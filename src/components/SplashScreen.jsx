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
      // Timer untuk mulai memudarkan layar (fade out)
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 2500);

      // Timer untuk menyelesaikan proses dan menyimpan ke cache
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('hasSeenSplash', 'true');
        onComplete();
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="animate-in zoom-in duration-700 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Star Champs Logo" 
          className="w-64 h-auto object-contain" 
          onError={(e) => {
            // Sembunyikan gambar jika file logo.png belum dimasukkan user
            e.target.style.display = 'none';
          }} 
        />
        {/* Fallback teks jika gambar tidak langsung muncul */}
        <h1 className="font-black text-4xl text-amber-500 tracking-wider mt-4">STAR CHAMPS</h1>
        <p className="font-bold text-emerald-700 tracking-widest mt-2">INDONESIA</p>
      </div>
    </div>
  );
}
