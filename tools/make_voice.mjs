/* Озвучка фраз игры → audio/<язык>/<ключ>.mp3 (+ audio/<язык>/index.json: ключ → голос и текст).

   Запуск из корня проекта:   node tools/make_voice.mjs            (оба языка)
                              node tools/make_voice.mjs he         (только иврит)
   Озвучиваются только новые фразы и фразы, у которых сменился голос; лишние файлы удаляются.
   После правки текста в js/texts.js или голоса в VOICES — просто запустить снова.

   Иврит — Google Cloud Text-to-Speech, голоса Chirp 3 HD (нужен gcloud: `gcloud auth login`,
          проект с включённым texttospeech.googleapis.com — PROJECT ниже).
   Русский — локальный сервер Silero из проекта BaratzNew (C:\BaratzNew\web: npm run tts:server),
          http://127.0.0.1:8081 — Google Chirp для русского путал ударения.

   Ключ файла считает voiceKey() из js/sound.js — тот же, что и игра.

   Google иногда «глотает» конец фразы. Поэтому каждый файл проверяется через ffmpeg: если последние
   TAIL_S секунды громче TAIL_DB — фраза оборвана, и она озвучивается заново (до TRIES попыток).
   Паузы в иврите — только знаками препинания: теги [pause] для he-IL Google не поддерживает. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PROJECT = 'becky-498719';
const SILERO = 'http://127.0.0.1:8081/synthesize';
const SPEAKING_RATE = 0.95;                         // чуть медленнее обычного — для детей 7–8 лет
const TAIL_S = 0.15, TAIL_DB = -35, TRIES = 4;      // проверка, не оборвана ли фраза

// кто какую фразу говорит → голос
const VOICES = {
  he: { eli: 'he-IL-Chirp3-HD-Puck', atom: 'he-IL-Chirp3-HD-Charon', narrator: 'he-IL-Chirp3-HD-Sulafat' },
  ru: { eli: 'eugene', atom: 'aidar', narrator: 'xenia' },
};

/* ---------- тексты и ключ — прямо из файлов игры ---------- */
const ctx = vm.createContext({ addEventListener() {}, window: {} });
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/texts.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/sound.js'), 'utf8'), ctx);
const voiceKey = vm.runInContext('voiceKey', ctx);
const gameJs = fs.readFileSync(path.join(ROOT, 'js/game.js'), 'utf8');
const PASS_SCORE = Number(gameJs.match(/PASS_SCORE:\s*(\d+)/)[1]);

function phrases(T) {                               // все фразы, которые игра произносит через say()
  const out = [], add = (who, ...texts) => texts.forEach(text => out.push({ who, text }));
  add('narrator', T.cell, T.molecule);
  add('atom', T.atomHello, T.buildHelp, T.neutrons, T.allFound);
  add('eli', ...T.s1, T.s1uv, T.s1yellow, T.s1drop, T.s1uvout, T.s2end, T.s2rainbow, T.s3intro, T.s3hint, T.pass,
    T.s4b, T.s4laser, T.s4wrong, T.s4end, T.s5intro(PASS_SCORE), T.win, T.almost, T.teaser);
  for (const c of ['red', 'cyan', 'violet']) add('eli', T.s4ok(T.photons[c][1]));   // «летят два красных фотона»
  for (const m of [3, 4, 5]) for (const t of [3, 4, 5]) if (m !== t) add('eli', T.wrongStep(m, t));
  return out;
}

/* ---------- синтез ---------- */
let token = null;
function gcloudToken() {
  const exe = path.join(process.env.LOCALAPPDATA || '', 'Google', 'Cloud SDK', 'google-cloud-sdk', 'bin', 'gcloud.cmd');
  const cmd = fs.existsSync(exe) ? exe : 'gcloud';
  return execSync(`"${cmd}" auth print-access-token`, { encoding: 'utf8' }).trim();   // gcloud.cmd — только через оболочку
}
async function googleTts(text, voice) {
  token ??= gcloudToken();
  const body = { input: { text }, voice: { languageCode: voice.slice(0, 5), name: voice },
    audioConfig: { audioEncoding: 'MP3', speakingRate: SPEAKING_RATE } };
  for (let attempt = 0; ; attempt++) {
    const r = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST', body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}`, 'x-goog-user-project': PROJECT, 'Content-Type': 'application/json' } });
    if (r.status === 401 && attempt === 0) { token = gcloudToken(); continue; }   // токен живёт ~1 час
    if (!r.ok) throw new Error(`Google TTS ${r.status}: ${(await r.text()).slice(0, 300)}`);
    return Buffer.from((await r.json()).audioContent, 'base64');
  }
}
async function sileroTts(text, speaker) {
  const r = await fetch(SILERO, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, speaker }) })
    .catch(() => { throw new Error('Silero не отвечает: запустите в C:\\BaratzNew\\web  npm run tts:server'); });
  if (!r.ok) throw new Error(`Silero ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return Buffer.from(await r.arrayBuffer());
}

function tailDb(file) {                             // самый громкий звук в последние TAIL_S секунды, дБ
  try {
    const out = execSync(`ffmpeg -hide_banner -sseof -${TAIL_S} -i "${file}" -af volumedetect -f null - 2>&1`, { encoding: 'utf8' });
    return Number((out.match(/max_volume: ([-\d.]+)/) || [])[1] ?? -99);
  } catch (e) { return -99; }                       // ffmpeg нет — проверку пропускаем
}
const cutOff = file => tailDb(file) > TAIL_DB;

/* ---------- основной проход ---------- */
const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['he', 'ru'];
for (const lang of langs) {
  const T = vm.runInContext(lang === 'he' ? 'T_HE' : 'T_RU', ctx), dir = path.join(ROOT, 'audio', lang);
  fs.mkdirSync(dir, { recursive: true });
  const idxFile = path.join(dir, 'index.json');
  const old = fs.existsSync(idxFile) ? JSON.parse(fs.readFileSync(idxFile, 'utf8')) : {};
  const idx = {};
  let made = 0;
  for (const { who, text } of phrases(T)) {
    const key = voiceKey(text), voice = VOICES[lang][who], file = path.join(dir, key + '.mp3');
    if (idx[key]) continue;                         // одинаковая фраза встречается дважды
    idx[key] = { voice, text };
    if (fs.existsSync(file) && old[key]?.voice === voice && !cutOff(file)) continue;
    process.stdout.write(`${lang} ${key} ${who}: ${text.slice(0, 50)}…\n`);
    for (let i = 1; i <= TRIES; i++) {
      fs.writeFileSync(file, lang === 'he' ? await googleTts(text, voice) : await sileroTts(text, voice));
      if (!cutOff(file)) break;
      console.log(i < TRIES ? `   оборвана в конце, ещё раз (${i + 1})` : `   !!! всё ещё оборвана после ${TRIES} попыток — послушать`);
    }
    made++;
  }
  let removed = 0;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.mp3') && !idx[f.slice(0, -4)]) { fs.unlinkSync(path.join(dir, f)); removed++; }
  fs.writeFileSync(idxFile, JSON.stringify(idx, null, 1) + '\n');
  console.log(`${lang}: фраз ${Object.keys(idx).length}, озвучено заново ${made}, удалено старых ${removed}`);
}
