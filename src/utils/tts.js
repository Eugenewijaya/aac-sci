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

    // Strategi pencarian suara Indonesia yang ketat
    let idVoice = availableVoices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) ||
                  availableVoices.find(v => v.name.includes('Damayanti') || v.name.includes('Andika') || v.name.includes('Gadis')) ||
                  availableVoices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID' || v.lang === 'in-ID' || v.lang === 'in_ID') ||
                  availableVoices.find(v => v.name.toLowerCase().includes('indonesia'));

    if (idVoice) {
        // Jika ada suara Indonesia bawaan sistem (100% offline)
        const utterance = new SpeechSynthesisUtterance(processedText);
        utterance.voice = idVoice;
        utterance.lang = 'id-ID';
        utterance.pitch = pitch; 
        utterance.rate = rate; 
        synth.speak(utterance);
    } else {
        // Jika perangkat TIDAK PUNYA suara Indonesia (sering terjadi di browser tertentu),
        // Gunakan Google Translate TTS API sebagai penyelamat (butuh internet)
        let googleText = encodeURIComponent(text);
        let audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${googleText}`;
        let audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        
        audio.play().catch(e => {
            console.warn("Google TTS gagal (mungkin offline), menggunakan suara bawaan sistem seadanya.", e);
            const utterance = new SpeechSynthesisUtterance(processedText);
            utterance.lang = 'id-ID';
            utterance.pitch = pitch; 
            utterance.rate = rate; 
            synth.speak(utterance);
        });
    }
};
