import { pronunciationMap } from '../data/defaultVocabulary';

const synth = window.speechSynthesis;

export const playSound = (text, rate = 0.85, pitch = 1.1) => {
    if (synth.speaking) synth.cancel();
    
    let spokenText = text.toLowerCase();
    let wordsArray = spokenText.split(" ");
    
    let processedText = wordsArray.map(w => {
        if (pronunciationMap[w]) return pronunciationMap[w];
        return w.replace(/c/g, 'ch');
    }).join(" ");

    const utterance = new SpeechSynthesisUtterance(processedText);
    
    // Selalu ambil daftar suara terbaru saat tombol ditekan
    const voices = synth.getVoices();
    
    // Cari suara bahasa Indonesia (beberapa sistem menggunakan id-ID, id_ID, in-ID, atau in_ID)
    let idVoice = voices.find(v => (v.lang === 'id-ID' || v.lang === 'in-ID') && v.name.includes('Google')) ||
                  voices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang === 'in-ID' || v.lang === 'in_ID') ||
                  voices.find(v => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().startsWith('in'));

    if (idVoice) {
        utterance.voice = idVoice;
    }
    
    // Paksa lang ke id-ID sebagai fallback jika voice spesifik tidak ditemukan
    utterance.lang = 'id-ID';
    utterance.pitch = pitch; 
    utterance.rate = rate; 
    
    synth.speak(utterance);
};
