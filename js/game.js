/*
  Название: Эли и фотон — Мир 1, Сцена 1 («Режем яблоко» + «Собери атом» + «Лесенка Эли»), версия 40
  Запуск: открыть index.html в браузере телефона или планшета (лучше через локальный сервер, см. README).
          Картинки — в папке img/ (38 файлов WebP).
  Вход:   картинки из папки img/, касания экрана ребёнком.
  Выход:  интерактивная игра; итог проверки (сколько из 5) и значок показываются на экране.
  Параметры, которые можно менять (объект P в начале js/game.js):
    ELI_SIZE       — размер Эли, доля ширины экрана (0.30)
    PHOTON_SIZE    — размер мячика относительно картинки Эли (0.33 = треть)
    FLY_MS         — время полёта пойманного мячика из реки к Эли, мс (2000)
    AUTO_FLY_MS    — время полёта «показательного» мячика от края экрана, мс (2500)
    OUT_MS         — время, за которое вылетевший мячик пересекает ширину экрана, мс (4500)
    RIVER_MS       — время, за которое мячик в реке проплывает экран слева направо, мс (14000)
    RIVER_FAST     — этап 3 без подсказок: доля RIVER_MS для заданий 1–4 — река ускоряется ([1, 0.8, 0.65, 0.55])
    LADDER_GAPS    — доли высоты лестницы для промежутков 1→2, 2→3, 3→4, 4→5 ([0.55, 0.22, 0.13, 0.10])
    LADDER_BOTTOM  — где 1-я ступенька, доля высоты экрана (0.80)
    TOP_RESERVE    — место сверху под кнопки, доля высоты экрана (0.14)
    PASS_SCORE     — сколько правильных из 5 нужно для значка (4)
    MANUAL_CUTS    — сколько разрезов ребёнок делает сам (4)
    TOTAL_CUTS     — всего разрезов до атома (30)
    APPLE_CM       — ширина яблока, см (8)
    FAST_CUT_MS    — скорость быстрого резания, мс на разрез (140)
    CUTS_PER_TAP   — сколько быстрых разрезов делает одно нажатие на ножик (3)
    STOP_TAP_MS    — через сколько ножик снова нажимается на остановках «клетка» и «молекула», мс (1000)
    BADGE_MS       — сколько растёт и сияет золотой значок в альбоме, мс (1800)
    DROP_DELAY_MS  — сколько Эли стоит наверху перед прыжком вниз, мс (1100)
    HOP_MS         — как часто Эли нетерпеливо подпрыгивает, мс на прыжок (450)
    SWALLOW_MS     — как долго Эли заглатывает фотон, мс (450)
    MOUTH_OPEN_AT  — когда открывать рот: сколько ростов Эли осталось фотону до рта (0.35)
    TREMBLE_MS     — период дрожи Эли с проглоченным фотоном, мс (200)
    TREMBLE_PX     — сила дрожи: 1 = чуть-чуть, 2 = вдвое сильнее (1)
    SPIT_MS        — как долго мячик вырастает изо рта при выплёвывании, мс (700)
    CHEW_FRAME_MS  — длительность кадра жевания (рот закрыт = рот открыт), мс (300)
    CHEW_TIMES     — сколько раз рожица жуёт (2)
    LASER_ATOMS    — мини-игра «Лазер» (этап 4): сколько маленьких Эли (5)
    LASER_MS       — мини-игра «Лазер»: за сколько мс строй фотонов пролетает ширину экрана (3500)
    SHOW_TEXT      — показывать ли фразы текстом вверху (false: только голос; true — для взрослых/отладки)
    PLANET_MS      — сколько вращается и наклоняется планетарный атом, мс (4500)
    RING_SIZES     — радиусы колец 1–5 в планетарном атоме, доля самого большого
    MOUTH_OPEN, MOUTH_BLOW — положение рта на картинках Эли (доли картинки)
    SPEED          — общая скорость анимаций (1 = обычная, 2 = вдвое быстрее)
    START          — с чего начинать: 'apple' или 'atom'
    (язык: пока только иврит — RU_ON = false в блоке «ЯЗЫК»; с RU_ON = true — кнопки «עברית / Русский» и адрес #ru)
    STEP_COLORS    — пастельные цвета ступенек 1–5
  «Собери атом»: константы NEUT (нейтроны для каждого числа протонов), BIN = 8 шариков в корзинке, SHAKE_MS;
    карточки веществ — img/card_1.webp … card_8.webp; когда открыты все 8 — сам переход к Эли.
  Навигация: 8 сцен (#apple, #build, #eli1…#eli5, #fire — глава «Салют»); ◀ — начало предыдущей сцены, ▶ — следующей (если эта пройдена).
    Внутри сцены продолжают нажатием на того, кто говорит (Атом или Эли); карточка закрывается нажатием на неё.
  Тексты: объект T — все фразы игры в одном месте, для перевода на иврит.
  Задания показываются без текста: нужная ступенька мерцает, Эли подпрыгивает;
  в обучении (этап 2, первое задание этапа 4, повторная тренировка) — ещё и прозрачный силуэт Эли на цели.
  Физика: уровни водорода E(n) = −13,6/n² эВ. Лестница не в точном масштабе (настоящий прыжок 1→2
          в 3,6 раза больше всего пути 2→5), но сохранены два верных правила: первый прыжок самый
          большой, выше ступеньки сближаются. Мячики: УФ 10,2 эВ (1→2), красный 1,89 (656 нм, 2→3),
          бирюзовый 2,55 (486 нм, 2→4), фиолетовый 2,86 (434 нм, 2→5); жёлтый 2,10 (589 нм) и
          зелёный 2,33 (532 нм) не подходят ни к одной ступеньке.
          Спонтанный прыжок вниз: мячик вылетает в случайную сторону.
          Вынужденный (мячик-подсказчик): повторюшка летит рядом, в ту же сторону, мигает в такт.
*/

/* ===================== ПАРАМЕТРЫ ===================== */
const P = {
  ELI_SIZE: 0.30,
  PHOTON_SIZE: 0.33,
  FLY_MS: 2000,
  AUTO_FLY_MS: 2500,
  OUT_MS: 4500,
  RIVER_MS: 14000,
  RIVER_FAST: [1, 0.8, 0.65, 0.55],   // этап 3: во сколько раз быстрее плывёт река в заданиях 1–4 (меньше — быстрее)
  LADDER_GAPS: [0.55, 0.22, 0.13, 0.10],   // 1→2 — больше половины лестницы: первый прыжок самый большой
  LADDER_BOTTOM: 0.80,
  TOP_RESERVE: 0.14,             // текст фраз не показывается — лестнице больше места
  PASS_SCORE: 4,
  MANUAL_CUTS: 4,
  TOTAL_CUTS: 30,
  APPLE_CM: 8,
  FAST_CUT_MS: 140,
  CUTS_PER_TAP: 3,              // после ручных разрезов: сколько разрезов делает одно нажатие на ножик
  STOP_TAP_MS: 1000,
  BADGE_MS: 1800,
  DROP_DELAY_MS: 1100,
  HOP_MS: 450,
  TREMBLE_MS: 200,
  TAIL_LEN: 3.5,                // длина кометного хвоста фотона, в размерах фотона
  TREMBLE_PX: 1,                // сила дрожи (1 = чуть-чуть, 2 = вдвое сильнее)
  SWALLOW_MS: 450,
  MOUTH_OPEN_AT: 0.35,         // Эли открывает рот, когда фотону осталось лететь столько своих ростов
  SPIT_MS: 700,
  CHEW_FRAME_MS: 300,
  CHEW_TIMES: 2,
  LASER_ATOMS: 5,               // мини-игра «Лазер»: сколько маленьких Эли
  LASER_MS: 3500,               // мини-игра «Лазер»: за сколько мс строй фотонов пролетает ширину экрана
  SHOW_TEXT: false,             // показывать ли фразы текстом (дети не читают: только голос; «Где Эли?» — всегда)
  PLANET_MS: 4500,              // сколько вращается и наклоняется планетарный атом
  RING_SIZES: [0.18, 0.34, 0.54, 0.76, 1.0],   // радиусы колец 1–5 (доля самого большого)
  MOUTH_OPEN: [0.50, 0.55],   // где рот на картинке «рот открыт» (доли ширины и высоты)
  MOUTH_BLOW: [0.52, 0.51],   // где рот на картинке «губы трубочкой»
  SPEED: 1,
  START: 'apple',
  DIR: 'ltr',
  STEP_COLORS: [            // [верх, передняя грань, свечение] для ступенек 1..5
    ['#d8e7ff', '#9fbbe8', 'rgba(150,190,255,.45)'],   // 1 — дом Эли, небесно-голубая
    ['#ffffff', '#e8f4ff', 'rgba(200,230,255,.45)'],   // 2 — стеклянная (невидимый фотон)
    ['#ffa8a8', '#f04848', 'rgba(255,60,60,.55)'],     // 3 — красный фотон (оттенок 0°)
    ['#9ff1fa', '#1fcde3', 'rgba(40,215,240,.55)'],    // 4 — бирюзовый фотон (оттенок ~185°)
    ['#bfb0ff', '#7458f0', 'rgba(110,80,255,.6)'],     // 5 — фиолетовый фотон (оттенок ~252°)
  ],
};

/* ===================== ЯЗЫК (тексты — в js/texts.js) ===================== */
/* По умолчанию — иврит. Адрес #ru / #ru-<сцена> — русский, #he / #he-<сцена> — иврит.
   Выбор на стартовом экране запоминается в этом браузере.
   RU_ON = false — пока только иврит: русская кнопка спрятана, #ru открывает иврит (русские тексты оставлены на потом). */
const RU_ON = false;
let LANG = 'he';
try { LANG = localStorage.getItem('eliLang') || 'he'; } catch (e) {}
const HASH0 = location.hash.slice(1), HM = HASH0.match(/^(ru|he)(?:-(.*))?$/);
if (HM) LANG = HM[1];
if (!RU_ON) LANG = 'he';
const HASH_SCENE = HM ? (HM[2] || '') : HASH0;
document.documentElement.dir = LANG === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = LANG;

const T = LANG === 'he' ? T_HE : T_RU;

function plural(n, one, few, many) {            // русское согласование: 1 разрез, 2 разреза, 5 разрезов
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}

/* ===================== ФИЗИКА ===================== */
const EN = n => -13.6 / (n * n);              // энергия ступеньки, эВ
const PH = {                                   // мячики-фотоны; названия — в texts.js (T.photons)
  uv:     { E: 10.2, img: 'photon_uv',     css: '#e9e2ff' },
  red:    { E: 1.89, img: 'photon_red',    css: '#ff4a4a' },
  cyan:   { E: 2.55, img: 'photon_cyan',   css: '#3fdcff' },
  violet: { E: 2.86, img: 'photon_violet', css: '#7a5cff' },
  yellow: { E: 2.10, img: 'photon_yellow', css: '#ffe24a' },
  green:  { E: 2.33, img: 'photon_green',  css: '#45e36a' },
};
for (const k in PH) [PH[k].name, PH[k].gen] = T.photons[k];
const TOL = 0.06;
function resolve(n, c) {                       // что сделает мячик c с Эли на ступеньке n
  const E = PH[c].E;
  for (let m = n + 1; m <= 5; m++) if (Math.abs(EN(m) - EN(n) - E) < TOL) return { type: 'up', to: m };
  for (let k = n - 1; k >= 1; k--) if (Math.abs(EN(n) - EN(k) - E) < TOL) return { type: 'down', to: k };
  return { type: 'pass', reach: EN(n) + E };
}
const colorFor = dE => Object.keys(PH).find(k => Math.abs(PH[k].E - dE) < TOL);

/* ===================== ОБЩЕЕ ===================== */
const $ = s => document.querySelector(s);
const stage = $('#stage');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const K = (RM ? 0.5 : 1) / P.SPEED;
const wait = ms => new Promise(r => setTimeout(r, ms * K));
let W, H, L = {}, phase = 'start', lvl = 1, eli, nucleus, steps = [], stepEl = [], curTarget = null, dreamEl = null, hopAnim = null;

function measure() {
  const r = stage.getBoundingClientRect(); W = r.width; H = r.height;
  L.eli = Math.min(W * P.ELI_SIZE, H * 0.15);
  L.ph = L.eli * P.PHOTON_SIZE;
  L.y1 = H * P.LADDER_BOTTOM;
  L.y5 = Math.min(H * P.TOP_RESERVE + L.eli * 0.92 + 8, L.y1 - 200);
  const g = P.LADDER_GAPS, sum = g.reduce((a, b) => a + b, 0);
  L.lv = [0, L.y1]; let cum = 0;
  for (let n = 2; n <= 5; n++) { cum += g[n - 2] / sum; L.lv[n] = L.y1 - (L.y1 - L.y5) * cum; }
  L.x0 = W * 0.17; L.x1 = W * 0.9; L.cx = (L.x0 + L.x1) / 2;
  L.nucY = H * 0.865; L.nuc = Math.min(H * 0.06, W * 0.15);
  L.riverY = H * 0.945; L.tap = Math.max(66, L.ph * 1.8);
  L.appleY = H * 0.53; L.apple = Math.min(W * 0.46, H * 0.26);
  L.monY = H * 0.76; L.mon = Math.min(W * 0.3, H * 0.17);
}
const yLevel = n => L.lv[n];
function yOfE(E) {                               // высота на экране для энергии E (между ступеньками — линейно)
  if (E <= EN(1)) return L.lv[1];
  for (let n = 1; n < 5; n++) if (E <= EN(n + 1)) return L.lv[n] + (L.lv[n + 1] - L.lv[n]) * (E - EN(n)) / (EN(n + 1) - EN(n));
  return L.lv[4] + (L.lv[5] - L.lv[4]) * (E - EN(4)) / (EN(5) - EN(4));
}
const eliY = n => yLevel(n) - 6 - L.eli * 0.42;

