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
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-6 shadow-2xl max-w-sm w-full relative border-4 border-amber-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
          <X size={24} />
        </button>
        <h2 className="text-xl font-black text-center mb-6 text-slate-800">Mode Orang Tua</h2>
        <p className="text-sm font-bold text-center text-amber-500 mb-6 bg-amber-50 p-2 rounded-xl">Masukkan PIN: {correctPin}</p>
        
        <div className="flex justify-center gap-3 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full transition-colors ${pin.length > i ? 'bg-amber-500' : 'bg-slate-200'} ${error ? 'bg-rose-500' : ''}`} />
          ))}
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
    </div>
  );
}
