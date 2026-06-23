import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Mengecek apakah sudah pernah melihat splash screen
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

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="animate-in zoom-in duration-700 flex flex-col items-center max-w-sm w-full px-6">
        <img 
          src="/logo.jpg" 
          alt="Star Champs Logo" 
          className="w-64 h-auto object-contain" 
          onError={(e) => {
            // Sembunyikan gambar jika file logo belum dimasukkan user
            e.target.style.display = 'none';
          }} 
        />
        {/* Fallback teks jika gambar tidak langsung muncul */}
        <h1 className="font-black text-4xl text-amber-500 tracking-wider mt-4 text-center">STAR CHAMPS</h1>
        <p className="font-bold text-emerald-700 tracking-widest mt-2 mb-16 text-center">INDONESIA</p>

        <button onClick={handleStart} className="bg-amber-500 hover:bg-amber-600 text-white w-full py-4 rounded-2xl font-black text-xl shadow-lg shadow-amber-200 active:scale-95 transition-all">
          MULAI
        </button>
      </div>
    </div>
  );
}
