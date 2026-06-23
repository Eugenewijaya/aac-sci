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
    <div className="flex flex-col h-screen overflow-hidden bg-[#FFF9EA]" onClick={handleInteraction}>
      {showPin && (
        <PinModal 
          correctPin={settings.pin} 
          onSuccess={() => { setShowPin(false); enterParentMode(); }}
          onClose={() => setShowPin(false)}
        />
      )}

      <header className="bg-white shadow-lg z-10 px-4 py-3 flex flex-col gap-3 shrink-0 rounded-b-[2rem] border-b-4 border-amber-200">
        <div className="flex justify-between items-center px-2">
            <h1 className="font-black text-2xl text-amber-600 flex items-center gap-2">
              AAC <span className="text-slate-400 text-sm font-bold bg-slate-100 px-3 py-1 rounded-full">Star Champs</span>
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={toggleFullscreen} 
                className="text-slate-300 hover:text-slate-400 p-2 rounded-full active:bg-slate-50 transition-colors"
                title="Layar Penuh"
              >
                {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
              </button>
              <button 
                onDoubleClick={() => setShowPin(true)} 
                className="text-slate-300 hover:text-slate-400 p-2 rounded-full active:bg-slate-50 transition-colors"
                title="Ketuk 2x untuk Pengaturan"
              >
                <Settings size={28} />
              </button>
            </div>
        </div>
        <div className="bg-amber-50/50 border-4 border-amber-100 rounded-3xl p-3 min-h-[100px] flex items-center justify-between gap-3 shadow-inner">
            <div className="flex-1 flex flex-wrap gap-2 text-xl font-bold text-slate-700 items-center overflow-y-auto max-h-[120px] p-1">
                {currentSentence.length === 0 ? (
                  <span className="text-slate-400 text-base font-medium italic">Tekan gambar untuk menyusun kata...</span>
                ) : (
                  currentSentence.map((item, i) => (
                    <div key={i} className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-100 text-slate-800 animate-in fade-in zoom-in duration-200">{item.word}</div>
                  ))
                )}
            </div>
            <div className="flex gap-2 shrink-0 border-l-4 border-amber-100 pl-3">
                <button onClick={clearSentence} className="bg-rose-100 text-rose-600 p-3 rounded-2xl w-16 h-16 flex flex-col items-center justify-center active:scale-95 transition-transform">
                  <Trash2 size={28} />
                </button>
                <button onClick={speakSentence} className="bg-amber-500 text-white p-3 rounded-2xl w-16 h-16 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-md shadow-amber-200/50">
                  <Mic size={28} />
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <nav className="shrink-0 p-3 overflow-x-auto no-scrollbar border-b border-amber-100/50">
            <div className="flex gap-3">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)} 
                  className={`px-6 py-3 rounded-2xl bg-white border-b-4 transition-all whitespace-nowrap font-bold flex items-center gap-2 ${activeCategoryId === cat.id ? 'border-amber-500 text-amber-600 shadow-md scale-105' : 'border-slate-200 text-slate-400'}`}
                >
                    <span className="text-2xl">{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
        </nav>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-24">
              {activeCategory?.words.map((w, i) => (
                <button 
                  key={i}
                  onClick={() => addToSentence(w.word, activeCategory.id)} 
                  className={`${activeCategory.color || 'bg-white border-slate-200'} p-4 rounded-3xl flex flex-col items-center justify-center border-b-4 active:scale-95 transition-transform min-h-[140px] shadow-sm hover:shadow-md`}
                >
                    {w.image ? (
                      <img src={w.image} className="w-16 h-16 mix-blend-multiply object-contain mb-3" alt={w.word} />
                    ) : (
                      <span className="text-6xl drop-shadow-sm mb-3">{w.emoji}</span>
                    )}
                    <span className="font-bold text-base text-center leading-tight text-slate-700">{w.word}</span>
                </button>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
