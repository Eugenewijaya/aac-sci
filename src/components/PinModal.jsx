import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function PinModal({ correctPin, onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      {/* Portrait layout */}
      <div className="hidden portrait:flex bg-white rounded-[2rem] p-5 sm:p-6 shadow-2xl max-w-sm w-full relative border-4 border-amber-100 flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
          <X size={22} />
        </button>
        <h2 className="text-xl font-black text-center mb-4 text-slate-800">Mode Orang Tua</h2>
        <p className="text-sm font-bold text-center text-amber-500 mb-4 bg-amber-50 p-2 rounded-xl">Masukkan PIN 4 digit</p>
        
        <div className="flex justify-center gap-3 mb-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors ${error ? 'bg-rose-500' : pin.length > i ? 'bg-amber-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="h-5 flex items-center justify-center mb-3">
          {error && <p className="text-xs text-rose-500 font-bold animate-pulse">PIN salah, coba lagi</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button key={num} onClick={() => handlePress(num.toString())} className="bg-slate-100 p-5 rounded-2xl text-2xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all">
              {num}
            </button>
          ))}
          <div />
          <button onClick={() => handlePress('0')} className="bg-slate-100 p-5 rounded-2xl text-2xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all">
            0
          </button>
          <button onClick={() => setPin(pin.slice(0, -1))} className="bg-rose-50 p-5 rounded-2xl text-xl font-bold text-rose-500 active:bg-rose-100 active:scale-95 transition-all flex items-center justify-center">
            ⌫
          </button>
        </div>
      </div>

      {/* Landscape layout — side-by-side */}
      <div className="hidden landscape:flex bg-white rounded-2xl shadow-2xl w-full max-w-lg relative border-2 border-amber-100 overflow-hidden">
        {/* Left: info panel */}
        <div className="flex-1 bg-amber-50 flex flex-col items-center justify-center px-6 py-4">
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 bg-white rounded-full z-10">
            <X size={18} />
          </button>
          <h2 className="text-lg font-black text-slate-800 mb-2 text-center">Mode Orang Tua</h2>
          <p className="text-xs font-bold text-amber-600 mb-4 text-center">Masukkan PIN 4 digit</p>
          <div className="flex justify-center gap-2.5 mb-3">
            {[0,1,2,3].map(i => (
              <div key={i} className={`w-3.5 h-3.5 rounded-full transition-colors ${error ? 'bg-rose-500' : pin.length > i ? 'bg-amber-500' : 'bg-white border-2 border-slate-300'}`} />
            ))}
          </div>
          <div className="h-5 flex items-center justify-center">
            {error && <p className="text-xs text-rose-500 font-bold animate-pulse text-center">PIN salah, coba lagi</p>}
          </div>
        </div>

        {/* Right: numpad */}
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9].map(num => (
              <button key={num} onClick={() => handlePress(num.toString())} className="bg-slate-100 py-3 rounded-xl text-xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all">
                {num}
              </button>
            ))}
            <div />
            <button onClick={() => handlePress('0')} className="bg-slate-100 py-3 rounded-xl text-xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all">
              0
            </button>
            <button onClick={() => setPin(pin.slice(0, -1))} className="bg-rose-50 py-3 rounded-xl text-lg font-bold text-rose-500 active:bg-rose-100 active:scale-95 transition-all flex items-center justify-center">
              ⌫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
