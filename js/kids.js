/* Название: kids.js — внуки, герои рассказа (STORY_RU.md, STORY_HE.md): Лаэль, Беэри, Шакед, Арбель
   Картинки — img/kids/: <имя>.webp (рот закрыт), <имя>_open.webp (рот открыт — ест),
   анимации по 3 с: <имя>_talk.webp (говорит: поворачивает голову к остальным, моргает, жест рукой),
   <имя>_idle.webp (стоит: моргает, дышит, чуть смотрит в сторону), <имя>_laugh.webp (смеётся).
   Анимации сделаны из видео Higgsfield (Kling 3.0; первый и последний кадр — та же картинка), зелёный фон убран
   (ffmpeg chromakey); поэтому каждая начинается и кончается точно в позе картинки, их можно повторять и сменять.
   Оригиналы (PNG и MP4) — art/kids/. У всех картинок кадр 9:16 (360×640): фигура по центру, ноги на FOOT высоты кадра,
   макушка на FIG[имя].
   Пока звучит (или видна) фраза ребёнка, его «говорит» повторяется; после фразы доигрывает до конца круга.
   Кто молчит — иногда моргает (IDLE_MS). Если анимации нет — рот просто открывается и закрывается (FLAP_MS).
   Наружу: KIDS.add(имя, {x, top, h, z, clip}) — поставить (x — середина, top — макушка, h — рост фигуры, clip — ниже этой высоты не видно; всё в px сцены),
     KIDS.talk(имя, фраза), KIDS.lines([[имя, фраза], …]), KIDS.laugh([имена]), KIDS.lean(имя, градусы),
     KIDS.mouth(имя, открыт), KIDS.chew(имя), KIDS.el(имя), KIDS.clear() */
const KIDS = (() => {
  const FIG = { arbel: 0.0703, beeri: 0.0347, lael: 0.079, shaked: 0.0729 };
  const FOOT = 1092 / 1152, FLAP_MS = 150, ANIM_MS = 3000, IDLE_MS = [8000, 16000];
  const el = {}, st = {}, blob = {};
  const src = (n, s = '') => `img/kids/${n}${s}.webp`;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function add(n, o) {
    const im = new Image(); im.alt = ''; im.draggable = false; im.className = 'kid'; im.src = src(n);
    const hc = o.h / (FOOT - FIG[n]), wc = hc * 9 / 16;   // размер кадра 9:16 под нужный рост фигуры
    Object.assign(im.style, { left: (o.x - wc / 2) + 'px', top: (o.top - FIG[n] * hc) + 'px', width: wc + 'px', height: hc + 'px', zIndex: String(o.z ?? 3) });
    im._foot = o.top + o.h;
    if (o.clip != null) im.style.clipPath = `inset(0 0 ${Math.max(0, o.top - FIG[n] * hc + hc - o.clip)}px 0)`;   // за столом: ниже края стола не видно
    stage.appendChild(im); el[n] = im;
    st[n] = { cur: 0, talkN: 0, loop: null, idle: 0 };
    // анимации — файлами в память один раз; каждый показ — новый адрес, чтобы анимация шла с первого кадра
    for (const k of ['talk', 'idle', 'laugh']) {
      const key = n + k;
      if (!blob[key]) blob[key] = fetch(src(n, '_' + k)).then(r => r.ok ? r.blob() : null).then(b => b && b.size ? b : null).catch(() => null);
    }
    idleLater(n);
    return im;
  }
  let seq = 0;
  /* один круг анимации (3 с). false — если её перебила другая (тогда картинку не трогаем) */
  async function play(n, k) {
    const im = el[n], s = st[n], b = await blob[n + k];
    if (!im || !b || RM) return false;
    const id = ++seq; s.cur = id;
    const url = URL.createObjectURL(b); im.src = url;
    await sleep(ANIM_MS);
    URL.revokeObjectURL(url);
    if (s.cur !== id || !im.isConnected) return false;
    s.cur = 0; im.src = src(n); return true;
  }
  function idleLater(n) {                          // молчит — иногда моргает
    const s = st[n]; clearTimeout(s.idle);
    s.idle = setTimeout(async () => {
      if (!el[n]) return;
      if (!s.cur && !s.talkN) await play(n, 'idle');
      if (el[n]) idleLater(n);
    }, IDLE_MS[0] + Math.random() * (IDLE_MS[1] - IDLE_MS[0]));
  }
  const mouth = (n, open) => { if (!el[n]) return; st[n].cur = ++seq; el[n].src = src(n, open ? '_open' : ''); if (!open) st[n].cur = 0; };

  async function talk(n, text) {                   // фраза ребёнка: «говорит», пока её видно / слышно
    const im = el[n], s = st[n]; if (!im) { await say(text, { next: false }); return; }
    const anim = await blob[n + 'talk'];
    if (!anim || RM) {                             // анимации нет — рот открывается и закрывается
      let on = true;
      const flap = (async () => { let o = false; while (on && im.isConnected) { o = !o; mouth(n, o); await sleep(FLAP_MS); } mouth(n, false); })();
      await say(text, { next: false }); on = false; await flap; return;
    }
    s.talkN++;
    if (!s.loop) s.loop = (async () => { while (s.talkN > 0 && await play(n, 'talk')); s.loop = null; })();
    await say(text, { next: false });
    s.talkN--;                                     // круг «говорит» доиграет сам, следующая фраза не ждёт
  }
  async function lines(list) { for (const [n, t] of list) await talk(n, t); }

  async function laugh(names) {                    // все смеются (3 с); без движения на экране — просто пауза
    if (RM) { await wait(1200); return; }
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
  function clear() { for (const n of Object.keys(el)) { clearTimeout(st[n].idle); el[n].remove(); delete el[n]; delete st[n]; } }
  return { add, talk, lines, laugh, lean, mouth, chew, clear, el: n => el[n] };
})();