function sprite(name, cls = '') {
  const im = new Image(); im.src = `img/${name}.webp`; im.alt = ''; im.draggable = false;
  im.className = 'spr ' + cls; stage.appendChild(im); return im;
}
function setB(el, b) { el._b = b; el.style.width = b + 'px'; el.style.height = b + 'px'; }
const tf = el => `translate(${el._x - el._b / 2}px,${el._y - el._b / 2}px) scale(${el._k}) ${el._ex || ''}`;
function put(el, x, y, k = 1, ex = '') { el._x = x; el._y = y; el._k = k; el._ex = ex; el.style.transform = tf(el); }
async function go(el, o = {}) {
  const a = tf(el), oa = el.style.opacity || '1';
  if (o.x != null) el._x = o.x; if (o.y != null) el._y = o.y; if (o.k != null) el._k = o.k; if (o.ex != null) el._ex = o.ex;
  const b = tf(el), kf = [{ transform: a }, { transform: b }];
  if (o.opacity != null) { kf[0].opacity = oa; kf[1].opacity = o.opacity; el.style.opacity = o.opacity; }
  el.style.transform = b;
  await el.animate(kf, { duration: (o.ms ?? 500) * K, easing: o.easing || 'ease-in-out' }).finished.catch(() => {});
}
function bounce(el, sx = 1.15, sy = 0.85) {
  const base = tf(el);
  return el.animate([{ transform: base }, { transform: base + ` scale(${sx},${sy})` }, { transform: base + ` scale(${2 - sx},${2 - sy})` }, { transform: base }],
    { duration: 420 * K, easing: 'ease-out' }).finished.catch(() => {});
}
const mouthOpen = el => { el.src = `img/${el._open}.webp`; };
const mouthShut = el => { el.src = `img/${el._shut}.webp`; };
/* рожица жуёт CHEW_TIMES раз: закрыт и открыт одинаковое время; в конце рот закрыт, рожица неподвижна */
async function chew(el) {
  for (let i = 0; i < P.CHEW_TIMES && el.isConnected; i++) {
    mouthShut(el); sfx('chomp');
    const base = tf(el);
    el.animate([{ transform: base }, { transform: base + ' scale(1.04,.94)' }, { transform: base }], { duration: P.CHEW_FRAME_MS * K });
    await wait(P.CHEW_FRAME_MS);
    mouthOpen(el); await wait(P.CHEW_FRAME_MS);
  }
  mouthShut(el);
}
function setCount(n) {
  const c = $('#counter'), num = $('#cnum');
  c.hidden = false; placeCounter();
  num.textContent = n; $('#ccap').textContent = T.cutCap(n, sizeStr(n));
  num.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 260 * K, easing: 'ease-out' });
}
function placeCounter() {                         // цифра разрезов всегда выше самой верхней точки ножика
  const c = $('#counter'), knifeTop = L.appleY - L.apple * 0.55 - L.apple * 0.31;
  c.style.top = Math.max(100, Math.min(H * 0.19, knifeTop - c.offsetHeight - 8)) + 'px';
}
function tag(text, x, y) {
  const d = document.createElement('div'); d.className = 'tag'; d.textContent = text; stage.appendChild(d);
  d.style.left = x + 'px'; d.style.top = y + 'px';
  d.animate([{ transform: 'translate(-50%,0) scale(.6)', opacity: 0 }, { transform: 'translate(-50%,-20px) scale(1.1)', opacity: 1, offset: .3 },
    { transform: 'translate(-50%,-40px) scale(1)', opacity: 0 }], { duration: 1500 * K, easing: 'ease-out' }).finished.then(() => d.remove());
}
function setLabel(t) { $('#label').textContent = t; }

/* речь в верхней панели, с озвучкой. next=true — фраза дозвучала, и через AFTER_VOICE_MS игра идёт дальше сама
   (ребёнок играет один и не читает). Пока голос звучит, нажатие на говорящего ничего не обрывает.
   Только если озвучки нет (файла нет или звук не разрешён) — говорящий (Атом или Эли) светится и ждёт нажатия,
   а если его нет на экране — ждём нажатия на текст.
   next=false — промис выполняется, когда фраза дозвучит (или сразу, если озвучки нет). */
const AFTER_VOICE_MS = 700;
let talk = null, sayText = '';
function speaker() {
  if (phase === 'build' && BS) return $('#atomw');
  if (phase === 'atom' && eli) return eli;
  if (phase === 'fire' && F) return F.eli;
  return null;
}
function endTalk() {
  if (!talk) return null;
  if (talk.sp) talk.sp.classList.remove('talk');
  if (talk.sp && talk.sp === eli && lvl < 3) hop(false);   // наверху продолжает дрожать
  $('#btext').classList.remove('tap');
  const r = talk.r; talk = null; return r;
}
/* нажатие ребёнка продолжает игру, только когда фраза ждёт нажатия (озвучки нет); auto — фраза дозвучала */
function talkTap(auto = false) {
  if (!talk || (!auto && !talk.tap)) return false;
  endTalk()(); return true;
}
function say(text, o = {}) {
  endTalk();
  $('#btext').textContent = sayText = text; $('#replay').hidden = false;
  if (!(o.next ?? true)) return playVoice(text).then(() => {});
  const sp = speaker();
  return new Promise(r => {
    talk = { r, sp, tap: false };
    if (sp && sp === eli) hop(true);              // Эли говорит: подпрыгивает (наверху — дрожит)
    voiceThenGo(talk);
  });
}
function voiceThenGo(t, interrupt = false) {      // озвучить текущую фразу; дозвучала — игра идёт дальше сама
  playVoice(sayText, interrupt).then(ok => {
    if (!t || talk !== t || ok === null) return;  // null — фразу перебили («ещё раз»): дальше ведёт новый вызов
    if (ok) { wait(AFTER_VOICE_MS).then(() => { if (talk === t) talkTap(true); }); return; }
    t.tap = true;                                 // озвучки нет — ждём нажатия
    if (t.sp) t.sp.classList.add('talk'); else $('#btext').classList.add('tap');
    // текст не показывается (SHOW_TEXT) — нажимать не на что: идём дальше сами, через время на фразу
    if (!P.SHOW_TEXT) wait(Math.max(2500, sayText.length * 70)).then(() => { if (talk === t) talkTap(true); });
  });
}
function hideSay() { endTalk(); $('#btext').textContent = sayText = ''; $('#replay').hidden = true; }
const tapOn = el => new Promise(r => el.addEventListener('click', () => r(), { once: true }));
let FLASHED = false;
async function flash() {
  FLASHED = true; sfx('whoosh');
  await $('#flash').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 * K, fill: 'forwards' }).finished;
}
async function unflash() {
  FLASHED = false;
  await $('#flash').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500 * K, fill: 'forwards' }).finished;
}
function sizeStr(n) {
  const m = P.APPLE_CM / 100 / 2 ** n;
  const f = x => Number(x.toPrecision(2)).toLocaleString(T.locale), u = T.units;
  if (m >= 0.01) return f(m * 100) + ' ' + u[0];
  if (m >= 0.001) return f(m * 1000) + ' ' + u[1];
  if (m >= 1e-6) return f(m * 1e6) + ' ' + u[2];
  return f(m * 1e9) + ' ' + u[3];
}

/* ===================== ЧАСТЬ А: ЯБЛОКО ===================== */
let A = {};
function layoutA() {
  if (A.monG) put(A.monG, W * 0.2, L.monY, A.monG._k);
  if (A.monO) put(A.monO, W * 0.8, L.monY, A.monO._k);
  if (A.piece) put(A.piece, W / 2, L.appleY, A.piece._k, A.piece._ex);
  if (A.knife && !A.knifeBusy) put(A.knife, W / 2 + L.apple * 0.62, L.appleY - L.apple * 0.3);
}
async function partA() {
  phase = 'A'; setLabel(T.appleLabel);
  A.monG = sprite('monster_green'); setB(A.monG, L.mon); A.monG._open = 'monster_green'; A.monG._shut = 'monster_green_chew';
  A.monO = sprite('monster_orange'); setB(A.monO, L.mon); A.monO._open = 'monster_orange'; A.monO._shut = 'monster_orange_chew';
  A.piece = sprite('apple_1'); setB(A.piece, L.apple);
  A.knife = sprite('knife', 'front'); setB(A.knife, L.apple * 0.62);
  put(A.piece, W / 2, L.appleY); layoutA();
  setCount(0);
  A.ask = document.createElement('div'); A.ask.id = 'ask'; A.ask.textContent = T.appleAsk; stage.appendChild(A.ask);
  await say(T.appleAsk, { next: false });         // «Где Эли?» — крупно посередине; ножик зовёт резать, когда вопрос дозвучит
  for (let i = 1; i <= P.MANUAL_CUTS; i++) {
    await knifeTap(0);
    await cutOnce(i);
  }
  hideSay();
  await fastCuts();                                // дальше режем тоже нажатием на ножик: за нажатие — несколько разрезов
}
async function knifeTap(delay) {                   // ножик светится и ждёт нажатия (через delay мс)
  await wait(delay);
  A.knife.classList.add('tappable');
  await tapOn(A.knife);
  A.knife.classList.remove('tappable');
}
async function cutOnce(i) {
  const cx = W / 2, kn = A.knife, k0x = kn._x, k0y = kn._y; A.knifeBusy = true;
  await go(kn, { x: cx + L.apple * 0.1, y: L.appleY - L.apple * 0.55, ms: 280 });
  await go(kn, { y: L.appleY + L.apple * 0.35, ms: 200, easing: 'ease-in' });
  // 1/2, 1/4, 1/8 — свои картинки; дальше — та же восьмушка, но меньше
  const img = i <= 3 ? 'apple_' + 2 ** i : 'apple_8';
  const k = (A.piece._k || 1) * 0.86 * (i >= 4 ? 0.6 : 1);
  setCount(i); sfx('cut');
  A.piece.remove();
  const a = sprite(img), b = sprite(img); setB(a, L.apple); setB(b, L.apple);
  put(a, cx, L.appleY, k, 'scaleX(-1)'); put(b, cx, L.appleY, k);
  go(kn, { x: k0x, y: k0y, ms: 350 }).then(() => A.knifeBusy = false);
  await Promise.all([go(a, { x: cx - W * 0.17, ms: 320 }), go(b, { x: cx + W * 0.17, ms: 320 })]);
  const left = i % 2 === 1, eaten = left ? a : b, keep = left ? b : a, mon = left ? A.monG : A.monO;
  mouthOpen(mon);                                  // открывает рот навстречу кусочку
  await go(eaten, { x: mon._x + (left ? 1 : -1) * L.mon * 0.05, y: mon._y + L.mon * 0.12, k: k * 0.2, ms: 450, easing: 'ease-in' });
  eaten.remove(); chew(mon);
  await go(keep, { x: cx, ms: 380 });
  A.piece = keep;
}
async function fastCuts() {
  hideSay();
  const cx = W / 2, stops = { 13: ['cell', T.cell], 27: ['molecule', T.molecule] };
  const kn = A.knife; A.knifeBusy = true;
  await knifeTap(0);
  await go(kn, { x: cx + L.apple * 0.08, y: L.appleY - L.apple * 0.5, ms: 260 });
  let n = P.MANUAL_CUTS + 1, pause = 0;
  while (n <= P.TOTAL_CUTS) {
    if (n > P.MANUAL_CUTS + 1) { await knifeTap(pause); hideSay(); }   // каждое нажатие — CUTS_PER_TAP разрезов
    pause = 0;
    for (let c = 0; c < P.CUTS_PER_TAP && n <= P.TOTAL_CUTS; c++, n++) {
      setCount(n); sfx('cut');
      const base = tf(kn);
      kn.animate([{ transform: base }, { transform: base + ` translateY(${L.apple * 0.6}px)` }, { transform: base }], { duration: P.FAST_CUT_MS * 0.9 * K });
      go(A.piece, { k: A.piece._k * 0.88, ms: P.FAST_CUT_MS });
      await wait(P.FAST_CUT_MS);
      if (stops[n]) {
        A.piece.remove();
        A.piece = sprite(stops[n][0]); setB(A.piece, L.apple * 1.05); put(A.piece, cx, L.appleY, 0.15);
        sfx('sparkle');
        await go(A.piece, { k: 1, ms: 550, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        await say(stops[n][1], { next: false });   // ножик снова зовёт, когда фраза дозвучит
        pause = P.STOP_TAP_MS;                     // пауза, чтобы успеть разглядеть клетку / молекулу
        n++; break;
      }
    }
  }
  hideSay();
  await flash();
  for (const el of [A.monG, A.monO, A.piece, A.knife, A.ask]) el.remove();
  $('#counter').hidden = true;
  A = {};
}

/* ===================== СОБЕРИ АТОМ ===================== */
/* В корзинках по 8 шариков: слева протоны (+), справа электроны (−). Шарик летит в атом,
   нейтроны добавляются сами (NEUT[p] — самые распространённые изотопы: He-4, Li-7, Be-9, B-11, C-12, N-14, O-16).
   Ребёнок нажимает на атом: не поровну — атом дрожит; поровну — сияет и показывает карточку;
   потом атом снова пустой. Открыты все 8 — сам переход к Эли.
   Электроны: 1-е кольцо до 2, 2-е кольцо до 8 (правило оболочек). */
const NEUT = [0, 0, 2, 4, 5, 6, 6, 7, 8];
const BIN = 8, SHAKE_MS = 1000;
const ELN = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O'];
let BS = null;
const UNDO_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L3 10 L9 15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 10 H14 a6 6 0 0 1 0 12 H10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

async function buildScene() {
  phase = 'build'; measure(); setLabel(T.buildLabel);
  const root = document.createElement('div'); root.id = 'buildscene';   // не 'build': адрес #build иначе прокручивал бы к нему
  root.innerHTML = `<div id="atomw"><div id="nuc"></div></div>
    <button id="atomhit" type="button" aria-label="${T.check}"></button>
    <div id="charge"><span class="plus"></span><span class="minus"></span></div>
    <div id="album"></div>
    <div id="controls">
      <button class="bin p" id="binP" type="button" aria-label="${T.addP}"></button>
      <button id="undo" type="button" aria-label="${T.undo}">${UNDO_SVG}</button>
      <button class="bin e" id="binE" type="button" aria-label="${T.addE}"></button>
    </div>`;
  stage.appendChild(root);
  BS = { root, p: 1, e: 1, hist: [], found: new Set(), busy: true, told: false, done: null };
  for (const k of ['p', 'e']) {
    const bin = $(k === 'p' ? '#binP' : '#binE');
    for (let i = 0; i < BIN; i++) { const b = document.createElement('div'); b.className = 'pt ' + k; b.textContent = k === 'p' ? '+' : '−'; bin.appendChild(b); }
  }
  for (let i = 1; i <= ELN.length; i++) {
    const s = document.createElement('button'); s.type = 'button'; s.className = 'slot'; s.textContent = i;
    s.onclick = () => { if (BS && BS.found.has(i) && !BS.busy) { BS.busy = true; showCard(i).then(() => { if (BS) BS.busy = false; }); } };
    $('#album').appendChild(s);
  }
  $('#binP').onclick = () => addParticle('p');
  $('#binE').onclick = () => addParticle('e');
  $('#undo').onclick = undoParticle;
  $('#atomhit').onclick = () => { if (!talkTap()) checkAtom(); };
  layoutBuild(); syncBins(); renderAtom();
  const ui = ['#controls', '#charge', '#album'].map(q => $(q));
  ui.forEach(el => { el.style.visibility = 'hidden'; });   // на приветствии только атом
  if (FLASHED) await unflash();
  // знакомство: атом водорода, ниточка между плюсом и минусом
  thread();
  await say(T.atomHello);
  hideSay();
  ui.forEach(el => { el.style.visibility = ''; el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 500 * K, easing: 'ease-out' }); });
  await wait(550);
  await emptyAtom();                               // шарики возвращаются в корзинки, атом пустой
  hideSay();
  await say(T.buildHelp, { next: false });         // пока Атом объясняет задание, всё стоит
  if (!BS) return;
  hideSay();
  ['#binP', '#binE'].forEach(q => $(q).classList.add('call'));   // фраза дозвучала — корзинки зовут
  BS.busy = false;
  await new Promise(r => { BS.done = r; });        // ждём, пока откроют все 8
  await say(T.allFound, { next: false }); await wait(900);
  hideSay(); await flash(); root.remove(); BS = null;
}

