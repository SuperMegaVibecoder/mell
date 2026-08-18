import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Sparkles, Zap, CreditCard, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPayment: () => void;
  isProcessing: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmitPayment,
  isProcessing,
}) => {
  if (!isOpen) return null;

  const handlePay = () => {
    soundManager.playClick();
    onSubmitPayment();
  };

  return (
    <AnimatePresence>
      <div
        id="payment-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient decorative blobs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Генерация судьбы</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              РАЗБЛОКИРОВАТЬ РУЛЕТКУ
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Получи свой персональный ролик Меллстроя по дате рождения
            </p>
          </div>

          {/* Price badge */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 mb-6 text-center">
            <div className="text-xs text-slate-400 font-medium mb-1">Сумма к оплате</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">1 ₽</span>
              <span className="text-sm text-slate-500 line-through">199 ₽</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[11px] font-bold">
                СКИДКА 99%
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            id="pay-button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-slate-950 font-black text-base sm:text-lg uppercase tracking-wide transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Оплатить и узнать</span>
          </button>

          {/* Trust badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Мгновенный доступ без подписок</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
