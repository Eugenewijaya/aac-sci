import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Mic, Maximize, Minimize } from 'lucide-react';
import { useAAC } from '../context/AACContext';
import { playSound } from '../utils/tts';
import PinModal from './PinModal';
import { useNavigate } from 'react-router-dom';

export default function AACMode() {
  const { categories, settings } = useAAC();
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [currentSentence, setCurrentSentence] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (settings.autoFullscreen && !document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log('Error attempting to enable fullscreen:', err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories]);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const addToSentence = (word, categoryId) => {
    setCurrentSentence([...currentSentence, { word, categoryId }]);
    playSound(word, settings.rate, settings.pitch);
  };

  const clearSentence = () => setCurrentSentence([]);

  const speakSentence = () => {
    if (currentSentence.length === 0) return;
    let finalWords = [];
    let buffer = "";

    for(let item of currentSentence) {
        if(item.categoryId === 'alfabet' || item.categoryId === 'angka') {
            buffer += item.word;
        } else {
            if(buffer) { finalWords.push(buffer); buffer = ""; }
            finalWords.push(item.word);
        }
    }
    if(buffer) finalWords.push(buffer);
    playSound(finalWords.join(" "), settings.rate, settings.pitch);
  };

  const enterParentMode = () => {
    navigate('/settings');
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#FFF9EA]" onClick={handleInteraction}>
      {showPin && (
        <PinModal 
          correctPin={settings.pin} 
          onSuccess={() => { setShowPin(false); enterParentMode(); }}
          onClose={() => setShowPin(false)}
        />
      )}

      <header className="bg-white shadow-md z-20 px-2 py-2 flex flex-col gap-2 shrink-0 rounded-b-2xl border-b-4 border-amber-200 landscape:py-1 landscape:flex-row landscape:items-center landscape:rounded-b-lg">
        <div className="flex justify-between items-center px-1 landscape:flex-col landscape:gap-1">
            <h1 className="hidden sm:flex font-black text-xl text-amber-600 items-center gap-2 landscape:hidden">
              AAC <span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">Star Champs</span>
            </h1>
            <div className="flex gap-1">
              <button 
                onClick={toggleFullscreen} 
                className="text-slate-400 hover:text-amber-500 p-2 rounded-full active:bg-slate-50 transition-colors landscape:p-1"
                title="Layar Penuh"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
              <button 
                onClick={() => setShowPin(true)} 
                className="text-slate-400 hover:text-amber-500 p-2 rounded-full active:bg-slate-50 transition-colors landscape:p-1"
                title="Pengaturan"
              >
                <Settings size={24} />
              </button>
            </div>
        </div>
        <div className="bg-amber-50/50 border-2 sm:border-4 border-amber-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 min-h-[48px] sm:min-h-[80px] flex-1 flex items-center justify-between gap-1 sm:gap-2 shadow-inner landscape:min-h-[48px] landscape:border-2">
            <div className="flex-1 flex flex-wrap gap-1 sm:gap-2 text-base sm:text-xl font-bold text-slate-700 items-center overflow-y-auto max-h-[50px] sm:max-h-[80px] p-1 landscape:max-h-[44px]">
                {currentSentence.length === 0 ? (
                  <span className="text-slate-400 text-sm sm:text-base font-medium italic">Tekan gambar untuk menyusun kata...</span>
                ) : (
                  currentSentence.map((item, i) => (
                    <div key={i} className="bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-xl shadow-sm border-2 border-slate-100 text-slate-800 animate-in fade-in zoom-in duration-200 leading-tight landscape:py-1 landscape:px-2 landscape:text-sm">{item.word}</div>
                  ))
                )}
            </div>
            <div className="flex gap-1 sm:gap-2 shrink-0 border-l-2 border-amber-100 pl-1 sm:pl-2">
                <button onClick={clearSentence} className="bg-rose-100 text-rose-600 p-2 rounded-lg w-10 h-10 sm:w-14 sm:h-14 flex flex-col items-center justify-center active:scale-95 transition-transform landscape:w-10 landscape:h-10">
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 landscape:w-5 landscape:h-5" />
                </button>
                <button onClick={speakSentence} className="bg-amber-500 text-white p-2 rounded-lg w-10 h-10 sm:w-14 sm:h-14 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-md shadow-amber-200/50 landscape:w-10 landscape:h-10">
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 landscape:w-5 landscape:h-5" />
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <nav className="shrink-0 p-1 sm:p-2 overflow-x-auto no-scrollbar border-b border-amber-100/50 bg-white/50 landscape:p-1">
            <div className="flex gap-2">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)} 
                  className={`px-3 py-2 sm:px-5 sm:py-2 rounded-xl bg-white border-b-2 sm:border-b-4 transition-all whitespace-nowrap font-bold text-sm sm:text-base flex items-center gap-2 landscape:py-1 landscape:px-3 landscape:text-xs ${activeCategoryId === cat.id ? 'border-amber-500 text-amber-600 shadow-sm scale-105' : 'border-slate-200 text-slate-400'}`}
                >
                    <span className="text-xl sm:text-2xl landscape:text-lg">{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
        </nav>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-24 landscape:gap-2 landscape:pb-12">
              {activeCategory?.words.map((w, i) => (
                <button 
                  key={i}
                  onClick={() => addToSentence(w.word, activeCategory.id)} 
                  className={`${activeCategory.color || 'bg-white border-slate-200'} p-3 rounded-2xl flex flex-col items-center justify-center border-b-4 active:scale-95 transition-transform min-h-[120px] shadow-sm hover:shadow-md landscape:min-h-[80px] landscape:p-2`}
                >
                    {w.image ? (
                      <img src={w.image} className="w-14 h-14 mix-blend-multiply object-contain mb-2 landscape:w-10 landscape:h-10 landscape:mb-1" alt={w.word} />
                    ) : (
                      <span className="text-5xl drop-shadow-sm mb-2 landscape:text-3xl landscape:mb-1">{w.emoji}</span>
                    )}
                    <span className="font-bold text-sm sm:text-base text-center leading-tight text-slate-700 landscape:text-xs">{w.word}</span>
                </button>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
