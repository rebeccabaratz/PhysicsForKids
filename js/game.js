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
    SHOW_TEXT      — показывать ли фразы текстом вверху (false: только голос; true — для взрослых/отладки; ?text в адресе включает его, фразы по-русски)
    PLANET_MS      — сколько вращается и наклоняется планетарный атом, мс (4500)
    RING_SIZES     — радиусы колец 1–5 в планетарном атоме, доля самого большого
    MOUTH_OPEN, MOUTH_BLOW — положение рта на картинках Эли (доли картинки)
    SPEED          — общая скорость анимаций (1 = обычная, 2 = вдвое быстрее)
    START          — с чего начинать: 'apple' или 'atom'
    (язык: пока только иврит — RU_ON = false в блоке «ЯЗЫК»; с RU_ON = true — кнопки «עברית / Русский» и адрес #ru)
    STEP_COLORS    — пастельные цвета ступенек 1–5
  «Собери атом»: константы NEUT (нейтроны для каждого числа протонов), BIN = 8 шариков в корзинке, SHAKE_MS;
    карточки веществ — img/card_1.webp … card_8.webp; когда открыты все 8 — сам переход к Эли.
  Навигация: 9 сцен (#apple, #build, #eli1…#eli5, #fire — «Салют», #chem — «Вещества», #react — «Реакции», #rainbow — «Радуга», #color — «Цвет», #uv — «Невидимый свет», #sky — «Небо», #leaf — «Лист делает сахар», #elec — «Электричество», #photo — «Фотон выбивает Эли», #magnet — «Магниты», #final — финал; #map — карта глав); ◀ — начало предыдущей сцены, ▶ — следующей (всегда: взрослый без звука может пройти дальше).
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
  SHOW_TEXT: true,              // показывать ли фразы текстом (пока игра в работе — да: новые фразы без озвучки, решение автора 2026-11-09;
                                // когда всё озвучим — false: дети не читают)
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
// фразы текстом вверху — по-русски (если есть русский вариант): текст только для автора, дети его не увидят (решение автора 2026-11-10);
// ?hetext — текст на иврите; ?text — включить текст, даже если P.SHOW_TEXT = false
if (/[?&]text\b/.test(location.search)) P.SHOW_TEXT = true;
const RU_TEXT = P.SHOW_TEXT && !/[?&]hetext\b/.test(location.search);
const RU_OF = new Map();                          // ивритская фраза → русская (одинаковые ключи в T_HE и T_RU)
(function pair(h, r) {
  if (typeof h === 'string' && typeof r === 'string') { RU_OF.set(h, r); return; }
  if (h && r && typeof h === 'object' && typeof r === 'object') for (const k of Object.keys(h)) pair(h[k], r[k]);
})(T_HE, T_RU);

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
  c.classList.toggle('small', phase === 'A');      // у яблока — мельче и сразу под «איפה אלי?»: не закрывает лица детей
  if (phase === 'A') { c.style.top = (A.ask ? A.ask.offsetTop + A.ask.offsetHeight + 2 : 96) + 'px'; return; }
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
  if (phase === 'final' && FN) return FN.eli;
  if (phase === 'magnet' && MG) return MG.eli;
  if (phase === 'photo' && PE) return PE.eli;
  if (phase === 'elec' && EL) return EL.eli;
  if (phase === 'leaf' && LF) return LF.eli;
  if (phase === 'react' && RX) return RX.eli;
  if (phase === 'chem') return CHEM.eli();
  if (phase === 'sky' && SK) return SK.eli;
  if (phase === 'uv' && UV) return UV.eli;
  if (phase === 'color' && CL) return CL.eli;
  if (phase === 'fire' && F) return F.eli;
  if (phase === 'rainbow' && RB) return RB.eli;
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
  sayText = text; $('#replay').hidden = false; showText(text);
  if (!(o.next ?? true)) return playVoice(text).then(ok => ok === false && P.SHOW_TEXT ? wait(readMs(text)) : undefined);
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
    // идём дальше сами, через время на фразу (нажатие на говорящего или на текст — сразу)
    wait(P.SHOW_TEXT ? readMs(sayText) : Math.max(2500, sayText.length * 70)).then(() => { if (talk === t) talkTap(true); });
  });
}
function showText(text) {                        // фраза вверху (видна, если P.SHOW_TEXT; с ?text — русский вариант)
  $('#btext').textContent = LANG === 'he' && RU_TEXT && RU_OF.has(text) ? RU_OF.get(text) : text;
}
const readMs = text => 1500 + 55 * text.length;   // фраза без озвучки: сколько её читать (нажатие — дальше сразу)
function hideSay() { endTalk(); sayText = ''; if (!P.SHOW_TEXT) $('#btext').textContent = ''; $('#replay').hidden = true; }   // ?text — фраза-задание видна до следующей
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
/* Внуки у стола (STORY_RU.md, STORY_HE.md; расстановка — проба чата для экрана 390×844): разговор «איפה אלי?», все смеются,
   первый разрез делает Лаэль, половинки едят Арбель (левые) и Шакед (правые); дальше режет ребёнок.
   Координаты — как на экране 390×844 (яблоко там в (195, 447) шириной 179 px); на другом экране
   всё масштабируется вокруг яблока (AD). Клетка — после 9 разрезов (8 см / 2⁹ ≈ 0,16 мм): клетки мякоти яблока
   около 0,15–0,25 мм (микро-КТ, BMC Plant Methods 2009), то есть как мелкая песчинка (0,1–0,25 мм). */
let A = {};
const AU = () => L.apple / 179;                     // масштаб относительно экрана 390×844
const AD = (x, y) => [W / 2 + (x - 195) * AU(), L.appleY + (y - 447) * AU()];
const KID_AT = {                                    // середина, макушка, рост, слой, [за столом — ниже не видно] (на экране 390×844)
  lael: [277, 225, 420, 1, 600], beeri: [166, 262, 440, 2, 600], arbel: [62, 372, 397, 3], shaked: [328, 322, 425, 3],
};
const MOUTH = { arbel: [72, 460], shaked: [311, 412] };   // куда летят половинки
const KNIFE_AT = [205, 566];                        // ножик лежит на столе перед яблоком
function drawTable() {                              // стол со скатертью и доска (как в пробе чата); слой 4 — под яблоком, над детьми
  const y0 = 468, y1 = 592, xb = 100, xf = 78, y2 = y1 + 62, floor = 790, w = 390;
  let wave = `M${xf} ${y1}`; for (let x = xf; x <= w - xf; x += 22) wave += ` L${x} ${y2 + (Math.round((x - xf) / 22) % 2 ? 6 : 0)}`; wave += ` L${w - xf} ${y2} L${w - xf} ${y1} Z`;
  const [ox, oy] = AD(0, 0), u = AU();
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); t.id = 'atable';
  t.innerHTML = `<defs><linearGradient id="atcl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe3cf"/><stop offset="1" stop-color="#fbf4e8"/></linearGradient>
    <linearGradient id="atdr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7d6bb"/><stop offset="1" stop-color="#d9c4a2"/></linearGradient>
    <linearGradient id="atlg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5326"/><stop offset=".5" stop-color="#a8673a"/><stop offset="1" stop-color="#7a4520"/></linearGradient>
    <pattern id="atck" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="11" height="11" fill="#e46a6a" opacity=".16"/><rect x="11" y="11" width="11" height="11" fill="#e46a6a" opacity=".16"/></pattern></defs>
    <g transform="translate(${ox} ${oy}) scale(${u})">
    <ellipse cx="195" cy="${floor}" rx="175" ry="12" fill="#000" opacity=".3"/>
    <rect x="${xf + 14}" y="${y2 - 6}" width="16" height="${floor - y2 + 2}" rx="5" fill="url(#atlg)"/><rect x="${w - xf - 30}" y="${y2 - 6}" width="16" height="${floor - y2 + 2}" rx="5" fill="url(#atlg)"/>
    <path d="M${xb} ${y0} H${w - xb} L${w - xf} ${y1} H${xf} Z" fill="url(#atcl)" stroke="#d8c6a8" stroke-width="1.2"/><path d="M${xb} ${y0} H${w - xb} L${w - xf} ${y1} H${xf} Z" fill="url(#atck)"/>
    <path d="${wave}" fill="url(#atdr)"/><path d="${wave}" fill="url(#atck)"/>
    <ellipse cx="195" cy="532" rx="104" ry="20" fill="#b9783d"/><ellipse cx="195" cy="528" rx="100" ry="17" fill="#d89a58"/></g>`;
  stage.appendChild(t); return t;
}
function placeKids() {
  KIDS.clear();
  for (const [n, [x, top, h, z, clip]] of Object.entries(KID_AT)) {
    const [px, py] = AD(x, top);
    KIDS.add(n, { x: px, top: py, h: h * AU(), z, clip: clip && AD(0, clip)[1] });
  }
  for (const [n, [x, y]] of Object.entries(MOUTH)) A[n] = AD(x, y);
}
const restY = k => L.appleY + 0.45 * L.apple * (1 - k);   // кусочек лежит на доске (низ целого яблока — на доске)
const KNIFE_REST = 'rotate(45deg) scaleX(1)';        // лежит на столе (scaleX — чтобы в руке Лаэль плавно перевернуться)
function knifeRest() { const [x, y] = AD(...KNIFE_AT); put(A.knife, x, y, 0.85, KNIFE_REST); }
async function knifeHome() {                        // ножик ложится обратно на стол
  if (A.knife._home) return;
  A.knife._home = true;
  const [x, y] = AD(...KNIFE_AT);
  await go(A.knife, { x, y, k: 0.85, ex: KNIFE_REST, ms: 380 });
  A.knife._home = false; A.knifeBusy = false;
}
function placeHalo() {                              // золотое мерцание под ножиком: на светлой скатерти свечения ножика почти не видно
  const [x, y] = AD(...KNIFE_AT), u = AU();
  Object.assign(A.halo.style, { left: (x - 70 * u) + 'px', top: (y - 40 * u) + 'px', width: 140 * u + 'px', height: 80 * u + 'px' });
}
function layoutA() {
  if (A.table) { A.table.remove(); A.table = drawTable(); placeKids(); }
  if (A.piece) put(A.piece, W / 2, restY(A.piece._k), A.piece._k, A.piece._ex);
  if (A.knife && !A.knifeBusy) knifeRest();
  if (A.halo) placeHalo();
}
const kl = ([n, t], o) => KIDS.talk(n, t, o);
const ALL_KIDS = ['lael', 'beeri', 'arbel', 'shaked'];
/* кулак Лаэль в анимации lael_cut (12 кадров/с; доли кадра 9:16), найден по цвету кожи в кадрах видео:
   0,7 с — поднимает руку, 0,9–1,75 с — держит над яблоком, 1,8–2,1 с — опускает (разрез), дальше рука внизу */
const FIST = [[.296, .538], [.296, .538], [.296, .538], [.296, .537], [.286, .54], [.251, .539], [.194, .515], [.175, .443], [.174, .38],
  [.186, .345], [.199, .33], [.204, .325], [.204, .336], [.204, .335], [.197, .33], [.201, .334], [.201, .333], [.2, .33], [.2, .33],
  [.199, .331], [.19, .338], [.174, .355], [.153, .396], [.171, .445], [.185, .514]];
/* в руке ножик отражён (scaleX(-1)): рукоятка справа внизу, острие влево вверх; поворот deg — по часовой.
   HOLD: острие смотрит вниз-влево, на яблоко; STRIKE: при ударе — почти отвесно вниз, в яблоко */
