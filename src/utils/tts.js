import { pronunciationMap } from '../data/defaultVocabulary';

const synth = window.speechSynthesis;
let availableVoices = [];

export const loadVoices = () => {
    availableVoices = synth.getVoices();
};

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
// Initial attempt
loadVoices();

export const playSound = (text, rate = 0.85, pitch = 1.1) => {
    if (synth.speaking) synth.cancel();
    
    // Fallback jika voices belum termuat
    if (availableVoices.length === 0) {
        availableVoices = synth.getVoices();
    }
    
    let spokenText = text.toLowerCase();
    let wordsArray = spokenText.split(" ");
    
    let processedText = wordsArray.map(w => {
        if (pronunciationMap[w]) return pronunciationMap[w];
        return w.replace(/c/g, 'ch');
    }).join(" ");

    const utterance = new SpeechSynthesisUtterance(processedText);
    
    // Strategi pencarian suara Indonesia yang tangguh
    let idVoice = availableVoices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) ||
                  availableVoices.find(v => v.name.includes('Damayanti') || v.name.includes('Andika') || v.name.includes('Gadis')) ||
                  availableVoices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang === 'in-ID' || v.lang === 'in_ID') ||
                  availableVoices.find(v => v.name.toLowerCase().includes('indonesia'));

    if (idVoice) {
        utterance.voice = idVoice;
    }
    
    // Paksa lang ke id-ID sebagai fallback jika voice spesifik tidak ditemukan
    utterance.lang = 'id-ID';
    utterance.pitch = pitch; 
    utterance.rate = rate; 
    
    synth.speak(utterance);
};
