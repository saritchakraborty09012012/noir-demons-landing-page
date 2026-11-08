let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let voices: OscillatorNode[] = [];

function tick() {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2400;
  filter.Q.value = 5;
  osc.type = "square";
  osc.frequency.value = 1600 + Math.random() * 1200;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.006, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(filter).connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.22);
}

export async function setAmbient(on: boolean) {
  if (!on) {
    if (master && ctx) master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    voices.forEach((v) => {
      try {
        v.stop(ctx ? ctx.currentTime + 0.5 : 0);
      } catch {
        /* already stopped */
      }
    });
    voices = [];
    if (timer) window.clearInterval(timer);
    timer = null;
    return;
  }

  if (!ctx) {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtor) return;
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") await ctx.resume();
  if (!master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 1.2);

  const now = ctx.currentTime;
  const hums = [43.65, 55, 87.3];
  voices = hums.map((freq, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    const filter = ctx!.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 260 + i * 160;
    osc.type = i === 2 ? "triangle" : "sine";
    osc.frequency.value = freq;
    gain.gain.value = i === 2 ? 0.09 : 0.2;
    osc.connect(filter).connect(gain).connect(master!);
    osc.start(now);
    return osc;
  });
  timer = window.setInterval(tick, 2100);
}

export function stopAmbientSync() {
  if (master && ctx) master.gain.value = 0.0001;
}
