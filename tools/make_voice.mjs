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
   TAIL_S секунды громче TAIL_DB — фраза оборвана; если звук на символ текста длиннее MAX_MS_PER_CHAR
   или сплошь громче MAX_MEAN_DB — это брак (бывает: 26 с шума вместо фразы). Такие озвучиваются заново (до TRIES раз).
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
const MAX_MS_PER_CHAR = 250, MAX_MEAN_DB = -14;     // брак: слишком длинно для текста или сплошной шум (норма ~70–160 мс, ~−20 дБ)

// кто какую фразу говорит → голос. Ребекка выбрала один мужской голос — голос Эли — для всех
// (женский рассказчик he-IL-Chirp3-HD-Sulafat звучал с сильным акцентом)
const VOICES = {
  he: { eli: 'he-IL-Chirp3-HD-Puck', atom: 'he-IL-Chirp3-HD-Puck', narrator: 'he-IL-Chirp3-HD-Puck' },
  ru: { eli: 'eugene', atom: 'eugene', narrator: 'eugene' },
};

/* как произносить: правки текста только для голоса (на экране текст не меняется).
   Своё произношение (IPA) Google для he-IL не поддерживает — подсказываем огласовками и латиницей.
   Варианты выбраны на слух (audio/samples, вкладка «Варианты» в tools/listen.html). */
const SAY_AS = {
  he: [
    [/פוטו/g, 'פוטוֹ'],                            // «фотун» → «фотон»: холам на последнем слоге (вариант foton3)
    [/אטו(?=[םמ])/g, 'אטוֹ'],                       // «атум» → «атом»: אטום, האטומים, באטום
    [/הכול/g, 'הכוֹל'],                           // «акуль» → «аколь»: холам на вав (варианты kol1–kol3)
    [/^איפה אלי\?$/, 'איפה Eli ???'],            // ивритом голос читал «элИ» и не спрашивал
    [/האלקטרון אלי(?![א-ת])/g, 'האלקטרון Elli'],   // фраза № 7: «Elli» — выбрано на слух
    [/(?<![א-ת])אלי(?![א-ת])/g, 'Ellie'], // имя: ивритом «элИ», «Eli» — по-английски «Или»; «Ellie» = «Эли»
  ],
  ru: [],
};
const spoken = (lang, text) => SAY_AS[lang].reduce((t, [re, to]) => t.replace(re, to), text);

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
  add('eli', T.appleAsk);                           // «Где Эли?» — мужским голосом (женский рассказчик звучал с акцентом)
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

function ff(args) {                                 // вывод ffmpeg; ffmpeg нет — пустая строка, проверки пропускаются
  try { return execSync(`ffmpeg -hide_banner ${args} -af volumedetect -f null - 2>&1`, { encoding: 'utf8' }); } catch (e) { return ''; }
}
const num = (out, re) => Number((out.match(re) || [])[1] ?? NaN);
/* что не так с файлом: '' — всё в порядке */
function problem(file, text) {
  const tail = num(ff(`-sseof -${TAIL_S} -i "${file}"`), /max_volume: ([-\d.]+)/);
  if (tail > TAIL_DB) return 'оборвана в конце';
  const all = ff(`-i "${file}"`), mean = num(all, /mean_volume: ([-\d.]+)/);
  const [, h, m, sec] = all.match(/time=(\d+):(\d+):([\d.]+)/g)?.pop().match(/time=(\d+):(\d+):([\d.]+)/) || [];
  const ms = ((+h || 0) * 3600 + (+m || 0) * 60 + (+sec || 0)) * 1000;
  if (text.length >= 15 && ms / text.length > MAX_MS_PER_CHAR) return `слишком длинная (${(ms / 1000).toFixed(1)} с)`;
  if (mean > MAX_MEAN_DB) return `шум вместо речи (${mean} дБ)`;
  return '';
}

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
    const said = spoken(lang, text);                // что уходит голосу (с правками произношения)
    idx[key] = said === text ? { voice, text } : { voice, text, said };
    const same = old[key] && old[key].voice === voice && (old[key].said ?? old[key].text) === said;
    if (fs.existsSync(file) && same && !problem(file, said)) continue;
    process.stdout.write(`${lang} ${key} ${who}: ${text.slice(0, 50)}…\n`);
    for (let i = 1; i <= TRIES; i++) {
      fs.writeFileSync(file, lang === 'he' ? await googleTts(said, voice) : await sileroTts(said, voice));
      const bad = problem(file, said);
      if (!bad) break;
      console.log(i < TRIES ? `   ${bad}, ещё раз (${i + 1})` : `   !!! ${bad} после ${TRIES} попыток — послушать`);
    }
    made++;
  }
  let removed = 0;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.mp3') && !idx[f.slice(0, -4)]) { fs.unlinkSync(path.join(dir, f)); removed++; }
  fs.writeFileSync(idxFile, JSON.stringify(idx, null, 1) + '\n');
  console.log(`${lang}: фраз ${Object.keys(idx).length}, озвучено заново ${made}, удалено старых ${removed}`);
}
