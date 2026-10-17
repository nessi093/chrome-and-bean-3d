/**
 * Procedural Web Audio Engine for CHROME & BEAN 3D Cafe
 * Synthesizes ambient cafe drone, espresso steam hiss, and lounge vibes
 * Zero external audio files (100% procedural, zero 404 dependencies)
 */

class CafeAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private steamGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Ambient chatter/room drone generator (filtered brown noise + soft harmonic chords)
    this.setupAmbience();
  }

  private setupAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // Create 4-second brown noise loop for atmospheric cafe room hum
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;

    // Filter to warm low-mid room acoustics
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.noiseSource.connect(lowpass);
    lowpass.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.noiseSource.start();

    // Soft warm electric rhodes/synth chord pad (Cmaj9 / Fmaj9)
    const chordFreqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
    chordFreqs.forEach((freq) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.ambientGain);
      osc.start();
    });
  }

  public toggle(): boolean {
    this.init();
    if (!this.ctx || !this.ambientGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = !this.isPlaying;
    const targetGain = this.isPlaying ? 0.4 : 0;
    this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.5);
    return this.isPlaying;
  }

  public playEspressoSteamSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // High frequency filtered hiss
    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    source.start(t);
    source.stop(t + 1.5);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const cafeAudio = new CafeAudioEngine();
