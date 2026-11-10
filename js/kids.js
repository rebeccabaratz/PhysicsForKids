/* Название: kids.js — внуки, герои рассказа (STORY_RU.md, STORY_HE.md): Лаэль, Беэри, Шакед, Арбель
   Картинки — img/kids/: <имя>.webp (улыбается), <имя>_open.webp (рот открыт — ест),
   <имя>_look.webp (смотрит на яблоко, серьёзно, рот прямой — пока режут).
   Анимации по 3 с: <имя>_talk.webp (говорит и показывает рукой — один раз за сцену, {hands: true}),
   <имя>_talk2.webp (говорит: голова и рот, руки спокойно), <имя>_idle.webp (молчит: моргает, дышит),
   <имя>_lookidle.webp (смотрит на яблоко и моргает), <имя>_laugh.webp (смеётся), lael_cut.webp (Лаэль режет).
   Анимации сделаны из видео Higgsfield (Kling 3.0; первый и последний кадр — та же картинка), зелёный фон убран
   (ffmpeg chromakey); поэтому каждая начинается и кончается точно в позе картинки, их можно повторять и сменять.
   Серьёзные картинки — GPT Image 2.6 по исходной (фигура совпадает до 2–4 px), смена — плавная (FADE_MS).
   Оригиналы (PNG и MP4) — art/kids/. У всех картинок кадр 9:16 (360×640): фигура по центру, ноги на FOOT высоты кадра,
   макушка на FIG[имя].
   Пока звучит (или видна) фраза ребёнка, его «говорит» повторяется; после фразы доигрывает до конца круга.
   Кто молчит — иногда моргает (IDLE_MS). Если анимации нет — рот просто открывается и закрывается (FLAP_MS).
   Наружу: KIDS.add(имя, {x, top, h, z, clip}) — поставить (x — середина, top — макушка, h — рост фигуры, clip — ниже этой высоты не видно; всё в px сцены),
     KIDS.talk(имя, фраза, {hands}), KIDS.lines([[имя, фраза], …]), KIDS.laugh([имена]), KIDS.look([имена], да/нет),
     KIDS.play(имя, анимация), KIDS.lean(имя, градусы), KIDS.mouth(имя, открыт), KIDS.chew(имя), KIDS.el(имя), KIDS.clear() */
