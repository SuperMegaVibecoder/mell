import React from 'react';
import { Sparkles, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.getMuted());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="relative z-20 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
      <button
        onClick={() => {
          soundManager.playClick();
          onReset();
        }}
        className="flex items-center gap-2 group text-left focus:outline-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <div className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
            MELLSTROY <span className="text-amber-400 font-normal">CALENDAR</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Гороскоп судьбы
          </div>
        </div>
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all shadow-md focus:outline-none"
          title={isMuted ? 'Включить звук' : 'Выключить звук'}
          aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onReset();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-md focus:outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Сначала</span>
        </button>
      </div>
    </header>
  );
};
