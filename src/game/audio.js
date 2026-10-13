// Accra Life 3D - Authentic Ghanaian Afrobeats & Sound FX Engine (Web Audio API)
// High-performance procedural synthesis - 0KB audio assets, instant loading, no data bundle cost!

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isPlayingBgm = false;
        this.bgmTimer = null;
        this.bpm = 110; // Classic Afrobeats / Highlife tempo
        this.beatIndex = 0;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.8;
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.45;
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.7;
            this.sfxGain.connect(this.masterGain);
        } catch (e) {
            console.warn('AudioContext unsupported:', e);
        }
    }

    unlock() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.isPlayingBgm && !this.isMuted) {
            this.startAfrobeatsBGM();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.8;
        }
        return this.isMuted;
    }

    // Play synthesized Afrobeats drum hit (Kick, Snare, Talking Drum, Shaker)
    playDrum(type, time) {
        if (!this.ctx || this.isMuted) return;
        const t = time || this.ctx.currentTime;

        if (type === 'kick') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(130, t);
            osc.frequency.exponentialRampToValueAtTime(32, t + 0.18);
            gain.gain.setValueAtTime(0.9, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.start(t);
            osc.stop(t + 0.22);
        } else if (type === 'snare') {
            // Snare / Rimshot
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, t);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.start(t);
            osc.stop(t + 0.1);

            // Shaker snap
            this.playShaker(t, 0.2);
        } else if (type === 'talking_drum') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, t);
            osc.frequency.exponentialRampToValueAtTime(260, t + 0.12);
            gain.gain.setValueAtTime(0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.connect(gain);
            gain.connect(this.musicGain);
            osc.start(t);
            osc.stop(t + 0.15);
        } else if (type === 'log_bass') {
            // Amapiano / Afrobeats deep log drum bass
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(65, t);
            osc.frequency.exponentialRampToValueAtTime(42, t + 0.3);
            gain.gain.setValueAtTime(0.65, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            
            // Low-pass filter for deep smooth groove
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(220, t);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);
            osc.start(t);
            osc.stop(t + 0.35);
        }
    }

    playShaker(t, vol = 0.15) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500, t);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, t);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        noise.start(t);
    }

    playMelodyNote(freq, t, dur = 0.2, type = 'sine') {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(t);
        osc.stop(t + dur);
    }

    // Procedural Afrobeats Highlife Rhythm Loop
    startAfrobeatsBGM() {
        if (this.isPlayingBgm) return;
        this.isPlayingBgm = true;

        const stepTime = (60 / this.bpm) / 4; // 16th note in seconds
        // F Major Pentatonic scale (Classic Highlife warm upbeat vibe)
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C, D, E, G, A, C5

        const scheduleBeat = () => {
            if (!this.isPlayingBgm || !this.ctx) return;
            const now = this.ctx.currentTime;
            const step = this.beatIndex % 16;

            // Shaker every 16th note
            this.playShaker(now, step % 2 === 0 ? 0.12 : 0.06);

            // Afrobeats Dem-Bow kick & snare pattern
            if (step === 0 || step === 6 || step === 10) {
                this.playDrum('kick', now);
            }
            if (step === 4 || step === 12) {
                this.playDrum('snare', now);
            }
            if (step === 3 || step === 9 || step === 14) {
                this.playDrum('talking_drum', now);
            }
            if (step === 0 || step === 7 || step === 11) {
                this.playDrum('log_bass', now);
            }

            // Highlife guitar / kalimba hook
            if (step === 0) this.playMelodyNote(notes[2], now, 0.2, 'triangle'); // E
            if (step === 3) this.playMelodyNote(notes[4], now, 0.15, 'triangle'); // A
            if (step === 6) this.playMelodyNote(notes[3], now, 0.2, 'triangle'); // G
            if (step === 8) this.playMelodyNote(notes[5], now, 0.25, 'triangle'); // C5
            if (step === 11) this.playMelodyNote(notes[3], now, 0.15, 'triangle'); // G
            if (step === 14) this.playMelodyNote(notes[1], now, 0.18, 'triangle'); // D

            this.beatIndex++;
            this.bgmTimer = setTimeout(scheduleBeat, stepTime * 1000);
        };

        scheduleBeat();
    }

    stopAfrobeatsBGM() {
        this.isPlayingBgm = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    // --- Sound Effects (SFX) ---
    playCashJingle() {
        this.unlock();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.4, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.35);
        });
    }

    playLevelUp() {
        this.unlock();
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const chord = [392.00, 523.25, 659.25, 783.99]; // G, C, E, G
        chord.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now);
            osc.stop(now + 0.7);
        });
    }

    playTap() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playFootstep() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        this.playShaker(now, 0.05);
    }
}

export const audio = new AudioManager();