const KIDS = (() => {
  const FIG = { arbel: 0.0703, beeri: 0.0347, lael: 0.079, shaked: 0.0729 };
  const FOOT = 1092 / 1152, FLAP_MS = 150, ANIM_MS = 3000, IDLE_MS = [8000, 16000], FADE_MS = 300;
  const ANIMS = ['talk2', 'idle', 'lookidle', 'laugh'];   // заранее; «talk» (с жестом) — когда понадобится
  const el = {}, st = {}, blob = {};
  const src = (n, s = '') => `img/kids/${n}${s}.webp`;
  const still = n => src(n, st[n] && st[n].look ? '_look' : '');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const load = (n, k) => blob[n + k] || (blob[n + k] = fetch(src(n, '_' + k)).then(r => r.ok ? r.blob() : null).then(b => b && b.size ? b : null).catch(() => null));

  function add(n, o) {
    const im = new Image(); im.alt = ''; im.draggable = false; im.className = 'kid'; im.src = src(n);
    const hc = o.h / (FOOT - FIG[n]), wc = hc * 9 / 16;   // размер кадра 9:16 под нужный рост фигуры
    Object.assign(im.style, { left: (o.x - wc / 2) + 'px', top: (o.top - FIG[n] * hc) + 'px', width: wc + 'px', height: hc + 'px', zIndex: String(o.z ?? 3) });
    im._foot = o.top + o.h;
    if (o.clip != null) im.style.clipPath = `inset(0 0 ${Math.max(0, o.top - FIG[n] * hc + hc - o.clip)}px 0)`;   // за столом: ниже края стола не видно
    stage.appendChild(im); el[n] = im;
    const old = st[n]; st[n] = { cur: 0, talkN: 0, loop: null, idle: 0, look: old ? old.look : false };
    if (st[n].look) im.src = still(n);
    // анимации — файлами в память один раз; каждый показ — новый адрес, чтобы анимация шла с первого кадра
    for (const k of ANIMS) load(n, k);
    if (n === 'lael') load(n, 'cut');
    idleLater(n);
    return im;
  }
  let seq = 0;
  /* один круг анимации (3 с). false — если её перебила другая (тогда картинку не трогаем) */
  async function play(n, k) {
    const im = el[n], s = st[n], b = await load(n, k);
    if (!im || !b || RM) return false;
    const id = ++seq; s.cur = id;
    const url = URL.createObjectURL(b); im.src = url;
    await sleep(ANIM_MS);
    URL.revokeObjectURL(url);
    if (s.cur !== id || !im.isConnected) return false;
    s.cur = 0; im.src = still(n); return true;
  }
  function idleLater(n) {                          // молчит — иногда моргает
    const s = st[n]; clearTimeout(s.idle);
    s.idle = setTimeout(async () => {
      if (!el[n]) return;
      if (!s.cur && !s.talkN) await play(n, s.look ? 'lookidle' : 'idle');
      if (el[n]) idleLater(n);
    }, IDLE_MS[0] + Math.random() * (IDLE_MS[1] - IDLE_MS[0]));
  }
  function fadeTo(n, url) {                        // плавная смена картинки: старая тает поверх новой
    const im = el[n]; if (!im || im.src.endsWith(url)) return;
    const g = im.cloneNode(); g.style.pointerEvents = 'none'; im.after(g);
    im.src = url;
    g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS * K, easing: 'ease-in-out' }).finished.catch(() => {}).then(() => g.remove());
  }
  function look(names, on) {                       // смотрят на яблоко (серьёзно) — или снова улыбаются
    for (const n of names) {
      const s = st[n]; if (!s || s.look === on) continue;
      s.look = on; s.cur = ++seq;                  // перебивает анимацию; круг «говорит» прекратится
      fadeTo(n, still(n)); s.cur = 0;
    }
  }
  const mouth = (n, open) => { if (!el[n]) return; st[n].cur = ++seq; el[n].src = open ? src(n, '_open') : still(n); if (!open) st[n].cur = 0; };

  async function talk(n, text, o = {}) {           // фраза ребёнка: «говорит», пока её видно / слышно
    const im = el[n], s = st[n]; if (!im) { await say(text, { next: false }); return; }
    if (s.look) look([n], false);                  // говорит — поднимает глаза на остальных
    const k = o.hands ? 'talk' : 'talk2';
    const anim = await load(n, k);
    if (!anim || RM) {                             // анимации нет — рот открывается и закрывается
      let on = true;
      const flap = (async () => { let op = false; while (on && im.isConnected) { op = !op; mouth(n, op); await sleep(FLAP_MS); } mouth(n, false); })();
      await say(text, { next: false }); on = false; await flap; return;
    }
    s.talkN++;
    if (!s.loop) s.loop = (async () => { let kk = k; while (s.talkN > 0 && await play(n, kk)) kk = 'talk2'; s.loop = null; })();
    await say(text, { next: false });
    s.talkN--;                                     // круг «говорит» доиграет сам, следующая фраза не ждёт
  }
  async function lines(list) { for (const [n, t] of list) await talk(n, t); }

  async function laugh(names) {                    // все смеются (3 с); без движения на экране — просто пауза
    if (RM) { await wait(1200); return; }
    look(names, false);
    await Promise.all(names.map(n => play(n, 'laugh')));
  }
  function lean(n, deg, ms = 1100) {               // наклониться к столу и выпрямиться (вращение вокруг ног)
    const im = el[n]; if (!im) return Promise.resolve();
    im.style.transformOrigin = `50% ${(im._foot - im.offsetTop)}px`;
    return im.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${deg}deg) translateY(4px)`, offset: 0.3 },
      { transform: `rotate(${deg}deg) translateY(4px)`, offset: 0.7 }, { transform: 'rotate(0)' }], { duration: ms * K, easing: 'ease-in-out' }).finished.catch(() => {});
  }
  async function chew(n) {                         // жуёт: рот закрыт — открыт, три раза
    for (let i = 0; i < 3 && el[n]; i++) { mouth(n, false); sfx('chomp'); await wait(170); mouth(n, true); await wait(170); }
    mouth(n, false);
  }
  /* где кадр анимации в px сцены: доли кадра 9:16 (fx, fy) → координаты на экране (для ножика в руке Лаэль) */
  function at(n, fx, fy) { const im = el[n]; return im ? [im.offsetLeft + fx * im.offsetWidth, im.offsetTop + fy * im.offsetHeight] : [0, 0]; }
  function clear() { for (const n of Object.keys(el)) { clearTimeout(st[n].idle); el[n].remove(); delete el[n]; } }
  function reset() { clear(); for (const n of Object.keys(st)) delete st[n]; }
  return { add, talk, lines, laugh, look, play, lean, mouth, chew, at, clear, reset, el: n => el[n] };
})();