function layoutBuild() {
  const R = Math.min(W * 0.40, H * 0.21);
  const binW = Math.min(190, (Math.min(W, 680) - 32 - 52 - 20) / 2), ball = (binW - 16 - 4 - 18) / 4;
  const ctrlH = 2 * ball + 6 + 16 + 4, ctrlTop = H - ctrlH - 14, albTop = ctrlTop - 46;
  const r2 = R * 0.9, es = Math.max(18, R * 0.13), hr = r2 + es;
  // атом ниже облачка (≈186 px сверху), но не налезает на заряды и альбом
  const cy = Math.min(Math.max(H * 0.40, 186 + hr), albTop - 54 - hr);
  Object.assign(BS, { cx: W / 2, cy, r1: R * 0.46, r2, es });
  const { cx } = BS;
  const aw = $('#atomw'); aw.style.left = cx + 'px'; aw.style.top = cy + 'px';
  Object.assign($('#atomhit').style, { left: (cx - hr) + 'px', top: (cy - hr) + 'px', width: 2 * hr + 'px', height: 2 * hr + 'px' });
  $('#charge').style.top = Math.min(cy + hr + 4, albTop - 50) + 'px';
  $('#album').style.top = albTop + 'px';
  $('#controls').style.top = ctrlTop + 'px';
  BS.root.querySelectorAll('.bin .pt').forEach(b => { b.style.fontSize = ball * 0.62 + 'px'; });
}

function syncBins() {                              // сколько шариков осталось в корзинках
  [['p', '#binP'], ['e', '#binE']].forEach(([k, q]) => {
    const used = BS[k];
    [...$(q).children].forEach((b, i) => b.classList.toggle('gone', i >= BIN - used));
  });
}

function hexPos(k) {                               // плотная упаковка шариков ядра, центр в (0,0)
  const pts = [[0, 0]];
  for (let i = 0; i < 6; i++) pts.push([Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3)]);
  for (let i = 0; i < 6; i++) pts.push([2 * Math.cos(i * Math.PI / 3), 2 * Math.sin(i * Math.PI / 3)]);
  for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; pts.push([Math.sqrt(3) * Math.cos(a), Math.sqrt(3) * Math.sin(a)]); }
  pts.sort((a, b) => Math.hypot(...a) - Math.hypot(...b));
  const use = pts.slice(0, k), mx = use.reduce((s, p) => s + p[0], 0) / k, my = use.reduce((s, p) => s + p[1], 0) / k;
  return use.map(p => [p[0] - mx, p[1] - my]);
}

function renderAtom() {
  const { p, e, r1, r2, es } = BS, aw = $('#atomw'), nuc = $('#nuc');
  aw.querySelectorAll('.ring2d,.shell').forEach(x => x.remove());
  nuc.innerHTML = '';
  const nN = NEUT[p], k = p + nN;                  // ядро: протоны и нейтроны вперемешку
  if (k) {
    const pos = hexPos(k), ext = Math.max(...pos.map(q => Math.hypot(q[0], q[1])));
    const bs = Math.min(r1 * 0.62, (r1 * 1.25) / (2 * ext * 0.9 + 1)), d = bs * 0.9;
    const types = []; let a = 0, b = 0;
    for (let i = 0; i < k; i++) { if (b >= nN || (a < p && a / p <= b / nN)) { types.push('p'); a++; } else { types.push('n'); b++; } }
    pos.forEach((q, i) => {
      const t = types[i], el = document.createElement('div'); el.className = 'pt ' + t;
      Object.assign(el.style, { width: bs + 'px', height: bs + 'px', left: (q[0] * d - bs / 2) + 'px', top: (q[1] * d - bs / 2) + 'px', fontSize: bs * 0.62 + 'px' });
      if (t === 'p' && bs >= 15) el.textContent = '+';
      nuc.appendChild(el);
    });
  }
  const shells = [[r1, Math.min(e, 2), '7s'], [r2, Math.max(0, e - 2), '11s']];
  shells.forEach(([r, n, t], si) => {
    if (si === 1 && n === 0) return;
    const ring = document.createElement('div'); ring.className = 'ring2d';
    ring.style.width = ring.style.height = 2 * r + 'px'; aw.appendChild(ring);
    const sh = document.createElement('div'); sh.className = 'shell'; sh.style.setProperty('--t', t);
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + i * 2 * Math.PI / n, el = document.createElement('div'); el.className = 'pt e';
      Object.assign(el.style, { width: es + 'px', height: es + 'px', left: (r * Math.cos(ang) - es / 2) + 'px', top: (r * Math.sin(ang) - es / 2) + 'px', fontSize: es * 0.8 + 'px' });
      el.textContent = '−'; sh.appendChild(el);
      if ((si === 0 ? i : 2 + i) >= p) { el.classList.add('extra'); el.onclick = () => removeElectron(el); }
    }
    if (si === 0) BS.shell1 = sh;
    aw.appendChild(sh);
  });
  const ch = $('#charge'); ch.querySelector('.plus').textContent = '+' + p; ch.querySelector('.minus').textContent = '−' + e;
  ch.classList.toggle('equal', p === e && p > 0);
}

async function thread() {                          // «ниточка» между плюсом и минусом
  if (!BS || !BS.shell1) return;
  const t = document.createElement('div'); t.className = 'thread'; t.style.width = BS.r1 + 'px'; t.style.transform = 'rotate(-90deg)';
  BS.shell1.appendChild(t);
  await t.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .2 }, { opacity: 1 }, { opacity: 0 }], { duration: 3200 * K }).finished.catch(() => {});
  t.remove();
}

function nudge(el) { el.animate([0, -6, 6, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 250 }); }
function centerOf(el) { const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect(); return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2]; }
async function fly(kind, [fx, fy], [tx, ty], sz) {
  const f = document.createElement('div'); f.className = 'pt ' + kind; f.textContent = kind === 'p' ? '+' : '−';
  Object.assign(f.style, { position: 'absolute', width: sz + 'px', height: sz + 'px', left: 0, top: 0, fontSize: sz * 0.68 + 'px', zIndex: 9 });
  BS.root.appendChild(f);
  await f.animate([{ transform: `translate(${fx - sz / 2}px,${fy - sz / 2}px)` }, { transform: `translate(${tx - sz / 2}px,${ty - sz / 2}px)` }],
    { duration: 520 * K, easing: 'ease-in-out' }).finished.catch(() => {});
  f.remove();
}
const atomTarget = kind => [BS.cx, kind === 'p' ? BS.cy : BS.cy - (BS.e < 2 ? BS.r1 : BS.r2)];

async function emptyAtom() {                       // все шарики из атома возвращаются в корзинки
  const flights = [];
  for (const k of ['p', 'e']) {
    const bin = $(k === 'p' ? '#binP' : '#binE');
    for (let i = 0; i < BS[k]; i++) {
      const slot = bin.children[BIN - BS[k] + i];
      flights.push(wait(i * 70).then(() => fly(k, atomTarget(k), centerOf(slot), k === 'p' ? 28 : BS.es)));
    }
  }
  BS.p = 0; BS.e = 0; BS.hist = []; renderAtom();
  await Promise.all(flights); syncBins();
}

async function shakeAtom() {                       // атом неспокоен: дрожит секунду
  sfx('oops');
  const xs = []; for (let i = 0; i < 12; i++) xs.push(i % 2 ? 6 : -6); xs.push(0);
  await $('#atomw').animate([{ transform: 'translateX(0)' }, ...xs.map(x => ({ transform: `translateX(${x}px)` }))], { duration: SHAKE_MS * K }).finished.catch(() => {});
}

async function addParticle(kind) {
  if (!BS || BS.busy || BS.finished) return;
  const bin = $(kind === 'p' ? '#binP' : '#binE');
  if (BS[kind] >= BIN) { nudge(bin); sfx('buzz'); return; }
  bin.classList.remove('call'); BS.busy = true;
  const ball = bin.children[BIN - 1 - BS[kind]], from = centerOf(ball);
  ball.classList.add('gone'); sfx('pop');
  await fly(kind, from, atomTarget(kind), kind === 'p' ? 30 : BS.es);
  if (!BS) return;
  BS[kind]++; BS.hist.push(kind); renderAtom();
  if (kind === 'p' && NEUT[BS.p] > 0 && !BS.told) {   // первый нейтрон: пока звучит «нейтроны — как клей», всё стоит
    BS.told = true;
    await say(T.neutrons, { next: false });
    if (!BS) return;
    hideSay();
  }
  BS.busy = false;
}

async function removeElectron(el) {             // нажали на лишний электрон — он улетает в корзинку
  if (!BS || BS.busy || BS.finished) return;
  BS.busy = true;
  const from = centerOf(el), h = BS.hist.lastIndexOf('e');
  if (h >= 0) BS.hist.splice(h, 1);
  const slot = $('#binE').children[BIN - BS.e];
  BS.e--; renderAtom(); sfx('fall');
  await fly('e', from, centerOf(slot), BS.es);
  syncBins(); BS.busy = false;
}

