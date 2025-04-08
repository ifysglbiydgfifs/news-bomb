class SpeakingService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
    }

    getRussianVoice() {
        const voices = window.speechSynthesis.getVoices();
        const russianVoices = voices.filter(v => v.lang === 'ru-RU');

        // Попробуем выбрать Google голос, если есть
        const googleVoice = russianVoices.find(v => v.name.includes('Google'));

        return googleVoice || russianVoices[0] || null;
    }

    speakDigest(digest) {
        this.cancel();

        const content = digest?.content || "Нет данных для озвучки.";
        const summary = digest?.summary || "Нет краткого описания.";
        const text = `Дайджест по теме: ${content}. ${summary}`;

        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = 'ru-RU';

        const voice = this.getRussianVoice();
        if (voice) {
            this.utterance.voice = voice;
        }

        this.synth.speak(this.utterance);
    }


    pause() {
        if (this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
        }
    }

    resume() {
        if (this.synth.paused) {
            this.synth.resume();
        }
    }

    cancel() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }

    isSpeaking() {
        return this.synth.speaking;
    }

    isPaused() {
        return this.synth.paused;
    }
}

const instance = new SpeakingService();
export default instance;
