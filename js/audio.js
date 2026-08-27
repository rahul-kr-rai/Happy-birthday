// Web Audio API Sound Engine & Synthesizer
// Provides rich polyphonic music playback & sound effects with zero external audio file dependencies.

class BirthdayAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlayingMusic = false;
        this.isMuted = false;
        this.musicTimeout = null;
        this.currentNoteIndex = 0;
        this.initialized = false;
    }

    init() {
        if (this.initialized && this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.ctx = new AudioContext();
            this.initialized = true;
        }
    }

    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Play a single synthesized note with envelope & harmonics
    playTone(freq, type = 'sine', duration = 0.4, timeOffset = 0, gainLevel = 0.2) {
        if (this.isMuted || !this.ctx || freq <= 0) return;
        const now = this.ctx.currentTime + timeOffset;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        // Warm lowpass filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);

        // Envelope: quick attack, natural exponential decay
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // Subtle vibrato/richness
        if (type === 'triangle' || type === 'sawtooth') {
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(freq * 0.5, now);
            subGain.gain.setValueAtTime(gainLevel * 0.3, now);
            subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            subOsc.connect(subGain);
            subGain.connect(filter);
            subOsc.start(now);
            subOsc.stop(now + duration + 0.05);
        }

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    }

    // Celebratory Fanfare on Gift Unbox
    playFanfare() {
        this.resume();
        if (!this.ctx) return;
        const notes = [
            { f: 261.63, d: 0.15, t: 0.0 },
            { f: 329.63, d: 0.15, t: 0.12 },
            { f: 392.00, d: 0.15, t: 0.24 },
            { f: 523.25, d: 0.45, t: 0.36 },
            { f: 392.00, d: 0.18, t: 0.70 },
            { f: 523.25, d: 0.80, t: 0.88 },
            { f: 659.25, d: 0.80, t: 0.88 },
            { f: 783.99, d: 0.80, t: 0.88 }
        ];

        notes.forEach(n => {
            this.playTone(n.f, 'triangle', n.d, n.t, 0.25);
            this.playTone(n.f * 2, 'sine', n.d * 0.6, n.t + 0.02, 0.1);
        });
    }

    // Balloon Pop Sound
    playPop() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    // Sparkle / Magical Chime
    playSparkle() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
        freqs.forEach((f, idx) => {
            this.playTone(f, 'sine', 0.3, idx * 0.06, 0.12);
        });
    }

    // Blow candle wind / whoosh effect
    playBlowEffect() {
        this.resume();
        if (!this.ctx || this.isMuted) return;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.45);
        filter.Q.setValueAtTime(3, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    // Happy Birthday Song Melody
    getHappyBirthdayMelody() {
        const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46;
        
        return [
            // "Hap-py Birth-day to you"
            { f: C4, d: 0.3, pause: 0.35 },
            { f: C4, d: 0.15, pause: 0.2 },
            { f: D4, d: 0.45, pause: 0.5 },
            { f: C4, d: 0.45, pause: 0.5 },
            { f: F4, d: 0.45, pause: 0.5 },
            { f: E4, d: 0.8, pause: 0.95 },

            // "Hap-py Birth-day to you"
            { f: C4, d: 0.3, pause: 0.35 },
            { f: C4, d: 0.15, pause: 0.2 },
            { f: D4, d: 0.45, pause: 0.5 },
            { f: C4, d: 0.45, pause: 0.5 },
            { f: G4, d: 0.45, pause: 0.5 },
            { f: F4, d: 0.8, pause: 0.95 },

            // "Hap-py Birth-day dear Di-di"
            { f: C4, d: 0.3, pause: 0.35 },
            { f: C4, d: 0.15, pause: 0.2 },
            { f: C5, d: 0.45, pause: 0.5 },
            { f: A4, d: 0.45, pause: 0.5 },
            { f: F4, d: 0.45, pause: 0.5 },
            { f: E4, d: 0.45, pause: 0.5 },
            { f: D4, d: 0.7, pause: 0.85 },

            // "Hap-py Birth-day to you!"
            { f: Bb4, d: 0.3, pause: 0.35 },
            { f: Bb4, d: 0.15, pause: 0.2 },
            { f: A4, d: 0.45, pause: 0.5 },
            { f: F4, d: 0.45, pause: 0.5 },
            { f: G4, d: 0.45, pause: 0.5 },
            { f: F4, d: 1.1, pause: 1.5 }
        ];
    }

    startBirthdayMusic() {
        this.resume();
        if (this.isPlayingMusic) return;
        this.isPlayingMusic = true;
        this.playMelodyStep(0);
    }

    playMelodyStep(index) {
        if (!this.isPlayingMusic) return;
        const melody = this.getHappyBirthdayMelody();
        const note = melody[index % melody.length];

        if (!this.isMuted && this.ctx) {
            this.playTone(note.f, 'triangle', note.d, 0, 0.22);
            this.playTone(note.f * 0.5, 'sine', note.d, 0, 0.15);
            this.playTone(note.f * 2, 'sine', note.d * 0.7, 0.03, 0.08);
        }

        const nextIndex = (index + 1) % melody.length;
        this.musicTimeout = setTimeout(() => {
            this.playMelodyStep(nextIndex);
        }, note.pause * 1000);
    }

    stopBirthdayMusic() {
        this.isPlayingMusic = false;
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

// Global instance
window.birthdayAudio = new BirthdayAudioEngine();