async function undoParticle() {
  if (!BS || BS.busy || BS.finished || !BS.hist.length) return;
  const k = BS.hist.pop(); BS.busy = true;
  const bin = $(k === 'p' ? '#binP' : '#binE'), slot = bin.children[BIN - BS[k]];
  const from = atomTarget(k); BS[k]--; renderAtom(); sfx('fall');
  await fly(k, from, centerOf(slot), k === 'p' ? 28 : BS.es);
  syncBins(); BS.busy = false;
}

async function checkAtom() {                       // нажали на атом: поровну — сияет и карточка, иначе дрожит
  if (!BS || BS.busy || BS.finished) return;
  BS.busy = true;
  if (BS.p > 0 && BS.p === BS.e) await atomDone(); else await shakeAtom();
  if (BS) BS.busy = false;
}

async function atomDone() {
  const aw = $('#atomw'), z = BS.p, isNew = !BS.found.has(z);
  sfx('sparkle');
  await aw.animate([{ filter: 'drop-shadow(0 0 0 #ffd45a)', transform: 'scale(1)' },
    { filter: 'drop-shadow(0 0 26px #ffd45a)', transform: 'scale(1.12)' },
    { filter: 'drop-shadow(0 0 0 #ffd45a)', transform: 'scale(1)' }], { duration: 1000 * K }).finished.catch(() => {});
  const slot = $('#album').children[z - 1];
  if (isNew) { BS.found.add(z); slot.classList.add('got'); slot.textContent = ELN[z - 1]; markDone('build'); }
  // значок в альбоме: растёт, дважды вспыхивает золотом и возвращается на место
  slot.style.position = 'relative'; slot.style.zIndex = 3; sfx('ding');
  const g = px => `drop-shadow(0 0 ${px}px #ffd45a) drop-shadow(0 0 ${px * 2}px rgba(255,200,60,.7))`;
  await slot.animate([
    { transform: 'scale(.5)', filter: g(0) },
    { transform: 'scale(2.5)', filter: g(14), offset: .3 },
    { transform: 'scale(2.2)', filter: g(5), offset: .5 },
    { transform: 'scale(2.5)', filter: g(16), offset: .7 },
    { transform: 'scale(1)', filter: g(0) }], { duration: P.BADGE_MS * K, easing: 'ease-in-out' }).finished.catch(() => {});
  slot.style.zIndex = '';
  await showCard(z);                               // потом карточка (и для уже собранного атома тоже)
  if (!BS) return;
  await emptyAtom();
  if (BS.found.size === ELN.length && BS.done) { BS.finished = true; BS.done(); }
}

function showCard(z) {
  return new Promise(res => {
    const ov = document.createElement('div'); ov.id = 'cardov';
    ov.innerHTML = `<img src="img/card_${z}.webp" alt=""><h2></h2>`;   // карточка закрывается нажатием на неё
    ov.querySelector('h2').textContent = T.elements[z - 1];
    stage.appendChild(ov); sfx('fanfare');
    wait(500).then(() => playVoice(T.elements[z - 1] + '.'));   // Эли называет элемент: «Гелий.»
    ov.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 450 * K, easing: 'ease-out' });
    let closing = false; const t0 = performance.now();
    ov.onclick = async () => {
      if (closing || performance.now() - t0 < 800) return;   // не закрыть случайно тем же быстрым нажатием
      closing = true;
      await ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 * K, fill: 'forwards' }).finished.catch(() => {});
      ov.remove(); res();
    };
  });
}

/* ===================== ЧАСТЬ Б: АТОМ И ЛЕСЕНКА ===================== */
function buildAtom() {
  steps.forEach(s => s.remove()); steps = []; stepEl = [];
  for (let n = 1; n <= 5; n++) {
    const y = yLevel(n), [ct, cf, cg] = P.STEP_COLORS[n - 1];
    const s = document.createElement('div'); s.className = 'step' + (n === 2 ? ' glass' : '');
    s.style.setProperty('--c-top', ct); s.style.setProperty('--c-front', cf); s.style.setProperty('--c-glow', cg);
    s.style.left = L.x0 + 'px'; s.style.width = (L.x1 - L.x0) + 'px'; s.style.top = y + 'px';
    const lab = document.createElement('div'); lab.className = 'stepn'; lab.textContent = n;
    lab.style.setProperty('--c-front', cf);
    lab.style.left = (L.x0 - 40) + 'px'; lab.style.top = (y - 10) + 'px';
    stage.append(s, lab); steps.push(s, lab); stepEl[n] = [s, lab];
  }
  if (!nucleus) nucleus = sprite('nucleus');
  setB(nucleus, L.nuc); put(nucleus, L.cx, L.nucY);
  if (!eli) { eli = sprite('eli_hello', 'front'); eli.addEventListener('click', () => talkTap()); }
  setB(eli, L.eli); put(eli, L.cx, eliY(lvl));
  if (auraEl) { setB(auraEl, L.eli * 1.7); put(auraEl, L.cx, eliY(lvl)); }
  setTarget(curTarget);
  if (dreamEl) { setB(dreamEl, L.eli); put(dreamEl, L.cx, eliY(dreamEl._lvl)); }
  if (spectrumOn) buildSpectrum();
}
const pose = p => { eli.src = `img/eli_${p}.webp`; };
async function eliTo(n, ms = 500, easing = 'ease-out') {
  hop(false); lvl = n;
  await Promise.all([go(eli, { y: eliY(n), ms, easing }), auraEl ? go(auraEl, { y: eliY(n), ms, easing }) : null]);
}
function shine() {
  eli.animate([{ filter: 'drop-shadow(0 0 0 #fff)' }, { filter: 'drop-shadow(0 0 22px #bfe9ff)' }, { filter: 'drop-shadow(0 0 0 #fff)' }], { duration: 600 * K });
}
function ghost(reachE, c) {                      // пунктир: куда донёс бы мячик (там нет ступеньки)
  if (reachE > EN(5) + 0.25 || reachE < EN(2)) return;
  const y = yOfE(reachE), d = document.createElement('div'); d.className = 'ghost';
  d.style.borderColor = PH[c].css; d.style.left = (L.x0 + 10) + 'px'; d.style.width = (L.x1 - L.x0 - 20) + 'px'; d.style.top = (y - 6) + 'px';
  stage.appendChild(d);
  d.animate([{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 2800 * K }).finished.then(() => d.remove());
}

/* --- наглядное задание: ступенька мерцает, Эли подпрыгивает, (в обучении) силуэт на цели --- */
function setTarget(n) {
  curTarget = n;
  stepEl.forEach((p, i) => p && p.forEach(e => e.classList.toggle('target', i === n)));
}
function hop(on) {                               // внизу Эли нетерпеливо подпрыгивает; с проглоченным фотоном (3-я и выше) — дрожит
  if (hopAnim) { hopAnim.cancel(); hopAnim = null; }
  if (on && eli) {
    const base = tf(eli);
    if (lvl >= 3) {
      hopAnim = eli.animate([0, 1, 2, 3, 4].map(i => ({ transform: base + ` translate(${[0, 1.2, -1.2, 0.8, 0][i] * P.TREMBLE_PX}px,${[0, -0.8, 0.5, 0.8, 0][i] * P.TREMBLE_PX}px) rotate(${[0, 0.6, -0.6, 0.4, 0][i] * P.TREMBLE_PX}deg)` })),
        { duration: P.TREMBLE_MS * K, iterations: Infinity });
    } else {
      hopAnim = eli.animate([{ transform: base }, { transform: base + ' translateY(-20px)', offset: .4 }, { transform: base, offset: .8 }, { transform: base }],
        { duration: P.HOP_MS * K, iterations: Infinity, easing: 'ease-out' });
    }
  }
}
function dream(n) {
  undream();
  dreamEl = sprite('eli_hello', 'dream'); dreamEl._lvl = n; setB(dreamEl, L.eli); put(dreamEl, L.cx, eliY(n));
}
function undream() { if (dreamEl) { dreamEl.remove(); dreamEl = null; } }
function ask(target, withDream, glow = true) { setTarget(glow ? target : null); hop(true); if (withDream) dream(target); }   // glow=false — ступенька не мигает
function unask() { setTarget(null); hop(false); undream(); }

/* --- штрихкод Эли: полоска-спектр, в которой загораются цвета, пойманные ребёнком (линии водорода) ---
   Слева фиолетовый край спектра (400 нм), справа красный (700 нм). Пойманные цвета помнятся в этом браузере
   для «Продолжить» и ◀ ▶; новая игра («Играть», ссылки для взрослых) начинает штрихкод заново. */
const LINE_NM = { violet: 434, cyan: 486, red: 656 };
const BAR = new Set();
try { JSON.parse(localStorage.getItem('eliBarcode') || '[]').forEach(c => BAR.add(c)); } catch (e) {}
let spectrumOn = false;
function resetBarcode() { BAR.clear(); try { localStorage.removeItem('eliBarcode'); } catch (e) {} }
function buildSpectrum() {
  let sp = $('#spectrum');
  if (!sp) {
    sp = document.createElement('div'); sp.id = 'spectrum'; stage.appendChild(sp);
    for (const c in LINE_NM) {
      const l = document.createElement('i'); l.className = 'sline'; l.dataset.c = c;
      l.style.left = (LINE_NM[c] - 400) / 3 + '%'; l.style.setProperty('--lc', PH[c].css); sp.appendChild(l);
    }
  }
  const w = Math.max(90, Math.min(170, L.cx - L.nuc / 2 - 40));
  Object.assign(sp.style, { width: w + 'px', top: (L.nucY - 14) + 'px' });
  sp.querySelectorAll('.sline').forEach(l => l.classList.toggle('on', BAR.has(l.dataset.c)));
}
async function catchLine(c) {                      // новый цвет: искорка летит от Эли в полоску, там загорается линия
  if (!(c in LINE_NM) || BAR.has(c)) return;
  BAR.add(c); try { localStorage.setItem('eliBarcode', JSON.stringify([...BAR])); } catch (e) {}
  const sp = $('#spectrum'); if (!sp) return;
  const l = sp.querySelector(`[data-c="${c}"]`), [tx, ty] = centerOf(l), d = document.createElement('div');
  d.className = 'dot'; Object.assign(d.style, { width: '14px', height: '14px', background: PH[c].css, boxShadow: `0 0 14px ${PH[c].css}` });
  stage.appendChild(d);
  await d.animate([{ transform: `translate(${L.cx - 7}px,${eliY(lvl) - 7}px)` }, { transform: `translate(${tx - 7}px,${ty - 7}px)` }],
    { duration: 700 * K, easing: 'ease-in' }).finished.catch(() => {});
  d.remove(); l.classList.add('on'); sfx('ding');
  l.animate([{ transform: 'translateX(-50%) scaleY(2.2)' }, { transform: 'translateX(-50%) scaleY(1)' }], { duration: 500 * K, easing: 'ease-out' });
  if (BAR.size === Object.keys(LINE_NM).length) {  // все три — штрихкод собран
    sfx('fanfare', 250);
    sp.animate([{ filter: 'none' }, { filter: 'drop-shadow(0 0 16px #fff) brightness(1.6)' }, { filter: 'none' }], { duration: 1400 * K });
  }
}

/* --- мячики в полёте: хвостик, мигание в такт, вылет за край --- */
function ball(c, x, y) { const b = sprite(PH[c].img, 'front'); setB(b, L.ph); put(b, x, y); return b; }
function trail(el, c) {                           // кометный хвост: длина растёт со скоростью, направлен против полёта
  const col = PH[c].css, tail = document.createElement('div'); tail.className = 'tail';
  tail.style.background = `linear-gradient(90deg, ${col}ff 0%, ${col}bb 35%, ${col}00 100%)`;
  stage.appendChild(tail);
  let px = null, py = null, ang = 0, len = 0, raf = 0, alive = true;
  const frame = () => {
    if (!alive) return;
    if (!el.isConnected) { stop(); return; }
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const x = r.left - s.left + r.width / 2, y = r.top - s.top + r.height / 2;
    if (px !== null) {
      const dx = x - px, dy = y - py, v = Math.hypot(dx, dy);
      if (v > 0.3) ang = Math.atan2(dy, dx) + Math.PI;
      len += ((v > 0.3 ? L.ph * P.TAIL_LEN : 0) - len) * 0.15;   // длина не зависит от скорости
    }
    px = x; py = y;
    const th = L.ph * 0.72;
    tail.style.width = len + 'px'; tail.style.height = th + 'px';
    tail.style.transform = `translate(${x}px,${y - th / 2}px) rotate(${ang}rad)`;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (!alive) return; alive = false; cancelAnimationFrame(raf);
    tail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 * K, fill: 'forwards' }).finished.then(() => tail.remove());
  };
  raf = requestAnimationFrame(frame);
  return stop;
}
function pulse(els) {                            // запускаются в один момент — мигают в такт
  els.forEach(e => e.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.8) saturate(1.3)' }, { filter: 'brightness(1)' }],
    { duration: 650, iterations: Infinity }));
}
function exitPoint(x, y, dx, dy) {
  const m = L.ph, ts = [];
  if (dx > 1e-6) ts.push((W + m - x) / dx); if (dx < -1e-6) ts.push((-m - x) / dx);
  if (dy > 1e-6) ts.push((H + m - y) / dy); if (dy < -1e-6) ts.push((-m - y) / dy);
  const t = Math.min(...ts); return { x: x + dx * t, y: y + dy * t, d: t };
}
async function flyOut(el, dx, dy, msPerW = P.OUT_MS) {
  const p = exitPoint(el._x, el._y, dx, dy);
  await go(el, { x: p.x, y: p.y, ms: p.d / W * msPerW, easing: 'linear' });
  el.remove();
}

