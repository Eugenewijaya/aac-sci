import { pronunciationMap } from '../data/defaultVocabulary';

let indonesianVoice = null;
const synth = window.speechSynthesis;

export const loadVoices = () => {
    const voices = synth.getVoices();
    if (voices.length === 0) return null;
    
    indonesianVoice = voices.find(v => v.lang === 'id-ID' && v.name.includes('Google')) ||
                      voices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID') ||
                      voices.find(v => v.lang.startsWith('id'));
    return indonesianVoice;
};

if (synth.onvoiceschanged !== undefined) { 
    synth.onvoiceschanged = loadVoices; 
}
loadVoices();

export const playSound = (text, rate = 0.85, pitch = 1.1) => {
    if (synth.speaking) synth.cancel();
    
    let spokenText = text.toLowerCase();
    let wordsArray = spokenText.split(" ");
    let processedText = wordsArray.map(w => pronunciationMap[w] || w).join(" ");

    const utterance = new SpeechSynthesisUtterance(processedText);
    
    if (indonesianVoice) {
        utterance.voice = indonesianVoice;
    }
    
    utterance.lang = 'id-ID';
    utterance.pitch = pitch; 
    utterance.rate = rate; 
    
    synth.speak(utterance);
};
