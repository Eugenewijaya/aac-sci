import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const pageVariants = {
    initial: { opacity: 0, x: 40, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
    exit: { opacity: 0, x: -40, filter: 'blur(4px)', transition: { duration: 0.3, ease: "easeIn" } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 overflow-y-auto"
        >
          <div className="max-w-md w-full flex flex-col items-center justify-center relative min-h-min py-4 sm:py-8 my-auto overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* Layer 1: Welcome */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center w-full"
                >
                  <motion.img 
                    variants={itemVariants}
                    src="/logo.jpg" alt="Star Champs Logo" 
                    className="w-32 sm:w-48 h-auto object-contain mb-2 sm:mb-4 landscape:w-24 landscape:mb-2 rounded-2xl shadow-xl shadow-amber-100" 
                    onError={(e) => e.target.style.display = 'none'} 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.h1 variants={itemVariants} className="font-black text-xl sm:text-3xl text-amber-500 mb-1 mt-4">
                    Selamat Datang di AAC
                  </motion.h1>
                  <motion.p variants={itemVariants} className="font-bold text-emerald-700 tracking-widest mb-4 sm:mb-6 text-xs sm:text-base">
                    BY STAR CHAMPS INDONESIA
                  </motion.p>
                  <motion.p variants={itemVariants} className="text-slate-600 mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base landscape:text-xs landscape:mb-4">
                    Aplikasi komunikasi augmentatif dan alternatif (AAC) yang dirancang khusus untuk membantu anak-anak mengekspresikan diri mereka melalui gambar dan suara berbahasa Indonesia.
                  </motion.p>
                  <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, backgroundColor: "#f59e0b" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep} 
                    className="bg-amber-500 text-white w-full py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg flex justify-center items-center gap-2 shadow-lg shadow-amber-200"
                  >
                    Selanjutnya <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                  </motion.button>
                </motion.div>
              )}

              {/* Layer 2: Landscape Warning */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center w-full"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-emerald-100 p-4 sm:p-8 rounded-full text-emerald-600 mb-4 sm:mb-6 shadow-inner landscape:p-4 landscape:mb-3"
                  >
                     <motion.div
                       animate={{ rotate: [90, 80, 100, 90] }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                     >
                       <Smartphone size={48} className="sm:w-16 sm:h-16 landscape:w-10 landscape:h-10" />
                     </motion.div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="font-black text-xl sm:text-2xl text-slate-800 mb-2 sm:mb-4">
                    Mode Landscape
                  </motion.h2>
                  <motion.p variants={itemVariants} className="text-slate-600 mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base landscape:text-xs landscape:mb-4">
                    Untuk mendapatkan <strong>Best Experience</strong> (Pengalaman Terbaik), kami sangat menyarankan Anda menggunakan aplikasi ini dalam posisi mendatar (miringkan device Anda).
                  </motion.p>
                  <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestLandscape} 
                    className="bg-white text-slate-700 hover:bg-slate-50 w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold mb-4 sm:mb-6 border-2 border-slate-200 shadow-sm text-sm sm:text-base"
                  >
                    Paksa Auto-Landscape
                  </motion.button>
                  <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 w-full">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevStep} 
                      className="bg-white border-2 border-slate-100 text-slate-700 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-6 shadow-sm"
                    >
                      <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep} 
                      className="bg-amber-500 text-white flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex justify-center items-center gap-2 shadow-lg shadow-amber-200"
                    >
                      Selanjutnya <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* Layer 3: Instructions */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center text-center w-full"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-amber-100 p-4 sm:p-6 rounded-full text-amber-500 mb-4 sm:mb-6 shadow-inner landscape:p-4 landscape:mb-3"
                  >
                     <motion.div
                       animate={{ scale: [1, 1.1, 1] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     >
                       <CheckCircle size={48} className="sm:w-16 sm:h-16 landscape:w-10 landscape:h-10" />
                     </motion.div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="font-black text-xl sm:text-2xl text-slate-800 mb-2 sm:mb-4">
                    Cara Penggunaan
                  </motion.h2>
                  <motion.div variants={itemVariants} className="text-slate-600 mb-6 sm:mb-8 text-left space-y-2 sm:space-y-3 bg-white shadow-sm p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 w-full font-medium text-xs sm:text-base landscape:mb-4 landscape:p-3 landscape:text-xs">
                    <motion.p whileHover={{ x: 5 }} className="flex gap-2 sm:gap-3 items-start transition-all"><span className="bg-amber-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-amber-600 shrink-0 shadow-sm text-xs sm:text-sm">1</span> Tekan gambar untuk menyusun kata di papan atas.</motion.p>
                    <motion.p whileHover={{ x: 5 }} className="flex gap-2 sm:gap-3 items-start transition-all"><span className="bg-amber-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-amber-600 shrink-0 shadow-sm text-xs sm:text-sm">2</span> Tekan ikon Mikrofon untuk menyuarakan kalimat.</motion.p>
                    <motion.p whileHover={{ x: 5 }} className="flex gap-2 sm:gap-3 items-start transition-all"><span className="bg-amber-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-amber-600 shrink-0 shadow-sm text-xs sm:text-sm">3</span> Tekan ikon Tong Sampah untuk menghapus kata.</motion.p>
                    <motion.p whileHover={{ x: 5 }} className="flex gap-2 sm:gap-3 items-start transition-all"><span className="bg-amber-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold text-amber-600 shrink-0 shadow-sm text-xs sm:text-sm">4</span> Ketuk ikon Gear (Pengaturan) untuk masuk ke Mode Orang Tua.</motion.p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 w-full">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevStep} 
                      className="bg-white border-2 border-slate-100 text-slate-700 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-6 shadow-sm"
                    >
                      <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStart} 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
                    >
                      MULAI SEKARANG
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

