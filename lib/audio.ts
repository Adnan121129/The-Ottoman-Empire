/**
 * Procedural ambient soundscapes, synthesized live with the Web Audio API.
 * No recordings or copyrighted music are used. Each mood is an original,
 * generative texture “inspired by” its setting rather than an imitation of a
 * historical performance.
 */
export type Mood = 'bosphorus' | 'palace' | 'bazaar' | 'battle';

export const moodLabels: Record<Mood, string> = {
  bosphorus: 'Bosphorus — sea and wind',
  palace: 'Palace — drone and reed melody',
  bazaar: 'Bazaar — murmuring market',
  battle: 'Battlefield — distant drums',
};

type Stop = () => void;

function noiseBuffer(ctx: AudioContext, seconds = 3, brown = false) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else data[i] = white;
  }
  return buf;
}

function loopNoise(ctx: AudioContext, brown: boolean) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 4, brown);
  src.loop = true;
  return src;
}

function lfo(ctx: AudioContext, freq: number, depth: number, target: AudioParam) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  gain.gain.value = depth;
  osc.connect(gain).connect(target);
  osc.start();
  return osc;
}

function bosphorus(ctx: AudioContext, out: AudioNode): Stop {
  const nodes: AudioScheduledSourceNode[] = [];
  const waves = loopNoise(ctx, true);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  const g = ctx.createGain();
  g.gain.value = 0.55;
  waves.connect(lp).connect(g).connect(out);
  nodes.push(waves, lfo(ctx, 0.07, 0.3, g.gain), lfo(ctx, 0.05, 180, lp.frequency));
  const hiss = loopNoise(ctx, false);
  const hp = ctx.createBiquadFilter();
  hp.type = 'bandpass';
  hp.frequency.value = 2400;
  hp.Q.value = 0.4;
  const hg = ctx.createGain();
  hg.gain.value = 0.025;
  hiss.connect(hp).connect(hg).connect(out);
  nodes.push(hiss, lfo(ctx, 0.11, 0.02, hg.gain));
  waves.start();
  hiss.start();
  return () => nodes.forEach((n) => n.stop());
}

// D Hicaz (approximately, in equal temperament): D Eb F# G A Bb C D
const HICAZ = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33];

function palace(ctx: AudioContext, out: AudioNode): Stop {
  const nodes: AudioScheduledSourceNode[] = [];
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.12;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 520;
  droneFilter.connect(droneGain).connect(out);
  for (const [f, d] of [[73.42, 0], [73.62, 0], [110, 0.2]] as const) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.detune.value = d;
    o.connect(droneFilter);
    o.start();
    nodes.push(o);
  }
  nodes.push(lfo(ctx, 0.09, 0.04, droneGain.gain));

  let idx = 4;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const play = () => {
    const step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
    idx = Math.max(0, Math.min(HICAZ.length - 1, idx + step));
    const now = ctx.currentTime;
    const dur = 1.2 + Math.random() * 1.8;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = HICAZ[idx] / 2;
    const vib = lfo(ctx, 5.2, 2.4, o.frequency);
    const breath = loopNoise(ctx, false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = HICAZ[idx];
    bp.Q.value = 8;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.16, now + 0.45);
    env.gain.setValueAtTime(0.14, now + dur);
    env.gain.linearRampToValueAtTime(0, now + dur + 1.1);
    const bg = ctx.createGain();
    bg.gain.value = 0.05;
    o.connect(env);
    breath.connect(bp).connect(bg).connect(env);
    env.connect(out);
    o.start(now);
    breath.start(now);
    const end = now + dur + 1.2;
    o.stop(end);
    breath.stop(end);
    vib.stop(end);
    timer = setTimeout(play, (dur + 0.8 + Math.random() * 2.6) * 1000);
  };
  timer = setTimeout(play, 1200);
  return () => {
    if (timer) clearTimeout(timer);
    nodes.forEach((n) => n.stop());
  };
}

function bazaar(ctx: AudioContext, out: AudioNode): Stop {
  const nodes: AudioScheduledSourceNode[] = [];
  for (const f of [320, 540, 860, 1250]) {
    const n = loopNoise(ctx, false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f;
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    n.connect(bp).connect(g).connect(out);
    n.start();
    nodes.push(n, lfo(ctx, 0.3 + Math.random() * 0.9, 0.035, g.gain));
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clink = () => {
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = 1800 + Math.random() * 2200;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.06, now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    o.connect(env).connect(out);
    o.start(now);
    o.stop(now + 0.4);
    timer = setTimeout(clink, 600 + Math.random() * 3200);
  };
  timer = setTimeout(clink, 900);
  return () => {
    if (timer) clearTimeout(timer);
    nodes.forEach((n) => n.stop());
  };
}

function battle(ctx: AudioContext, out: AudioNode): Stop {
  const nodes: AudioScheduledSourceNode[] = [];
  const wind = loopNoise(ctx, true);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 300;
  const wg = ctx.createGain();
  wg.gain.value = 0.35;
  wind.connect(lp).connect(wg).connect(out);
  wind.start();
  nodes.push(wind, lfo(ctx, 0.06, 0.2, wg.gain));
  // A slow two-stroke pattern: heavy “düm” and lighter “tek”.
  const pattern = [1, 0, 0.45, 0, 1, 0, 0, 0];
  let step = 0;
  const hit = (strength: number) => {
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(strength > 0.6 ? 70 : 120, now);
    o.frequency.exponentialRampToValueAtTime(38, now + 0.4);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.5 * strength, now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    o.connect(env).connect(out);
    o.start(now);
    o.stop(now + 0.65);
  };
  const interval = setInterval(() => {
    const s = pattern[step % pattern.length];
    if (s) hit(s);
    step++;
  }, 420);
  return () => {
    clearInterval(interval);
    nodes.forEach((n) => n.stop());
  };
}

const builders: Record<Mood, (ctx: AudioContext, out: AudioNode) => Stop> = { bosphorus, palace, bazaar, battle };

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private current: { mood: Mood; stop: Stop; gain: GainNode } | null = null;
  private volume = 0.35;

  private ensure() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      const comp = this.ctx.createDynamicsCompressor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(comp).connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return { ctx: this.ctx, master: this.master! };
  }

  play(mood: Mood) {
    if (this.current?.mood === mood) return;
    const { ctx, master } = this.ensure();
    const previous = this.current;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
    gain.connect(master);
    const stop = builders[mood](ctx, gain);
    this.current = { mood, stop, gain };
    if (previous) this.fadeOut(previous);
  }

  private fadeOut(track: { stop: Stop; gain: GainNode }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    track.gain.gain.cancelScheduledValues(t);
    track.gain.gain.setValueAtTime(track.gain.gain.value, t);
    track.gain.gain.linearRampToValueAtTime(0, t + 1.8);
    setTimeout(() => {
      track.stop();
      track.gain.disconnect();
    }, 2000);
  }

  stop() {
    if (this.current) this.fadeOut(this.current);
    this.current = null;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.master && this.ctx) this.master.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.3);
  }
}