/* --- рот и «мячик внутри»: Эли светится цветом проглоченного мячика --- */
function mouthAt(rel, n) { return { x: L.cx - L.eli / 2 + rel[0] * L.eli, y: eliY(n) - L.eli / 2 + rel[1] * L.eli }; }
let auraEl = null;
function holdGlow(c) {
  const col = c === 'uv' ? 'rgba(235,228,255,.85)' : PH[c].css;
  eli.style.filter = c === 'uv' ? `drop-shadow(0 0 10px ${col})` : `drop-shadow(0 0 9px ${col}) drop-shadow(0 0 22px ${col})`;
  if (c === 'uv') { removeAura(); return; }
  if (!auraEl) { auraEl = document.createElement('div'); auraEl.className = 'aura'; stage.appendChild(auraEl); }
  auraEl.style.background = `radial-gradient(circle, ${col}cc 0%, ${col}66 38%, transparent 70%)`;
  setB(auraEl, L.eli * 1.7); put(auraEl, L.cx, eliY(lvl));
}
function removeAura() { if (auraEl) { auraEl.remove(); auraEl = null; } }
function unglow() { eli.style.filter = ''; removeAura(); }
const restPose = n => { pose(n >= 3 ? 'full' : 'hello'); if (n === 1) unglow(); if (n >= 3) hop(true); };
function growFromMouth(c, at) {                  // мячик-картинка, который вырастает изо рта
  const b = ball(c, at.x, at.y); b._k = 0.1; b.style.transform = tf(b); return b;
}

/* спонтанный прыжок вниз: губы трубочкой, мячик медленно вырастает изо рта и летит в случайную «длинную» сторону */
async function emit(c, n2, text) {
  hop(false); pose('blow');
  const m = mouthAt(P.MOUTH_BLOW, lvl), b = growFromMouth(c, m);
  sfx('pop');
  await go(b, { k: 1, ms: P.SPIT_MS, easing: 'ease-out' });
  unglow();
  const need = 0.55 * Math.min(W, H);
  let dx = 1, dy = 0;
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a);
    if (exitPoint(m.x, m.y, dx, dy).d >= need) break;
  }
  const stop = trail(b, c); if (c === 'uv') pulse([b]);
  flyOut(b, dx, dy).then(stop);
  const said = text ? say(text) : null;
  sfx('fall'); await eliTo(n2, 450, 'ease-in'); pose('hello');
  if (talk && talk.sp === eli) hop(true);          // фраза ждёт нажатия — снова подпрыгивает
  if (n2 === 2) holdGlow('uv');                  // на 2-й он всё ещё «держит» невидимый мячик
  if (said) await said; else await wait(700);
}
async function dropToTwo(text) {
  if (lvl <= 2) return;
  await wait(P.DROP_DELAY_MS);
  await emit(colorFor(EN(lvl) - EN(2)), 2, text);
}
async function dropHome(text) { if (lvl !== 2) return; await wait(500); await emit('uv', 1, text); }

async function hit(c, fx, fy, ms = P.FLY_MS, demo = false) {   // мячик c летит в Эли из точки (fx,fy); demo — показ, не ребёнок
  const r = resolve(lvl, c), heldBefore = eli.style.filter, poseBefore = eli.src;
  const b = ball(c, fx, fy), stop = trail(b, c);
  if (c === 'uv') pulse([b]);
  const mo = mouthAt(P.MOUTH_OPEN, lvl), mb = mouthAt(P.MOUTH_BLOW, lvl), off = L.ph * 1.25;
  let tx, ty;
  if (r.type === 'up') { tx = mo.x; ty = mo.y; }                      // прямо в рот
  else if (r.type === 'down') {                                       // мимо, вплотную ко рту
    let ax = mb.x - fx, ay = mb.y - fy; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
    tx = mb.x - ay * off; ty = mb.y + ax * off;
  } else { tx = L.cx; ty = eliY(lvl); }                                // сквозь Эли
  let dx = tx - fx, dy = ty - fy; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;

  if (r.type === 'up') {
    // глотание: подлетел — Эли открыл рот — мячик медленно уходит в рот — рот закрыт, светится цветом
    const near = Math.max(0, len - L.eli * P.MOUTH_OPEN_AT);
    await go(b, { x: fx + dx * near, y: fy + dy * near, ms: ms * near / len, easing: 'linear' });
    hop(false); pose('open');
    await go(b, { x: tx, y: ty, k: 0.2, ms: P.SWALLOW_MS, easing: 'ease-in' }); stop(); b.remove();
    sfx('gulp'); pose('full'); holdGlow(c); await wait(450);
    sfx('rise'); await eliTo(r.to, 650);          // прыгает вверх с надутыми щеками (фотон внутри) await wait(250); restPose(r.to);
    if (!demo) await catchLine(c);
  } else if (r.type === 'down') {
    // вынужденный: мячик задевает Эли, повторюшка медленно вырастает изо рта, оба летят рядом и в ногу
    await go(b, { x: tx, y: ty, ms, easing: 'linear' }); hop(false);
    pose('blow'); shine(); sfx('pop');
    const tw = growFromMouth(c, mb), stop2 = trail(tw, c), crawl = L.ph * 0.5;
    await Promise.all([
      go(b, { x: tx + dx * crawl, y: ty + dy * crawl, ms: P.SPIT_MS, easing: 'linear' }),
      go(tw, { x: mb.x + dx * crawl, y: mb.y + dy * crawl, k: 1, ms: P.SPIT_MS, easing: 'ease-out' })]);
    pulse([b, tw]); unglow(); tag(T.twins, L.cx + L.eli * 0.6, eliY(lvl) - L.eli * 0.35);
    sfx('fall');
    await Promise.all([eliTo(r.to, 600, 'ease-in'), flyOut(b, dx, dy), flyOut(tw, dx, dy)]);
    stop(); stop2(); pose('hello'); if (r.to === 2) holdGlow('uv');
  } else {                                       // пролетел мимо — дальше по той же прямой
    await go(b, { x: tx, y: ty, ms, easing: 'linear' }); hop(false);
    pose('surprised'); ghost(r.reach, c); sfx('boing');
    await flyOut(b, dx, dy, ms * W / len); stop();
    await wait(300); eli.src = poseBefore; eli.style.filter = heldBefore;
  }
  return r;
}
const fromLeft = c => hit(c, -L.ph, eliY(lvl), P.AUTO_FLY_MS, true);
async function demo(c, target) {                 // показ на этапе 1: цель мигает, силуэт, потом мячик
  hideSay();
  if (target) { ask(target, true); await wait(1500); }
  await fromLeft(c); unask();
}
async function liftToTwo(hint = false, colors = ['red', 'uv', 'cyan'], text = '') {
  // с 1-й ступеньки Эли поднимает ребёнок: подходит только невидимый фотон (1→2, 10,2 эВ); цветные пролетают мимо
  if (lvl !== 1) return;
  await upTask(2, colors, hint, hint, text);
}
async function downHome(text = '') {              // задание этапа «Вниз»: со 2-й домой — тем же невидимым фотоном
  if (text) await say(text, { next: false });     // пока Эли объясняет, всё стоит: фотоны — после фразы
  hideSay();
  for (;;) {
    ask(1, false, false);                         // спуск: два фотона-повторюшки — ступенька не мигает, это путает
    const { c, x, y } = await river(['red', 'uv', 'cyan']);
    const r = await hit(c, x, y);
    if (r.type === 'down' && r.to === 1) { unask(); hideSay(); sfx('ding'); await wait(900); return; }   // два мерцающих фотона видны и без слов
    hop(false);
    if (r.type === 'up') await dropToTwo();
    await say(T.s4wrong, { next: false });
  }
}

/* --- река света: мячики плывут слева направо по кругу --- */
let riv = null, riverK = 1;                     // riverK < 1 — река плывёт быстрее
function clearRiver() { if (riv) { cancelAnimationFrame(riv.raf); riv.items.forEach(it => it.el.remove()); riv = null; } }
function river(colors, hint) {
  clearRiver();
  return new Promise(res => {
    const items = colors.map((c, i) => {
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'ball' + (c === hint ? ' hint' : ''); b.setAttribute('aria-label', T.photonLabel(PH[c].name));
      const im = new Image(); im.src = `img/${PH[c].img}.webp`; im.alt = ''; b.appendChild(im);
      stage.appendChild(b); return { c, el: b, f: (i + 0.5) / colors.length, x: 0 };
    });
    riv = { items, raf: 0, t0: performance.now() };
    const frame = now => {
      if (!riv) return;
      const span = W + L.tap, prog = (now - riv.t0) / (P.RIVER_MS * K * riverK);
      for (const it of items) {
        it.x = -L.tap / 2 + ((it.f + prog) % 1) * span;
        it.el.style.width = it.el.style.height = L.tap + 'px';
        it.el.firstChild.style.width = it.el.firstChild.style.height = L.ph + 'px';
        it.el.style.transform = `translate(${it.x - L.tap / 2}px,${L.riverY - L.tap / 2}px)`;
      }
      riv.raf = requestAnimationFrame(frame);
    };
    frame(riv.t0);
    items.forEach(it => it.el.onclick = () => { const x = it.x, y = L.riverY; sfx('tap'); clearRiver(); res({ c: it.c, x, y }); });
  });
}

/* --- задания (без текста: цель показывается мерцанием) --- */
async function upTask(target, colors, hint, withDream, text = '') {
  const right = colorFor(EN(target) - EN(lvl));
  if (text) await say(text, { next: false });     // пока Эли объясняет, всё стоит: фотоны — после фразы
  hideSay();
  for (;;) {
    ask(target, withDream);
    const { c, x, y } = await river(colors, hint ? right : null);
    const r = await hit(c, x, y);
    if (r.type === 'up' && r.to === target) {
      unask(); tag(T.hooray, L.cx, eliY(lvl) - L.eli * 0.7); sfx('ding');
      hideSay();                                  // без «Ура, я на N-й ступеньке»: видно и так
      await dropToTwo(); await wait(300); hideSay(); return;
    }
    hop(false);
    if (r.type === 'up') { await say(T.wrongStep(r.to, target), { next: false }); await dropToTwo(); }
    else await say(T.pass, { next: false });
  }
}
async function downTask(from, colors, o = {}) {
  const lc = colorFor(EN(from) - EN(2));
  hideSay(); await wait(600);                     // без «Сейчас меня поднимет…»: ребёнок это видит
  await fromLeft(lc);
  const tx = o.explain || o.text;
  if (tx) await say(tx, { next: false });         // пока Эли объясняет, всё стоит: фотоны — после фразы
  hideSay();
  for (;;) {
    ask(2, o.dream, false);                       // спуск: два фотона-повторюшки — ступенька не мигает, это путает
    const { c, x, y } = await river(colors);
    const r = await hit(c, x, y);
    if (r.type === 'down' && r.to === 2) { unask(); sfx('ding'); await say(T.s4ok(PH[lc].gen), { next: false }); await wait(900); hideSay(); return; }
    hop(false);
    await say(T.s4wrong, { next: false });
  }
}
async function teleport(n) {                     // на проверке: Эли сразу наверху, щёки надуты,
  await go(eli, { opacity: 0, ms: 250 }); put(eli, L.cx, eliY(n)); lvl = n;   // свечение белое — цвет не подсказывает
  restPose(n); holdGlow('uv');
  await go(eli, { opacity: 1, ms: 250 });
}
async function testTask(t, i) {
  hideSay();
  if (t.from !== 2) {                            // сначала ребёнок сам поднимает Эли (не в зачёт), потом спускает
    for (;;) {
      ask(t.from, false);
      const up = await river(t.lift);
      const r0 = await hit(up.c, up.x, up.y);
      unask();
      if (r0.type === 'up' && r0.to === t.from) break;
      if (r0.type === 'up') await dropToTwo();
    }
  }
  ask(t.to, false, t.from === 2);                // вниз (фотон-повторюшка) ступенька не мигает: ребёнок брал её цвет
  const { c, x, y } = await river(t.colors);
  const r = await hit(c, x, y);
  unask();
  const ok = r.type === (t.from === 2 ? 'up' : 'down') && r.to === t.to;
  $('#score').children[i].className = ok ? 'ok' : 'bad';
  // без надписи: верно — Эли радостно подпрыгивает и вспыхивает; неверно — удивляется и «мотает головой»
  hideSay();
  if (ok) {
    pose('jump'); shine(); sfx('ding');
    const b = tf(eli);
    await eli.animate([{ transform: b }, { transform: b + ' translateY(-28px) scale(1.08)' }, { transform: b }, { transform: b + ' translateY(-14px)' }, { transform: b }],
      { duration: 900 * K, easing: 'ease-out' }).finished.catch(() => {});
  } else {
    pose('surprised'); sfx('oops');
    const b = tf(eli);
    await eli.animate([0, -10, 10, -10, 10, -6, 0].map(x => ({ transform: b + ` translateX(${x}px) rotate(${x * 0.6}deg)` })),
      { duration: 900 * K, easing: 'ease-in-out' }).finished.catch(() => {});
  }
  restPose(lvl);
  await wait(250);
  await dropToTwo();
  return ok;
}

