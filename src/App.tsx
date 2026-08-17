import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { BirthdayForm } from './components/BirthdayForm';
import { PaymentModal } from './components/PaymentModal';
import { PaymentSuccess } from './components/PaymentSuccess';
import { Roulette } from './components/Roulette';
import { ResultScreen } from './components/ResultScreen';
import { getRandomMellstroyId } from './utils/calculateResult';
import { getMellstroyById, MELLSTROYS } from './data/mellstroys';
import { getAssetUrl } from './utils/assets';
import { AppStep, Mellstroy } from './types';

export default function App() {
  const [birthday, setBirthday] = useState<string>('1998-12-15');
  const [step, setStep] = useState<AppStep>('form');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState<boolean>(false);
  const [targetMellstroy, setTargetMellstroy] = useState<Mellstroy>(MELLSTROYS[0]);
  const lastSelectedIdRef = useRef<number | undefined>(undefined);

  // Скрытый <video>, который "прогревает" ролик победителя в фоне.
  // Он появляется в DOM сразу после выбора даты рождения (см. handleBirthdaySubmit),
  // то есть задолго до того, как ResultScreen реально покажет этот файл —
  // у браузера есть время (заполнение оплаты + processing + success + рулетка)
  // чтобы полностью скачать видео, пока пользователь смотрит на другие экраны.
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const preloadedMellstroyIdRef = useRef<number | null>(null);

  // Предзагрузка всех 3 базовых картинок и фона сразу при открытии сайта
  useEffect(() => {
    const imagesToPreload = [
      getAssetUrl('pics/gold.jpg'),
      getAssetUrl('pics/red.jpg'),
      getAssetUrl('pics/blue.jpg'),
      getAssetUrl('pics/bg.jpg'),
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleBirthdaySubmit = () => {
    const resultId = getRandomMellstroyId(lastSelectedIdRef.current);
    lastSelectedIdRef.current = resultId;
    const selected = getMellstroyById(resultId);
    setTargetMellstroy(selected);
    setIsPaymentModalOpen(true);
  };

  const handleStartPayment = async () => {
    setIsProcessing(true);
    setIsPaymentModalOpen(false);
    setIsPaymentSuccessOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsProcessing(false);
  };

  const handlePaymentComplete = () => {
    setIsPaymentSuccessOpen(false);
    setStep('roulette');
  };

  const handleRouletteFinish = () => {
    setStep('result');
  };

  const handleTryAgain = () => {
    setStep('form');
  };

  // Грузим видео ровно один раз на каждого нового мельстроя,
  // а не при каждом переходе между экранами (form → roulette → result).
  useEffect(() => {
    if (step === 'form') return;
    if (preloadedMellstroyIdRef.current === targetMellstroy.id) return;

    const video = preloadVideoRef.current;
    if (video) {
      preloadedMellstroyIdRef.current = targetMellstroy.id;
      video.load();
    }
  }, [targetMellstroy, step]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-x-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 brightness-95 contrast-105"
        style={{ backgroundImage: `url("${getAssetUrl('pics/bg.jpg')}")` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/35 to-slate-950/60 pointer-events-none z-0" />

      {/* Скрытый прелоадер видео победителя. Не показывается пользователю,
          но заставляет браузер качать файл в фоне заранее. */}
      {targetMellstroy.video && step !== 'form' && (
        <video
          ref={preloadVideoRef}
          src={targetMellstroy.video}
          preload="auto"
          muted
          playsInline
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      )}

      <Header onReset={handleTryAgain} />

      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {step === 'form' && (
          <BirthdayForm
            birthday={birthday}
            onBirthdayChange={setBirthday}
            onSubmit={handleBirthdaySubmit}
          />
        )}

        {step === 'roulette' && (
          <Roulette
            targetMellstroy={targetMellstroy}
            onFinished={handleRouletteFinish}
          />
        )}

        {step === 'result' && (
          <ResultScreen
            mellstroy={targetMellstroy}
            birthday={birthday}
            onTryAgain={handleTryAgain}
          />
        )}
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmitPayment={handleStartPayment}
        isProcessing={isProcessing}
      />

      {isPaymentSuccessOpen && (
        <PaymentSuccess
          isProcessing={isProcessing}
          onComplete={handlePaymentComplete}
        />
      )}

      <footer className="relative z-10 py-6 px-4 border-t border-slate-800/60 text-center text-xs text-slate-400 bg-slate-950/80 backdrop-blur-md">
        <p>
          Развлекательный проект «Какой ты Меллстрой?». Все права защищены.
        </p>
      </footer>
    </div>
  );
}
