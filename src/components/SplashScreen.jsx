import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (hasSeenSplash === 'true') {
      onComplete();
    } else {
      setIsVisible(true);
    }
  }, [onComplete]);

  const handleStart = () => {
    setIsFading(true);
    setTimeout(() => {
      localStorage.setItem('hasSeenSplash', 'true');
      onComplete();
    }, 500);
  };

  const requestLandscape = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (window.screen.orientation && window.screen.orientation.lock) {
        await window.screen.orientation.lock('landscape');
      }
    } catch (e) {
      alert("Browser menolak otomatisasi. Harap miringkan perangkat Anda (Rotate) secara manual.");
    }
  };

  const nextStep = () => { if (step < 3) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'} p-4`}>
      <div className="max-w-md w-full flex flex-col items-center min-h-[450px] justify-center relative">
        
        {/* Layer 1: Welcome */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center w-full">
            <img src="/logo.jpg" alt="Star Champs Logo" className="w-48 h-auto object-contain mb-4" onError={(e) => e.target.style.display = 'none'} />
            <h1 className="font-black text-2xl sm:text-3xl text-amber-500 mb-1">Selamat Datang di AAC</h1>
            <p className="font-bold text-emerald-700 tracking-widest mb-6 text-sm sm:text-base">BY STAR CHAMPS INDONESIA</p>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              Aplikasi komunikasi augmentatif dan alternatif (AAC) yang dirancang khusus untuk membantu anak-anak mengekspresikan diri mereka melalui gambar dan suara berbahasa Indonesia.
            </p>
            <button onClick={nextStep} className="bg-amber-500 text-white w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 active:scale-95 transition-all shadow-md shadow-amber-200">
              Selanjutnya <ArrowRight size={24} />
            </button>
          </div>
        )}

        {/* Layer 2: Landscape Warning */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center w-full">
            <div className="bg-emerald-100 p-8 rounded-full text-emerald-600 mb-6 shadow-inner">
               <Smartphone size={72} className="rotate-90 animate-pulse" />
            </div>
            <h2 className="font-black text-2xl text-slate-800 mb-4">Mode Landscape</h2>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              Untuk mendapatkan <strong>Best Experience</strong> (Pengalaman Terbaik), kami sangat menyarankan Anda menggunakan aplikasi ini dalam posisi mendatar (miringkan device Anda).
            </p>
            <button onClick={requestLandscape} className="bg-slate-100 text-slate-700 hover:bg-slate-200 w-full py-3 rounded-2xl font-bold mb-6 border-2 border-slate-200 active:scale-95 transition-all">
              Paksa Auto-Landscape
            </button>
            <div className="flex gap-3 w-full">
              <button onClick={prevStep} className="bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold px-6 active:scale-95 transition-all">
                <ArrowLeft size={24} />
              </button>
              <button onClick={nextStep} className="bg-amber-500 text-white flex-1 py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 active:scale-95 transition-all shadow-md shadow-amber-200">
                Selanjutnya <ArrowRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Layer 3: Instructions */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center w-full">
            <div className="bg-amber-100 p-6 rounded-full text-amber-500 mb-6 shadow-inner">
               <CheckCircle size={64} />
            </div>
            <h2 className="font-black text-2xl text-slate-800 mb-4">Cara Penggunaan</h2>
            <div className="text-slate-600 mb-8 text-left space-y-3 bg-amber-50 p-5 rounded-2xl border-2 border-amber-100 w-full font-medium">
              <p className="flex gap-3 items-start"><span className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-amber-500 shrink-0 shadow-sm">1</span> Tekan gambar untuk menyusun kata di papan atas.</p>
              <p className="flex gap-3 items-start"><span className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-amber-500 shrink-0 shadow-sm">2</span> Tekan ikon Mikrofon untuk menyuarakan kalimat.</p>
              <p className="flex gap-3 items-start"><span className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-amber-500 shrink-0 shadow-sm">3</span> Tekan ikon Tong Sampah untuk menghapus kata.</p>
              <p className="flex gap-3 items-start"><span className="bg-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-amber-500 shrink-0 shadow-sm">4</span> Ketuk ikon Gear (Pengaturan) untuk masuk ke Mode Orang Tua.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={prevStep} className="bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold px-6 active:scale-95 transition-all">
                <ArrowLeft size={24} />
              </button>
              <button onClick={handleStart} className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 py-4 rounded-2xl font-black text-xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-all">
                MULAI SEKARANG
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
