import React, { useState } from 'react';
import { useAAC } from '../context/AACContext';
import { ArrowLeft, Plus, Trash2, Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ParentMode() {
  const { categories, saveCategories, settings, saveSettings } = useAAC();
  const navigate = useNavigate();

  const [localSettings, setLocalSettings] = useState(settings);
  const [localCategories, setLocalCategories] = useState(categories);

  const [showToast, setShowToast] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  const handleSave = () => {
    if (localSettings.pin.length !== 4) {
      alert('PIN Keamanan harus tepat 4 angka!');
      return;
    }
    saveSettings(localSettings);
    saveCategories(localCategories);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 1500);
  };

  const handleAddCategory = () => {
    const label = prompt('Masukkan nama kategori baru:');
    if (!label) return;
    const icon = prompt('Masukkan emoji untuk kategori ini (contoh: 🍎, 🚗, 🏃‍♂️):');
    if (!icon) return;

    const newCat = {
      id: 'cat_' + Date.now(),
      label: label,
      color: 'bg-slate-100 border-slate-300',
      icon: icon,
      words: []
    };
    // Menambahkan di urutan pertama agar langsung terlihat oleh user
    setLocalCategories([newCat, ...localCategories]);
  };

  const handleDeleteCategory = (id) => {
    if(confirm('Hapus kategori ini beserta semua isinya?')) {
      setLocalCategories(localCategories.filter(c => c.id !== id));
    }
  };

  const handleAddWord = (catId) => {
    const word = prompt('Masukkan kata baru:');
    if (!word) return;
    const emoji = prompt('Masukkan emoji untuk kata ini: (ketik batal jika ingin upload gambar nanti)');
    
    setLocalCategories(localCategories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          words: [...cat.words, { word, emoji: emoji !== 'batal' ? emoji : '❓' }]
        };
      }
      return cat;
    }));
  };

  const handleDeleteWord = (catId, wordIndex) => {
    if(confirm('Hapus kata ini?')) {
      setLocalCategories(localCategories.map(cat => {
        if (cat.id === catId) {
          const newWords = [...cat.words];
          newWords.splice(wordIndex, 1);
          return { ...cat, words: newWords };
        }
        return cat;
      }));
    }
  };

  const handleImageUpload = (e, catId, wordIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setLocalCategories(localCategories.map(cat => {
          if (cat.id === catId) {
            const newWords = [...cat.words];
            newWords[wordIndex] = { ...newWords[wordIndex], image: base64String, emoji: null };
            return { ...cat, words: newWords };
          }
          return cat;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-black text-slate-800">Mode Orang Tua</h1>
        </div>
        <button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Save size={20} /> Simpan & Keluar
        </button>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-bold">
            <Save size={24} />
            Pengaturan berhasil disimpan!
          </div>
        </div>
      )}

      <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-8 pb-24">
        
        {/* Settings Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Pengaturan Umum & Keamanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Kecepatan Suara (Rate: {localSettings.rate})</label>
              <input 
                type="range" min="0.5" max="1.5" step="0.05" 
                value={localSettings.rate} 
                onChange={e => setLocalSettings({...localSettings, rate: parseFloat(e.target.value)})}
                className="w-full accent-amber-500"
              />
              <p className="text-xs text-slate-400 mt-2">Geser ke kiri untuk melambatkan suara agar lebih mudah dipahami anak.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Nada Suara (Pitch: {localSettings.pitch})</label>
              <input 
                type="range" min="0.5" max="2" step="0.1" 
                value={localSettings.pitch} 
                onChange={e => setLocalSettings({...localSettings, pitch: parseFloat(e.target.value)})}
                className="w-full accent-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-600 mb-2">PIN Keamanan (4 Digit)</label>
              <input 
                type="text" maxLength="4" 
                value={localSettings.pin} 
                onChange={e => setLocalSettings({...localSettings, pin: e.target.value.replace(/\D/g,'')})}
                className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-slate-400 mt-2">PIN digunakan untuk mencegah anak masuk ke menu ini dan menghapus kata tanpa sengaja.</p>
            </div>
            
            <div className="md:col-span-2 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
              <div>
                <label className="block text-sm font-bold text-slate-600">Layar Penuh Otomatis</label>
                <p className="text-xs text-slate-400 mt-1">Otomatis masuk ke mode layar penuh saat anak menyentuh layar pertama kali.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={localSettings.autoFullscreen || false}
                  onChange={e => setLocalSettings({...localSettings, autoFullscreen: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Manajemen Kosakata</h2>
            <button onClick={handleAddCategory} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
              <Plus size={20} /> Kategori Baru
            </button>
          </div>

          <div className="space-y-6">
            {localCategories.map(cat => (
              <div key={cat.id} className="border-2 border-slate-100 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <input 
                      type="text" 
                      value={cat.label}
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        setLocalCategories(localCategories.map(c => c.id === cat.id ? {...c, label: newLabel} : c));
                      }}
                      className="text-lg font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 w-48"
                    />
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-50 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  {cat.words.map((w, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-3 min-w-[140px] relative group">
                      <div className="flex justify-between items-start">
                        <input 
                          type="text"
                          value={w.word}
                          onChange={(e) => {
                            const newWord = e.target.value;
                            setLocalCategories(localCategories.map(c => {
                              if(c.id === cat.id) {
                                const nw = [...c.words];
                                nw[i].word = newWord;
                                return {...c, words: nw};
                              }
                              return c;
                            }))
                          }}
                          className="font-bold text-slate-700 bg-transparent border-b border-slate-300 focus:border-amber-500 focus:outline-none w-full"
                        />
                        <button onClick={() => handleDeleteWord(cat.id, i)} className="text-slate-300 hover:text-rose-500 ml-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="h-16 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-3xl overflow-hidden relative">
                        {w.image ? <img src={w.image} className="w-full h-full object-contain" /> : w.emoji}
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white rounded-lg">
                           <Upload size={20} />
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, cat.id, i)} />
                        </label>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddWord(cat.id)} className="border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-500 rounded-xl px-4 min-w-[140px] flex flex-col items-center justify-center font-bold transition-colors gap-2">
                    <Plus size={24} /> <span>Tambah Kata</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal & Copyright */}
        <div className="text-center mt-12 pb-8">
          <button onClick={() => setShowLegal(true)} className="text-sm font-bold text-slate-400 hover:text-amber-500 transition-colors underline underline-offset-4">
            Legal & Hak Cipta
          </button>
        </div>

      </main>

      {/* Legal Modal */}
      {showLegal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full relative border-4 border-amber-100 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            <button onClick={() => setShowLegal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-6 border-b-2 border-slate-100 pb-4">Syarat & Ketentuan</h2>
            
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                <strong>Status Aplikasi:</strong> Saat ini aplikasi AAC Star Champs masih dalam mode <em>prototype</em> dan terus dalam tahap pengembangan aktif.
              </p>
              <p>
                <strong>Hak Cipta:</strong> Seluruh hak cipta desain dan kode aplikasi ini adalah milik <strong>Eugenewijaya</strong>. Seluruh kode yang ada di dalam aplikasi ini perlu dan wajib dipatenkan oleh institusi terkait atau klien sebelum didistribusikan secara komersial.
              </p>
              <p>
                <strong>Lisensi Vendor & Pihak Ketiga:</strong>
                <br/>Pembuatan aplikasi ini melibatkan teknologi dan infrastruktur dari beberapa vendor berikut:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Antigravity Pro Plan:</strong> Alat perancangan dan asisten pengembangan AI terpadu.</li>
                <li><strong>Sagara Karya Kreanusati:</strong> Dukungan modul dan komponen sistem fungsionalitas.</li>
                <li><strong>Vercel & GitHub:</strong> Layanan hosting cloud, domain, dan repositori kode manajemen.</li>
                <li><strong>Google Translate / Web Speech API:</strong> Layanan modul inti Text-to-Speech (TTS).</li>
              </ul>
              <p className="italic text-xs mt-6 text-slate-400">
                Dengan menggunakan aplikasi ini, Anda menyetujui bahwa aplikasi masih dalam tahap uji coba dan pengembang (developer) tidak bertanggung jawab atas kendala yang terjadi di luar kendali teknis.
              </p>
            </div>

            <button onClick={() => setShowLegal(false)} className="mt-8 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
