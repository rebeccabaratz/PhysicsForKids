/* ===================== ЗВУК: озвучка фраз и звуковые эффекты =====================
   Озвучка: файлы audio/<язык>/<ключ>.mp3, ключ = voiceKey(текст фразы).
   Их создаёт tools/make_voice.mjs; список — audio/<язык>/index.json.
   Эффекты синтезируются прямо в браузере (Web Audio), файлов для них нет.
   Браузер включает звук только после касания экрана — поэтому unlockAudio() на каждое касание. */

const VOICE_VOLUME = 1.0;
const SFX_VOLUME = 0.55;

function voiceKey(text) {                         // FNV-1a, 32 бита; тот же ключ считает tools/make_voice.mjs
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

const SND = { ac: null, voice: null, sfx: null, noise: null, cache: new Map(), cur: null, lang: 'he' };

function audioCtx() {
  if (SND.ac) return SND.ac;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  const ac = SND.ac = new C();
  SND.voice = ac.createGain(); SND.voice.gain.value = VOICE_VOLUME; SND.voice.connect(ac.destination);
  SND.sfx = ac.createGain(); SND.sfx.gain.value = SFX_VOLUME; SND.sfx.connect(ac.destination);
  const n = SND.noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ac;
}
function unlockAudio() { const ac = audioCtx(); if (ac && ac.state !== 'running') ac.resume().catch(() => {}); }
const soundOn = () => !!SND.ac && SND.ac.state === 'running';
// касание разрешает звук: на телефоне — pointerup/touchend, мышью — pointerdown
for (const ev of ['pointerdown', 'pointerup', 'touchend', 'keydown']) addEventListener(ev, unlockAudio, true);

/* ---------- озвучка ---------- */
function loadVoice(key) {                          // → AudioBuffer или null (файла нет / не открылся)
  const ac = audioCtx();
  if (!ac) return Promise.resolve(null);
  if (!SND.cache.has(key)) {
    SND.cache.set(key, fetch(`audio/${SND.lang}/${key}.mp3`)
      .then(r => r.ok ? r.arrayBuffer() : null)
      .then(b => b && new Promise((res, rej) => ac.decodeAudioData(b, res, rej)))
      .catch(() => null));
  }
  return SND.cache.get(key);
}
function preloadVoices(lang) {                     // заранее скачать все фразы языка, чтобы не было пауз
  SND.lang = lang;
  return fetch(`audio/${lang}/index.json`).then(r => r.ok ? r.json() : {})          // index.json: ключ → голос и текст
    .then(idx => { const keys = Object.keys(idx); keys.forEach(loadVoice); return keys.length; })
    .catch(() => 0);
}
function stopVoice() {                             // оборвать звучащую фразу (только для «послушать ещё раз»)
  const c = SND.cur; SND.cur = null;
  if (!c) return;
  c.src.onended = null; try { c.src.stop(); } catch (e) {}
  c.done(null);
}
/* Фраза не обрывает ту, что звучит: ждёт, пока та договорит. Если за это время пришла фраза новее,
   ждавшая пропускается. interrupt=true — оборвать звучащую и говорить сразу.
   Результат: true — дозвучала до конца; false — озвучки нет (нет файла или звук не разрешён);
   null — фразу оборвали или пропустили ради более новой. */
async function playVoice(text, interrupt = false) {
  if (interrupt) stopVoice();
  const t = {}; SND.next = t;
  if (!text) return false;
  const buf = await loadVoice(voiceKey(text));
  while (SND.cur) await SND.cur.ended;
  if (SND.next !== t) return null;
  // касание только что было — браузер включает звук не мгновенно: ждём до 0,5 с
  if (buf && SND.ac.state !== 'running') await Promise.race([SND.ac.resume().catch(() => {}), new Promise(r => setTimeout(r, 500))]);
  if (SND.next !== t) return null;
  if (SND.cur) return playVoice(text);             // пока ждали звук, заговорила другая фраза
  SND.next = null;
  if (!buf || !soundOn()) return false;
  const src = SND.ac.createBufferSource(); src.buffer = buf; src.connect(SND.voice);
  const c = SND.cur = { src };
  c.ended = new Promise(r => { c.done = r; });
  src.onended = () => { if (SND.cur === c) SND.cur = null; c.done(true); };
  src.start();
  return c.ended;
}

/* ---------- эффекты ---------- */
function tone(t, f, dur, type = 'sine', vol = 0.3, f2 = null) {
  const ac = SND.ac, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(SND.sfx); o.start(t); o.stop(t + dur + 0.02);
}
function noise(t, dur, vol = 0.3, f = 2000, f2 = null, q = 1) {
  const ac = SND.ac, s = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = SND.noise; bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f, t);
  if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(SND.sfx); s.start(t); s.stop(t + dur + 0.02);
}
const SFX = {
  tap:     t => tone(t, 700, 0.07, 'sine', 0.2),
  cut:     t => { noise(t, 0.1, 0.6, 3500, 1500, 2); tone(t, 200, 0.09, 'triangle', 0.3, 90); },
  tick:    t => noise(t, 0.05, 0.35, 4200, 2500, 3),
  chomp:   t => { noise(t, 0.08, 0.4, 900, 500, 2); tone(t, 150, 0.1, 'square', 0.08, 80); },
  gulp:    t => tone(t, 520, 0.25, 'sine', 0.45, 150),
  rise:    t => tone(t, 280, 0.45, 'triangle', 0.28, 950),
  fall:    t => tone(t, 850, 0.4, 'triangle', 0.22, 260),
  pop:     t => tone(t, 950, 0.09, 'sine', 0.35, 320),
  whoosh:  t => noise(t, 0.5, 0.3, 500, 3000, 1.5),
  ding:    t => { tone(t, 1046, 0.4, 'sine', 0.28); tone(t + 0.09, 1568, 0.5, 'sine', 0.22); },
  oops:    t => { tone(t, 330, 0.16, 'triangle', 0.22, 300); tone(t + 0.15, 247, 0.28, 'triangle', 0.22, 220); },
  buzz:    t => tone(t, 150, 0.3, 'sawtooth', 0.1, 120),
  sparkle: t => [1318, 1568, 2093, 2637].forEach((f, i) => tone(t + i * 0.07, f, 0.3, 'sine', 0.18)),
  fanfare: t => [523, 659, 784, 1046].forEach((f, i) => tone(t + i * 0.13, f, i === 3 ? 0.8 : 0.22, 'triangle', 0.3)),
  boing:   t => tone(t, 220, 0.25, 'sine', 0.3, 520),
};
function sfx(name, delayMs = 0) {
  if (!soundOn() || !SFX[name]) return;
  SFX[name](SND.ac.currentTime + delayMs / 1000);
}
