export class AudioManager {
  private ctx: AudioContext | null = null;
  private sfxBuffers: Map<number, AudioBuffer> = new Map();
  private sfxEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private currentBgmId: number = -1;
  private bgmInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  constructor() {
    this.sfxEnabled = localStorage.getItem('accra_sfx') !== 'false';
    this.musicEnabled = localStorage.getItem('accra_music') !== 'false';
  }

  public init(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? 0.7 : 0;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? 0.45 : 0;
      this.musicGain.connect(this.masterGain);

      this.preloadSfx();
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  private async preloadSfx(): Promise<void> {
    const sfxList = [13, 14, 15, 16, 17, 18, 20, 24, 25, 26, 27, 28, 29, 31];
    for (const id of sfxList) {
      try {
        const res = await fetch(`/audio/sfx_${id}.wav`);
        if (res.ok) {
          const arrayBuf = await res.arrayBuffer();
          if (this.ctx) {
            const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
            this.sfxBuffers.set(id, audioBuf);
          }
        }
      } catch (err) {}
    }
  }

  public playSfx(id: number): void {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.ctx?.resume();
    }

    const buf = this.sfxBuffers.get(id);
    if (buf && this.ctx && this.sfxGain) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.sfxGain);
      src.start();
    } else {
      this.playSynthBeep(id);
    }
  }

  private playSynthBeep(id: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);

    const now = this.ctx.currentTime;
    let freq = 440;
    let dur = 0.08;

    if (id === 14 || id === 20) { freq = 540; dur = 0.05; }
    else if (id === 13 || id === 15) { freq = 680; dur = 0.1; }
    else if (id === 17) { freq = 320; dur = 0.08; }
    else if (id === 18) { freq = 900; dur = 0.2; } // Cash / MoMo chime
    else if (id === 25) { freq = 750; dur = 0.15; } // Phone chime
    else if (id === 28) { freq = 780; dur = 0.15; } // Positive
    else if (id === 29) { freq = 280; dur = 0.2; } // Negative

    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.start(now);
    osc.stop(now + dur);
  }

  public playBgm(id: number): void {
    if (this.currentBgmId === id && this.bgmInterval !== null) return;
    this.stopBgm();
    this.currentBgmId = id;
    if (!this.musicEnabled) return;

    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.startAfrobeatsLoop(id);
  }

  public stopBgm(): void {
    if (this.bgmInterval !== null) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgmId = -1;
  }

  private startAfrobeatsLoop(themeId: number): void {
    if (!this.ctx || !this.musicGain) return;

    // Upbeat Ghanaian Highlife & Afrobeats Chime Melodies!
    // Theme 1: Main Title / Accra Anthem
    // Theme 2: Osu Oxford Street Hustle
    // Theme 3: East Legon Club & Azonto Rhythm
    // Theme 4: Labadi Beach Coastal Breeze
    // Theme 5: Apartment Chill
    let notes: { freq: number; dur: number; type: OscillatorType }[] = [];

    if (themeId === 1) { // Title: Highlife Upbeat Bounce
      notes = [
        { freq: 293.66, dur: 0.16, type: 'triangle' }, // D4
        { freq: 369.99, dur: 0.16, type: 'triangle' }, // F#4
        { freq: 440.00, dur: 0.25, type: 'sine' },     // A4
        { freq: 587.33, dur: 0.35, type: 'triangle' }, // D5
        { freq: 523.25, dur: 0.16, type: 'triangle' }, // C5
        { freq: 440.00, dur: 0.30, type: 'sine' },     // A4
        { freq: 392.00, dur: 0.16, type: 'triangle' }, // G4
        { freq: 440.00, dur: 0.45, type: 'sine' },     // A4
      ];
    } else if (themeId === 3) { // Azonto / Club Beat
      notes = [
        { freq: 110.00, dur: 0.12, type: 'square' },   // A2 bass
        { freq: 440.00, dur: 0.12, type: 'sawtooth' }, // A4
        { freq: 110.00, dur: 0.12, type: 'square' },
        { freq: 554.37, dur: 0.12, type: 'sawtooth' }, // C#5
        { freq: 130.81, dur: 0.12, type: 'square' },   // C3 bass
        { freq: 659.25, dur: 0.15, type: 'sawtooth' }, // E5
        { freq: 110.00, dur: 0.12, type: 'square' },
        { freq: 740.00, dur: 0.25, type: 'sawtooth' }, // F#5
      ];
    } else if (themeId === 4) { // Labadi Beach Reggae / Afro-chill
      notes = [
        { freq: 261.63, dur: 0.35, type: 'sine' }, // C4
        { freq: 329.63, dur: 0.35, type: 'sine' }, // E4
        { freq: 392.00, dur: 0.50, type: 'sine' }, // G4
        { freq: 349.23, dur: 0.35, type: 'sine' }, // F4
        { freq: 440.00, dur: 0.50, type: 'sine' }, // A4
        { freq: 392.00, dur: 0.70, type: 'sine' }, // G4
      ];
    } else { // Oxford Street / Default Urban Grooves
      notes = [
        { freq: 329.63, dur: 0.20, type: 'triangle' }, // E4
        { freq: 392.00, dur: 0.20, type: 'triangle' }, // G4
        { freq: 440.00, dur: 0.28, type: 'sine' },     // A4
        { freq: 493.88, dur: 0.20, type: 'triangle' }, // B4
        { freq: 523.25, dur: 0.35, type: 'sine' },     // C5
        { freq: 440.00, dur: 0.40, type: 'sine' },     // A4
      ];
    }

    let noteIdx = 0;
    const playNext = () => {
      if (!this.musicEnabled || !this.ctx || !this.musicGain) return;
      const n = notes[noteIdx];
      noteIdx = (noteIdx + 1) % notes.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.20, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.dur);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + n.dur);
    };

    playNext();
    this.bgmInterval = window.setInterval(playNext, 290);
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('accra_sfx', String(this.sfxEnabled));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxEnabled ? 0.7 : 0;
    }
    return this.sfxEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('accra_music', String(this.musicEnabled));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicEnabled ? 0.45 : 0;
    }
    if (!this.musicEnabled) {
      this.stopBgm();
    } else if (this.currentBgmId > 0) {
      this.playBgm(this.currentBgmId);
    }
    return this.musicEnabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }
}