/* --- планетарный атом → лесенка (около 6 с, без текста) ---
   1) ядро и 5 колец, электрон бежит по 1-му кольцу; 2) кольца вращаются, наклоняются, атом приближается;
   3) кольца встают ребром и становятся линиями; 4) линии расходятся в ступеньки; 5) шарик вырастает в Эли */
async function planetIntro(afterFlash) {
  phase = 'planet'; measure();
  const cx = W / 2, cy = H * 0.5, R = Math.min(W, H) * 0.40, rs = P.RING_SIZES.map(f => f * R);
  const wrap = document.createElement('div'); wrap.id = 'planet';
  const plane = document.createElement('div'); plane.id = 'plane'; wrap.appendChild(plane);
  rs.forEach((r, i) => {
    const [, cf, cg] = P.STEP_COLORS[i], g = document.createElement('div');
    g.className = 'ring' + (i === 1 ? ' glass' : '');
    g.style.width = g.style.height = 2 * r + 'px';
    g.style.setProperty('--c-front', cf); g.style.setProperty('--c-glow', cg);
    plane.appendChild(g);
  });
  const orbit = document.createElement('div'); orbit.id = 'orbit'; plane.appendChild(orbit);
  const ds = Math.max(14, L.eli * 0.16), dot = document.createElement('div'); dot.className = 'edot';
  dot.style.width = dot.style.height = ds + 'px'; dot.style.left = (rs[0] - ds / 2) + 'px'; dot.style.top = (-ds / 2) + 'px';
  orbit.appendChild(dot);
  stage.appendChild(wrap);
  nucleus = sprite('nucleus'); nucleus.style.zIndex = 7; setB(nucleus, Math.max(18, rs[0] * 0.9)); put(nucleus, cx, cy);
  const pl = (rx, rz, s) => `translate(${cx}px,${cy}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`;
  plane.style.transform = pl(0, 0, 0.85);
  if (afterFlash) await unflash(); else await wait(300);
  await wait(900);
  // вращение, наклон и приближение до положения «ребром»
  const endS = 1.25;
  await plane.animate([{ transform: pl(0, 0, 0.85) }, { transform: pl(62, 50, 1), offset: .55 }, { transform: pl(87, 100, endS) }],
    { duration: P.PLANET_MS * K, easing: 'ease-in-out', fill: 'forwards' }).finished;
  // кольца стали линиями: заменяем их плоскими полосками и разводим по ступенькам
  wrap.remove();
  const bars = rs.map((r, i) => {
    const [, cf, cg] = P.STEP_COLORS[i], b = document.createElement('div'); b.className = 'bar';
    b.style.setProperty('--c-front', i === 1 ? 'rgba(255,255,255,.75)' : cf); b.style.setProperty('--c-glow', cg);
    const w = 2 * r * endS; b.style.left = (cx - w / 2) + 'px'; b.style.width = w + 'px'; b.style.top = (cy - 3) + 'px';
    stage.appendChild(b); return b;
  });
  measure(); lvl = 1;
  const e = document.createElement('div'); e.className = 'edot'; e.style.position = 'absolute'; e.style.zIndex = 15;
  e.style.width = e.style.height = ds + 'px'; e.style.left = (cx - ds / 2) + 'px'; e.style.top = (cy - ds / 2) + 'px';
  stage.appendChild(e);
  const moves = bars.map((b, i) => b.animate([
    { left: b.style.left, width: b.style.width, top: b.style.top },
    { left: L.x0 + 'px', width: (L.x1 - L.x0) + 'px', top: (yLevel(i + 1) - 3) + 'px' }],
    { duration: 1400 * K, delay: i * 120 * K, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).finished);
  const ex = L.cx, ey = eliY(1), es = L.eli * 0.55;
  moves.push(e.animate([{ left: e.style.left, top: e.style.top, width: ds + 'px', height: ds + 'px' },
    { left: (ex - es / 2) + 'px', top: (ey - es / 2) + 'px', width: es + 'px', height: es + 'px' }],
    { duration: 1700 * K, easing: 'ease-in-out', fill: 'forwards' }).finished);
  moves.push(go(nucleus, { x: L.cx, y: L.nucY, ms: 1600 }).then(() => { setB(nucleus, L.nuc); put(nucleus, L.cx, L.nucY); nucleus.style.zIndex = ''; }));
  await Promise.all(moves);
  // ступеньки и Эли проявляются, полоски и шарик гаснут
  phase = 'atom'; buildAtom(); pose('hello');
  steps.forEach(s => s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 * K }));
  eli.animate([{ opacity: 0, transform: tf(eli) + ' scale(.5)' }, { opacity: 1, transform: tf(eli) }], { duration: 600 * K, easing: 'ease-out' });
  [...bars, e].forEach(x => x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500 * K, fill: 'forwards' }).finished.then(() => x.remove()));
  await wait(700);
}

async function ensureAtom() {                    // сцена Эли, запущенная сама по себе: атом и Эли на 1-й ступеньке
  if (phase !== 'atom') { measure(); phase = 'atom'; lvl = 1; buildAtom(); pose('hello'); }
  spectrumOn = true; buildSpectrum();              // с этапа 2 ребёнок ловит фотоны сам — виден штрихкод
  if (FLASHED) await unflash();
}

async function eliStage1() {                     // Этап 1 — смотрим (после планетарного атома)
  await planetIntro(FLASHED);
  phase = 'atom'; lvl = 1; buildAtom(); pose('hello');
  setLabel(T.stage(1));
  for (const s of T.s1) await say(s);
  await demo('uv', 2);          await say(T.s1uv);
  await demo('yellow', null);   await say(T.s1yellow);
  await demo('red', 3);
  hideSay(); await dropToTwo(T.s1drop);
  hideSay(); await dropHome();
  hideSay();
}

async function eliStage2() {                     // Этап 2 — с подсказкой (обучение: силуэт на цели)
  await ensureAtom();
  setLabel(T.stage(2)); hideSay();
  await liftToTwo(true, ['red', 'uv', 'cyan'], T.s2intro);   // начало игры: «теперь твоя очередь — нажми на фотон»
  await upTask(3, ['cyan', 'red', 'violet'], true, true);
  await upTask(4, ['red', 'violet', 'cyan'], true, true);
  await upTask(5, ['violet', 'cyan', 'red'], true, true, T.s2end);
  hideSay(); await dropHome();
}

async function stage3(hints) {                   // Этап 3 — сам (при повторной тренировке — с подсказками и силуэтом)
  setLabel(T.stage(3));
  const fast = i => { riverK = hints ? 1 : P.RIVER_FAST[i]; };   // без подсказок река с каждым заданием быстрее
  if (!hints) await say(T.s2rainbow);              // про радугу и штрихкод — до заданий; дозвучала — дальше сама
  fast(0); await liftToTwo(hints, ['violet', 'red', 'uv'], hints ? T.almost : T.s3intro);   // «а теперь без подсказок» — с первым же заданием
  fast(1); await upTask(4, ['red', 'cyan', 'yellow'], hints, hints, hints ? T.s3hint : '');
  fast(2); await upTask(3, ['green', 'red', 'violet'], hints, hints);
  fast(3); await upTask(5, ['cyan', 'violet', 'yellow'], hints, hints);
  riverK = 1;
  hideSay(); await dropHome();
}
async function eliStage3() { await ensureAtom(); await stage3(false); }

async function eliStage4() {                     // Этап 4 — вниз (силуэт — в первом задании)
  await ensureAtom();
  setLabel(T.stage(4));
  await liftToTwo(false, ['uv', 'cyan', 'yellow']);
  await downTask(3, ['cyan', 'red', 'violet'], { explain: T.s4b, dream: true });
  await downTask(4, ['red', 'cyan', 'violet']);
  await downTask(5, ['cyan', 'violet', 'red']);
  await laserGame();
  await downHome(T.s4end);
  hideSay();
}

/* --- мини-игра «Лазер» (конец этапа 4) ---
   1) пять маленьких Эли на своих ступеньках 2 и 3; ребёнок нажимает на каждого — Эли глотает красный фотон
      и прыгает наверх (накачка); 2) все наверху — появляется красный фотон, ребёнок его запускает;
   3) пролетая мимо Эли, фотон заставляет его спрыгнуть и выпустить повторюшку (вынужденное излучение):
      фотонов становится 1 → 6, они летят строем и мигают в такт; 4) в конце — лазерный луч и мишень. */
async function laserGame() {
  phase = 'laser';                                 // перестройка экрана при повороте не трогает лесенку
  const N = P.LASER_ATOMS, main = [...steps, eli, nucleus, auraEl, dreamEl, $('#spectrum')].filter(Boolean);
  main.forEach(el => { el.style.visibility = 'hidden'; });
  const m = Math.min(W / (N + 2), H * 0.11), y3 = H * 0.42, y2 = y3 + m * 1.6;   // ступеньки 3 и 2
  const xs = [...Array(N)].map((_, i) => W * (i + 1.5) / (N + 2)), yE = y => y - 6 - m * 0.42;
  const bars = [], kids = [];
  for (const [y, n] of [[y3, 3], [y2, 2]]) {
    const [ct, cf, cg] = P.STEP_COLORS[n - 1];
    xs.forEach(x => {
      const b = document.createElement('div'); b.className = 'step' + (n === 2 ? ' glass' : '');
      b.style.setProperty('--c-top', ct); b.style.setProperty('--c-front', cf); b.style.setProperty('--c-glow', cg);
      Object.assign(b.style, { left: (x - m * 0.55) + 'px', width: m * 1.1 + 'px', top: y + 'px' });
      stage.appendChild(b); bars.push(b);
    });
  }
  xs.forEach(x => { const k = sprite('eli_hello', 'front'); setB(k, m); put(k, x, yE(y2)); k._up = false; kids.push(k); });
  [...bars, ...kids].forEach(e => e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500 * K }));
  await wait(500);
  // 1) накачка: нажать на каждого Эли
  await say(T.laserPump, { next: false });        // пока Эли объясняет, нажимать нельзя
  await new Promise(done => {
    let left = N;
    kids.forEach(k => {
      k.classList.add('tappable');
      k.onclick = async () => {
        if (k._up || k._busy) return;
        k._busy = true; k.classList.remove('tappable'); sfx('tap');
        const b = ball('red', k._x, H + L.ph); b.style.zIndex = 15;
        await go(b, { y: k._y + m * 0.1, k: 0.6, ms: 550, easing: 'ease-in' }); b.remove();
        k.src = 'img/eli_full.webp'; sfx('gulp'); sfx('rise', 120);
        await go(k, { y: yE(y3), ms: 420, easing: 'ease-out' });
        k.style.filter = `drop-shadow(0 0 8px ${PH.red.css}) drop-shadow(0 0 18px ${PH.red.css})`;
        k._shake = k.animate([0, 1, 2, 3, 4].map(i => ({ transform: tf(k) + ` translate(${[0, 1.2, -1.2, 0.8, 0][i]}px,${[0, -0.8, 0.5, 0.8, 0][i]}px)` })),
          { duration: P.TREMBLE_MS * K, iterations: Infinity });
        k._up = true; if (--left === 0) done();
      };
    });
  });
  // 2) запуск: светящийся фотон слева
  await wait(400);
  const yBeam = yE(y3);                           // строй и луч — на высоте заряженных Эли, через их место
  const shot = ball('red', W * 0.06, yBeam);
  await say(T.laserFire, { next: false });        // фотон ждёт нажатия — после фразы
  shot.classList.add('tappable');
  await tapOn(shot);
  shot.classList.remove('tappable'); sfx('whoosh');
  // 3) цепочка: строй фотонов летит направо, каждый Эли добавляет повторюшку
  const team = [shot], gap = L.ph * 0.5, stops = [trail(shot, 'red')];
  pulse(team);
  const yRow = i => shot._y + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * gap * 0.55;   // строй: веер вверх-вниз от оси
  for (let i = 0; i < N; i++) {
    const k = kids[i], x = k._x - m * 0.45;
    await Promise.all(team.map((p, j) => go(p, { x, y: yRow(j), ms: (x - p._x) / W * P.LASER_MS, easing: 'linear' })));
    k._shake.cancel(); k.src = 'img/eli_blow.webp'; k.style.filter = ''; sfx('pop');
    const tw = ball('red', k._x, k._y); tw._k = 0.2; tw.style.transform = tf(tw);
    stops.push(trail(tw, 'red'));
    team.push(tw);
    team.forEach(p => p.getAnimations().forEach(a => a.cancel())); pulse(team);   // все мигают в такт
    go(k, { y: yE(y2), ms: 380, easing: 'ease-in' }).then(() => { k.src = 'img/eli_hello.webp'; });
    sfx('fall');
    await go(tw, { k: 1, x: x, y: yRow(team.length - 1), ms: 260, easing: 'ease-out' });
  }
  // 4) луч и мишень
  const tx = W - 16 - m * 0.5, target = document.createElement('div'); target.className = 'ltarget';
  Object.assign(target.style, { width: m + 'px', height: m + 'px', left: (tx - m / 2) + 'px', top: (yBeam - m / 2) + 'px' });
  stage.appendChild(target);
  await Promise.all(team.map((p, j) => go(p, { x: tx, y: yRow(j), ms: (tx - p._x) / W * P.LASER_MS * 0.6, easing: 'ease-in' })));
  stops.forEach(s => s()); team.forEach(p => p.remove());
  const beam = document.createElement('div'); beam.className = 'lbeam';
  Object.assign(beam.style, { left: W * 0.06 + 'px', width: (tx - W * 0.06) + 'px', top: (yBeam - 5) + 'px' });
  stage.appendChild(beam);
  sfx('sparkle'); sfx('fanfare', 200);
  beam.animate([{ transform: 'scaleX(0)', opacity: 0.4 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: 350 * K, easing: 'ease-out' });
  target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)', filter: 'brightness(2)' }, { transform: 'scale(1)' }], { duration: 700 * K, iterations: 2 });
  kids.forEach(k => bounce(k));
  await say(T.laserWin, { next: false });
  await wait(800);
  // назад к лесенке Эли
  const extra = [...bars, ...kids, beam, target];
  await Promise.all(extra.map(e => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400 * K, fill: 'forwards' }).finished));
  extra.forEach(e => e.remove());
  main.forEach(el => { el.style.visibility = ''; });
  phase = 'atom';
}

