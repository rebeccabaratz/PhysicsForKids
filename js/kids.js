/* Название: kids.js — внуки, герои рассказа (STORY.md): Лаэль, Беэри, Шакед, Арбель
   Картинки — img/kids/: <имя>.webp (рот закрыт), <имя>_open.webp (рот открыт), <имя>_laugh.webp (смех, 3 с).
   Смех сделан из видео Higgsfield (Kling 3.0, первый и последний кадр — та же картинка), зелёный фон убран (ffmpeg chromakey);
   поэтому смех начинается и кончается точно в позе картинки. Оригиналы (PNG и MP4) — art/kids/.
   У всех картинок кадр 9:16 (360×640): фигура по центру, ноги на FOOT высоты кадра, макушка на FIG[имя].
   Пока озвучки нет, говорящий открывает и закрывает рот, пока видна его фраза (say из game.js).
   Наружу: KIDS.add(имя, {x, top, h, z, clip}) — поставить (x — середина, top — макушка, h — рост фигуры, clip — ниже этой высоты не видно; всё в px сцены),
     KIDS.talk(имя, фраза), KIDS.lines([[имя, фраза], …]), KIDS.laugh([имена]), KIDS.hop(имя), KIDS.lean(имя, градусы),
     KIDS.mouth(имя, открыт), KIDS.chew(имя), KIDS.el(имя), KIDS.clear() */
const KIDS = (() => {
  const FIG = { arbel: 0.0703, beeri: 0.0347, lael: 0.079, shaked: 0.0729 };
  const FOOT = 1092 / 1152, FLAP_MS = 150, LAUGH_MS = 3000;
  const el = {}, laughBlob = {};
  const src = (n, s = '') => `img/kids/${n}${s}.webp`;

  function add(n, o) {
    const im = new Image(); im.alt = ''; im.draggable = false; im.className = 'kid'; im.src = src(n);
    const hc = o.h / (FOOT - FIG[n]), wc = hc * 9 / 16;   // размер кадра 9:16 под нужный рост фигуры
    Object.assign(im.style, { left: (o.x - wc / 2) + 'px', top: (o.top - FIG[n] * hc) + 'px', width: wc + 'px', height: hc + 'px', zIndex: String(o.z ?? 3) });
    im._foot = o.top + o.h;
    if (o.clip != null) im.style.clipPath = `inset(0 0 ${Math.max(0, o.top - FIG[n] * hc + hc - o.clip)}px 0)`;   // за столом: ниже края стола не видно
    stage.appendChild(im); el[n] = im;
    // смех — файлом в память один раз; каждый показ — новый адрес, чтобы анимация шла с первого кадра
    if (!laughBlob[n]) laughBlob[n] = fetch(src(n, '_laugh')).then(r => r.ok ? r.blob() : null).catch(() => null);
    return im;
  }
  const mouth = (n, open) => { if (el[n]) el[n].src = src(n, open ? '_open' : ''); };

  async function talk(n, text) {                   // фраза ребёнка: рот открывается и закрывается, пока её видно / слышно
    const im = el[n]; if (!im) { await say(text, { next: false }); return; }
    let on = true;
    const flap = (async () => { let o = false; while (on && im.isConnected) { o = !o; mouth(n, o); await new Promise(r => setTimeout(r, FLAP_MS)); } mouth(n, false); })();
    im.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 300 * K, easing: 'ease-out' });
    await say(text, { next: false });
    on = false; await flap;
  }
  async function lines(list) { for (const [n, t] of list) await talk(n, t); }

  async function laugh(names) {                    // все смеются (3 с); без движения на экране — просто пауза
    if (RM) { await wait(1200); return; }
    await Promise.all(names.map(async n => {
      const im = el[n], b = await laughBlob[n];
      if (!im || !b || !b.size) return;
      const url = URL.createObjectURL(b);
      im.src = url;
      await new Promise(r => setTimeout(r, LAUGH_MS));
      if (im.isConnected) im.src = src(n);
      URL.revokeObjectURL(url);
    }));
  }
  function hop(n, h = 18) {                        // подпрыгнуть от удивления
    const im = el[n]; if (!im) return Promise.resolve();
    return im.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-h}px)`, offset: 0.4 }, { transform: 'translateY(0)' }],
      { duration: 450 * K, easing: 'ease-out' }).finished.catch(() => {});
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
  function clear() { for (const n of Object.keys(el)) { el[n].remove(); delete el[n]; } }
  return { add, talk, lines, laugh, hop, lean, mouth, chew, clear, el: n => el[n] };
})();