const GRIP = [0.25, 0.22], HOLD = -95, STRIKE = -125;   // GRIP — рукоятка в отражённой картинке (доля от середины)
function fistPos(f, deg, k) {                       // где середина ножика, если рукоятка — в кулаке Лаэль
  const [fx, fy] = FIST[f], [hx, hy] = KIDS.at('lael', fx, fy), a = deg * Math.PI / 180, b = A.knife._b * k;
  const gx = GRIP[0] * b, gy = GRIP[1] * b;
  return [hx - (gx * Math.cos(a) - gy * Math.sin(a)), hy - (gx * Math.sin(a) + gy * Math.cos(a))];
}
const knifeInFist = (f, deg, k) => put(A.knife, ...fistPos(f, deg, k), k, `rotate(${deg}deg) scaleX(-1)`);
async function laelStrike(after) {                  // Лаэль берёт ножик, поднимает и режет (ножик — в её кулаке)
  const kn = A.knife, K0 = 0.72;
  const lz = KIDS.el('lael'); lz.style.zIndex = '3';   // поднятая рука — перед плечом Беэри
  KIDS.play('lael', 'cut');
  const t0 = performance.now(), fr = () => Math.floor((performance.now() - t0) / 1000 * 12);
  while (fr() < 8) await new Promise(requestAnimationFrame);
  // ножик со стола прыгает в руку, пока она поднимается
  const [x, y] = fistPos(10, HOLD, K0);
  await go(kn, { x, y, k: K0, ex: `rotate(${HOLD}deg) scaleX(-1)`, ms: 220 });
  for (;;) {                                        // держит над яблоком, потом — удар: острие опускается в яблоко
    const f = fr(); if (f >= FIST.length) break;
    knifeInFist(Math.max(f, 10), HOLD + (STRIKE - HOLD) * Math.min(1, Math.max(0, (f - 19) / 4)), K0);
    await new Promise(requestAnimationFrame);
  }
  lz.style.zIndex = String(KID_AT.lael[3]);
}
async function partA() {
  phase = 'A'; setLabel(T.appleLabel);
  const KA = T.kidsApple;
  KIDS.reset(); A.table = drawTable(); placeKids();
  A.piece = sprite('apple_1'); setB(A.piece, L.apple);
  A.knife = sprite('knife', 'front'); setB(A.knife, L.apple * 0.62);
  A.halo = document.createElement('div'); A.halo.id = 'khalo'; stage.appendChild(A.halo); placeHalo();
  put(A.piece, W / 2, L.appleY); knifeRest();
  A.ask = document.createElement('div'); A.ask.id = 'ask'; A.ask.textContent = T.appleAsk; stage.appendChild(A.ask);
  if (P.SHOW_TEXT) A.ask.style.top = '116px';      // пока фразы видны текстом — «איפה אלי?» ниже них (и цифра разрезов ниже)
  setCount(0);
  // сначала — живая картинка: дети стоят, моргают, переглядываются; любое нажатие на экран — и Лаэль начинает
  KIDS.glances(true);
  await new Promise(r => stage.addEventListener('pointerdown', () => r(), { once: true }));
  KIDS.glances(false);
  await wait(300);
  for (const l of KA.intro) await kl(l);
  hideSay();
  // все смеются; Лаэль, смеясь, говорит «сейчас проверим» и берёт ножик; остальные досмеиваются и, пока она режет, смех переходит в улыбку
  const laughing = KIDS.laugh(ALL_KIDS);
  await wait(1200);
  const said = say(KA.go[1], { next: false });
  await wait(600);
  await cutOnce(1, laughing);                      // первый разрез делает Лаэль
  await said; hideSay();
  for (let i = 1; i <= P.MANUAL_CUTS; i++) {
    if (i > 1) { await knifeTap(0); hideSay(); await cutOnce(i); }
    for (const l of KA.cut[i]) await kl(l);
  }
  hideSay();
  await fastCuts();                                // дальше режем тоже нажатием на ножик: за нажатие — несколько разрезов
}
async function knifeTap(delay) {                   // ножик светится и ждёт нажатия (через delay мс)
  await wait(delay);
  A.knife.classList.add('tappable'); if (A.halo) A.halo.classList.add('on');
  KIDS.look(ALL_KIDS, true); KIDS.glances(true);    // ждут — смотрят на яблоко, изредка на секунду переглядываются
  await tapOn(A.knife);
  KIDS.glances(false);
  A.knife.classList.remove('tappable'); if (A.halo) A.halo.classList.remove('on');
}
async function cutOnce(i, byLael) {                // byLael — режет Лаэль; это обещание: когда остальным смотреть на яблоко
  const cx = W / 2, kn = A.knife; A.knifeBusy = true;
  if (byLael) await laelStrike(byLael);
  else {
    KIDS.look(ALL_KIDS, true);                     // пока режут — все смотрят на яблоко
    await go(kn, { x: cx + L.apple * 0.1, y: L.appleY - L.apple * 0.55, k: 1, ex: '', ms: 320 });   // ножик встаёт над яблоком
    await go(kn, { y: L.appleY + L.apple * 0.35, ms: 200, easing: 'ease-in' });
  }
  // 1/2, 1/4, 1/8 — свои картинки; дальше — та же восьмушка, но меньше
  const img = i <= 3 ? 'apple_' + 2 ** i : 'apple_8';
  const k = (A.piece._k || 1) * 0.86 * (i >= 4 ? 0.6 : 1);
  setCount(i); sfx('cut');
  const facing = KIDS.face(i % 2 === 1 ? 'arbel' : 'shaked');   // кто будет есть — заранее поворачивается к столу
  A.piece.remove();
  const a = sprite(img), b = sprite(img); setB(a, L.apple); setB(b, L.apple);
  put(a, cx, restY(k), k, 'scaleX(-1)'); put(b, cx, restY(k), k);
  knifeHome();
  const sp = 43 * AU();                            // половинки расходятся недалеко: иначе правая закрывает лицо Шакеда
  await Promise.all([go(a, { x: cx - sp, ms: 320 }), go(b, { x: cx + sp, ms: 320 })]);
  const left = i % 2 === 1, eaten = left ? a : b, keep = left ? b : a, who = left ? 'arbel' : 'shaked';
  if (i === 2) await kl(T.kidsApple.me);
  await facing;
  const e = KIDS.eat(who), [hx, hy] = e.hand;      // берёт кусочек рукой (видео), откусывает, жуёт с закрытым ртом
  await go(eaten, { x: hx, y: hy, k: k * 0.3, ms: e.ms, easing: 'ease-out' });   // кусочек прилетает в руку — там его подхватывает видео
  eaten.remove(); const ch = e.done;
  await go(keep, { x: cx, ms: 380 });
  A.piece = keep;
  await ch;                                        // сначала дожёвывает — говорить и жевать сразу нельзя
  if (i === 2) await kl(T.kidsApple.yum);
}
async function fastCuts() {
  hideSay();
  const KA = T.kidsApple, cx = W / 2, stops = { 9: ['cell', KA.cell], 27: ['molecule', KA.mol] };
  const kn = A.knife;
  let n = P.MANUAL_CUTS + 1, pause = 0;
  while (n <= P.TOTAL_CUTS) {
    await knifeTap(pause); hideSay();              // ножик лежит на столе; каждое нажатие — CUTS_PER_TAP разрезов
    pause = 0;
    A.knifeBusy = true;
    KIDS.look(ALL_KIDS, true);
    await go(kn, { x: cx + L.apple * 0.08, y: L.appleY - L.apple * 0.5, k: 1, ex: '', ms: 260 });
    for (let c = 0; c < P.CUTS_PER_TAP && n <= P.TOTAL_CUTS; c++, n++) {
      setCount(n); sfx('cut');
      const base = tf(kn);
      kn.animate([{ transform: base }, { transform: base + ` translateY(${L.apple * 0.6}px)` }, { transform: base }], { duration: P.FAST_CUT_MS * 0.9 * K });
      go(A.piece, { k: A.piece._k * 0.88, y: restY(A.piece._k * 0.88), ms: P.FAST_CUT_MS });
      await wait(P.FAST_CUT_MS);
      if (stops[n]) {
        knifeHome();
        A.piece.remove();
        A.piece = sprite(stops[n][0]); setB(A.piece, L.apple * 1.05); put(A.piece, cx, L.appleY, 0.15);
        sfx('sparkle');
        const ah = KIDS.gasp(ALL_KIDS);            // все ахают
        await go(A.piece, { k: 1, ms: 550, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        await ah;                                  // «ах!» — и сразу Лаэль объясняет, все поворачиваются к ней
        for (const l of stops[n][1]) await kl(l);  // ножик снова зовёт, когда дети договорят
        KIDS.look(ALL_KIDS, true);
        pause = P.STOP_TAP_MS;                     // пауза, чтобы успеть разглядеть клетку / молекулу
        n++; break;
      }
    }
    await knifeHome();                             // серия разрезов кончилась — ножик ложится на стол
  }
  hideSay();
  await flash();
  for (const el of [A.table, A.halo, A.piece, A.knife, A.ask]) el.remove();
  KIDS.reset();
  $('#counter').hidden = true;
  A = {};
}

/* ===================== СОБЕРИ АТОМ ===================== */
/* В корзинках по 8 шариков: слева протоны (+), справа электроны (−). Шарик летит в атом,
   нейтроны добавляются сами (NEUT[p] — самые распространённые изотопы: He-4, Li-7, Be-9, B-11, C-12, N-14, O-16).
   Про нейтроны — во вступлении (ядро гелия), в игре атом не останавливается.
   На кольцах видны пустые места для электронов (2 и 8).
   Ребёнок нажимает на атом: не поровну — атом дрожит; поровну — сияет и показывает карточку;
   потом атом снова пустой. Открыты все 8 — сам переход к Эли.
   Электроны: 1-е кольцо до 2, 2-е кольцо до 8 (правило оболочек). */
const NEUT = [0, 0, 2, 4, 5, 6, 6, 7, 8];
const BIN = 8, SHAKE_MS = 1000;
const ELN = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O'];
const SLOT_ORD = [0, 4, 2, 6, 1, 5, 3, 7];          // порядок мест на 2-м кольце (из 8 по кругу): верх, низ, бока, потом пары
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
  BS = { root, p: 1, e: 1, hist: [], found: new Set(), busy: true, done: null, eslot: [] };
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
  // нейтроны — во вступлении (в игре они добавляются сами, без остановки): на минуту — ядро гелия, 2 протона и 2 нейтрона
  $('#charge').style.visibility = 'hidden';
  BS.p = 2; renderAtom(); sfx('pop');
  $('#nuc').animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.5)', opacity: 1 }], { duration: 450 * K, easing: 'ease-out', fill: 'forwards' });
  await say(T.neutrons, { next: false });
  if (!BS) return;
  hideSay();
  await $('#nuc').animate([{ transform: 'scale(1.5)', opacity: 1 }, { transform: 'scale(.3)', opacity: 0 }], { duration: 350 * K, fill: 'forwards' }).finished.catch(() => {});
  $('#nuc').getAnimations().forEach(a => a.cancel());
  BS.p = 0; renderAtom(); $('#charge').style.visibility = '';
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
  // на кольцах видны пустые места: на 1-м — 2, на 2-м — 8 (ребёнок видит, сколько влезает, без объяснений).
  // 2-е кольцо появляется, когда 1-е заполнено. Электроны садятся в места по порядку SLOT_ORD: сначала по одному
  // на каждую сторону, потом парами (как в схемах Льюиса). Что на самом деле: электроны не сидят в точках
  // и не бегают по кругу — это облака; «8 мест» — правило октета для 2-го слоя (2s + 2p).
  BS.eslot = [];                                   // места в порядке заполнения: 0–1 на 1-м кольце, 2–9 на 2-м
  const shells = [[r1, 2, Math.min(e, 2), '7s'], [r2, 8, Math.max(0, e - 2), '11s']];
  shells.forEach(([r, cap, n, t], si) => {
    if (si === 1 && e < 2) return;
    const ring = document.createElement('div'); ring.className = 'ring2d';
    ring.style.width = ring.style.height = 2 * r + 'px'; aw.appendChild(ring);
    const sh = document.createElement('div'); sh.className = 'shell'; sh.style.setProperty('--t', t);
    const ord = si === 0 ? [0, 1] : SLOT_ORD;
    for (let i = 0; i < cap; i++) {
      const ang = -Math.PI / 2 + ord[i] * 2 * Math.PI / cap, el = document.createElement('div');
      Object.assign(el.style, { width: es + 'px', height: es + 'px', left: (r * Math.cos(ang) - es / 2) + 'px', top: (r * Math.sin(ang) - es / 2) + 'px', fontSize: es * 0.8 + 'px' });
      if (i < n) {
        el.className = 'pt e'; el.textContent = '−';
        if ((si === 0 ? i : 2 + i) >= p) { el.classList.add('extra'); el.onclick = () => removeElectron(el); }
      } else el.className = 'pt eslot';            // пустое место
      sh.appendChild(el); BS.eslot.push(el);
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
const atomTarget = (kind, i = BS[kind]) => kind === 'p' || !BS.eslot[i] ? [BS.cx, kind === 'p' ? BS.cy : BS.cy - (i < 2 ? BS.r1 : BS.r2)] : centerOf(BS.eslot[i]);

async function emptyAtom() {                       // все шарики из атома возвращаются в корзинки
  const flights = [];
  for (const k of ['p', 'e']) {
    const bin = $(k === 'p' ? '#binP' : '#binE');
    for (let i = 0; i < BS[k]; i++) {
      const slot = bin.children[BIN - BS[k] + i], from = atomTarget(k, i);
      flights.push(wait(i * 70).then(() => fly(k, from, centerOf(slot), k === 'p' ? 28 : BS.es)));
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
  const from = atomTarget(k, BS[k] - 1); BS[k]--; renderAtom(); sfx('fall');
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
  clearStage();
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
  await eliVanish(F.eli);
}


/* ===================== ОБЩЕЕ ДЛЯ НОВЫХ ГЛАВ ===================== */
function clearStage() {                          // новая глава: со сцены убирается всё, кроме верхней панели
  hop(false); clearRiver(); unask(); hideSay();
  for (const c of [...stage.children]) if (!['top', 'counter', 'flash', 'start', 'confirm'].includes(c.id)) c.remove();
  eli = null; spectrumOn = false; $('#score').innerHTML = '';
}
async function eliVanish(el) {                   // «Ой, мне на работу» — Эли растворяется облачком
  hideSay(); sfx('whoosh');
  await el.animate([{ filter: 'blur(0)', opacity: 1, transform: tf(el) }, { filter: 'blur(14px)', opacity: 0, transform: tf(el) + ' scale(1.6)' }],
    { duration: 1200 * K, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  await wait(800);
}
function tapObj(el) {                            // предмет светится и ждёт нажатия
  el.classList.add('tappable');
  return new Promise(r => { el.onclick = () => { el.onclick = null; el.classList.remove('tappable'); sfx('tap'); r(); }; });
}
function wl2rgb(l) {                             // цвет спектра для длины волны l (нм), 400–700
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
  const f = l < 420 ? 0.3 + 0.7 * (l - 400) / 20 : l > 680 ? 0.3 + 0.7 * (700 - l) / 20 : 1;
  const c = x => Math.round(255 * Math.pow(Math.max(0, x * f), 0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

/* ===================== ГЛАВА «РАДУГА» ===================== */
/* 1) Белый свет лампы падает на экран белым пятном; ребёнок ставит призму — на экране радуга (призма сильнее всего
      преломляет фиолетовый, слабее всего — красный). Ребёнок трогает все 6 цветов (звук: красный — низкий, фиолетовый — высокий:
      частота света тоже растёт от красного к фиолетовому). Вторая, перевёрнутая призма снова собирает цвета в белый (опыт Ньютона).
   2) Небо: нажать на тучу — дождь, на солнце — радуга. Радуга видна, когда солнце за спиной, а дождь впереди; красный снаружи.
      Что на самом деле: в капле свет преломляется на входе, отражается от задней стенки и преломляется на выходе
      (угол около 42° для красного и 40° для фиолетового) — «как маленькая призма» — упрощение.
   3) Три лампы: обычная (все цвета), водородная (только 656, 486, 434 нм — штрихкод Эли; на самом деле есть ещё слабая
      фиолетовая линия 410 нм; сама лампа светится розовым) и натриевая (только жёлтая 589 нм — на самом деле две близкие
      линии 589,0 и 589,6; лампа оранжево-жёлтая). Испытание: по штрихкоду на картинке найти лампу. */
const RB_LAMPS = { white: { c: '#fff6d8', lines: null }, h: { c: '#ff7ad9', lines: [656, 486, 434] }, na: { c: '#ffb02e', lines: [589] } };
const RB_BANDS = [660, 610, 580, 530, 470, 420];  // красный, оранжевый, жёлтый, зелёный, синий, фиолетовый
const PRISM = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,8 94,88 6,88" fill="rgba(190,230,255,.35)" stroke="#dff3ff" stroke-width="4" stroke-linejoin="round"/></svg>';
const LAMP = c => '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="g' + c.slice(1) + '"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity=".6"/></radialGradient></defs>'
  + '<circle cx="50" cy="40" r="32" fill="url(#g' + c.slice(1) + ')"/><rect x="36" y="70" width="28" height="20" rx="4" fill="#9aa0b8"/><rect x="40" y="90" width="20" height="6" rx="3" fill="#6b7088"/></svg>';
const SUN = '<svg viewBox="0 0 100 100" aria-hidden="true">' + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6;
  return '<line x1="' + (50 + Math.cos(a) * 30) + '" y1="' + (50 + Math.sin(a) * 30) + '" x2="' + (50 + Math.cos(a) * 46) + '" y2="' + (50 + Math.sin(a) * 46) + '" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/>'; }).join('')
  + '<circle cx="50" cy="50" r="24" fill="#ffc53d"/></svg>';
const CLOUD = '<svg viewBox="0 0 100 60" aria-hidden="true"><g fill="#e8ecff"><circle cx="30" cy="36" r="18"/><circle cx="52" cy="26" r="22"/><circle cx="74" cy="36" r="17"/><rect x="14" y="36" width="76" height="18" rx="9"/></g></svg>';
let RB = null;

function rbObj(svg, label) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'rbobj'; b.innerHTML = svg; b.setAttribute('aria-label', label || '');
  RB.root.appendChild(b); return b;
}
function rbPlace(el, x, y, w, h = w) { Object.assign(el.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' }); }
function rbGeo() {
  const g = { sy: H * 0.68, sx0: W * 0.08, sx1: W * 0.92, sh: Math.max(26, H * 0.04), s: Math.min(W * 0.3, H * 0.16), a: Math.max(56, Math.min(W * 0.17, H * 0.09, 84)) };
  g.lx = W * 0.14; g.ly = H * 0.22; g.px = W * 0.42; g.py = H * 0.4; g.qx = W * 0.6; g.qy = H * 0.54; g.trayY = H * 0.88;
  g.xl = l => g.sx0 + (l - 400) / 300 * (g.sx1 - g.sx0);
  return g;
}
function rbRender() {                            // всё нарисованное — заново из состояния RB
  if (!RB) return;
  const g = rbGeo(), S = RB.state, parts = [];
  RB.svg.setAttribute('viewBox', `0 0 ${W} ${H}`); RB.svg.setAttribute('width', W); RB.svg.setAttribute('height', H);
  const poly = (pts, fill, op = 1) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" opacity="${op}"/>`;
  if (S.mode === 'lab') {
    parts.push(`<rect x="${g.sx0}" y="${g.sy}" width="${g.sx1 - g.sx0}" height="${g.sh}" rx="6" fill="#1c1f3e" stroke="rgba(255,255,255,.35)" stroke-width="2"/>`);
    if (S.lamp) {
      const L0 = RB_LAMPS[S.lamp], lines = L0.lines, beam = S.lamp === 'white' ? '#fffdf2' : L0.c;
      if (!S.prism) {                            // без призмы: луч прямо на экран — пятно цвета лампы
        const ex = W * 0.5;
        parts.push(`<line x1="${g.lx}" y1="${g.ly}" x2="${ex}" y2="${g.sy}" stroke="${beam}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`);
        parts.push(`<rect x="${ex - 18}" y="${g.sy}" width="36" height="${g.sh}" rx="6" fill="${beam}"/>`);
      } else {
        const p1 = [g.px - g.s * 0.2, g.py + g.s * 0.02], p2 = [g.px + g.s * 0.2, g.py + g.s * 0.06];
        parts.push(`<line x1="${g.lx}" y1="${g.ly}" x2="${p1[0]}" y2="${p1[1]}" stroke="${beam}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`);
        parts.push(`<line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${beam}" stroke-width="7" opacity=".6"/>`);
        const ls = lines || [...Array(60)].map((_, i) => 400 + i * 5);
        const w = lines ? 3 : 2.5;
        if (S.prism2) {                          // вторая призма собирает всё обратно: дальше белый луч
          const q1 = [g.qx - g.s * 0.12, g.qy - g.s * 0.05], q2 = [g.qx + g.s * 0.02, g.qy + g.s * 0.12];
          ls.forEach((l, i) => { const t = i / Math.max(1, ls.length - 1);
            parts.push(poly([[p2[0], p2[1]], [p2[0] + 1, p2[1] + 2], [q1[0] - 12 + 24 * t, q1[1] + 2], [q1[0] - 12 + 24 * t - 1, q1[1]]], wl2rgb(l), 0.9)); });
          parts.push(`<line x1="${q2[0]}" y1="${q2[1]}" x2="${g.qx + g.s * 0.1}" y2="${g.sy}" stroke="${beam}" stroke-width="9" stroke-linecap="round"/>`);
          parts.push(`<rect x="${g.qx + g.s * 0.1 - 18}" y="${g.sy}" width="36" height="${g.sh}" rx="6" fill="${beam}"/>`);
        } else {
          for (const l of ls) {
            const x = g.xl(l), d = lines ? 3 : (g.xl(l + 5) - x) / 2 + 0.5;
            parts.push(poly([[p2[0] - w / 2, p2[1]], [p2[0] + w / 2, p2[1]], [x + d, g.sy], [x - d, g.sy]], wl2rgb(l), lines ? 0.95 : 0.8));
            parts.push(`<rect x="${x - d}" y="${g.sy}" width="${2 * d}" height="${g.sh}" fill="${wl2rgb(l)}"/>`);
          }
        }
      }
    }
    if (S.target) {                              // картинка-образец: штрихкод, который надо узнать
      const tx0 = W * 0.5, tx1 = W * 0.92, ty = H * 0.13, th = g.sh * 1.2, tl = RB_LAMPS[S.target].lines;
      parts.push(`<rect x="${tx0 - 6}" y="${ty - 6}" width="${tx1 - tx0 + 12}" height="${th + 12}" rx="10" fill="rgba(5,6,25,.6)" stroke="rgba(255,255,255,.55)" stroke-width="3"/>`);
      const xs = l => tx0 + (l - 400) / 300 * (tx1 - tx0);
      (tl || [...Array(60)].map((_, i) => 400 + i * 5)).forEach(l =>
        parts.push(`<rect x="${xs(l) - (tl ? 2.5 : 1.6)}" y="${ty}" width="${tl ? 5 : 3.4}" height="${th}" fill="${wl2rgb(l)}"/>`));
    }
  } else {                                       // небо: дождь и радуга
    if (S.rain) for (let i = 0; i < 28; i++) {
      const x = W * (0.5 + ((i * 0.618) % 1) * 0.45), y = H * (0.3 + ((i * 0.382 + i * i * 0.071) % 1) * 0.42);
      parts.push(`<line class="drop" style="animation-delay:${-(i * 0.13) % 0.8}s" x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 16}" stroke="#a9c8ff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`);
    }
    if (S.bow) {
      const cx = W * 0.68, cy = H * 0.9, r0 = Math.min(W * 0.28, H * 0.3), sw = Math.max(6, r0 * 0.05);
      RB_BANDS.forEach((l, i) => { const r = r0 - i * sw;          // красный — снаружи
        parts.push(`<path class="bow" d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${wl2rgb(l)}" stroke-width="${sw + 0.5}" opacity=".85"/>`); });
    }
  }
  RB.svg.innerHTML = parts.join('');
  // предметы
  const o = RB.obj;
  rbPlace(o.prism, S.prism ? g.px : W * 0.3, S.prism ? g.py : g.trayY, S.prism ? g.s : g.a);
  o.prism.hidden = !(S.mode === 'lab' && (S.prism || S.prismTray));
  rbPlace(o.prism2, S.prism2 ? g.qx : W * 0.5, S.prism2 ? g.qy : g.trayY, S.prism2 ? g.s * 0.7 : g.a);
  o.prism2.hidden = !(S.mode === 'lab' && (S.prism2 || S.prism2Tray));
  ['white', 'h', 'na'].forEach((k, i) => {
    const on = S.lamp === k;
    rbPlace(o.lamps[k], on ? g.lx : W * (0.22 + i * 0.22), on ? g.ly : g.trayY, g.a);
    o.lamps[k].hidden = !(S.mode === 'lab' && (on || S.lampTray));
  });
  rbPlace(o.sun, W * 0.16, H * 0.22, g.a * 1.4); o.sun.hidden = S.mode !== 'sky';
  rbPlace(o.cloud, W * 0.72, H * 0.24, g.a * 2.2, g.a * 1.3); o.cloud.hidden = S.mode !== 'sky';
  setB(RB.eli, L.eli * 0.95);
  put(RB.eli, S.mode === 'sky' ? W * 0.3 : W * 0.86, S.mode === 'sky' ? H * 0.8 : H * 0.85, RB.eli._k ?? 1);
}
function touchBands() {                          // ребёнок трогает все 6 цветов на экране
  const g = rbGeo(), left = new Set(RB_BANDS);
  return new Promise(res => {
    RB_BANDS.forEach(l => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'rbband tappable'; b.setAttribute('aria-label', String(l));
      const w = (g.sx1 - g.sx0) / 6;
      Object.assign(b.style, { left: g.xl(l) - w / 2 + 'px', top: g.sy - 26 + 'px', width: w + 'px', height: g.sh + 52 + 'px' });
      b.onclick = () => {
        if (soundOn()) tone(SND.ac.currentTime, 330 + (700 - l) * 3, 0.45, 'sine', 0.28);   // красный — низкий, фиолетовый — высокий
        const d = document.createElement('div'); d.className = 'rbpulse'; d.style.background = wl2rgb(l);
        Object.assign(d.style, { left: g.xl(l) - 22 + 'px', top: g.sy + g.sh / 2 - 22 + 'px' }); RB.root.appendChild(d);
        d.animate([{ transform: 'scale(.4)', opacity: 1 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 700 * K, easing: 'ease-out' }).finished.then(() => d.remove());
        if (left.delete(l)) b.classList.remove('tappable');
        if (!left.size) { RB.root.querySelectorAll('.rbband').forEach(x => x.remove()); setTimeout(res, 700); }
      };
      RB.root.appendChild(b);
    });
  });
}
function tapLamp() {                             // все лампы в корзинке светятся; → какую нажали
  return new Promise(r => {
    for (const k in RB.obj.lamps) {
      const el = RB.obj.lamps[k]; el.classList.add('tappable');
      el.onclick = () => { for (const x in RB.obj.lamps) { RB.obj.lamps[x].onclick = null; RB.obj.lamps[x].classList.remove('tappable'); } sfx('tap'); r(k); };
    }
  });
}
const rbPose = n => { RB.eli.src = 'img/' + n + '.webp'; };

async function rainbowScene() {
  await flash();
  clearStage();
  phase = 'rainbow'; setLabel(T.rbLabel);
  RB = { state: { mode: 'lab', lamp: 'white', prism: false, prismTray: true, prism2: false, prism2Tray: false, lampTray: false, target: null, rain: false, bow: false } };
  RB.root = document.createElement('div'); RB.root.id = 'rb'; stage.appendChild(RB.root);
  RB.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); RB.svg.id = 'rbsvg'; RB.root.appendChild(RB.svg);
  RB.obj = { prism: rbObj(PRISM), prism2: rbObj(PRISM), sun: rbObj(SUN), cloud: rbObj(CLOUD),
    lamps: { white: rbObj(LAMP(RB_LAMPS.white.c)), h: rbObj(LAMP(RB_LAMPS.h.c)), na: rbObj(LAMP(RB_LAMPS.na.c)) } };
  RB.obj.prism2.classList.add('flip');
  RB.eli = sprite('eli_hello', 'front'); RB.eli.addEventListener('click', () => talkTap());
  const S = RB.state, set = o => { Object.assign(S, o); rbRender(); };
  rbRender();
  await unflash();

  // 1) призма
  for (const t of T.rbIntro) await say(t);
  await say(T.rbPrism, { next: false }); hideSay();
  await tapObj(RB.obj.prism);
  set({ prism: true }); sfx('sparkle'); await wait(900);
  await say(T.rbSplit);
  await say(T.rbTouch, { next: false }); hideSay();
  await touchBands();
  await say(T.rbBack, { next: false }); hideSay();
  set({ prism2Tray: true });
  await tapObj(RB.obj.prism2);
  set({ prism2: true }); sfx('sparkle'); await wait(1000);
  await say(T.rbWhite);

  // 2) небо
  await flash(); set({ mode: 'sky', prism2: false, prism2Tray: false }); await unflash();
  await say(T.rbSky);
  await say(T.rbCloud, { next: false }); hideSay();
  await tapObj(RB.obj.cloud); set({ rain: true }); sfx('whoosh'); await wait(800);
  await say(T.rbSun, { next: false }); hideSay();
  await tapObj(RB.obj.sun); set({ bow: true }); sfx('sparkle'); await wait(1300);
  await say(T.rbBow);
  await say(T.rbBowWhy);

  // 3) лампы
  await flash(); set({ mode: 'lab', prism: true, prismTray: false, lamp: null, lampTray: true, rain: false, bow: false }); await unflash();
  await say(T.rbLamps, { next: false }); hideSay();
  const seen = new Set();
  while (seen.size < 3) {
    const k = await tapLamp();
    set({ lamp: k }); await wait(1200);
    if (!seen.has(k)) { seen.add(k); for (const t of T.rbLamp[k]) await say(t); hideSay(); }
  }
  await say(T.rbTest, { next: false }); hideSay();
  for (const target of ['h', 'na', 'white']) {
    set({ lamp: null, target });
    for (;;) {
      const k = await tapLamp();
      set({ lamp: k }); await wait(1300);
      if (k === target) break;
      sfx('oops'); rbPose('eli_surprised');
      await say(T.rbWrong, { next: false }); hideSay(); rbPose('eli_hello');
      set({ lamp: null });
    }
    sfx('ding'); rbPose('eli_jump'); await bounce(RB.eli, 1.12, 0.9); await wait(500); rbPose('eli_hello');
  }
  set({ target: null });
  await say(T.rbWin);
  await say(T.fireBye);
  await eliVanish(RB.eli);
}


/* ===================== ГЛАВА «ЦВЕТ» ===================== */
/* Эли работает в кожуре яблока: глотает фотоны.
   1) Свет солнца — поток фотонов трёх цветов (красный, зелёный, синий). Ребёнок нажимает на шарики-цвета внизу:
      нажатый цвет предмет «ест» (фотон исчезает в предмете), остальные отскакивают в глаз — предмет окрашивается
      в смесь отражённых. Задания: красное яблоко (ест зелёный и синий), зелёный лист (ест красный и синий),
      жёлтый банан (ест только синий), чёрная и белая футболки.
   2) Две футболки на солнце: съеденные фотоны становятся теплом — у чёрной градусник поднимается выше.
      Отличие от «Эли и свет»: здесь проглоченный фотон обратно не выплёвывается, энергия уходит в тепло.
   3) Экран телефона вблизи: красная, зелёная и синяя точки; ребёнок включает их и собирает цвет как на картинке
      (жёлтый = красный + зелёный, белый = все три, пурпурный = красный + синий, голубой = зелёный + синий).
   Что на самом деле: в белом свете все цвета радуги, а не три; три цвета — упрощение, честное для экрана
   (и для глаза: в нём три вида колбочек). Пигменты глотают полосы спектра: кожура красного яблока — сине-зелёный,
   хлорофилл — красный и синий, банан — синий. */
const RGB = { r: [255, 40, 40], g: [40, 220, 60], b: [50, 90, 255] };
const RGB_CSS = { r: '#ff3b3b', g: '#3bdc4b', b: '#3d6bff' };
const mixRGB = on => { const c = [22, 22, 30]; for (const k of on) RGB[k].forEach((v, i) => { c[i] = Math.min(255, c[i] + v); }); return `rgb(${c.join(',')})`; };
const COL_SHAPES = {
  apple: 'M50 30 C35 18 12 26 14 52 C16 78 36 92 50 86 C64 92 84 78 86 52 C88 26 65 18 50 30 Z',
  leaf: 'M14 86 C14 42 44 12 88 12 C88 56 58 86 14 86 Z',
  banana: 'M16 26 C20 70 58 90 90 70 C86 64 80 64 76 66 C54 74 34 60 30 26 C28 20 18 20 16 26 Z',
  shirt: 'M30 15 L42 10 C44 18 56 18 58 10 L70 15 L90 32 L80 44 L72 38 L72 90 L28 90 L28 38 L20 44 L10 32 Z',
};
const COL_TASKS = [                              // предмет, какие цвета он должен есть
  { id: 'apple', shape: 'apple', eat: ['g', 'b'] },
  { id: 'leaf', shape: 'leaf', eat: ['r', 'b'] },
  { id: 'banana', shape: 'banana', eat: ['b'] },
  { id: 'black', shape: 'shirt', eat: ['r', 'g', 'b'] },
  { id: 'white', shape: 'shirt', eat: [] },
];
const SCREEN_TASKS = [['r', 'g'], ['r', 'g', 'b'], ['r', 'b'], ['g', 'b']];
const EYE = '<svg viewBox="0 0 100 60" aria-hidden="true"><path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" fill="#f3f5ff"/><circle class="iris" cx="50" cy="30" r="17" fill="#888"/><circle cx="50" cy="30" r="7" fill="#111"/><circle cx="44" cy="24" r="4" fill="#fff"/></svg>';
let CL = null;

function colGeo() {
  const g = { a: Math.max(56, Math.min(W * 0.17, H * 0.09, 84)), os: Math.min(W * 0.44, H * 0.25) };
  g.sunX = W * 0.14; g.sunY = H * 0.2; g.ox = W * 0.44; g.oy = H * 0.44; g.eyeX = W * 0.86; g.eyeY = H * 0.44; g.trayY = H * 0.86;
  return g;
}
function objSvg(shape, fill) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="cls" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`
    + (shape === 'apple' ? '<rect x="47" y="12" width="6" height="18" rx="3" fill="#7a4a24"/>' : '')
    + `<path d="${COL_SHAPES[shape]}" fill="${fill}" stroke="rgba(200,206,240,.55)" stroke-width="2"/><path d="${COL_SHAPES[shape]}" fill="url(#cls)"/>`
    + (shape === 'leaf' ? '<path d="M18 82 Q50 50 84 16" stroke="rgba(0,0,0,.25)" stroke-width="2.5" fill="none"/>' : '') + '</svg>';
}
function colRender() {
  if (!CL) return;
  const g = colGeo(), S = CL.state;
  if (CL.cvW !== W || CL.cvH !== H) {            // размер холста — только когда меняется экран
    const dpr = Math.min(2, devicePixelRatio || 1); CL.cvW = W; CL.cvH = H;
    CL.cv.width = W * dpr; CL.cv.height = H * dpr; Object.assign(CL.cv.style, { width: W + 'px', height: H + 'px' });
    CL.ctx = CL.cv.getContext('2d'); CL.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const pl = (el, x, y, w, h = w) => Object.assign(el.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
  CL.sun.hidden = S.mode === 'screen'; pl(CL.sun, g.sunX, g.sunY, g.a * 1.3);
  CL.eye.hidden = S.mode !== 'obj'; pl(CL.eye, g.eyeX, g.eyeY, g.a * 1.2, g.a * 0.72);
  const refl = ['r', 'g', 'b'].filter(k => !S.eat.includes(k));
  CL.eye.querySelector('.iris').setAttribute('fill', S.mode === 'obj' ? mixRGB(refl) : '#888');
  CL.eye.style.filter = S.mode === 'obj' && refl.length ? `drop-shadow(0 0 12px ${mixRGB(refl)})` : '';
  if (S.mode === 'obj') {
    CL.obj.hidden = false; pl(CL.obj, g.ox, g.oy, g.os);
    CL.obj.innerHTML = objSvg(S.shape, mixRGB(refl));
  } else CL.obj.hidden = true;
  ['r', 'g', 'b'].forEach((k, i) => {
    const b = CL.balls[k]; b.hidden = S.mode !== 'obj'; pl(b, W * (0.22 + i * 0.22), g.trayY, g.a * 0.85);
    b.classList.toggle('eaten', S.eat.includes(k));
  });
  // футболки с градусниками
  CL.shirts.hidden = S.mode !== 'heat';
  if (S.mode === 'heat') {
    const sw = Math.min(W * 0.36, H * 0.2);
    CL.shirts.innerHTML = ['black', 'white'].map((c, i) => {
      const x = W * (0.3 + i * 0.4), t = S.temp[i];
      return `<div class="clshirt" style="left:${x - sw / 2}px;top:${H * 0.42 - sw / 2}px;width:${sw}px;height:${sw}px">${objSvg('shirt', c === 'black' ? mixRGB([]) : mixRGB(['r', 'g', 'b']))}</div>`
        + `<div class="clthermo" style="left:${x - 9}px;top:${H * 0.58}px;height:${H * 0.2}px"><i style="height:${15 + t * 85}%"></i></div>`;
    }).join('');
  }
  // экран телефона
  CL.screen.hidden = S.mode !== 'screen';
  if (S.mode === 'screen') {
    const ps = Math.min(W * 0.6, H * 0.32);
    pl(CL.screen, W / 2, H * 0.4, ps);
    ['r', 'g', 'b'].forEach(k => CL.dots[k].classList.toggle('on', S.lit.includes(k)));
    pl(CL.swatch, W / 2, H * 0.72, g.a * 1.1); CL.swatch.style.background = mixRGB(S.lit);
  }
  CL.swatch.hidden = S.mode !== 'screen';
  // картинка-образец
  CL.sample.hidden = !S.target;
  if (S.target) {
    const q = Math.min(W * 0.28, H * 0.16);
    pl(CL.sample, W - 16 - q / 2, H * 0.13 + q / 2, q);
    CL.sample.innerHTML = S.mode === 'screen'
      ? `<i style="background:${mixRGB(S.target)}"></i>` : objSvg(S.shape, S.target);
  }
  setB(CL.eli, L.eli * 0.95); put(CL.eli, W * 0.88, H * 0.86, CL.eli._k ?? 1);
}
/* поток фотонов от солнца к предмету: съеденные исчезают, остальные летят в глаз */
function colStream(on) {
  CL.streaming = on;
  if (!on || CL.raf) return;
  let last = performance.now(), acc = 0;
  const frame = now => {
    if (!CL || !CL.cv.isConnected) return;
    const dt = Math.min(50, now - last) / K; last = now; acc += dt;
    const g = colGeo(), c = CL.ctx, S = CL.state;
    if (CL.streaming && acc > 170) { acc = 0;
      const k = ['r', 'g', 'b'][CL.n++ % 3], hx = S.mode === 'heat' ? W * (CL.n % 2 ? 0.3 : 0.7) : g.ox, hy = S.mode === 'heat' ? H * 0.42 : g.oy;
      CL.ps.push({ k, x: g.sunX, y: g.sunY, tx: hx + (Math.random() - 0.5) * g.os * 0.3, ty: hy + (Math.random() - 0.5) * g.os * 0.3, st: 'in' });
    }
    c.clearRect(0, 0, W, H);
    const v = Math.min(W, H) * 0.0006 * dt;          // скорость фотона, пикселей за кадр
    for (const p of CL.ps) {
      const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy);
      if (d < v + 1) {
        if (p.st === 'in') {
          if (S.mode === 'obj' && S.eat.includes(p.k) || S.mode === 'heat' && p.tx < W / 2) p.st = 'gone';   // чёрная футболка (слева) ест всё
          else { p.st = 'out'; p.tx = S.mode === 'obj' ? g.eyeX : (p.tx < W / 2 ? W * 0.1 : W * 0.95); p.ty = S.mode === 'obj' ? g.eyeY : -20; }
        } else p.st = 'gone';
        continue;
      }
      p.x += dx / d * v; p.y += dy / d * v;
      c.globalAlpha = 1; c.fillStyle = RGB_CSS[p.k]; c.shadowColor = RGB_CSS[p.k]; c.shadowBlur = 10;
      c.beginPath(); c.arc(p.x, p.y, Math.max(5, g.a * 0.12), 0, Math.PI * 2); c.fill();
    }
    c.shadowBlur = 0;
    CL.ps = CL.ps.filter(p => p.st !== 'gone');
    CL.raf = (CL.streaming || CL.ps.length) ? requestAnimationFrame(frame) : 0;
  };
  CL.raf = requestAnimationFrame(frame);
}
function colTask(t) {                            // ребёнок выбирает, что предмет ест; совпало — дальше
  const S = CL.state;
  // белая футболка — сразу после чёрной: начинаем с «ест всё», ребёнок убирает
  Object.assign(S, { mode: 'obj', shape: t.shape, eat: t.id === 'white' ? ['r', 'g', 'b'] : [], target: mixRGB(['r', 'g', 'b'].filter(k => !t.eat.includes(k))) });
  colRender();
  return new Promise(res => {
    const check = () => {
      if (S.eat.length === t.eat.length && t.eat.every(k => S.eat.includes(k))) {
        for (const k in CL.balls) { CL.balls[k].onclick = null; CL.balls[k].classList.remove('tappable'); }
        setTimeout(res, 900);
      }
    };
    for (const k in CL.balls) {
      const b = CL.balls[k]; b.classList.add('tappable');
      b.onclick = () => {
        S.eat = S.eat.includes(k) ? S.eat.filter(x => x !== k) : [...S.eat, k];
        sfx(S.eat.includes(k) ? 'chomp' : 'pop'); colRender(); check();
      };
    }
    check();
  });
}
function screenTask(t) {                         // ребёнок включает точки экрана; совпало — дальше
  const S = CL.state;
  Object.assign(S, { mode: 'screen', lit: [], target: t }); colRender();
  return new Promise(res => {
    for (const k in CL.dots) {
      const d = CL.dots[k]; d.classList.add('tappable');
      d.onclick = () => {
        S.lit = S.lit.includes(k) ? S.lit.filter(x => x !== k) : [...S.lit, k];
        sfx('tap'); colRender();
        if (S.lit.length === t.length && t.every(x => S.lit.includes(x))) {
          for (const x in CL.dots) { CL.dots[x].onclick = null; CL.dots[x].classList.remove('tappable'); }
          setTimeout(res, 900);
        }
      };
    }
  });
}
const clPose = n => { CL.eli.src = 'img/' + n + '.webp'; };
async function clYay() { sfx('ding'); clPose('eli_jump'); await bounce(CL.eli, 1.12, 0.9); clPose('eli_hello'); }

async function colorScene() {
  await flash();
  clearStage();
  phase = 'color'; setLabel(T.colLabel);
  CL = { state: { mode: 'obj', shape: 'apple', eat: [], target: null, temp: [0, 0], lit: [] }, ps: [], n: 0, raf: 0, streaming: false };
  const root = CL.root = document.createElement('div'); root.id = 'cl'; stage.appendChild(root);
  const mk = (tag, cls, html = '') => { const e = document.createElement(tag); if (tag === 'button') e.type = 'button'; e.className = cls; e.innerHTML = html; root.appendChild(e); return e; };
  CL.cv = mk('canvas', 'clcv');
  CL.sun = mk('button', 'clobj', SUN); CL.obj = mk('div', 'clobj clthing'); CL.eye = mk('div', 'clobj', EYE);
  CL.balls = {}; for (const k of ['r', 'g', 'b']) { CL.balls[k] = mk('button', 'clball'); CL.balls[k].style.setProperty('--bc', RGB_CSS[k]); CL.balls[k].setAttribute('aria-label', k); }
  CL.shirts = mk('div', 'clshirts');
  CL.screen = mk('div', 'clscreen'); CL.dots = {};
  for (const k of ['r', 'g', 'b']) { const d = document.createElement('button'); d.type = 'button'; d.className = 'cldot'; d.style.setProperty('--bc', RGB_CSS[k]); d.setAttribute('aria-label', k); CL.screen.appendChild(d); CL.dots[k] = d; }
  CL.swatch = mk('div', 'clswatch'); CL.sample = mk('div', 'clsample');
  CL.eli = sprite('eli_hello', 'front'); CL.eli.addEventListener('click', () => talkTap());
  colRender();
  await unflash();

  // 1) почему предметы цветные
  colStream(true);
  for (const t of T.colIntro) await say(t);
  for (let i = 0; i < COL_TASKS.length; i++) {
    const t = COL_TASKS[i];
    Object.assign(CL.state, { shape: t.shape, eat: t.id === 'white' ? ['r', 'g', 'b'] : [], target: null }); colRender();
    await say(T.colMake[t.id], { next: false });
    if (i === 0) await say(T.colChoose, { next: false });
    hideSay();
    await colTask(t);
    await clYay();
    await say(T.colWhy[t.id]);
  }
  // 2) футболки на солнце
  colStream(false);
  await flash(); Object.assign(CL.state, { mode: 'heat', target: null, eat: [], temp: [0, 0] }); colRender(); await unflash();
  for (const t of T.colHeat) await say(t, { next: false });
  hideSay();
  await tapObj(CL.sun);
  colStream(true);
  for (let i = 1; i <= 40; i++) { CL.state.temp = [i / 40 * 0.85, i / 40 * 0.3]; colRender(); await wait(120); }   // чёрная греется сильнее
  colStream(false);
  await say(T.colHeatEnd);
  // 3) экран телефона
  await flash(); Object.assign(CL.state, { mode: 'screen', target: null }); colRender(); await unflash();
  for (const t of T.colScreen) await say(t, { next: false });
  hideSay();
  for (const t of SCREEN_TASKS) { await screenTask(t); await clYay(); }
  Object.assign(CL.state, { target: null }); colRender();
  await say(T.colScreenEnd);
  await say(T.colWin);
  await say(T.fireBye);
  await eliVanish(CL.eli);
}


/* ===================== ГЛАВА «НЕВИДИМЫЙ СВЕТ» ===================== */
/* Ультрафиолет (наш «невидимый» фотон) — самый сильный.
   1) Лесенка: невидимый фотон подбрасывает Эли высоко; Эли немного съезжает вниз (часть энергии уходит в тепло)
      и спрыгивает с цветным (зелёным) фотоном — «вошёл невидимый, вышел цветной» (флуоресценция; выходящий фотон
      всегда слабее входящего).
   2) Тёмная комната с ультрафиолетовой лампой: светятся рисунок фломастером-маркером и наклейки-звёздочки,
      яблоко и камень — нет. Лампу выключили: маркер гаснет сразу (флуоресценция), звёздочки светятся ещё долго
      (фосфоресценция: электроны «застревают» наверху и спрыгивают медленно). В маркерах и наклейках светятся
      особые молекулы, а не водород.
   3) Пляж: солнце шлёт и цветные, и невидимые фотоны; невидимые обжигают кожу (солнечный ожог — от ультрафиолета).
      Ребёнок ловит невидимые фотоны, потом мажет крем: крем поглощает ультрафиолет (минеральный — ещё и рассеивает). */
const UV_ROOM = [                                // предметы в тёмной комнате: светятся ли под лампой
  { id: 'marker', glow: '#7dff6a', x: 0.2 }, { id: 'stars', glow: '#d8ff6a', x: 0.45 },
  { id: 'apple', glow: null, x: 0.7 }, { id: 'rock', glow: null, x: 0.9 },
];
const UV_SVG = {
  marker: c => `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round">`
    + '<circle cx="50" cy="38" r="12"/><path d="M50 50 V90 M50 70 Q34 60 26 66 M50 76 Q66 66 74 72"/>'
    + [0, 1, 2, 3, 4, 5].map(i => { const a = i * Math.PI / 3; return `<circle cx="${50 + Math.cos(a) * 22}" cy="${38 + Math.sin(a) * 22}" r="8"/>`; }).join('') + '</g></svg>',
  stars: c => '<svg viewBox="0 0 100 100" aria-hidden="true">' + [[30, 30, 18], [70, 44, 14], [40, 72, 16]].map(([x, y, r]) =>
    `<polygon fill="${c}" points="${[...Array(10)].map((_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return (x + Math.cos(a) * rr) + ',' + (y + Math.sin(a) * rr); }).join(' ')}"/>`).join('') + '</svg>',
  apple: c => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="47" y="12" width="6" height="18" rx="3" fill="#5a3a20"/><path d="${COL_SHAPES.apple}" fill="${c}"/></svg>`,
  rock: c => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M14 74 Q10 50 30 40 Q46 22 66 34 Q90 40 88 66 Q86 84 60 84 L30 84 Q16 84 14 74 Z" fill="${c}"/></svg>`,
};
const UV_LAMP = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="34" width="76" height="26" rx="13" fill="#3b2f6e" stroke="#c9b8ff" stroke-width="3"/><rect class="tube" x="20" y="40" width="60" height="14" rx="7" fill="#5a4a8a"/><rect x="44" y="60" width="12" height="26" rx="4" fill="#6b7088"/></svg>';
const CREAM = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 18 H70 L76 84 Q50 92 24 84 Z" fill="#f3f5ff" stroke="#9aa0c8" stroke-width="3"/><rect x="38" y="6" width="24" height="14" rx="4" fill="#ffc53d"/><circle cx="50" cy="52" r="14" fill="#ffc53d"/></svg>';
let UV = null;

function uvPh(kind, cls = '') {                  // фотон-картинка (как в «Эли и свет»)
  const im = new Image(); im.src = `img/${PH[kind].img}.webp`; im.alt = ''; im.draggable = false; im.className = 'uvph ' + cls; UV.root.appendChild(im); return im;
}
function uvFly(el, x0, y0, x1, y1, ms, size) {   // фотон летит по прямой; → animation
  Object.assign(el.style, { width: size + 'px', height: size + 'px' });
  return el.animate([{ transform: `translate(${x0 - size / 2}px,${y0 - size / 2}px)` }, { transform: `translate(${x1 - size / 2}px,${y1 - size / 2}px)` }],
    { duration: ms * K, easing: 'linear', fill: 'forwards' });
}
const uvPose = n => { UV.eli.src = 'img/' + n + '.webp'; };

/* --- 1) лесенка --- */
async function uvLadder() {
  const x0 = W * 0.22, x1 = W * 0.78, yG = H * 0.66, yM = H * 0.42, yT = H * 0.3, ph = L.eli * 0.4;
  UV.root.insertAdjacentHTML('beforeend', `<svg class="uvlad" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">`
    + [[yG, '#9aa0c8'], [yM, '#7dff6a'], [yT, '#e9e2ff']].map(([y, c]) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity=".85"/>`).join('') + '</svg>');
  const e = UV.eli, ey = y => y - 6 - e._b * 0.42;
  setB(e, L.eli * 0.85); put(e, W / 2, ey(yG));
  await say(T.uvLadder[0], { next: false });
  const p = uvPh('uv'); await uvFly(p, -ph, ey(yG), W / 2, ey(yG), 1400, ph).finished.catch(() => {}); p.remove();
  sfx('rise'); uvPose('eli_jump'); await go(e, { y: ey(yT), ms: 600 }); uvPose('eli_full');
  await say(T.uvLadder[1], { next: false });
  for (let i = 0; i < 8; i++) { const s = document.createElement('div'); s.className = 'spark'; s.style.background = '#ff8a3d'; UV.root.appendChild(s);
    const a = Math.random() * Math.PI * 2;
    s.animate([{ transform: `translate(${W / 2}px,${ey(yT)}px)`, opacity: 1 }, { transform: `translate(${W / 2 + Math.cos(a) * 60}px,${ey(yT) + Math.sin(a) * 60}px)`, opacity: 0 }], { duration: 700 * K }).finished.then(() => s.remove()); }
  await go(e, { y: ey(yM), ms: 700 });
  await say(T.uvLadder[2], { next: false });
  sfx('fall'); uvPose('eli_blow');
  const g = uvPh('green'); uvFly(g, W / 2, ey(yM), W + ph, ey(yM) - 40, 1500, ph).finished.then(() => g.remove());
  await go(e, { y: ey(yG), ms: 500 }); uvPose('eli_hello');
  await say(T.uvLadder[3]);
  UV.root.querySelector('.uvlad').remove();
}

/* --- 2) тёмная комната --- */
function uvRoomRender() {
  const s = Math.min(W * 0.2, H * 0.12);
  UV_ROOM.forEach(o => {
    const el = UV.items[o.id], lit = UV.on && o.glow || (o.id === 'stars' && UV.after);
    el.innerHTML = UV_SVG[o.id](lit ? o.glow : (o.id === 'apple' ? '#4a2a34' : '#2c2f4a'));
    el.classList.toggle('lit', !!lit);
    Object.assign(el.style, { left: W * o.x - s / 2 + 'px', top: H * 0.56 - s / 2 + 'px', width: s + 'px', height: s + 'px' });
  });
  const a = Math.max(60, Math.min(W * 0.26, H * 0.12));
  Object.assign(UV.lamp.style, { left: W / 2 - a / 2 + 'px', top: H * 0.2 - a / 2 + 'px', width: a + 'px', height: a + 'px' });
  UV.lamp.querySelector('.tube').setAttribute('fill', UV.on ? '#b48cff' : '#5a4a8a');
  UV.glowBg.style.opacity = UV.on ? 1 : 0;
}
async function uvRoom() {
  UV.inRoom = true;
  UV.items = {};
  for (const o of UV_ROOM) { const b = document.createElement('button'); b.type = 'button'; b.className = 'uvitem'; UV.root.appendChild(b); UV.items[o.id] = b; }
  UV.lamp = document.createElement('button'); UV.lamp.type = 'button'; UV.lamp.className = 'uvitem'; UV.lamp.innerHTML = UV_LAMP; UV.root.appendChild(UV.lamp);
  UV.glowBg = document.createElement('div'); UV.glowBg.className = 'uvglow'; UV.root.appendChild(UV.glowBg);
  UV.on = false; UV.after = false; uvRoomRender();
  setB(UV.eli, L.eli * 0.85); put(UV.eli, W * 0.86, H * 0.86);
  await say(T.uvRoom, { next: false }); hideSay();
  await tapObj(UV.lamp); UV.on = true; sfx('buzz'); uvRoomRender(); await wait(700);
  await say(T.uvFind, { next: false }); hideSay();
  const left = new Set(UV_ROOM.filter(o => o.glow).map(o => o.id));
  await new Promise(res => {
    for (const o of UV_ROOM) {
      const el = UV.items[o.id];
      if (o.glow) el.classList.add('tappable');
      el.onclick = () => {
        if (!o.glow) { sfx('oops'); el.animate([0, -8, 8, -6, 6, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 500 * K }); return; }
        if (!left.delete(o.id)) return;
        sfx('ding'); el.classList.remove('tappable');
        el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 500 * K });
        if (!left.size) { for (const x in UV.items) UV.items[x].onclick = null; setTimeout(res, 700); }
      };
    }
  });
  await say(T.uvOff, { next: false }); hideSay();
  await tapObj(UV.lamp); UV.on = false; UV.after = true; sfx('pop'); uvRoomRender();
  await wait(900);
  for (const t of T.uvAfter) await say(t);
  await UV.items.stars.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: 2500 * K, fill: 'forwards' }).finished.catch(() => {});   // звёздочки медленно гаснут
  for (const x in UV.items) UV.items[x].remove(); UV.lamp.remove(); UV.glowBg.remove(); UV.inRoom = false;
}

/* --- 3) пляж --- */
function uvBeachLayout() {
  const a = Math.max(56, Math.min(W * 0.17, H * 0.09, 84));
  UV.sun.style.cssText = `left:${W * 0.8 - a * 0.7}px;top:${H * 0.18 - a * 0.7}px;width:${a * 1.4}px;height:${a * 1.4}px`;
  UV.cream.style.cssText = `left:${W * 0.16 - a / 2}px;top:${H * 0.86 - a / 2}px;width:${a}px;height:${a}px`;
  UV.sand.style.top = H * 0.8 + 'px';
  setB(UV.eli, L.eli); put(UV.eli, W * 0.45, H * 0.72);
  UV.shield.style.cssText = `left:${W * 0.45 - L.eli * 0.75}px;top:${H * 0.72 - L.eli * 0.75}px;width:${L.eli * 1.5}px;height:${L.eli * 1.5}px`;
}
function uvShot(uvOnly = null) {                 // один фотон от солнца к Эли; → промис: 'hit' | 'caught' | 'bounced' | 'color'
  const kind = uvOnly ?? (Math.random() < 0.55 ? 'uv' : ['red', 'green', 'yellow', 'cyan'][Math.floor(Math.random() * 4)]);
  const ph = L.eli * 0.42, x0 = W * 0.8, y0 = H * 0.18, x1 = W * 0.45 + (Math.random() - 0.5) * L.eli * 0.4, y1 = H * 0.72 - L.eli * 0.1;
  const el = uvPh(kind, kind === 'uv' ? 'uvbad' : '');
  const an = uvFly(el, x0, y0, x1, y1, 2400, ph);
  return new Promise(res => {
    if (kind === 'uv' && UV.catching) el.onclick = () => { const tr = getComputedStyle(el).transform; an.cancel(); el.onclick = null; sfx('pop');
      el.style.transform = tr; el.animate([{ opacity: 1 }, { opacity: 0, filter: 'blur(6px)' }], { duration: 300 * K }).finished.then(() => el.remove()); res('caught'); };
    an.finished.then(() => {
      if (kind !== 'uv') { el.remove(); res('color'); return; }
      if (UV.shielded) {                         // крем: невидимый фотон не доходит до кожи
        sfx('boing'); uvFly(el, x1, y1, x1 + (Math.random() - 0.5) * W, -40, 900, ph).finished.then(() => el.remove()); res('bounced'); return;
      }
      el.remove(); UV.burn = Math.min(1, UV.burn + 0.2); UV.eli.style.filter = `hue-rotate(${150 * UV.burn}deg) saturate(${1 + UV.burn})`;   // голубой Эли краснеет: голубой → сиреневый → розово-красный
      sfx('buzz'); res('hit');
    }).catch(() => {});
  });
}
async function uvBeach() {
  UV.sand = document.createElement('div'); UV.sand.className = 'uvsand'; UV.root.appendChild(UV.sand);
  UV.sun = document.createElement('div'); UV.sun.className = 'uvitem'; UV.sun.innerHTML = SUN; UV.root.appendChild(UV.sun);
  UV.cream = document.createElement('button'); UV.cream.type = 'button'; UV.cream.className = 'uvitem'; UV.cream.innerHTML = CREAM; UV.root.appendChild(UV.cream);
  UV.shield = document.createElement('div'); UV.shield.className = 'uvshield'; UV.shield.hidden = true; UV.root.appendChild(UV.shield);
  UV.burn = 0; UV.shielded = false; UV.catching = false; UV.inBeach = true; uvBeachLayout();
  for (const t of T.uvBeach) await say(t);
  await Promise.all([0, 1, 2].map(async i => { await wait(i * 500); return uvShot('uv'); }));   // без крема: обожглись
  uvPose('eli_surprised'); await say(T.uvBurn); uvPose('eli_hello');
  await say(T.uvCatch, { next: false }); hideSay();
  UV.catching = true;
  let caught = 0;
  while (caught < 8) {                           // ловим 8 невидимых; цветные пусть летят
    const shots = [uvShot(), wait(350).then(() => uvShot())];
    const rs = await Promise.all(shots);
    caught += rs.filter(r => r === 'caught').length;
  }
  UV.catching = false; await wait(1500);
  await say(T.uvCream, { next: false }); hideSay();
  await tapObj(UV.cream);
  UV.shielded = true; UV.shield.hidden = false; sfx('sparkle');
  UV.burn = 0; UV.eli.style.filter = '';
  for (let i = 0; i < 6; i++) { uvShot(i % 2 ? null : 'uv'); await wait(450); }
  await wait(2000);
  await say(T.uvSafe);
}

async function uvScene() {
  await flash();
  clearStage();
  phase = 'uv'; setLabel(T.uvLabel);
  UV = {};
  UV.root = document.createElement('div'); UV.root.id = 'uv'; stage.appendChild(UV.root);
  UV.eli = sprite('eli_hello', 'front'); UV.eli.addEventListener('click', () => talkTap());
  setB(UV.eli, L.eli * 0.85); put(UV.eli, W * 0.86, H * 0.86);
  await unflash();
  for (const t of T.uvIntro) await say(t);
  await uvLadder();
  await flash(); setB(UV.eli, L.eli * 0.85); put(UV.eli, W * 0.86, H * 0.86); await unflash();
  await uvRoom();
  await flash(); await unflash();
  await uvBeach();
  await say(T.uvWin);
  await say(T.fireBye);
  await eliVanish(UV.eli);
}
function uvRelayout() { if (!UV) return; if (UV.inRoom) uvRoomRender(); if (UV.inBeach) uvBeachLayout(); }


/* ===================== ГЛАВА «НЕБО» ===================== */
/* 1) Северное сияние: частицы от Солнца ударяют атомы воздуха и подбрасывают их электроны (здесь толчок — удар
      частицы, а не фотон); спрыгивая, электроны светятся. Кислород очень высоко (выше ~200 км) — красный 630,0 нм,
      кислород ниже (~100–250 км) — зелёный 557,7 нм, азот у нижнего края — сине-фиолетовый 427,8 нм.
      Ребёнок нажимает на высоты неба и раскрашивает сияние как на картинке.
   2) Звёздный детектив: в радуге звезды тёмные линии — атомы звезды глотают свои цвета (глотание из «Эли и свет»).
      Ребёнок выбирает штрихкоды атомов и находит, из чего звезда: Солнце — водород и натрий (линии Фраунгофера C, F и D),
      горячая голубая звезда — водород и гелий, белая звезда — водород.
      Факт: гелий нашли в 1868 году по жёлтой линии в свете Солнца (в протуберанцах, яркая линия 587,6 нм),
      на Земле — только в 1895. Линии гелия здесь: 447, 502, 588, 668 нм. */
const SKY_BANDS = [                              // сверху вниз: доли высоты экрана, цвет
  { id: 'red', y0: 0.12, y1: 0.24, c: '#ff4a5a' }, { id: 'green', y0: 0.24, y1: 0.42, c: '#5dff8a' }, { id: 'violet', y0: 0.42, y1: 0.5, c: '#9b6bff' },
];
const SKY_TASKS = [['green'], ['red', 'green'], ['green', 'violet'], ['red', 'green', 'violet']];
const STAR_ATOMS = { h: { lines: [656, 486, 434], c: '#f3f5ff' }, na: { lines: [589], c: '#b46bff' }, he: { lines: [447, 502, 588, 668], c: '#5fe3ff' } };
const STAR_TASKS = [{ star: '#ffd86b', atoms: ['h', 'na'], after: 'skySunDone' }, { star: '#a9d4ff', atoms: ['h', 'he'], after: 'skyHe' }, { star: '#f6f4ff', atoms: ['h'] }];
let SK = null;

function skyRender() {
  if (!SK) return;
  const S = SK.state, parts = [];
  SK.svg.setAttribute('viewBox', `0 0 ${W} ${H}`); SK.svg.setAttribute('width', W); SK.svg.setAttribute('height', H);
  if (S.mode === 'aurora') {
    for (let i = 0; i < 40; i++) parts.push(`<circle cx="${W * ((i * 0.618) % 1)}" cy="${H * 0.55 * ((i * 0.382 + i * i * 0.013) % 1)}" r="1.4" fill="#fff" opacity=".7"/>`);
    for (const b of SKY_BANDS) if (S.on.includes(b.id)) {   // занавес сияния: волнистые полосы с мягким краем
      const h0 = (b.y1 - b.y0) * H, y0 = H * b.y0 - h0 * 0.35, y1 = H * b.y1 + h0 * 0.35, xa = -W * 0.15, xb = W * 1.15, st = (xb - xa) / 8;   // полосы заходят друг на друга
      parts.push(`<defs><linearGradient id="sg${b.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b.c}" stop-opacity="0"/><stop offset=".55" stop-color="${b.c}" stop-opacity=".7"/><stop offset="1" stop-color="${b.c}" stop-opacity="0"/></linearGradient></defs>`);
      let d = `M ${xa} ${y1}`;
      for (let x = xa; x < xb - 1; x += st) d += ` Q ${x + st / 2} ${y1 - (y1 - y0) * 0.25} ${x + st} ${y1}`;
      d += ` L ${xb} ${y0} `;
      for (let x = xb; x > xa + 1; x -= st) d += ` Q ${x - st / 2} ${y0 + (y1 - y0) * 0.2} ${x - st} ${y0}`;
      parts.push(`<path class="skyc" d="${d} Z" fill="url(#sg${b.id})"/>`);
    }
    parts.push(`<path d="M0 ${H * 0.78} L${W * 0.18} ${H * 0.6} L${W * 0.32} ${H * 0.72} L${W * 0.5} ${H * 0.55} L${W * 0.68} ${H * 0.7} L${W * 0.84} ${H * 0.58} L${W} ${H * 0.74} L${W} ${H} L0 ${H} Z" fill="#1b2140"/>`
      + `<path d="M${W * 0.44} ${H * 0.6} L${W * 0.5} ${H * 0.55} L${W * 0.56} ${H * 0.6} Z M${W * 0.8} ${H * 0.61} L${W * 0.84} ${H * 0.58} L${W * 0.88} ${H * 0.62} Z" fill="#e8ecff"/>`);
  } else if (S.mode === 'star' && S.task) {
    const sx0 = W * 0.08, sx1 = W * 0.92, sy = H * 0.38, sh = Math.max(34, H * 0.05), xl = l => sx0 + (l - 400) / 300 * (sx1 - sx0);
    const r = Math.min(W * 0.12, H * 0.07);
    parts.push(`<defs><radialGradient id="stg"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="${S.task.star}"/><stop offset="1" stop-color="${S.task.star}" stop-opacity="0"/></radialGradient></defs>`
      + `<circle cx="${W / 2}" cy="${H * 0.2}" r="${r * 1.6}" fill="url(#stg)"/>`);
    for (let l = 400; l < 700; l += 3) parts.push(`<rect x="${xl(l)}" y="${sy}" width="${xl(l + 3) - xl(l) + 0.6}" height="${sh}" fill="${wl2rgb(l)}"/>`);
    for (const a of S.task.atoms) for (const l of STAR_ATOMS[a].lines) parts.push(`<rect x="${xl(l) - 2.5}" y="${sy}" width="5" height="${sh}" fill="#05060f"/>`);
    parts.push(`<rect x="${sx0}" y="${sy}" width="${sx1 - sx0}" height="${sh}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" rx="4"/>`);
  }
  SK.svg.innerHTML = parts.join('');
  // карточки атомов: шарик и его яркие линии
  const cw = Math.min(W * 0.27, 150), ch = Math.min(H * 0.15, 120);
  for (const [i, k] of ['h', 'na', 'he'].entries()) {
    const c = SK.cards[k]; c.hidden = S.mode !== 'star';
    Object.assign(c.style, { left: W * (0.2 + i * 0.3) - cw / 2 + 'px', top: H * 0.66 - ch / 2 + 'px', width: cw + 'px', height: ch + 'px' });
    c.classList.toggle('on', S.pick.includes(k));
  }
  setB(SK.eli, L.eli * 0.85); put(SK.eli, W * 0.86, H * 0.88, SK.eli._k ?? 1);
  SK.sample.hidden = !(S.mode === 'aurora' && S.target);
  if (S.mode === 'aurora' && S.target) {
    const q = Math.min(W * 0.28, H * 0.16);
    Object.assign(SK.sample.style, { left: W - 16 - q + 'px', top: H * 0.56 + 'px', width: q + 'px', height: q * 0.7 + 'px' });
    SK.sample.innerHTML = SKY_BANDS.map(b => `<i style="background:${S.target.includes(b.id) ? b.c : 'transparent'};flex:${(b.y1 - b.y0) * 10}"></i>`).join('');
  }
  for (const b of SKY_BANDS) {
    const el = SK.hits[b.id]; el.hidden = S.mode !== 'aurora';
    Object.assign(el.style, { top: H * b.y0 + 'px', height: H * (b.y1 - b.y0) + 'px' });
  }
}
function cardHtml(k) {                           // шарик атома и его штрихкод (яркие линии на тёмном)
  const ls = STAR_ATOMS[k].lines.map(l => `<rect x="${4 + (l - 400) / 300 * 92 - 1.6}" y="0" width="3.2" height="22" fill="${wl2rgb(l)}"/>`).join('');
  return `<span class="skball" style="--bc:${STAR_ATOMS[k].c}"></span><svg viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="22" rx="3" fill="#05060f"/>${ls}</svg>`;
}
function skyAuroraTask(t) {
  const S = SK.state; Object.assign(S, { on: [], target: t }); skyRender();
  return new Promise(res => {
    for (const b of SKY_BANDS) {
      const el = SK.hits[b.id]; el.classList.add('call');
      el.onclick = () => {
        S.on = S.on.includes(b.id) ? S.on.filter(x => x !== b.id) : [...S.on, b.id];
        sfx(S.on.includes(b.id) ? 'sparkle' : 'pop'); skyRender();
        if (S.on.length === t.length && t.every(x => S.on.includes(x))) {
          for (const x in SK.hits) { SK.hits[x].onclick = null; SK.hits[x].classList.remove('call'); }
          setTimeout(res, 1000);
        }
      };
    }
  });
}
function skyStarTask(t) {
  const S = SK.state; Object.assign(S, { mode: 'star', task: t, pick: [] }); skyRender();
  return new Promise(res => {
    for (const k in SK.cards) {
      const c = SK.cards[k]; c.classList.add('tappable');
      c.onclick = () => {
        S.pick = S.pick.includes(k) ? S.pick.filter(x => x !== k) : [...S.pick, k];
        sfx('tap'); if (S.pick.includes(k)) playVoice(T.elementsSky[k] + '.', true);
        skyRender();
        if (S.pick.length === t.atoms.length && t.atoms.every(x => S.pick.includes(x))) {
          for (const x in SK.cards) { SK.cards[x].onclick = null; SK.cards[x].classList.remove('tappable'); }
          setTimeout(res, 900);
        }
      };
    }
  });
}
const skPose = n => { SK.eli.src = 'img/' + n + '.webp'; };
async function skYay() { sfx('ding'); skPose('eli_jump'); await bounce(SK.eli, 1.12, 0.9); skPose('eli_hello'); }

async function skyScene() {
  await flash();
  clearStage();
  phase = 'sky'; setLabel(T.skyLabel);
  SK = { state: { mode: 'aurora', on: ['green'], target: null, task: null, pick: [] } };
  SK.root = document.createElement('div'); SK.root.id = 'sky'; stage.appendChild(SK.root);
  SK.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); SK.svg.id = 'skysvg'; SK.root.appendChild(SK.svg);
  SK.hits = {};
  for (const b of SKY_BANDS) { const e = document.createElement('button'); e.type = 'button'; e.className = 'skhit'; e.setAttribute('aria-label', b.id); SK.root.appendChild(e); SK.hits[b.id] = e; }
  SK.cards = {};
  for (const k of ['h', 'na', 'he']) { const e = document.createElement('button'); e.type = 'button'; e.className = 'skcard'; e.innerHTML = cardHtml(k); e.setAttribute('aria-label', T.elementsSky[k]); SK.root.appendChild(e); SK.cards[k] = e; }
  SK.sample = document.createElement('div'); SK.sample.className = 'sksample'; SK.root.appendChild(SK.sample);
  SK.eli = sprite('eli_hello', 'front'); SK.eli.addEventListener('click', () => talkTap());
  skyRender();
  await unflash();

  for (const t of T.skyIntro) await say(t);
  for (const t of T.skyWhy) await say(t);
  for (const [i, t] of T.skyAtoms.entries()) {   // показываем каждую высоту по очереди
    SK.state.on = [['red', 'green', 'violet'][i]]; skyRender(); sfx('sparkle');
    await say(t);
  }
  await say(T.skyPaint, { next: false }); hideSay();
  for (const t of SKY_TASKS) { await skyAuroraTask(t); await skYay(); }
  SK.state.target = null; skyRender();

  await flash(); Object.assign(SK.state, { mode: 'star', task: STAR_TASKS[0], pick: [] }); skyRender(); await unflash();
  for (const t of T.skyStars) await say(t);
  await say(T.skyFind, { next: false }); hideSay();
  for (const t of STAR_TASKS) {
    await skyStarTask(t); await skYay();
    if (t.after) await say(T[t.after]);
  }
  await say(T.skyWin);
  await say(T.fireBye);
  await eliVanish(SK.eli);
}


/* ===================== ГЛАВА «ВЕЩЕСТВА» =====================
   Сама глава — в js/chem.js (атомы с ручками из проб чата). Здесь — цвета атомов и карточки веществ для «Реакций». */
const CH_ATOMS = {                              // цвета атомов (как в химии) — шарики «Реакций»
  H: { c: '#f3f5ff', r: 0.55, v: 1 }, C: { c: '#4a4f66', r: 0.8, v: 4 }, O: { c: '#ff4a4a', r: 0.8, v: 6 },
  Na: { c: '#b46bff', r: 0.95, v: 1 }, Cl: { c: '#45e36a', r: 0.95, v: 7 },
};
const CH_ICON = {                                // карточки веществ
  salt: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 14 L84 32 L84 70 L50 88 L16 70 L16 32 Z" fill="#f3f5ff"/><path d="M50 14 L84 32 L50 50 L16 32 Z" fill="#fff"/><path d="M50 50 L84 32 L84 70 L50 88 Z" fill="#c9cfee"/></svg>',
  acid: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M40 10 H60 V36 L82 82 Q84 90 74 90 H26 Q16 90 18 82 L40 36 Z" fill="rgba(220,235,255,.25)" stroke="#dff3ff" stroke-width="4"/><path d="M28 64 H72 L80 82 Q81 86 74 86 H26 Q19 86 20 82 Z" fill="#b6ff6a"/></svg>',
  water: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10 Q76 46 76 62 A26 26 0 0 1 24 62 Q24 46 50 10 Z" fill="#4fb6ff"/><ellipse cx="40" cy="58" rx="6" ry="10" fill="#fff" opacity=".6"/></svg>',
  bleach: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="40" y="8" width="20" height="12" rx="3" fill="#3d6bff"/><path d="M34 20 H66 Q78 28 78 44 V86 Q78 92 72 92 H28 Q22 92 22 86 V44 Q22 28 34 20 Z" fill="#f3f5ff"/><rect x="30" y="48" width="40" height="24" rx="5" fill="#3d6bff"/></svg>',
  soda: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="22" y="20" width="56" height="64" rx="6" fill="#ff8a3d"/><rect x="30" y="34" width="40" height="22" rx="4" fill="#f3f5ff"/><path d="M14 92 Q50 70 86 92 Z" fill="#f3f5ff"/></svg>',
  vinegar: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="42" y="6" width="16" height="14" rx="3" fill="#7a4a24"/><path d="M40 20 H60 V34 Q74 40 74 54 V86 Q74 92 68 92 H32 Q26 92 26 86 V54 Q26 40 40 34 Z" fill="rgba(255,214,140,.55)" stroke="#ffe0a8" stroke-width="3"/><circle cx="50" cy="66" r="12" fill="#ff4a4a"/><rect x="49" y="50" width="3" height="6" fill="#7a4a24"/></svg>',
};
const chemScene = () => CHEM.scene();


/* ===================== ГЛАВА «РЕАКЦИИ» ===================== */
/* Пять коротких уровней, в каждом — одно-два нажатия.
   1) Растворяем: соль в воде распадается на Na⁺ и Cl⁻; сахар остаётся целыми молекулами.
   2) Огонь: метан CH₄ + 2 O₂ → CO₂ + 2 H₂O; атомы не исчезают и не появляются — только меняются местами
      (счёт до и после одинаковый: 1 C, 4 H, 4 O).
   3) Пузырьки: сода + уксус → углекислый газ (пузырьки), вода и ацетат натрия (его не показываем).
   4) Красная капуста: сок фиолетовый; с уксусом (кислота) — красный/розовый, с содой (слабая щёлочь) — бирюзовый
      (с сильной щёлочью был бы зелёно-жёлтым), с водой — остаётся фиолетовым.
   5) Ржавчина: железо + кислород + вода → ржавчина; гвоздь в доме (сухо) не ржавеет, под дождём — ржавеет. */
const GLASS = (liq, lvl = 0.62) => `<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M18 8 H82 L74 112 H26 Z" fill="rgba(220,235,255,.12)" stroke="#dff3ff" stroke-width="3"/>`
  + `<path d="M${18 + 8 * (1 - lvl)} ${112 - 104 * lvl} H${82 - 8 * (1 - lvl)} L74 112 H26 Z" fill="${liq}" opacity=".85"/></svg>`;
const BOTTLE = (c, lab) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="42" y="6" width="16" height="14" rx="3" fill="#9aa0c8"/><path d="M40 20 H60 V32 Q74 38 74 52 V86 Q74 92 68 92 H32 Q26 92 26 86 V52 Q26 38 40 32 Z" fill="${c}" stroke="#dff3ff" stroke-width="3"/>${lab}</svg>`;
const SPOON = c => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 80 L56 44" stroke="#c9cfee" stroke-width="8" stroke-linecap="round"/><ellipse cx="66" cy="34" rx="22" ry="16" fill="#c9cfee" transform="rotate(-45 66 34)"/><ellipse cx="66" cy="32" rx="14" ry="9" fill="${c}" transform="rotate(-45 66 32)"/></svg>`;
const NAIL = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="22" y="12" width="56" height="10" rx="4" fill="currentColor"/><path d="M44 22 H56 V80 L50 94 L44 80 Z" fill="currentColor"/></svg>';
const CLOCK = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="#f3f5ff" stroke="#9aa0c8" stroke-width="5"/><line class="hm" x1="50" y1="50" x2="50" y2="22" stroke="#1b1e4a" stroke-width="5" stroke-linecap="round"/><line class="hh" x1="50" y1="50" x2="68" y2="50" stroke="#1b1e4a" stroke-width="6" stroke-linecap="round"/></svg>';
const BURNER = '<svg viewBox="0 0 100 60" aria-hidden="true"><rect x="10" y="40" width="80" height="14" rx="6" fill="#6b7088"/><ellipse cx="50" cy="40" rx="30" ry="7" fill="#9aa0c8"/><path class="fl" d="M30 38 Q34 14 40 30 Q44 6 50 28 Q56 6 60 30 Q66 14 70 38 Z" fill="#4fb6ff" opacity="0"/></svg>';
let RX = null;

function rxEl(cls, html = '', button = false) {
  const e = document.createElement(button ? 'button' : 'div'); if (button) e.type = 'button';
  e.className = 'rxo ' + cls; e.innerHTML = html; RX.root.appendChild(e); return e;
}
const rxPl = (e, x, y, w, h = w) => Object.assign(e.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
const rxA = () => Math.max(56, Math.min(W * 0.17, H * 0.09, 84));
function rxClear() { RX.root.innerHTML = ''; }
function rxBall(k, x, y, d, sign = '') {          // маленький шарик-атом (цвета — как в «Веществах»)
  const e = rxEl('rxball'); e.style.setProperty('--bc', CH_ATOMS[k].c); rxPl(e, x, y, d); if (sign) e.innerHTML = `<b>${sign}</b>`; return e;
}
function rxWander(e, r) {                         // частица бродит в стакане
  e.animate([0, 1, 2, 3, 0].map(i => ({ transform: `translate(${Math.sin(i * 2.1 + r) * 10}px,${Math.cos(i * 1.7 + r) * 8}px)` })),
    { duration: (2600 + r * 300) * K, iterations: Infinity, easing: 'ease-in-out' });
}

/* 1) растворяем */
async function rxDissolve() {
  rxClear();
  const gw = Math.min(W * 0.36, H * 0.24), gy = H * 0.44, a = rxA();
  const glasses = [W * 0.28, W * 0.72].map(x => { const g = rxEl('', GLASS('#4fb6ff55')); rxPl(g, x, gy, gw, gw * 1.2); return g; });
  const salt = rxEl('', SPOON('#f3f5ff'), true), sugar = rxEl('', SPOON('#ffe9c4'), true);
  rxPl(salt, W * 0.28, H * 0.8, a); rxPl(sugar, W * 0.72, H * 0.8, a);
  await say(T.rxDissolve[0], { next: false }); hideSay();
  await tapObj(salt); sfx('pop'); salt.remove();
  for (let i = 0; i < 5; i++) {                   // соль: пары распадаются на «+» и «−»
    const x = W * 0.28 + (i - 2) * gw * 0.14, y = gy + gw * 0.25 + (i % 2) * gw * 0.18;
    const na = rxBall('Na', x, y, a * 0.36, '+'), cl = rxBall('Cl', x + a * 0.36, y, a * 0.4, '−');
    await wait(150); rxWander(na, i); rxWander(cl, i + 2.5);
  }
  await wait(700);
  await say(T.rxDissolve[1], { next: false }); hideSay();
  await tapObj(sugar); sfx('pop'); sugar.remove();
  for (let i = 0; i < 4; i++) {                   // сахар: целые молекулы-колечки
    const e = rxEl('rxsug'); rxPl(e, W * 0.72 + (i - 1.5) * gw * 0.18, gy + gw * 0.22 + (i % 2) * gw * 0.2, a * 0.5);
    await wait(150); rxWander(e, i * 1.3);
  }
  await wait(700);
  await say(T.rxDissolve[2]);
  void glasses;
}

/* 2) огонь: атомы меняются местами */
async function rxFire() {
  rxClear();
  const a = rxA(), u = Math.min(W * 0.1, H * 0.06), cx = W / 2, cy = H * 0.4, d = { C: u * 1.1, H: u * 0.72, O: u * 1.1 };
  const burner = rxEl('', BURNER, true); rxPl(burner, cx, H * 0.78, a * 1.8, a * 1.1);
  const before = [['C', -1.6, 0], ['H', -2.4, 0], ['H', -0.8, 0], ['H', -1.6, -0.8], ['H', -1.6, 0.8], ['O', 0.9, -0.9], ['O', 1.7, -0.9], ['O', 0.9, 0.9], ['O', 1.7, 0.9]];
  const after = [['C', -1.3, 0], ['H', 0.6, -1.3], ['H', 1.8, -1.3], ['H', 0.6, 0.7], ['H', 1.8, 0.7], ['O', -2.1, 0], ['O', 1.2, -0.85], ['O', -0.5, 0], ['O', 1.2, 1.15]];
  const balls = before.map(([k, x, y]) => rxBall(k, cx + x * u, cy + y * u, d[k]));
  const count = rxEl('rxcount'); count.innerHTML = [['C', 1], ['H', 4], ['O', 4]].map(([k, n]) => `<span>${[...Array(n)].map(() => `<i style="--bc:${CH_ATOMS[k].c}"></i>`).join('')}</span>`).join('');
  Object.assign(count.style, { left: '16px', right: '16px', top: H * 0.13 + 'px' });
  await say(T.rxFire[0], { next: false }); hideSay();
  await tapObj(burner); burner.querySelector('.fl').setAttribute('opacity', '1'); sfx('whoosh');
  await Promise.all(balls.map(b => b.animate([0, -4, 4, -3, 3, 0].map(x => ({ transform: `translate(${x}px,${-x}px)` })), { duration: 700 * K }).finished.catch(() => {})));
  balls.forEach((b, i) => { b.style.transition = `left ${1.2 * K}s ease-in-out, top ${1.2 * K}s ease-in-out`;
    const [k, x, y] = after[i]; requestAnimationFrame(() => rxPl(b, cx + x * u, cy + y * u, d[k])); });
  sfx('sparkle'); await wait(1500);
  for (const t of T.rxFire.slice(1)) await say(t);
}

/* 3) пузырьки */
async function rxBubbles() {
  rxClear();
  const gw = Math.min(W * 0.42, H * 0.26), gx = W / 2, gy = H * 0.44, a = rxA();
  const g = rxEl('', GLASS('#ffe0a855')); rxPl(g, gx, gy, gw, gw * 1.2);
  const soda = rxEl('', CH_ICON.soda, true); rxPl(soda, W * 0.25, H * 0.8, a);
  await say(T.rxBubbles[0], { next: false }); hideSay();
  await tapObj(soda); sfx('pop');
  for (let i = 0; i < 26; i++) {                  // пузырьки углекислого газа поднимаются
    const b = rxEl('rxbub'), s = 8 + (i % 4) * 4, x = gx + (Math.sin(i * 2.3) * 0.32) * gw;
    rxPl(b, x, gy + gw * 0.5, s);
    b.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${-gw * 0.9}px)`, opacity: 0 }], { duration: (1400 + (i % 5) * 200) * K, delay: i * 90 * K, iterations: 3 });
  }
  if (soundOn()) for (let i = 0; i < 12; i++) sfx('pop', i * 160);
  await wait(1500);
  for (const t of T.rxBubbles.slice(1)) await say(t);
}

/* 4) красная капуста */
async function rxCabbage() {
  rxClear();
  const gw = Math.min(W * 0.42, H * 0.26), gx = W / 2, gy = H * 0.42, a = rxA();
  const g = rxEl('', GLASS('#8a3fd1')); rxPl(g, gx, gy, gw, gw * 1.2);
  const liquids = { vinegar: '#ff4f8b', soda: '#25c7c2', water: '#8a3fd1' };
  const bottles = {
    vinegar: rxEl('', CH_ICON.vinegar, true), soda: rxEl('', CH_ICON.soda, true),
    water: rxEl('', BOTTLE('rgba(79,182,255,.45)', ''), true),
  };
  ['vinegar', 'water', 'soda'].forEach((k, i) => rxPl(bottles[k], W * (0.2 + i * 0.3), H * 0.82, a));
  const setLiq = c => { g.innerHTML = GLASS(c); };
  for (const t of T.rxCabbage.slice(0, 2)) await say(t);
  for (const [want, phrase] of [['vinegar', T.rxCabRed], ['soda', T.rxCabTurq]]) {
    setLiq(liquids.water);
    await say(phrase, { next: false }); hideSay();
    for (;;) {
      const k = await new Promise(r => { for (const b in bottles) { bottles[b].classList.add('tappable'); bottles[b].onclick = () => r(b); } });
      for (const b in bottles) { bottles[b].classList.remove('tappable'); bottles[b].onclick = null; }
      sfx('pop'); setLiq(liquids[k]); await wait(1000);
      if (k === want) { sfx('ding'); break; }
      sfx('oops'); await say(T.rxCabWrong, { next: false }); hideSay(); setLiq(liquids.water);
    }
  }
  await say(T.rxCabbage[2]);
}

/* 5) ржавчина */
async function rxRust() {
  rxClear();
  const a = rxA();
  const house = rxEl('', '<svg viewBox="0 0 100 80" aria-hidden="true"><path d="M6 36 L50 6 L94 36 Z" fill="#ff8a3d"/><rect x="14" y="36" width="72" height="40" fill="rgba(243,245,255,.14)" stroke="#c9cfee" stroke-width="2"/></svg>');
  rxPl(house, W * 0.28, H * 0.45, W * 0.4, W * 0.32);
  const cloud = rxEl('', CLOUD); rxPl(cloud, W * 0.72, H * 0.24, a * 1.8, a * 1.1);
  for (let i = 0; i < 10; i++) { const r = rxEl('rxrain'); rxPl(r, W * (0.6 + (i % 5) * 0.05), H * (0.32 + Math.floor(i / 5) * 0.08), 3, 16);
    r.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(60px)', opacity: 0 }], { duration: 800 * K, delay: i * 80 * K, iterations: Infinity }); }
  const n1 = rxEl('rxnail', NAIL), n2 = rxEl('rxnail', NAIL);
  rxPl(n1, W * 0.28, H * 0.5, a); rxPl(n2, W * 0.72, H * 0.5, a);
  const clock = rxEl('', CLOCK, true); rxPl(clock, W / 2, H * 0.8, a);
  for (const t of T.rxRust.slice(0, 2)) await say(t);
  await say(T.rxRust[2], { next: false }); hideSay();
  await tapObj(clock);
  clock.querySelector('.hm').style.transformOrigin = '50px 50px';   // стрелка крутится — прошло много дней
  clock.querySelector('.hm').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(1440deg)' }], { duration: 2400 * K, easing: 'ease-in-out' });
  sfx('tick'); for (let i = 1; i < 10; i++) sfx('tick', i * 240);
  n2.animate([{ color: '#b9c0d8' }, { color: '#b5531c' }], { duration: 2400 * K, fill: 'forwards' });
  await wait(2600);
  for (const t of T.rxRust.slice(3)) await say(t);
}

async function reactScene() {
  await flash();
  clearStage();
  phase = 'react'; setLabel(T.rxLabel);
  RX = {};
  RX.root = document.createElement('div'); RX.root.id = 'rx'; stage.appendChild(RX.root);
  RX.eli = sprite('eli_hello', 'front'); RX.eli.addEventListener('click', () => talkTap());
  setB(RX.eli, L.eli * 0.8); put(RX.eli, W * 0.9, H * 0.66);
  await unflash();
  for (const t of T.rxIntro) await say(t);
  for (const lvl of [rxDissolve, rxFire, rxBubbles, rxCabbage, rxRust]) {
    await lvl();
    hideSay(); await flash(); await unflash();
  }
  await say(T.rxWin);
  await say(T.fireBye);
  await eliVanish(RX.eli);
}
function rxRelayout() { if (RX) { setB(RX.eli, L.eli * 0.8); put(RX.eli, W * 0.9, H * 0.66); } }


/* ===================== ГЛАВА «ЛИСТ ДЕЛАЕТ САХАР» ===================== */
/* Фотосинтез: 6 CO₂ + 6 H₂O + свет → C₆H₁₂O₆ (сахар) + 6 O₂.
   Ребёнок даёт листу свет (солнце: хлорофилл глотает красный и синий — как в главе «Цвет»), воду (6 капель от корней)
   и углекислый газ (6 молекул из воздуха). Лист делает сахар — он уходит в яблоко, яблоко растёт; кислород выходит
   в воздух (почти весь кислород, которым мы дышим, сделали растения). Круг замкнулся: молекула сахара из главы
   «Яблоко» сделана из воздуха и воды с помощью света. */
const LEAF_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M10 88 C10 40 44 10 90 10 C90 58 58 88 10 88 Z" fill="#3fbf55" stroke="#9ff2a8" stroke-width="2"/>'
  + '<path d="M14 84 Q50 50 86 14 M40 60 Q36 44 38 34 M56 44 Q64 40 74 40 M30 70 Q46 70 56 66" stroke="#2a8a3c" stroke-width="2.5" fill="none"/></svg>';
const DROP_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 Q80 50 80 64 A30 30 0 0 1 20 64 Q20 50 50 8 Z" fill="#4fb6ff"/><ellipse cx="40" cy="60" rx="6" ry="10" fill="#fff" opacity=".6"/></svg>';
const CO2_SVG = '<svg viewBox="0 0 100 50" aria-hidden="true"><circle cx="20" cy="25" r="16" fill="#ff4a4a"/><circle cx="50" cy="25" r="18" fill="#4a4f66"/><circle cx="80" cy="25" r="16" fill="#ff4a4a"/></svg>';
const O2_SVG = '<svg viewBox="0 0 100 50" aria-hidden="true"><circle cx="34" cy="25" r="18" fill="#ff4a4a"/><circle cx="66" cy="25" r="18" fill="#ff4a4a"/></svg>';
const SUGAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="#ffe9c4" stroke-width="9" stroke-linejoin="round"/><circle cx="50" cy="10" r="7" fill="#ff4a4a"/></svg>';
let LF = null;

function lfEl(cls, html = '', button = false) {
  const e = document.createElement(button ? 'button' : 'div'); if (button) e.type = 'button';
  e.className = 'lfo ' + cls; e.innerHTML = html; LF.root.appendChild(e); return e;
}
const lfPl = (e, x, y, w, h = w) => Object.assign(e.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
function lfGeo() {
  const s = Math.min(W * 0.46, H * 0.26);
  return { s, lx: W * 0.55 - 0.4 * s, ly: H * 0.5 - 0.38 * s,   // черешок листа — на верхушке ствола
    sunX: W * 0.15, sunY: H * 0.17, ax: W * 0.76, ay: H * 0.5, groundY: H * 0.84, a: Math.max(48, Math.min(W * 0.13, H * 0.07, 70)) };
}
function lfLayout() {
  if (!LF) return;
  const g = lfGeo();
  lfPl(LF.leaf, g.lx, g.ly, g.s); lfPl(LF.sun, g.sunX, g.sunY, g.a * 1.4);
  lfPl(LF.apple, g.ax, g.ay, g.a * (0.5 + LF.appleK * 0.7));
  Object.assign(LF.trunk.style, { left: W * 0.55 - 7 + 'px', top: H * 0.5 + 'px', width: '14px', height: g.groundY - H * 0.5 + 'px' });
  Object.assign(LF.branch.style, { left: W * 0.55 + 'px', top: H * 0.5 - 4 + 'px', width: g.ax - W * 0.55 + 'px', height: '8px' });
  Object.assign(LF.ground.style, { top: g.groundY + 'px' });
  Object.assign(LF.meter.style, { left: '16px', right: '16px', top: H * 0.12 + 'px' });
  setB(LF.eli, L.eli * 0.8); put(LF.eli, W * 0.88, H * 0.72, LF.eli._k ?? 1);
}
function lfMeter() {                             // три строки по 6 точек: свет, вода, углекислый газ
  LF.meter.innerHTML = [['light', '#ffc53d'], ['water', '#4fb6ff'], ['co2', '#9aa0c8']].map(([k, c]) =>
    `<span>${[...Array(6)].map((_, i) => `<i style="background:${i < LF.got[k] ? c : 'transparent'};border-color:${c}"></i>`).join('')}</span>`).join('');
}
function lfFly(el, x0, y0, x1, y1, ms) {
  return el.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x1}px,${y1}px)` }], { duration: ms * K, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
}
async function lfLight() {                       // солнце: красные и синие фотоны летят в лист
  const g = lfGeo();
  await tapObj(LF.sun);
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('i'); p.className = 'lfph'; p.style.background = i % 2 ? '#3d6bff' : '#ff3b3b'; LF.root.appendChild(p);
    lfFly(p, g.sunX, g.sunY, g.lx + (Math.random() - 0.5) * g.s * 0.3, g.ly, 900).then(() => { p.remove(); LF.got.light++; lfMeter(); sfx('gulp'); });
    await wait(260);
  }
  await wait(1000);
}
function lfCollect(kind, n, place, svg, w, h) {  // ребёнок нажимает на n предметов; каждый летит в лист
  const g = lfGeo();
  return new Promise(res => {
    let left = n;
    for (let i = 0; i < n; i++) {
      const [x, y] = place(i), e = lfEl('lfitem tappable', svg, true); lfPl(e, x, y, w, h);
      e.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: (1600 + i * 120) * K, iterations: Infinity });
      e.onclick = async () => {
        e.onclick = null; e.classList.remove('tappable'); sfx('tap');
        const r = e.getBoundingClientRect(), st = stage.getBoundingClientRect();
        e.style.left = e.style.top = '0px'; e.getAnimations().forEach(a => a.cancel());
        await lfFly(e, r.left - st.left, r.top - st.top, g.lx - w / 2, g.ly - h / 2, 700);
        e.remove(); LF.got[kind]++; lfMeter(); sfx('gulp');
        if (!--left) setTimeout(res, 500);
      };
    }
  });
}
async function leafScene() {
  await flash();
  clearStage();
  phase = 'leaf'; setLabel(T.lfLabel);
  LF = { got: { light: 0, water: 0, co2: 0 }, appleK: 0 };
  LF.root = document.createElement('div'); LF.root.id = 'lf'; stage.appendChild(LF.root);
  LF.ground = lfEl('lfground'); LF.trunk = lfEl('lftrunk'); LF.branch = lfEl('lftrunk');
  LF.leaf = lfEl('lfleaf', LEAF_SVG); LF.sun = lfEl('', SUN, true);
  LF.apple = lfEl('', `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="47" y="8" width="6" height="18" rx="3" fill="#7a4a24"/><path d="${COL_SHAPES.apple}" fill="#ff3b3b"/></svg>`);
  LF.meter = lfEl('lfmeter'); lfMeter();
  LF.eli = sprite('eli_hello', 'front'); LF.eli.addEventListener('click', () => talkTap());
  lfLayout();
  await unflash();
  const g = lfGeo();
  for (const t of T.lfIntro) await say(t);
  await say(T.lfSun, { next: false }); hideSay();
  await lfLight();
  await say(T.lfWater, { next: false }); hideSay();
  await lfCollect('water', 6, i => [W * (0.12 + i * 0.12), g.groundY + (H - g.groundY) * 0.45], DROP_SVG, g.a * 0.6, g.a * 0.6);
  await say(T.lfCo2, { next: false }); hideSay();
  await lfCollect('co2', 6, i => [W * (0.14 + (i % 3) * 0.3), H * (0.62 + Math.floor(i / 3) * 0.1)], CO2_SVG, g.a * 0.9, g.a * 0.45);
  // лист работает: сахар — в яблоко, кислород — в воздух
  LF.leaf.classList.add('lfglow'); sfx('sparkle'); await wait(900);
  for (let i = 0; i < 6; i++) {
    const o = lfEl('lfitem', O2_SVG); lfPl(o, 0, 0, g.a * 0.6, g.a * 0.3); o.style.left = o.style.top = '0px';
    lfFly(o, g.lx + (i - 2.5) * 14, g.ly, g.lx + (i - 2.5) * 40, -40, 1800 + i * 150).then(() => o.remove());
  }
  const su = lfEl('lfitem', SUGAR_SVG); lfPl(su, 0, 0, g.a * 0.7); su.style.left = su.style.top = '0px';
  await lfFly(su, g.lx - g.a * 0.35, g.ly - g.a * 0.35, g.ax - g.a * 0.35, g.ay - g.a * 0.35, 1400); su.remove();
  for (let i = 1; i <= 10; i++) { LF.appleK = i / 10; lfLayout(); await wait(60); }
  sfx('ding'); LF.leaf.classList.remove('lfglow');
  for (const t of T.lfDone) await say(t);
  await say(T.lfWin);
  await say(T.fireBye);
  await eliVanish(LF.eli);
}


/* ===================== ГЛАВА «ЭЛЕКТРИЧЕСТВО» ===================== */
/* Эли с командой электронов зажигает свет.
   1) Цепь: батарейка, лампа, выключатель; в проводе три дырки — ребёнок их закрывает; цепь замкнута — электроны бегут
      от «−» батарейки через лампу к «+», лампа горит; выключатель разомкнул цепь — электроны стоят, лампа гаснет.
      Что на самом деле: в учебниках «ток» рисуют наоборот, от «+» к «−» (так договорились до открытия электрона).
   2) Электроны в проводе ползут медленнее улитки: при 1 А в медном проводе 1 мм² — около 0,07 мм/с
      (v = I / (n·S·e), n ≈ 8,5·10²⁸ в м³); улитка — около 1 мм/с (в гонке улитка в 14 раз быстрее).
      Но лампа загорается сразу: провод полон электронов, толчок передаётся почти мгновенно — как шарики в трубке.
   3) Дом: в каждой комнате своя лампа и свой выключатель — ребёнок зажигает свет везде.
   Обязательная фраза о безопасности — одна, в начале. */
const BATTERY = '<svg viewBox="0 0 60 100" aria-hidden="true"><rect x="10" y="14" width="40" height="80" rx="8" fill="#3d6bff"/><rect x="10" y="60" width="40" height="34" rx="8" fill="#ffc53d"/><rect x="22" y="4" width="16" height="12" rx="3" fill="#c9cfee"/><text x="30" y="44" text-anchor="middle" font-size="26" fill="#fff" font-family="Rubik,sans-serif">−</text><text x="30" y="86" text-anchor="middle" font-size="24" fill="#3a2500" font-family="Rubik,sans-serif">+</text></svg>';
const BULB = on => `<svg viewBox="0 0 100 100" aria-hidden="true">${on ? '<circle cx="50" cy="40" r="44" fill="#ffe36b" opacity=".35"/>' : ''}<circle cx="50" cy="40" r="28" fill="${on ? '#fff3a8' : 'rgba(220,235,255,.18)'}" stroke="#dff3ff" stroke-width="3"/><path d="M40 44 Q50 30 60 44" stroke="${on ? '#ff9a3d' : '#9aa0c8'}" stroke-width="3" fill="none"/><rect x="38" y="66" width="24" height="18" rx="3" fill="#9aa0c8"/></svg>`;
const SWITCH = on => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="20" width="76" height="60" rx="14" fill="#2c2f4a" stroke="#9aa0c8" stroke-width="3"/><rect x="${on ? 48 : 18}" y="28" width="34" height="44" rx="10" fill="${on ? '#5dff8a' : '#ff6b6b'}"/></svg>`;
const SNAIL = '<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M8 60 Q50 66 92 60 L86 52 Q50 56 20 52 Z" fill="#c9a25e"/><circle cx="50" cy="36" r="22" fill="#ff8a3d"/><path d="M50 36 m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -7 -7" stroke="#a24d14" stroke-width="3" fill="none"/><path d="M78 54 Q86 30 82 22 M86 54 Q94 34 92 26" stroke="#c9a25e" stroke-width="4" fill="none"/><circle cx="82" cy="20" r="3" fill="#1b1e4a"/><circle cx="92" cy="24" r="3" fill="#1b1e4a"/></svg>';
let EL = null;

function elEl(cls, html = '', button = false) {
  const e = document.createElement(button ? 'button' : 'div'); if (button) e.type = 'button';
  e.className = 'elo ' + cls; e.innerHTML = html; EL.root.appendChild(e); return e;
}
const elPl = (e, x, y, w, h = w) => Object.assign(e.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
/* --- цепь: прямоугольник, точка на нём по параметру t ∈ [0,1): верх, право, низ, лево --- */
function elRect() { return { x0: W * 0.16, y0: H * 0.3, x1: W * 0.84, y1: H * 0.62 }; }
function elAt(t) {
  const r = elRect(), w = r.x1 - r.x0, h = r.y1 - r.y0, P = 2 * (w + h); let d = ((t % 1) + 1) % 1 * P;
  if (d < w) return [r.x0 + d, r.y0]; d -= w;
  if (d < h) return [r.x1, r.y0 + d]; d -= h;
  if (d < w) return [r.x1 - d, r.y1]; d -= w;
  return [r.x0, r.y1 - d];
}
const EL_GAPS = [[0.03, 0.08], [0.17, 0.22], [0.58, 0.66]];   // дырки в проводе
const EL_PARTS = { bulb: 0.125, sw: 0.375, bat: 0.875 };
function elDraw() {
  const r = elRect(), parts = [], N = 160;
  for (let i = 0; i < N; i++) {                  // провод — кусочками, кроме дырок
    const t0 = i / N, t1 = (i + 1) / N, m = (t0 + t1) / 2;
    if (EL.gaps.some((open, g) => open && m > EL_GAPS[g][0] && m < EL_GAPS[g][1])) continue;
    const [ax, ay] = elAt(t0), [bx, by] = elAt(t1);
    parts.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#ffb02e" stroke-width="6" stroke-linecap="round"/>`);
  }
  EL.svg.setAttribute('viewBox', `0 0 ${W} ${H}`); EL.svg.setAttribute('width', W); EL.svg.setAttribute('height', H);
  EL.svg.innerHTML = parts.join(''); void r;
  const a = Math.max(56, Math.min(W * 0.17, H * 0.1, 84));
  const pb = elAt(EL_PARTS.bulb), ps = elAt(EL_PARTS.sw), pt = elAt(EL_PARTS.bat);
  elPl(EL.bulb, pb[0], pb[1] - a * 0.25, a * 1.1); EL.bulb.innerHTML = BULB(EL.lit);
  elPl(EL.sw, ps[0], ps[1], a); EL.sw.innerHTML = SWITCH(EL.on);
  elPl(EL.bat, pt[0], pt[1], a * 0.6, a);
  EL.gapBtns.forEach((b, g) => { const [x, y] = elAt((EL_GAPS[g][0] + EL_GAPS[g][1]) / 2); elPl(b, x, y, 48); b.hidden = !EL.gaps[g]; });
}
function elFlow(on) {                            // электроны бегут по кругу, пока цепь замкнута
  EL.flowing = on;
  if (!on || EL.raf) return;
  const dots = [...Array(18)].map((_, i) => { const d = document.createElement('i'); d.className = 'eldot'; EL.root.appendChild(d); return { d, t: i / 18 }; });
  let last = performance.now();
  const frame = now => {
    if (!EL.flowing || !EL.root.isConnected) { dots.forEach(x => x.d.remove()); EL.raf = 0; return; }
    const dt = (now - last) / 1000 / K; last = now;
    for (const x of dots) { x.t = (x.t + dt * 0.05) % 1; const [px, py] = elAt(x.t); x.d.style.transform = `translate(${px - 5}px,${py - 5}px)`; }
    EL.raf = requestAnimationFrame(frame);
  };
  EL.raf = requestAnimationFrame(frame);
}
async function elCircuit() {
  EL.gaps = [true, true, true]; EL.on = true; EL.lit = false;
  EL.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); EL.svg.classList.add('elsvg'); EL.root.appendChild(EL.svg);
  EL.bulb = elEl(''); EL.sw = elEl('', '', true); EL.bat = elEl('', BATTERY);
  EL.gapBtns = EL_GAPS.map(() => elEl('elgap', '', true));
  elDraw();
  await say(T.elFix, { next: false }); hideSay();
  await new Promise(res => {
    EL.gapBtns.forEach((b, g) => { b.classList.add('tappable'); b.onclick = () => {
      b.onclick = null; b.classList.remove('tappable'); EL.gaps[g] = false; sfx('pop'); elDraw();
      if (!EL.gaps.some(Boolean)) res();
    }; });
  });
  EL.lit = true; elDraw(); sfx('ding'); elFlow(true);
  await say(T.elLit);
  await say(T.elSwitch, { next: false }); hideSay();
  await tapObj(EL.sw);
  EL.on = false; EL.lit = false; elFlow(false); EL.gaps = [false, false, false]; elDraw(); sfx('pop');
  await say(T.elOpen);
  EL.root.innerHTML = '';
}
async function elSnail() {
  const y = H * 0.45, x0 = W * 0.1, a = Math.max(56, Math.min(W * 0.17, H * 0.1, 84));
  const wire = elEl('elwire'); Object.assign(wire.style, { left: x0 + 'px', top: y + a * 0.35 + 'px', width: W * 0.8 + 'px' });
  const sn = elEl('', SNAIL); elPl(sn, x0, y, a * 1.1, a * 0.77);
  const e = document.createElement('i'); e.className = 'eldot big'; EL.root.appendChild(e);
  e.style.transform = `translate(${x0 - 7}px,${y + a * 0.35 - 7}px)`;
  await say(T.elSnail[0]);
  const t0 = performance.now(), dur = 5000 * K;
  await new Promise(res => { const f = now => { const p = Math.min(1, (now - t0) / dur);
    sn.style.left = x0 + p * W * 0.7 - a * 0.55 + 'px'; e.style.transform = `translate(${x0 + p * W * 0.05 - 7}px,${y + a * 0.35 - 7}px)`;
    if (p < 1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
  await say(T.elSnail[1]);
  EL.root.innerHTML = '';
  // трубка с шариками: толкнули один — сразу выпал другой
  const n = 9, d = Math.min(W * 0.075, 34), tx = W / 2 - n * d / 2, ty = H * 0.45;
  const tube = elEl('eltube'); Object.assign(tube.style, { left: tx - 6 + 'px', top: ty - d / 2 - 6 + 'px', width: n * d + 12 + 'px', height: d + 12 + 'px' });
  let balls = [...Array(n)].map((_, i) => { const b = document.createElement('i'); b.className = 'eldot ball'; Object.assign(b.style, { width: d - 4 + 'px', height: d - 4 + 'px' });
    b.style.transform = `translate(${tx + i * d + 2}px,${ty - d / 2 + 2}px)`; EL.root.appendChild(b); return b; });
  const bulb = elEl(''); elPl(bulb, tx + n * d + a * 0.7, ty, a); bulb.innerHTML = BULB(false);
  const push = elEl('elpush', '', true); elPl(push, tx - a * 0.6, ty, a * 0.7);
  for (const t of T.elWhy.slice(0, 3)) await say(t);
  await say(T.elWhy[3], { next: false }); hideSay();
  for (let k = 0; k < 2; k++) {
    await tapObj(push);
    const nb = document.createElement('i'); nb.className = 'eldot ball'; Object.assign(nb.style, { width: d - 4 + 'px', height: d - 4 + 'px' }); EL.root.appendChild(nb);
    balls.unshift(nb);
    balls.forEach((b, i) => b.animate([{ transform: `translate(${tx + (i - 1) * d + 2}px,${ty - d / 2 + 2}px)` }, { transform: `translate(${tx + i * d + 2}px,${ty - d / 2 + 2}px)` }],
      { duration: 300 * K, fill: 'forwards', easing: 'ease-out' }));
    const out = balls.pop(); bulb.innerHTML = BULB(true); sfx('ding');
    out.animate([{ transform: `translate(${tx + n * d + 2}px,${ty - d / 2 + 2}px)`, opacity: 1 }, { transform: `translate(${tx + n * d + 30}px,${ty + 60}px)`, opacity: 0 }], { duration: 600 * K, fill: 'forwards' }).finished.then(() => out.remove());
    await wait(900); bulb.innerHTML = BULB(false);
  }
  EL.root.innerHTML = '';
}
async function elHouse() {
  const a = Math.max(56, Math.min(W * 0.16, H * 0.09, 80)), rw = W * 0.28, rh = H * 0.22, y = H * 0.42;
  const roof = elEl('', `<svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 L50 0 L100 30 Z" fill="#ff8a3d"/></svg>`);
  Object.assign(roof.style, { left: W * 0.06 + 'px', top: y - rh / 2 - H * 0.1 + 'px', width: W * 0.88 + 'px', height: H * 0.1 + 'px' });
  const rooms = [0, 1, 2].map(i => {
    const x = W * (0.2 + i * 0.3), room = elEl('elroom'); elPl(room, x, y, rw, rh);
    const b = elEl(''); elPl(b, x, y - rh * 0.15, a * 0.8); b.innerHTML = BULB(false);
    const s = elEl('', SWITCH(false), true); elPl(s, x, y + rh * 0.3, a * 0.6);
    return { room, b, s, on: false };
  });
  await say(T.elHouse, { next: false }); hideSay();
  await new Promise(res => rooms.forEach(r => { r.s.classList.add('tappable'); r.s.onclick = () => {
    r.s.onclick = null; r.s.classList.remove('tappable'); r.on = true; r.s.innerHTML = SWITCH(true); r.b.innerHTML = BULB(true); r.room.classList.add('lit'); sfx('ding');
    if (rooms.every(x => x.on)) setTimeout(res, 700);
  }; }));
}

async function elecScene() {
  await flash();
  clearStage();
  phase = 'elec'; setLabel(T.elLabel);
  EL = { raf: 0, flowing: false };
  EL.root = document.createElement('div'); EL.root.id = 'el'; stage.appendChild(EL.root);
  EL.eli = sprite('eli_hello', 'front'); EL.eli.addEventListener('click', () => talkTap());
  setB(EL.eli, L.eli * 0.8); put(EL.eli, W * 0.88, H * 0.82);
  await unflash();
  for (const t of T.elIntro) await say(t);
  await say(T.elSafe);
  await elCircuit();
  await flash(); await unflash();
  await elSnail();
  await flash(); await unflash();
  await elHouse();
  await say(T.elWin);
  await say(T.fireBye);
  await eliVanish(EL.eli);
}
function elRelayout() { if (!EL) return; setB(EL.eli, L.eli * 0.8); put(EL.eli, W * 0.88, H * 0.82); if (EL.svg && EL.svg.isConnected) elDraw(); }


/* ===================== ГЛАВА «ФОТОН ВЫБИВАЕТ ЭЛИ» ===================== */
/* Фотоэффект. Пластинка из калия: работа выхода 2,29 эВ (таблица «Work function» в Википедии, по справочнику CRC).
   Красный (1,89 эВ) и жёлтый (2,10) электрон не выбивают, бирюзовый (2,55) и фиолетовый (2,86) — выбивают; выбитый
   электрон летит на вторую пластинку, по проводу бежит ток — лампа вспыхивает. Зелёный (2,33) у самого порога —
   в главе его нет. Много красных фотонов подряд тоже не помогают: важна сила одного фотона, а не их число
   (объяснил Эйнштейн в 1905 году; Нобелевская премия 1921 года — «особенно за открытие закона фотоэффекта»).
   Что на самом деле: у натрия по справочнику CRC работа выхода 2,75 эВ (в задачниках часто 2,3) — поэтому не натрий;
   в солнечных батареях (кремний) работает и красный свет — там другой порог (около 1,1 эВ). */
const PH_WORK = 2.29;
const PH_COLORS = ['red', 'yellow', 'cyan', 'violet'];
let PE = null;

function peGeo() {
  return { px: W * 0.28, cx: W * 0.72, py: H * 0.42, ph: H * 0.2, pw: Math.max(14, W * 0.05), by: H * 0.62, a: Math.max(56, Math.min(W * 0.17, H * 0.09, 84)) };
}
function peLayout() {
  if (!PE) return;
  const g = peGeo();
  const pl = (e, x, y, w, h) => Object.assign(e.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
  pl(PE.plate, g.px, g.py, g.pw, g.ph); pl(PE.coll, g.cx, g.py, g.pw, g.ph);
  pl(PE.k, g.px, g.py - g.ph / 2 - g.a * 0.3, g.a * 0.45, g.a * 0.45);
  pl(PE.bulb, W / 2, g.by, g.a, g.a); PE.bulb.innerHTML = BULB(PE.lit);
  PE.svg.setAttribute('viewBox', `0 0 ${W} ${H}`); PE.svg.setAttribute('width', W); PE.svg.setAttribute('height', H);
  PE.svg.innerHTML = `<path d="M${g.px} ${g.py + g.ph / 2} V${g.by} H${W / 2 - g.a * 0.3} M${W / 2 + g.a * 0.3} ${g.by} H${g.cx} V${g.py + g.ph / 2}" fill="none" stroke="#ffb02e" stroke-width="5"/>`;
  PH_COLORS.forEach((c, i) => { const b = PE.btn[c]; pl(b, W * (0.2 + i * 0.2), H * 0.85, g.a * 0.85, g.a * 0.85); });
  setB(PE.eli, L.eli * 0.8); put(PE.eli, W * 0.86, H * 0.2, PE.eli._k ?? 1);
}
async function peShoot(c) {                      // фотон цвета c летит в пластинку; → выбил ли электрон
  const g = peGeo(), b = PE.btn[c], st = stage.getBoundingClientRect(), r = b.getBoundingClientRect(), s = g.a * 0.45;
  const p = new Image(); p.src = `img/${PH[c].img}.webp`; p.className = 'peph'; Object.assign(p.style, { width: s + 'px', height: s + 'px' }); PE.root.appendChild(p);
  const x0 = r.left - st.left + r.width / 2 - s / 2, y0 = r.top - st.top + r.height / 2 - s / 2;
  await p.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${g.px - s / 2}px,${g.py - s / 2}px)` }], { duration: 650 * K, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  p.remove();
  if (PH[c].E < PH_WORK) {                       // слабый: фотон проглочен, пластинка чуть нагрелась — электрон на месте
    sfx('pop'); PE.plate.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.4)' }, { filter: 'brightness(1)' }], { duration: 400 * K });
    return false;
  }
  sfx('rise');
  const e = document.createElement('i'); e.className = 'eldot big'; PE.root.appendChild(e);
  await e.animate([{ transform: `translate(${g.px + g.pw / 2 - 7}px,${g.py - 7}px)` }, { transform: `translate(${(g.px + g.cx) / 2}px,${g.py - 40}px)` }, { transform: `translate(${g.cx - g.pw / 2 - 7}px,${g.py - 7}px)` }],
    { duration: 700 * K, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
  e.remove(); PE.lit = true; peLayout(); sfx('ding');
  setTimeout(() => { PE.lit = false; peLayout(); }, 700 * K);
  return true;
}
function peTap(only = null) {                    // ребёнок нажимает на цвет; → какой
  return new Promise(res => {
    for (const c of PH_COLORS) {
      const b = PE.btn[c], on = !only || only.includes(c);
      b.classList.toggle('tappable', on);
      b.onclick = on ? () => { for (const x of PH_COLORS) { PE.btn[x].onclick = null; PE.btn[x].classList.remove('tappable'); } res(c); } : null;   // пока фотон летит и Эли говорит — ничего не светится
    }
  });
}
async function photoScene() {
  await flash();
  clearStage();
  phase = 'photo'; setLabel(T.peLabel);
  PE = { btn: {}, lit: false };
  PE.root = document.createElement('div'); PE.root.id = 'pe'; stage.appendChild(PE.root);
  PE.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); PE.svg.classList.add('elsvg'); PE.root.appendChild(PE.svg);
  const mk = (cls, html = '', button = false) => { const e = document.createElement(button ? 'button' : 'div'); if (button) e.type = 'button'; e.className = cls; e.innerHTML = html; PE.root.appendChild(e); return e; };
  PE.plate = mk('peplate'); PE.coll = mk('peplate'); PE.k = mk('rxball'); PE.k.style.setProperty('--bc', FLAME.k); PE.k.style.position = 'absolute';
  PE.bulb = mk('elo');
  for (const c of PH_COLORS) { PE.btn[c] = mk('pebtn', `<img src="img/${PH[c].img}.webp" alt="">`, true); PE.btn[c].setAttribute('aria-label', PH[c].name); }
  PE.eli = sprite('eli_hello', 'front'); PE.eli.addEventListener('click', () => talkTap());
  peLayout();
  await unflash();
  for (const t of T.peIntro) await say(t);
  await say(T.peTry, { next: false }); hideSay();
  const tried = new Set();
  while (tried.size < PH_COLORS.length) {        // попробовать каждый цвет
    const c = await peTap();
    tried.add(c); PE.btn[c].classList.add('tried');
    await peShoot(c); await wait(300);
  }
  for (const c of PH_COLORS) PE.btn[c].classList.remove('tappable');
  for (const t of T.peResult) await say(t);
  await say(T.peMany, { next: false }); hideSay();
  for (let i = 0; i < 6; i++) { await peTap(['red']); peShoot('red'); await wait(250); }
  await wait(900);
  for (const t of T.peManyNo) await say(t);
  await say(T.peTask, { next: false }); hideSay();
  for (;;) {
    const c = await peTap();
    if (await peShoot(c)) break;
    await wait(400);
  }
  for (const c of PH_COLORS) PE.btn[c].classList.remove('tappable');
  sfx('ding'); PE.eli.src = 'img/eli_jump.webp'; await bounce(PE.eli, 1.12, 0.9); PE.eli.src = 'img/eli_hello.webp';
  await say(T.peWin);
  await say(T.fireBye);
  await eliVanish(PE.eli);
}


/* ===================== ГЛАВА «МАГНИТЫ» ===================== */
/* 1) Каждый электрон — крошечный магнит (из-за спина). В железе есть области, где магнитики смотрят в одну сторону;
      стрелка в игре — такая область. Ребёнок поворачивает все стрелки в одну сторону — железо стало магнитом,
      скрепка прыгает к нему. (Нагрев выше 770 °C снова перемешивает порядок — в игре не показано.)
   2) Притягиваются железо (гвоздь, скрепка); алюминий и дерево — нет (с обычным магнитом).
   3) Компас: Земля — большой магнит, красная стрелка показывает на север. Ребёнок нажимает на дверь, на которую
      показывает стрелка. Магнит Земли направляет частицы от Солнца к полюсам — там северное сияние (глава «Небо»). */
const ARROW = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M14 50 H70 M56 32 L78 50 L56 68" stroke="#ff4a4a" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
const CLIP = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M36 80 V30 a14 14 0 0 1 28 0 V72 a8 8 0 0 1 -16 0 V36" stroke="#c9cfee" stroke-width="6" fill="none" stroke-linecap="round"/></svg>';
const CAN = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="28" y="16" width="44" height="72" rx="8" fill="#c9cfee"/><rect x="28" y="40" width="44" height="22" fill="#3d6bff"/><ellipse cx="50" cy="16" rx="22" ry="5" fill="#e8ecff"/></svg>';
const WSPOON = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 86 L60 40" stroke="#c98d4e" stroke-width="9" stroke-linecap="round"/><ellipse cx="68" cy="28" rx="16" ry="20" fill="#c98d4e" transform="rotate(35 68 28)"/></svg>';
const MAGNET = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 20 V56 a30 30 0 0 0 60 0 V20 H62 V56 a12 12 0 0 1 -24 0 V20 Z" fill="#ff4a4a"/><rect x="20" y="12" width="18" height="16" fill="#c9cfee"/><rect x="62" y="12" width="18" height="16" fill="#c9cfee"/></svg>';
const COMPASS = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#f3f5ff" stroke="#9aa0c8" stroke-width="5"/><g class="needle"><path d="M50 12 L60 50 H40 Z" fill="#ff4a4a"/><path d="M50 88 L60 50 H40 Z" fill="#4a4f66"/></g><circle cx="50" cy="50" r="5" fill="#1b1e4a"/></svg>';
const DOOR = '<svg viewBox="0 0 60 100" aria-hidden="true"><rect x="4" y="4" width="52" height="92" rx="6" fill="#7a4a24" stroke="#c98d4e" stroke-width="4"/><circle cx="44" cy="54" r="4" fill="#ffc53d"/></svg>';
let MG = null;

function mgEl(cls, html = '', button = false) {
  const e = document.createElement(button ? 'button' : 'div'); if (button) e.type = 'button';
  e.className = 'mgo ' + cls; e.innerHTML = html; MG.root.appendChild(e); return e;
}
const mgPl = (e, x, y, w, h = w) => Object.assign(e.style, { left: x - w / 2 + 'px', top: y - h / 2 + 'px', width: w + 'px', height: h + 'px' });
const mgA = () => Math.max(56, Math.min(W * 0.17, H * 0.09, 84));

async function mgIron() {
  const cols = 4, rows = 3, cw = Math.min(W * 0.18, 72), ix = W / 2, iy = H * 0.42;
  const iron = mgEl('mgiron'); mgPl(iron, ix, iy, cols * cw + 16, rows * cw + 16);
  const arrows = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const b = mgEl('mgarrow', ARROW, true); mgPl(b, ix + (c - (cols - 1) / 2) * cw, iy + (r - (rows - 1) / 2) * cw, cw * 0.9);
    const ang = [90, 180, 270, 45, 135, 225, 315][(r * cols + c) * 3 % 7];
    b.style.transform = `rotate(${ang}deg)`; arrows.push(b);
  }
  const clip = mgEl('', CLIP); const a = mgA(); mgPl(clip, ix + cols * cw / 2 + a * 0.9, H * 0.72, a * 0.7);
  await say(T.mgAlign, { next: false }); hideSay();
  await new Promise(res => {
    let left = arrows.length;
    arrows.forEach(b => { b.classList.add('tappable'); b.onclick = () => {
      b.onclick = null; b.classList.remove('tappable'); b.style.transform = 'rotate(0deg)'; sfx('tick');
      if (!--left) setTimeout(res, 600);
    }; });
  });
  iron.classList.add('on'); sfx('sparkle');
  const r0 = clip.getBoundingClientRect(), ir = iron.getBoundingClientRect();
  await clip.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${ir.right - r0.right + a * 0.2}px,${ir.top - r0.top + ir.height / 2 - r0.height / 2}px)` }],
    { duration: 500 * K, easing: 'cubic-bezier(.5,0,1,1)', fill: 'forwards' }).finished.catch(() => {});
  sfx('ding');
  await say(T.mgAligned);
  MG.root.innerHTML = '';
}
async function mgTest() {
  const a = mgA(), mx = W / 2, my = H * 0.42;
  const mag = mgEl('', MAGNET); mgPl(mag, mx, my, a * 1.4);
  const items = [{ svg: NAIL, iron: true, x: 0.18, y: 0.28 }, { svg: CLIP, iron: true, x: 0.82, y: 0.28 }, { svg: CAN, iron: false, x: 0.18, y: 0.66 }, { svg: WSPOON, iron: false, x: 0.82, y: 0.66 }];
  const els = items.map(it => { const e = mgEl(it.svg === NAIL ? 'rxnail' : '', it.svg, true); mgPl(e, W * it.x, H * it.y, a * 0.9); return e; });
  await say(T.mgTest, { next: false }); hideSay();
  await new Promise(res => {
    let left = items.length;
    items.forEach((it, i) => { const e = els[i]; e.classList.add('tappable'); e.onclick = async () => {
      e.onclick = null; e.classList.remove('tappable');
      if (it.iron) {                              // железо — к магниту
        sfx('boing');
        await e.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(mx - W * it.x) * 0.62}px,${(my - H * it.y) * 0.62}px)` }], { duration: 450 * K, easing: 'cubic-bezier(.5,0,1,1)', fill: 'forwards' }).finished.catch(() => {});
      } else { sfx('oops'); await e.animate([0, -8, 8, -6, 6, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 500 * K }).finished.catch(() => {}); }
      if (!--left) setTimeout(res, 500);
    }; });
  });
  await say(T.mgTestEnd);
  MG.root.innerHTML = '';
}
async function mgCompass() {
  const a = mgA(), cx = W / 2, cy = H * 0.45, R0 = Math.min(W * 0.36, H * 0.24);
  const comp = mgEl('', COMPASS); mgPl(comp, cx, cy, a * 1.6);
  const needle = comp.querySelector('.needle'); needle.style.transformOrigin = '50px 50px'; needle.style.transition = `transform ${0.8 * K}s ease-in-out`;
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];   // двери: вверх, вправо, вниз, влево
  const doors = dirs.map(([dx, dy]) => { const d = mgEl('', DOOR, true); mgPl(d, cx + dx * R0, cy + dy * R0, a * 0.55, a * 0.9); return d; });
  for (const t of T.mgCompass) await say(t);
  await say(T.mgDoor, { next: false }); hideSay();
  for (const k of [1, 3, 2]) {                   // север «поворачивается» — стрелка показывает на другую дверь
    needle.style.transform = `rotate(${k * 90}deg)`; await wait(900);
    for (;;) {
      const i = await new Promise(r => doors.forEach((d, j) => { d.classList.add('tappable'); d.onclick = () => { doors.forEach(x => { x.onclick = null; x.classList.remove('tappable'); }); r(j); }; }));
      if (i === k) { sfx('ding'); await bounce(doors[i], 1.15, 0.9); break; }
      sfx('oops'); await doors[i].animate([0, -6, 6, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 400 * K }).finished.catch(() => {});
    }
  }
  await say(T.mgAurora);
}
async function magnetScene() {
  await flash();
  clearStage();
  phase = 'magnet'; setLabel(T.mgLabel);
  MG = {};
  MG.root = document.createElement('div'); MG.root.id = 'mg'; stage.appendChild(MG.root);
  MG.eli = sprite('eli_hello', 'front'); MG.eli.addEventListener('click', () => talkTap());
  setB(MG.eli, L.eli * 0.8); put(MG.eli, W * 0.88, H * 0.86);
  await unflash();
  for (const t of T.mgIntro) await say(t);
  await mgIron();
  await flash(); await unflash();
  await mgTest();
  await flash(); await unflash();
  await mgCompass();
  await say(T.mgWin);
  await say(T.fireBye);
  await eliVanish(MG.eli);
}
function mgRelayout() { if (MG) { setB(MG.eli, L.eli * 0.8); put(MG.eli, W * 0.88, H * 0.86); } }


/* ===================== ФИНАЛ «ЭЛИ ПРИШЁЛ В ГОСТИ» ===================== */
/* Тук-тук: ребёнок открывает дверь — Эли наконец пришёл. Короткое «спасибо», что искали его на всех работах;
   праздник — ребёнок нажимает на небо, и там салют (цвета атомов из «Салюта»); «в следующий раз приду вовремя».
   В этот раз Эли не исчезает — он остаётся. */
const HOUSE = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M6 44 L50 8 L94 44 Z" fill="#ff8a3d"/><rect x="14" y="44" width="72" height="52" fill="#2c2f4a" stroke="#c9cfee" stroke-width="2"/>'
  + '<rect x="20" y="52" width="18" height="16" fill="#ffe36b"/><rect x="62" y="52" width="18" height="16" fill="#ffe36b"/></svg>';
let FN = null;
async function finalScene() {
  await flash();
  clearStage();
  phase = 'final'; setLabel(T.fnLabel);
  FN = {};
  FN.root = document.createElement('div'); FN.root.id = 'fn'; stage.appendChild(FN.root);
  FX.cv = document.createElement('canvas'); FX.cv.id = 'ffx'; FN.root.appendChild(FX.cv);
  const dpr = Math.min(2, devicePixelRatio || 1);
  FX.cv.width = W * dpr; FX.cv.height = H * dpr; FX.cv.style.width = W + 'px'; FX.cv.style.height = H + 'px';
  FX.ctx = FX.cv.getContext('2d'); FX.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const hw = Math.min(W * 0.8, H * 0.45);
  const house = document.createElement('div'); house.className = 'fnhouse'; house.innerHTML = HOUSE; FN.root.appendChild(house);
  Object.assign(house.style, { left: W / 2 - hw / 2 + 'px', top: H * 0.92 - hw + 'px', width: hw + 'px', height: hw + 'px' });
  const door = document.createElement('button'); door.type = 'button'; door.className = 'fndoor'; door.innerHTML = DOOR; FN.root.appendChild(door);
  const dw = hw * 0.16, dh = hw * 0.3;
  Object.assign(door.style, { left: W / 2 - dw / 2 + 'px', top: H * 0.92 - dh - hw * 0.04 + 'px', width: dw + 'px', height: dh + 'px' });
  FN.eli = sprite('eli_hello', 'front'); FN.eli.addEventListener('click', () => talkTap()); FN.eli.style.opacity = 0;
  setB(FN.eli, L.eli * 1.1); put(FN.eli, W / 2, H * 0.92 - L.eli * 0.6);
  await unflash();
  sfx('tick'); sfx('tick', 220);                   // тук-тук
  await say(T.fnKnock, { next: false }); hideSay();
  await tapObj(door);
  door.style.transformOrigin = 'left center';      // дверь открывается
  door.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.1)' }], { duration: 400 * K, fill: 'forwards' });
  sfx('fanfare');
  await go(FN.eli, { opacity: 1, ms: 400 });
  FN.eli.src = 'img/eli_jump.webp'; await go(FN.eli, { y: H * 0.5, k: 1.3, ms: 700, easing: 'cubic-bezier(.3,1.4,.5,1)' }); FN.eli.src = 'img/eli_hello.webp';
  for (const t of T.fnHello) await say(t);
  await say(T.fnRecap);
  await say(T.fnParty, { next: false }); hideSay();
  const cols = Object.values(FLAME);
  await new Promise(res => {                       // салют там, где нажали на небо
    let n = 0; const sky = document.createElement('button'); sky.type = 'button'; sky.className = 'fnsky'; FN.root.appendChild(sky);
    sky.style.height = H * 0.42 + 'px';
    sky.onclick = e => {
      const r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      sfx('boom'); burst(x, y, [cols[n % cols.length], cols[(n + 2) % cols.length]]);
      if (++n >= 6) { sky.remove(); setTimeout(res, 1500); }
    };
  });
  FN.eli.src = 'img/eli_medal.webp';
  await say(T.fnPromise);
  await say(T.fnStay);
  hideSay();
  for (let i = 0; i < 8; i++) { sfx('boom'); burst(W * (0.15 + Math.random() * 0.7), H * (0.12 + Math.random() * 0.25), [cols[i % cols.length], cols[(i + 1) % cols.length]]); await wait(400); }
  await wait(2500);
}

function fnRelayout() {}

/* ===================== КАРТА ГЛАВ ===================== */
/* Часть 1 (яблоко → атом → «Эли и свет») идёт подряд; дальше после каждой главы — карта: «Где Эли теперь?».
   Глава открыта, если пройдена предыдущая; пройденные светятся золотом, следующая мигает, дальние — с замочком.
   Взрослым: долгое нажатие (1,5 с) на карту открывает все главы (помнится в браузере). */
const CHAPTERS = [
  { first: 'apple', last: 'eli5', c: '#ff4a5a' }, { first: 'fire', c: '#ffc21a' }, { first: 'chem', c: '#f3f5ff' },
  { first: 'react', c: '#ff4f8b' }, { first: 'rainbow', c: '#3fdcff' }, { first: 'color', c: '#ff8a3d' }, { first: 'uv', c: '#b48cff' },
  { first: 'sky', c: '#5dff8a' }, { first: 'leaf', c: '#3fbf55' }, { first: 'elec', c: '#ffb02e' }, { first: 'photo', c: '#7a5cff' },
  { first: 'magnet', c: '#ff4a4a' }, { first: 'final', c: '#ffe36b' },
].map(ch => ({ ...ch, last: ch.last || ch.first }));
const chapterOf = s => CHAPTERS.find(ch => SCENES.indexOf(s) >= SCENES.indexOf(ch.first) && SCENES.indexOf(s) <= SCENES.indexOf(ch.last));
function goMap() { location.hash = LANG + '-map'; location.reload(); }
function showMap() {
  const st = $('#start'); if (st) st.remove();
  measure(); phase = 'map'; hideSay();
  let all = false; try { all = localStorage.getItem('eliAll') === '1'; } catch (e) {}
  const done = ch => DONE.has(ch.last);
  const open = (ch, i) => all || i === 0 || done(ch) || done(CHAPTERS[i - 1]);
  const next = CHAPTERS.findIndex((ch, i) => open(ch, i) && !done(ch));
  const m = document.createElement('div'); m.id = 'map'; stage.appendChild(m);
  const n = CHAPTERS.length, cols = 3, rows = Math.ceil(n / cols), d = Math.min(W * 0.2, (H * 0.74) / rows * 0.7, 76);
  const pos = i => { const r = Math.floor(i / cols), c = r % 2 ? cols - 1 - i % cols : i % cols;   // змейка
    return [W * (LANG === 'he' ? 0.8 - c * 0.3 : 0.2 + c * 0.3), H * 0.16 + (r + 0.5) * (H * 0.76 / rows)]; };   // на иврите — справа налево
  let path = ''; for (let i = 0; i < n; i++) { const [x, y] = pos(i); path += (i ? ' L' : 'M') + x + ' ' + y; }
  m.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${path}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="6" stroke-dasharray="2 12" stroke-linecap="round"/></svg>`;
  CHAPTERS.forEach((ch, i) => {
    const [x, y] = pos(i), b = document.createElement('button'); b.type = 'button';
    b.className = 'mapdot' + (done(ch) ? ' done' : '') + (open(ch, i) ? '' : ' locked') + (i === next ? ' next' : '');
    b.style.setProperty('--mc', ch.c);
    Object.assign(b.style, { left: x - d / 2 + 'px', top: y - d / 2 + 'px', width: d + 'px', height: d + 'px' });
    b.innerHTML = open(ch, i) ? `<span>${i + 1}</span>` : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="#c9cfee"/><path d="M8 11 V8 a4 4 0 0 1 8 0 V11" fill="none" stroke="#c9cfee" stroke-width="2.4"/></svg>';
    b.setAttribute('aria-label', String(i + 1));
    if (open(ch, i)) b.onclick = () => { sfx('tap'); m.remove(); if (ch.first === 'apple') resetBarcode(); runFrom(ch.first); };
    m.appendChild(b);
  });
  if (next >= 0) {                                 // Эли ждёт у следующей главы
    const [x, y] = pos(next), e = sprite('eli_hello', 'front mapeli'); setB(e, d * 0.8); put(e, x + d * 0.55, y - d * 0.45);
  }
  let t = 0; m.addEventListener('pointerdown', () => { t = setTimeout(() => { try { localStorage.setItem('eliAll', '1'); } catch (e) {} m.remove(); document.querySelectorAll('.mapeli').forEach(x => x.remove()); showMap(); }, 1500); });
  m.addEventListener('pointerup', () => clearTimeout(t)); m.addEventListener('pointerleave', () => clearTimeout(t));
  if (soundOn()) setTimeout(() => say(T.mapWhere, { next: false }).then(() => { if (phase === 'map') hideSay(); }), 500);
}

/* ===================== СЦЕНЫ И СТРЕЛКИ ===================== */
/* Сцена = адрес после # (#apple, #build, #eli1 … #eli5). ◀ и ▶ перезапускают нужную сцену с чистого листа.
   ▶ активна всегда (кроме финала): без звука задание не понять, а застревать нельзя. Пропущенная глава не считается пройденной.
   Пройденные сцены, значок и место, где остановились, помнятся в этом браузере (localStorage):
   «Играть» — всегда с яблока; «Продолжить» (если игра уже начата) — со сцены после последней законченной. */
const SCENES = ['apple', 'build', 'eli1', 'eli2', 'eli3', 'eli4', 'eli5', 'fire', 'chem', 'react', 'rainbow', 'color', 'uv', 'sky', 'leaf', 'elec', 'photo', 'magnet', 'final'];
const SCENE_FN = { apple: partA, build: buildScene, eli1: eliStage1, eli2: eliStage2, eli3: eliStage3, eli4: eliStage4, eli5: eliStage5, fire: fireScene, rainbow: rainbowScene, color: colorScene, uv: uvScene, sky: skyScene, chem: chemScene, react: reactScene, leaf: leafScene, elec: elecScene, photo: photoScene, magnet: magnetScene, final: finalScene };
let cur = -1;
const DONE = new Set();
try { JSON.parse(localStorage.getItem('eliDone') || '[]').forEach(x => DONE.add(x)); } catch (e) {}
function markDone(n) { DONE.add(n); try { localStorage.setItem('eliDone', JSON.stringify([...DONE])); } catch (e) {} updNav(); }
function updNav() {
  $('#prev').disabled = cur < 0;
  $('#next').disabled = !(cur >= 0 && cur < SCENES.length - 1);
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
    const ch = chapterOf(SCENES[i]);
    if (ch && ch.last === SCENES[i]) { if (ch.first === 'final') goScene(-1); else goMap(); return; }   // глава пройдена — на карту
  }
  goScene(-1);
}

/* ===================== СТАРТ ===================== */
const ALL = ['bg_space', 'eli_hello', 'eli_surprised', 'eli_jump', 'eli_hold', 'eli_medal', 'eli_open', 'eli_full', 'eli_blow',
  'apple_1', 'apple_2', 'apple_4', 'apple_8', 'knife', ...['lael', 'beeri', 'arbel', 'shaked'].flatMap(n => ['kids/' + n, 'kids/' + n + '_open', 'kids/' + n + '_look']),
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
  if (phase === 'map') { const m = $('#map'); if (m) m.remove(); document.querySelectorAll('.mapeli').forEach(x => x.remove()); showMap(); }
  if (phase === 'final') fnRelayout();
  if (phase === 'magnet') mgRelayout();
  if (phase === 'photo') peLayout();
  if (phase === 'elec') elRelayout();
  if (phase === 'leaf') lfLayout();
  if (phase === 'react') rxRelayout();
  if (phase === 'chem') CHEM.relayout();
  if (phase === 'sky') skyRender();
  if (phase === 'uv') uvRelayout();
  if (phase === 'color') colRender();
  if (phase === 'rainbow') rbRender();
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
if (startHash === 'map') { $('#start').hidden = true; }
preload().then(async () => {
  const play = $('#play'); play.disabled = false; play.textContent = T.play;
  if (startHash === 'map') { unlockAudio(); showMap(); return; }
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
  if (DONE.size || SCENES.includes(next)) {       // игра уже начата — «Продолжить»: карта глав
    const cont = $('#cont'); cont.hidden = false; cont.onclick = showMap;
  }
  $('#skip').onclick = fresh('build');
  $('#skip2').onclick = fresh('eli1');
});