async function eliStage5() {                     // Этап 5 — проверка; не прошёл — тренировка с подсказками и снова проверка
  await ensureAtom();
  for (;;) {
    setLabel(T.stage(5));
    $('#score').innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    await liftToTwo(false, ['green', 'uv', 'red'], T.s5intro(P.PASS_SCORE));   // подъём со 1-й — не в зачёт
    const tasks = [
      { from: 2, to: 3, colors: ['cyan', 'red', 'yellow'] },
      { from: 4, to: 2, colors: ['red', 'violet', 'cyan'], lift: ['violet', 'cyan', 'yellow'] },
      { from: 2, to: 5, colors: ['violet', 'green', 'cyan'] },
      { from: 3, to: 2, colors: ['cyan', 'red', 'green'], lift: ['green', 'cyan', 'red'] },
      { from: 2, to: 4, colors: ['yellow', 'violet', 'cyan'] },
    ];
    let score = 0;
    for (let i = 0; i < tasks.length; i++) if (await testTask(tasks[i], i)) score++;
    hideSay(); await dropHome();
    if (score >= P.PASS_SCORE) break;
    $('#score').innerHTML = '';
    await stage3(true);                            // «Почти! Давай ещё потренируемся» — во время подъёма
  }
  // финал
  pose('medal'); bounce(eli, 1.12, 0.9);
  const badge = sprite('badge', 'front'); setB(badge, Math.min(W * 0.42, H * 0.22));
  put(badge, W / 2, H * 0.47, 0.1, 'rotate(-180deg)');
  sfx('fanfare');
  await go(badge, { k: 1, ex: 'rotate(0deg)', ms: 800, easing: 'cubic-bezier(.3,1.5,.5,1)' });
  await say(T.win);
  await say(T.teaser);
  try { localStorage.setItem('eliBadge', '1'); localStorage.removeItem('eliNext'); } catch (e) {}
  markDone('eli5');                               // дальше — глава «Салют» (runFrom)
}


/* ===================== ГЛАВА «САЛЮТ» ===================== */
/* Эли на фабрике салюта. Ребёнок кладёт в ракету 1–3 атома (нажатие на шарик; ещё раз — вынуть) и запускает её
   нажатием на ракету: салют вспыхивает цветами этих атомов.
   1) Эли объясняет и сам запускает натрий; 2) три свободных запуска; 3) три задания «как на картинке»;
   4) испытание: шарики серые, цвет виден только в огне; после двух ошибок цвета возвращаются (подсказка).
   Физика: огонь подбрасывает электроны атома вверх по ступенькам, спрыгивая, они выпускают фотоны;
   у каждого атома своя лесенка — поэтому свой цвет (цвет пламени). Что на самом деле: в настоящем салюте горят
   соли металлов, а не чистые атомы; красный обычно дают стронцием (литий тоже даёт малиновый, 670,8 нм);
   синий — соединения меди (хлорид меди; в пламени медь сине-зелёная); калий в салюте почти не используют
   (бледно-сиреневый); натрий — жёлтый (589 нм); барий — зелёный. */
const FIRE_ATOMS = ['li', 'na', 'k', 'cu', 'ba'];
const FLAME = { li: '#ff2a55', na: '#ffc21a', k: '#c49bff', cu: '#2f8cff', ba: '#6dff5a' };
const FIRE_TASKS = [['li'], ['ba', 'na'], ['cu', 'k']];            // с цветными шариками
const FIRE_TESTS = [['na'], ['cu'], ['li', 'ba'], ['k']];          // шарики серые
const FACE = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="14.5" cy="17" r="3" fill="#1b1e4a"/><circle cx="25.5" cy="17" r="3" fill="#1b1e4a"/>'
  + '<path d="M13.5 24.5 Q20 30 26.5 24.5" fill="none" stroke="#1b1e4a" stroke-width="2.6" stroke-linecap="round"/></svg>';
const ROCKET = '<svg viewBox="0 0 40 100" aria-hidden="true"><path class="fl" d="M13 86 Q20 104 27 86 Z" fill="#ffb52e" opacity="0"/>'
  + '<path d="M6 70 L13 58 L13 84 L6 88 Z M34 70 L27 58 L27 84 L34 88 Z" fill="#3fb6ff"/>'
  + '<path d="M20 2 Q33 18 31 32 L31 82 Q20 88 9 82 L9 32 Q7 18 20 2 Z" fill="#ff5a6e"/>'
  + '<path d="M20 2 Q33 18 31 32 L9 32 Q7 18 20 2 Z" fill="#f3f5ff"/>'
  + [42, 56, 70].map((y, i) => '<circle class="w' + i + '" cx="20" cy="' + y + '" r="5.6" fill="#1b1e4a" stroke="#f3f5ff" stroke-width="1.6"/>').join('')
  + '</svg>';
const WIN_Y = [0.42, 0.56, 0.70];                // окошки ракеты — доли её высоты
let F = null;

/* --- искры: один canvas на всю сцену --- */
const FX = { ps: [], raf: 0, last: 0, ctx: null, cv: null };
function fxAdd(p) { FX.ps.push(p); if (!FX.raf) { FX.last = performance.now(); FX.raf = requestAnimationFrame(fxFrame); } }
function fxFrame(now) {
  const c = FX.ctx; if (!c || !FX.cv.isConnected) { FX.ps = []; FX.raf = 0; return; }
  const dt = Math.min(3, (now - FX.last) / 16.7) / K; FX.last = now;
  c.clearRect(0, 0, W, H); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  FX.ps = FX.ps.filter(p => (p.life -= dt) > 0);
  for (const p of FX.ps) {
    const d = Math.pow(p.drag, dt); p.vx *= d; p.vy = p.vy * d + p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    c.globalAlpha = Math.min(1, p.life / p.max * 1.6); c.strokeStyle = p.c; c.lineWidth = p.w;
    c.beginPath(); c.moveTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5); c.lineTo(p.x, p.y); c.stroke();
  }
  c.globalAlpha = 1;
  FX.raf = FX.ps.length ? requestAnimationFrame(fxFrame) : 0;
  if (!FX.raf) c.clearRect(0, 0, W, H);
}
function burst(x, y, cols) {                     // вспышка салюта: искры цветов cols разлетаются и падают
  const s = Math.min(W, H) / 380, n = 80 + 30 * cols.length;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (1.4 + Math.random() * 3.4) * s, life = 55 + Math.random() * 50;
    fxAdd({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, w: 2.4 * s, c: cols[i % cols.length], g: 0.04 * s, drag: 0.975 });
  }
  for (let i = 0; i < 14; i++) {                 // белая серединка
    const a = Math.random() * Math.PI * 2, v = Math.random() * 1.2 * s;
    fxAdd({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 18, max: 18, w: 5 * s, c: '#fff', g: 0, drag: 0.9 });
  }
}
function sparks(x, y) {                          // хвост летящей ракеты
  const s = Math.min(W, H) / 380;
  for (let i = 0; i < 2; i++) fxAdd({ x: x + (Math.random() - 0.5) * 6 * s, y, vx: (Math.random() - 0.5) * 0.8 * s, vy: (0.6 + Math.random()) * s,
    life: 22, max: 22, w: 2 * s, c: i ? '#ffd27a' : '#ff8a3d', g: 0.02 * s, drag: 0.96 });
}

/* --- раскладка --- */
function layoutFire() {
  if (!F) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  FX.cv.width = W * dpr; FX.cv.height = H * dpr; FX.cv.style.width = W + 'px'; FX.cv.style.height = H + 'px';
  FX.ctx = FX.cv.getContext('2d'); FX.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  F.a = Math.max(54, Math.min(W * 0.16, H * 0.09, 84));
  F.atoms.forEach((b, i) => {
    b._x = W * (0.1 + i * 0.2); b._y = H * 0.9;
    Object.assign(b.style, { width: F.a + 'px', height: F.a + 'px', left: b._x - F.a / 2 + 'px', top: b._y - F.a / 2 + 'px' });
  });
  F.rw = F.a * 1.05; F.rh = F.rw * 2.5; F.rx = W * 0.4; F.ry = H * 0.66;
  F.topY = H * 0.32;
  Object.assign(F.rocket.style, { width: F.rw + 'px', height: F.rh + 'px' });
  if (!F.flying) F.rocket.style.transform = 'translate(' + (F.rx - F.rw / 2) + 'px,' + (F.ry - F.rh / 2) + 'px)';
  setB(F.eli, L.eli * 1.1); put(F.eli, W * 0.82, H * 0.66, F.eli._k ?? 1);
  const q = Math.min(W * 0.3, H * 0.17);
  Object.assign(F.sample.style, { width: q + 'px', height: q + 'px', left: 16 + 'px', top: H * 0.13 + 'px' });
  if (F.target) drawSample(F.target);
}
function drawSample(t) {                         // картинка-образец: салют нужных цветов
  const cv = F.sample.firstChild, q = F.sample.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = q * dpr; cv.height = q * dpr;
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.lineCap = 'round';
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2, col = FLAME[t[i % t.length]];
    c.strokeStyle = col; c.lineWidth = 3;
    c.beginPath(); c.moveTo(q / 2 + Math.cos(a) * q * 0.1, q / 2 + Math.sin(a) * q * 0.1); c.lineTo(q / 2 + Math.cos(a) * q * 0.34, q / 2 + Math.sin(a) * q * 0.34); c.stroke();
    c.fillStyle = col; c.beginPath(); c.arc(q / 2 + Math.cos(a) * q * 0.41, q / 2 + Math.sin(a) * q * 0.41, 3, 0, Math.PI * 2); c.fill();
  }
}

