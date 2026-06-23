import React, { useState } from 'react';
import { useAAC } from '../context/AACContext';
import { ArrowLeft, Plus, Trash2, Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Manajemen Kosakata</h2>
              <p className="text-sm text-slate-500 mt-1">Atur kata-kata dan gambar sesuai kebutuhan belajar anak.</p>
            </div>
            <button onClick={handleAddCategory} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95">
              <Plus size={20} /> Kategori Baru
            </button>
          </div>

          <div className="space-y-8">
            <AnimatePresence>
            {localCategories.map(cat => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={cat.id} 
                className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 shadow-sm overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-5 border-b border-slate-200 gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-white p-3 rounded-2xl shadow-sm text-3xl shrink-0">
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nama Kategori</label>
                       <input 
                         type="text" 
                         value={cat.label}
                         onChange={(e) => {
                           const newLabel = e.target.value;
                           setLocalCategories(localCategories.map(c => c.id === cat.id ? {...c, label: newLabel} : c));
                         }}
                         className="text-xl font-black text-slate-800 bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none w-full sm:w-64 transition-colors py-1"
                       />
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="flex items-center gap-2 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl font-bold transition-all w-full sm:w-auto justify-center group border border-rose-200 hover:border-rose-500">
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform"/> <span className="sm:hidden">Hapus Kategori</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <AnimatePresence>
                  {cat.words.map((w, i) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={w.word + '_' + i} 
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <button 
                        onClick={() => handleDeleteWord(cat.id, i)} 
                        className="absolute -top-2 -right-2 bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10 border border-slate-100"
                        title="Hapus kata"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-5xl overflow-hidden relative group/img transition-colors hover:bg-slate-100">
                        {w.image ? <img src={w.image} className="w-full h-full object-cover" alt={w.word} /> : w.emoji}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white rounded-xl backdrop-blur-sm">
                           <Upload size={24} className="mb-2" />
                           <span className="text-xs font-bold px-2 text-center">Ganti Gambar</span>
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, cat.id, i)} />
                        </label>
                      </div>

                      <div>
                        <input 
                          type="text"
                          value={w.word}
                          placeholder="Nama Kata"
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
                          className="font-bold text-center text-slate-700 bg-slate-50 border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none w-full py-2 px-3 rounded-lg transition-colors"
                        />
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                  
                  <motion.button 
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddWord(cat.id)} 
                    className="border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 text-slate-400 rounded-2xl p-4 flex flex-col items-center justify-center font-bold transition-all gap-3 min-h-[160px] group"
                  >
                    <div className="bg-slate-100 p-3 rounded-full group-hover:bg-amber-100 transition-colors">
                      <Plus size={28} />
                    </div>
                    <span>Tambah Kata</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Legal & Copyright */}
        <div className="text-center mt-12 pb-8">
          <button onClick={() => setShowLegal(true)} className="text-xs font-medium text-slate-300 hover:text-slate-500 transition-colors">
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