/* --- ракета: зарядить, запустить --- */
function setGray(on) { F.gray = on; F.atoms.forEach(b => b.classList.toggle('gray', on)); paintRocket(); }
function paintRocket() {
  for (let i = 0; i < 3; i++) F.rocket.querySelector('.w' + i).setAttribute('fill', F.load[i] ? (F.gray ? '#9aa0b8' : FLAME[F.load[i]]) : '#1b1e4a');
  F.atoms.forEach(b => b.classList.toggle('on', F.load.includes(b._k)));
  F.rocket.classList.toggle('tappable', !!F.wait && F.load.length > 0);
  F.atoms.forEach(b => b.classList.toggle('tappable', !!F.wait && !F.load.length));   // ракета пустая — шарики зовут
}
async function loadAtom(k, byEli = false) {      // шарик-копия летит в окошко ракеты; уже в ракете — вынуть
  if (F.load.includes(k)) { F.load = F.load.filter(x => x !== k); sfx('pop'); paintRocket(); return; }
  if (F.load.length >= 3) { sfx('buzz'); return; }
  const b = F.atoms[FIRE_ATOMS.indexOf(k)];
  sfx('tap'); playVoice(T.fireAtoms[k] + '.', true);
  F.load.push(k); const i = F.load.length - 1, sz = F.a * 0.5;
  const d = document.createElement('div'); d.className = 'fatom' + (F.gray ? ' gray' : ''); d.style.setProperty('--ac', FLAME[k]);
  Object.assign(d.style, { pointerEvents: 'none', zIndex: 13, width: sz + 'px', height: sz + 'px' }); stage.appendChild(d);
  const wx = F.rx - sz / 2, wy = F.ry - F.rh / 2 + F.rh * WIN_Y[i] - sz / 2;
  await d.animate([{ transform: 'translate(' + (b._x - sz / 2) + 'px,' + (b._y - sz / 2) + 'px)' }, { transform: 'translate(' + wx + 'px,' + wy + 'px)' }],
    { duration: (byEli ? 900 : 450) * K, easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => {});
  d.remove(); paintRocket();
}
function waitLaunch() {                          // ребёнок заряжает ракету и нажимает на неё
  return new Promise(r => { F.wait = r; paintRocket(); });
}
async function launch() {                        // → какие атомы были в ракете
  const cols = F.load.map(k => FLAME[k]), r = F.rocket, x = F.rx;
  F.flying = true; F.wait = null; paintRocket();
  r.querySelector('.fl').setAttribute('opacity', '1'); sfx('launch');
  const t0 = performance.now(), dur = 950 * K;
  await new Promise(res => {
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), y = F.ry + (F.topY - F.ry) * p * p;
      r.style.transform = 'translate(' + (x - F.rw / 2) + 'px,' + (y - F.rh / 2) + 'px)'; sparks(x, y + F.rh * 0.45);
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  r.style.visibility = 'hidden'; sfx('boom'); burst(x, F.topY, cols);
  const got = F.load.slice(); F.load = []; paintRocket();
  await wait(1500);
  r.querySelector('.fl').setAttribute('opacity', '0'); F.flying = false; layoutFire();
  r.style.visibility = ''; await r.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 * K }).finished.catch(() => {});
  return got;
}
const pose2 = n => { F.eli.src = 'img/' + n + '.webp'; };
async function fireTask(t) {                     // салют как на картинке
  F.target = t; F.sample.hidden = false; drawSample(t);
  F.sample.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 400 * K, easing: 'ease-out' });
  let fails = 0;
  for (;;) {
    await waitLaunch();
    const got = await launch();
    if (got.length === t.length && t.every(k => got.includes(k))) break;
    fails++; sfx('oops'); pose2('eli_surprised');
    await say(T.fireWrong, { next: false }); hideSay(); pose2('eli_hello');
    if (F.gray && fails >= 2) setGray(false);     // подсказка: цвета вернулись — до конца этого задания
  }
  sfx('ding'); pose2('eli_jump'); await bounce(F.eli, 1.12, 0.9); await wait(500); pose2('eli_hello');
  F.target = null; F.sample.hidden = true;
}

async function fireScene() {
  await flash();
  hop(false); clearRiver(); unask(); hideSay();
  for (const c of [...stage.children]) if (!['top', 'counter', 'flash', 'start', 'confirm'].includes(c.id)) c.remove();
  eli = null; spectrumOn = false; $('#score').innerHTML = '';
  phase = 'fire'; setLabel(T.fireLabel);
  const root = document.createElement('div'); root.id = 'fire'; stage.appendChild(root);
  FX.cv = document.createElement('canvas'); FX.cv.id = 'ffx'; root.appendChild(FX.cv);
  F = { load: [], wait: null, gray: false, flying: false, target: null };
  F.atoms = FIRE_ATOMS.map(k => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'fatom'; b._k = k;
    b.style.setProperty('--ac', FLAME[k]); b.innerHTML = FACE; b.setAttribute('aria-label', T.fireAtoms[k]);
    b.onclick = () => { if (F.wait && !F.flying) loadAtom(k); };
    root.appendChild(b); return b;
  });
  F.rocket = document.createElement('button'); F.rocket.type = 'button'; F.rocket.id = 'frocket'; F.rocket.innerHTML = ROCKET;
  F.rocket.onclick = () => { if (F.wait && F.load.length && !F.flying) { sfx('tap'); F.wait(); } };
  root.appendChild(F.rocket);
  F.sample = document.createElement('div'); F.sample.id = 'fsample'; F.sample.hidden = true;
  F.sample.appendChild(document.createElement('canvas')); root.appendChild(F.sample);
  F.eli = sprite('eli_hello', 'front'); F.eli.addEventListener('click', () => talkTap());
  layoutFire();
  await unflash();

  for (const t of T.fire) await say(t);
  await say(T.fireDemo, { next: false });          // Эли сам кладёт натрий и запускает
  await loadAtom('na', true); await wait(300);
  await launch();
  await say(T.fireDemoEnd);
  for (const t of T.fireWhy) await say(t);
  await say(T.fireFree, { next: false }); hideSay();
  for (let i = 0; i < 3; i++) { await waitLaunch(); await launch(); }   // свободная игра: три ракеты
  await say(T.fireTask, { next: false }); hideSay();
  for (const t of FIRE_TASKS) await fireTask(t);
  setGray(true);
  for (const t of T.fireGray) await say(t, { next: false });
  hideSay();
  for (const t of FIRE_TESTS) { setGray(true); await fireTask(t); }
  setGray(false);
  for (let i = 0; i < 6; i++) {                    // финал: салют всеми цветами
    const x = W * (0.2 + Math.random() * 0.6), y = H * (0.2 + Math.random() * 0.2);
    const cols = FIRE_ATOMS.filter(() => Math.random() < 0.5).map(k => FLAME[k]);
    sfx('boom'); burst(x, y, cols.length ? cols : [FLAME.na]); await wait(450);
  }
  await wait(800);
  await say(T.fireWin);
  await say(T.fireBye);
  hideSay();                                       // «Ой, мне на работу» — Эли растворяется облачком
  sfx('whoosh');
  await F.eli.animate([{ filter: 'blur(0)', opacity: 1, transform: tf(F.eli) }, { filter: 'blur(14px)', opacity: 0, transform: tf(F.eli) + ' scale(1.6)' }],
    { duration: 1200 * K, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  await wait(800);
  try { localStorage.removeItem('eliNext'); } catch (e) {}
  markDone('fire'); goScene(-1);                 // последняя глава — на стартовый экран
}

/* ===================== СЦЕНЫ И СТРЕЛКИ ===================== */
/* Сцена = адрес после # (#apple, #build, #eli1 … #eli5). ◀ и ▶ перезапускают нужную сцену с чистого листа.
   ▶ активна, если текущая сцена уже пройдена (или в «Собери атом» открыт хотя бы 1 атом).
   Пройденные сцены, значок и место, где остановились, помнятся в этом браузере (localStorage):
   «Играть» — всегда с яблока; «Продолжить» (если игра уже начата) — со сцены после последней законченной. */
const SCENES = ['apple', 'build', 'eli1', 'eli2', 'eli3', 'eli4', 'eli5', 'fire'];
const SCENE_FN = { apple: partA, build: buildScene, eli1: eliStage1, eli2: eliStage2, eli3: eliStage3, eli4: eliStage4, eli5: eliStage5, fire: fireScene };
let cur = -1;
const DONE = new Set();
try { JSON.parse(localStorage.getItem('eliDone') || '[]').forEach(x => DONE.add(x)); } catch (e) {}
function markDone(n) { DONE.add(n); try { localStorage.setItem('eliDone', JSON.stringify([...DONE])); } catch (e) {} updNav(); }
function updNav() {
  $('#prev').disabled = cur < 0;
  $('#next').disabled = !(cur >= 0 && cur < SCENES.length - 1 && DONE.has(SCENES[cur]));
}
function goScene(i) { location.hash = LANG + (i >= 0 ? '-' + SCENES[i] : ''); location.reload(); }
async function runFrom(name) {
  const st = $('#start'); if (st) st.remove();
  measure();
  for (let i = SCENES.indexOf(name); i < SCENES.length; i++) {
    cur = i; location.hash = LANG + '-' + SCENES[i]; updNav();
    await SCENE_FN[SCENES[i]]();
    markDone(SCENES[i]);
    try { localStorage.setItem('eliNext', SCENES[i + 1] || ''); } catch (e) {}
  }
}

/* ===================== СТАРТ ===================== */
const ALL = ['bg_space', 'eli_hello', 'eli_surprised', 'eli_jump', 'eli_hold', 'eli_medal', 'eli_open', 'eli_full', 'eli_blow',
  'apple_1', 'apple_2', 'apple_4', 'apple_8', 'knife', 'monster_green', 'monster_orange', 'monster_green_chew', 'monster_orange_chew',
  'cell', 'molecule', 'nucleus', 'badge', ...Object.values(PH).map(p => p.img), ...[1, 2, 3, 4, 5, 6, 7, 8].map(i => 'card_' + i)];
function preload() {
  return Promise.all(ALL.map(n => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = `img/${n}.webp`; })));
}
function relayout() {
  measure();
  if (phase === 'A') { layoutA(); placeCounter(); }
  if (phase === 'atom') { const h = !!hopAnim; buildAtom(); if (h) hop(true); }
  if (phase === 'build' && BS) { layoutBuild(); syncBins(); renderAtom(); }
  if (phase === 'fire') layoutFire();
}
addEventListener('resize', () => { clearTimeout(relayout._t); relayout._t = setTimeout(relayout, 150); });

document.body.classList.toggle('notext', !P.SHOW_TEXT);
$('#stitle').textContent = T.title; $('#snote').textContent = T.note;
$('#play').textContent = T.loading; $('#cont').textContent = T.cont; $('#skip').textContent = T.skip; $('#skip2').textContent = T.skip2;
$('#prev .nl').textContent = T.back; $('#next .nl').textContent = T.fwd;
$('#prev').setAttribute('aria-label', T.prevScene); $('#next').setAttribute('aria-label', T.nextScene);
$('#prev').onclick = () => goScene(cur - 1);     // из первой сцены — на стартовый экран
$('#next').onclick = () => { if (!$('#next').disabled) goScene(cur + 1); };
$('#home').setAttribute('aria-label', T.home);
$('#home').onclick = () => {                     // «в начало» — с подтверждением ✓ / ✗, чтобы не нажать случайно
  if ($('#confirm')) return;
  const ov = document.createElement('div'); ov.id = 'confirm';
  ov.innerHTML = `<p></p><div class="row">
    <button class="cbtn yes" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button class="cbtn no" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg></button></div>`;
  ov.querySelector('p').textContent = T.restartQ;
  const yes = ov.querySelector('.yes'), no = ov.querySelector('.no');
  yes.setAttribute('aria-label', T.yes); no.setAttribute('aria-label', T.no);
  yes.onclick = () => goScene(-1);
  no.onclick = () => ov.remove();
  stage.appendChild(ov); no.focus({ preventScroll: true });
};
$('#btext').onclick = () => { if ($('#btext').classList.contains('tap')) talkTap(); };
$('#replay').setAttribute('aria-label', T.replay);
$('#replay').onclick = () => voiceThenGo(talk, true);   // ещё раз озвучить текущую фразу — сразу
document.querySelectorAll('.lang').forEach(b => {
  b.classList.toggle('on', b.dataset.l === LANG);
  b.onclick = () => {
    if (b.dataset.l === LANG) return;
    try { localStorage.setItem('eliLang', b.dataset.l); } catch (e) {}
    location.hash = b.dataset.l; location.reload();
  };
});
if (!RU_ON) $('#langs').hidden = true;
updNav();
const startHash = HASH_SCENE;
try { $('#sbadge').hidden = localStorage.getItem('eliBadge') !== '1'; } catch (e) {}
// открыли сцену по адресу (после ◀ ▶ страница перезагружается): если браузер уже разрешает звук — сразу в сцену;
// иначе — экран только с кнопкой «Играть»: касание нужно, чтобы браузер включил звук
if (SCENES.includes(startHash)) {
  $('#start').hidden = true;
  ['#snote', '#skip', '#skip2', '#langs', '#sbadge', '#cont'].forEach(q => { $(q).hidden = true; });
}
preloadVoices(LANG);
preload().then(async () => {
  const play = $('#play'); play.disabled = false; play.textContent = T.play;
  if (SCENES.includes(startHash)) {
    unlockAudio(); await new Promise(r => setTimeout(r, 300));
    if (soundOn()) { runFrom(startHash); return; }
    $('#start').hidden = false; play.focus({ preventScroll: true });
    play.onclick = () => runFrom(startHash); return;
  }
  play.focus({ preventScroll: true });
  const fresh = scene => () => { resetBarcode(); runFrom(scene); };   // новая игра: штрихкод заполняется заново
  play.onclick = fresh(P.START === 'atom' ? 'eli1' : 'apple');   // «Играть» — всегда с начала
  let next = ''; try { next = localStorage.getItem('eliNext') || ''; } catch (e) {}
  if (SCENES.includes(next)) {                     // игра уже начата — «Продолжить» с того места, где остановились
    const cont = $('#cont'); cont.hidden = false; cont.onclick = () => runFrom(next);
  }
  $('#skip').onclick = fresh('build');
  $('#skip2').onclick = fresh('eli1');
});
