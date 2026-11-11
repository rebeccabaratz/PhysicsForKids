/* Название: kids.js — внуки, герои рассказа (STORY_RU.md, STORY_HE.md): Лаэль, Беэри, Шакед, Арбель
   Картинки — img/kids/: <имя>.webp (улыбается), <имя>_open.webp (рот открыт — ест),
   <имя>_look.webp (смотрит на яблоко, серьёзно, рот прямой — пока режут),
   <имя>_glance.webp (повернул голову: Лаэль и Беэри — друг к другу, Арбель и Шакед — на зрителя; пока ждут нажатия),
   lael_right.webp (Лаэль плавно смотрит направо, моргает и возвращается — 3 с из её «стоит», анимация); у Лаэль _glance — картинка (в её видео она влево не смотрит), правый глаз сдвинут от носа вручную.
   Арбель (2026-11-11, по фото) обычно стоит АНФАС (arbel_front.webp = _glance, лицо с портрета). К столу и обратно голова
   поворачивается видео (arbel_turn 1,5 с / arbel_back 1,7 с — из пробного поворота, без смены картинок). Повёрнутый к столу
   (arbel.webp) — говорит (talk2), ест (eat), смотрит на яблоко (та же arbel.webp: голова к столу), смеётся (laugh). Анфас — моргает
   (arbel_blink), отводит глаза в сторону и обратно (arbel_glancef), смотрит вверх и обратно (arbel_upf) — из круга глазами, смеётся (arbel_laughf). Всё из видео art/kids/arbel_*.mp4.
   Кто-то говорит — остальные смотрят на него (GAZE): картинки с головой и глазами, повёрнутыми к говорящему.
   arbel_eat.webp, shaked_eat.webp — берёт кусочек рукой, откусывает, жуёт с закрытым ртом (3 с; кусочек в руке — с кадра HAND[имя][2]).
   beeri_turnA / beeri_turnAback, beeri_turnR / beeri_turnRback — Беэри плавно поворачивает голову к Арбелю (налево) / к Лаэль (направо) и обратно (1,5 с, видео от картинки до _toA).
   <имя>_gasp.webp — ахает: глаза широко, рот «ах!», держит, рот медленно закрывается, в конце лёгкая улыбка (2,3 с, улыбка в конце — мгновение, сразу поворачивают головы к Лаэль: начало видео
   <имя>_gasp.mp4 вперёд и медленно назад — широкая улыбка из конца видео не нужна, автор; клетка и молекула; у Арбеля — анфас).
   <имя>_tolook / <имя>_fromlook (Лаэль, Шакед, Беэри) — видео «обычная → смотрит на яблоко» и оно же назад (art/kids/<имя>_tolook.mp4).
   Взгляды на говорящего — видео <имя>_m?.mp4 / beeri_turn?.mp4 (MOVE): от обычной картинки к картинке взгляда; назад — то же наоборот.
   arbel_chew.webp, shaked_chew.webp (запас) — жуёт (1,9 с): начало их «говорит» вперёд и назад, поэтому кончается в позе картинки.
   Анимации по 3 с: <имя>_talk.webp (говорит и показывает рукой — один раз за сцену, {hands: true}),
   <имя>_talk2.webp (говорит: голова и рот, руки спокойно), <имя>_idle.webp (молчит: моргает, дышит),
   <имя>_lookidle.webp (смотрит на яблоко и моргает), <имя>_laugh.webp (смеётся), lael_cut.webp (Лаэль режет).
   Все анимации — один проход (loop = 1 в файле): если таймер чуть опоздал, остаётся последний кадр, а не начало круга.
   Анимации сделаны из видео Higgsfield (Kling 3.0; первый и последний кадр — та же картинка), зелёный фон убран
   (ffmpeg chromakey); поэтому каждая начинается и кончается точно в позе картинки, их можно повторять и сменять.
   Серьёзные картинки — GPT Image 2.6 по исходной (фигура совпадает до 2–4 px), смена — плавная (FADE_MS).
   Оригиналы (PNG и MP4) — art/kids/. У всех картинок кадр 9:16 (360×640): фигура по центру, ноги на FOOT высоты кадра (у Арбеля — FOOT_ARBEL),
   макушка на FIG[имя].
   Пока звучит (или видна) фраза ребёнка, его «говорит» повторяется; после фразы доигрывает до конца круга.
   Кто молчит — иногда моргает (IDLE_MS). Если анимации нет — рот просто открывается и закрывается (FLAP_MS).
   Наружу: KIDS.add(имя, {x, top, h, z, clip}) — поставить (x — середина, top — макушка, h — рост фигуры, clip — ниже этой высоты не видно; всё в px сцены),
     KIDS.talk(имя, фраза, {hands}), KIDS.lines([[имя, фраза], …]), KIDS.laugh([имена]), KIDS.look([имена], да/нет), KIDS.glances(да/нет) — ждут: смотрят на яблоко, изредка на секунду переглядываются,
     KIDS.play(имя, анимация), KIDS.lean(имя, градусы), KIDS.mouth(имя, открыт), KIDS.chew(имя), KIDS.el(имя), KIDS.clear() */
const KIDS = (() => {
  const FIG = { arbel: 0.0703, beeri: 0.0347, lael: 0.079, shaked: 0.0729 };
  const FOOT = 1092 / 1152, FOOT_ARBEL = 0.922, FLAP_MS = 150, ANIM_MS = 3000, CHEW_MS = 23 / 12 * 1000, IDLE_MS = [8000, 16000], LAEL_LOOK_MS = [2500, 5000], FADE_MS = 300;   // Лаэль, глядя на яблоко, моргает и чуть двигается чаще (её lookidle — любимое у автора)
  const GLANCE_EVERY = [6000, 10000], GLANCE_HOLD = [900, 1200];   // ждут: раз в 6–10 с — короткий взгляд (около секунды)
  // ждут: Арбель и Шакед вместе — на зрителя; Лаэль и Беэри — друг на друга; Лаэль — направо (не одно и то же два раза подряд)
  const GLANCES = [[['arbel', '_glance'], ['shaked', '_glance']], [['lael', '_glance'], ['beeri', '_toR']], [['lael', '_right']]];
  const FRONT = { arbel: true };                   // стоит анфас; к столу — видео turn, обратно — back (st.side — повёрнут к столу)
  const DUR = { arbel_blink: 1250, arbel_turn: 1500, arbel_back: 1670, arbel_peek: 3080, arbel_laughf: 3150, arbel_glancef: 2170, arbel_upf: 2580, arbel_backfast: 580, beeri_turnA: 1580, beeri_turnAback: 1580, beeri_turnR: 1580, beeri_turnRback: 1580, lael_gasp: 2320, beeri_gasp: 2320, arbel_gasp: 2320, shaked_gasp: 2320, lael_right: 3080 };
  const FRONT_ANIMS = ['blink', 'glancef', 'upf', 'turn', 'back', 'backfast', 'peek', 'laughf'];
  const FRONT_IDLE_MS = [3500, 7000];             // анфас Арбель двигается чаще: у него движения короче (1–3 с), чем «стоит» у остальных
  // куда смотрит слушатель, когда говорит [кто]: суффикс картинки; 'side' — Арбель поворачивает голову к столу (там все); нет — не меняется
  // посчитано по положению глаз на экране 390×844: Лаэль (272, 298), Беэри (158, 351), Шакед (334, 408), Арбель (62, 449);
  // картинки — та же поза, повёрнуты голова и глаза (_toS, _toA, _up, _right, _toL, _toB — GPT Image 2.6, 2026-11-11)
  const GAZE = { lael: { beeri: '_glance', arbel: '_glance', shaked: '_toS' },          // влево-вниз 25° и 36°; вправо-вниз 60°
    beeri: { lael: '_toR', shaked: '_toR', arbel: '_toA' },   // вправо (вверх 25° / вниз 18°); влево-вниз 45°
    arbel: { lael: '_up', beeri: '_up', shaked: '_right' },                               // вправо-вверх 36° и 45°; вправо прямо
    shaked: { lael: '_toL', beeri: '_toB' } };                                            // влево-вверх 60°; влево, чуть вверх; на Арбеля — и так влево
  const GAZE_KEEP_MS = 2500;                       // после фразы ещё столько смотрят на говорившего (вдруг заговорит следующий)
  const HAND = { arbel: [0.363, 0.585, 500], shaked: [0.278, 0.58, 420] };   // где в кадре рука с кусочком и через сколько мс она там (видео eat)
  const LOOKMOVE = { lael: true, shaked: true, beeri: true };   // у кого есть tolook / fromlook (видео: обычная → смотрит на яблоко; fromlook — оно же назад)
  // плавные взгляды на говорящего: видео «обычная (у Арбеля — анфас) → картинка взгляда»; <имя>_<анимация>back — то же назад
  const MOVE = { lael: { _glance: 'mL', _toS: 'mS' }, beeri: { _toA: 'turnA', _toR: 'turnR' },
    arbel: { _up: 'mU', _right: 'mR' }, shaked: { _toL: 'mL', _toB: 'mB', _glance: 'mV' } };
  const MOVE_MS = 2080;                            // длина такой анимации (кроме turnA/turnR Беэри — 1580)
  const ANIMS = ['talk2', 'idle', 'lookidle', 'laugh'];   // заранее; «talk» (с жестом) — когда понадобится
  const el = {}, st = {}, blob = {};
  const src = (n, s = '') => `img/kids/${n}${s}.webp`;
  const still = n => { const s = st[n]; return src(n, s && s.look ? (n === 'arbel' ? '' : '_look') : s && s.gaze && s.gaze !== 'side' ? s.gaze : FRONT[n] && !(s && s.side) ? '_front' : ''); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const load = (n, k) => blob[n + k] || (blob[n + k] = fetch(src(n, '_' + k)).then(r => r.ok ? r.blob() : null).then(b => b && b.size ? b : null).catch(() => null));

  function add(n, o) {
    const im = new Image(); im.alt = ''; im.draggable = false; im.className = 'kid'; im.src = src(n);
    const hc = o.h / ((n === 'arbel' ? FOOT_ARBEL : FOOT) - FIG[n]), wc = hc * 9 / 16;   // размер кадра 9:16 под нужный рост фигуры
    Object.assign(im.style, { left: (o.x - wc / 2) + 'px', top: (o.top - FIG[n] * hc) + 'px', width: wc + 'px', height: hc + 'px', zIndex: String(o.z ?? 3) });
    im._foot = o.top + o.h;
    if (o.clip != null) im.style.clipPath = `inset(0 0 ${Math.max(0, o.top - FIG[n] * hc + hc - o.clip)}px 0)`;   // за столом: ниже края стола не видно
    stage.appendChild(im); el[n] = im;
    const old = st[n]; st[n] = { cur: 0, talkN: 0, loop: null, idle: 0, look: old ? old.look : false, side: old ? old.side : false };
    im.src = still(n);
    // анимации — файлами в память один раз; каждый показ — новый адрес, чтобы анимация шла с первого кадра
    for (const k of ANIMS) if (!(n === 'arbel' && k === 'lookidle')) load(n, k);   // у Арбеля lookidle (кивок) и _look/_open удалены (автор)
    if (n === 'lael') load(n, 'cut');
    if (n === 'arbel' || n === 'shaked') load(n, 'eat');
    load(n, 'gasp');
    if (LOOKMOVE[n]) { load(n, 'tolook'); load(n, 'fromlook'); }
    for (const a of Object.values(MOVE[n] || {})) { load(n, a); load(n, a + 'back'); }
    if (n === 'beeri') for (const t of ['turnA', 'turnAback', 'turnR', 'turnRback']) load(n, t);
    if (FRONT[n]) { for (const a of FRONT_ANIMS) load(n, a); ready(src(n, '_front')); ready(src(n)); }
    for (const g of Object.values(GAZE[n] || {})) if (g !== 'side') ready(src(n, g));
    ready(src(n, '_glance')); if (n === 'lael') { load(n, 'right'); ready(src(n, '_toright')); }
    idleLater(n);
    return im;
  }
  let seq = 0;
  /* один круг анимации (обычно 3 с). false — если её перебила другая (тогда картинку не трогаем).
     o.end — какая картинка после (суффикс; иначе still); o.via — последний кадр анимации картинкой, потом плавно к still */
  async function play(n, k, o = {}) {
    const ms = o.ms ?? DUR[n + '_' + k] ?? (/^m[A-Z]/.test(k) || /look$/.test(k) ? MOVE_MS : ANIM_MS);
    const im = el[n], s = st[n], b = await load(n, k);
    if (!im || !b || RM) return false;
    const id = ++seq; s.cur = id;
    const url = URL.createObjectURL(b);
    await ready(url);                              // раскодировать заранее: смена без пустого кадра
    if (s.cur !== id) { URL.revokeObjectURL(url); return false; }
    im.src = url;
    await sleep(ms);
    URL.revokeObjectURL(url);
    if (s.cur !== id || !im.isConnected) return false;
    s.cur = 0;
    if (o.end != null) { await ready(src(n, o.end)); im.src = src(n, o.end); }
    else if (o.via != null) { im.src = src(n, o.via); fadeTo(n, still(n)); }
    else { const u = still(n); await ready(u); im.src = u; }
    return true;
  }
  function home(n, delay = 700) {                  // повёрнутый к столу (не занят) — плавно обратно анфас
    if (!FRONT[n]) return;
    setTimeout(async () => {
      const s = st[n]; if (!el[n] || !s.side || s.look) return;
      if (s.gaze) { home(n, 700); return; }        // слушает — голова пока к говорящему
      if (s.cur || s.talkN || s.chewing) { home(n, 700); return; }
      s.side = false;
      if (!await play(n, 'back') && st[n] && !st[n].look) st[n].side = true;
    }, delay);
  }
  function idleLater(n) {                          // молчит — иногда моргает
    const s = st[n]; clearTimeout(s.idle);
    s.idle = setTimeout(async () => {
      if (!el[n]) return;
      if (!s.cur && !s.talkN && !s.chewing && !s.gaze) {   // смотрит на говорящего — не отвлекается
        if (!FRONT[n]) await play(n, s.look ? 'lookidle' : 'idle');
        else if (s.look && s.side) {                // Арбель смотрит на яблоко: изредка поднимает голову к зрителю и снова к яблоку
          s.side = false;
          if (await play(n, 'back', { end: '_front' })) { await sleep(500); if (st[n] && st[n].look && !st[n].cur) { st[n].side = true; await play(n, 'turn'); } }
          else if (st[n]) st[n].side = true;
        }
        else if (s.side) home(n, 0);
        else { const r = Math.random(); await play(n, r < 0.4 ? 'blink' : r < 0.7 ? 'glancef' : 'upf'); }   // анфас: моргает, отводит глаза, смотрит вверх
      }
      if (el[n]) idleLater(n);
    }, (([a, b]) => a + Math.random() * (b - a))(n === 'lael' && s.look ? LAEL_LOOK_MS : FRONT[n] && !s.look ? FRONT_IDLE_MS : IDLE_MS));
  }
  const decoded = new Set();
  async function ready(url) {                      // картинка раскодирована — её можно показать без пустого кадра
    if (decoded.has(url)) return;
    const p = new Image(); p.src = url;
    try { await p.decode(); } catch (e) {}
    if (!url.startsWith('blob:')) decoded.add(url);
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
      if (s.chewing) { s.look = on; continue; }   // дожёвывает; потом сам посмотрит куда нужно
      s.look = on; s.cur = ++seq;                  // перебивает анимацию; круг «говорит» прекратится
      if (FRONT[n] && on && !s.side) { s.side = true; play(n, 'turn', { via: '' }); continue; }   // анфас — поворачивается к столу
      if (LOOKMOVE[n] && !RM) {                    // плавно (моргание / кусок видео); смотрел на говорящего — сначала обратно
        const g = s.gaze; s.gaze = null;
        (async () => {
          if (g && MOVE[n] && MOVE[n][g]) await play(n, MOVE[n][g] + 'back', { end: '' });
          if (st[n] && st[n].look === on) play(n, on ? 'tolook' : 'fromlook', { via: '' });
        })();
        continue;
      }
      fadeTo(n, still(n)); s.cur = 0;
      if (FRONT[n] && !on) home(n, 900);
    }
  }
  let gT = 0, gLast = -1;
  const s0 = (g, n) => (g.find(([m]) => m === n) || [])[1];
  function glances(on) {                           // ждут игрока: все смотрят на яблоко (и иногда моргают), изредка — короткий взгляд
    clearTimeout(gT);
    if (!on) { for (const n of Object.keys(el)) if (st[n].gl && st[n].cur === st[n].gl) { fadeTo(n, still(n)); st[n].cur = 0; } return; }
    gT = setTimeout(() => {
      let i; do i = Math.floor(Math.random() * GLANCES.length); while (i === gLast);
      const g = GLANCES[i];
      if (g.every(([n]) => el[n] && !st[n].talkN && !st[n].chewing)) {   // кто говорит — не отвлекается (моргание прерывается)
        gLast = i; let ms = GLANCE_HOLD[0] + Math.random() * (GLANCE_HOLD[1] - GLANCE_HOLD[0]);
        if (g.some(([n]) => FRONT[n] || (MOVE[n] && MOVE[n][s0(g, n)]))) ms = 4500;   // туда и обратно видео — дольше    // Арбель поворачивается видео (≈3,4 с) — Шакед смотрит столько же
        for (const [n, s] of g) glance(n, s, ms);
      }
      glances(true);
    }, GLANCE_EVERY[0] + Math.random() * (GLANCE_EVERY[1] - GLANCE_EVERY[0]));
  }
  async function glance(n, suf, ms) {
    if (MOVE[n] && MOVE[n][suf]) {                 // взгляд и обратно — видео (Беэри на Лаэль, Шакед на зрителя)
      const a = MOVE[n][suf], s = st[n], was = s.look; s.look = false;
      if (was && LOOKMOVE[n]) await play(n, 'fromlook', { end: '' }); else { fadeTo(n, still(n)); await sleep(FADE_MS); }
      if (!await play(n, a, { end: suf })) return;
      const id = ++seq; s.cur = id; await sleep(Math.max(300, ms - 4200)); if (s.cur !== id || !el[n]) return;
      await play(n, a + 'back', { end: '' }); if (st[n] && was) look([n], true); return;
    }
    if (n === 'lael' && suf === '_right') {        // Лаэль: плавный взгляд направо — кусок видео, не смена картинок
      const s = st[n], was = s.look; s.look = false;
      fadeTo(n, still(n)); await sleep(FADE_MS);
      await play(n, 'right', { via: '' });
      if (st[n] && was) look([n], true); return;
    }
    if (FRONT[n]) {                                // Арбель: от стола к зрителю и обратно — видео, не смена картинок
      const s = st[n]; if (!s.side) return;
      s.side = false;
      if (!await play(n, 'back', { end: '_front' })) { if (st[n]) st[n].side = true; return; }
      const id = ++seq; s.cur = s.gl = id; await sleep(200);
      if (s.cur !== id || !el[n]) return;
      s.side = true; await play(n, 'turn', { via: '' }); return;
    }
    const s = st[n], id = ++seq; s.cur = s.gl = id;
    fadeTo(n, src(n, suf));
    await sleep(ms);
    if (s.cur !== id || !el[n]) return;
    fadeTo(n, still(n)); s.cur = 0;
  }
  async function face(n) {                         // анфас Арбель плавно поворачивается к столу (например, чтобы съесть кусочек)
    const s = st[n]; if (!FRONT[n] || !el[n] || s.side || RM) return;
    s.side = true; await play(n, 'turn');
  }
  const mouth = (n, open) => { if (!el[n]) return; st[n].cur = ++seq; if (open && FRONT[n]) st[n].side = true; el[n].src = open && n !== 'arbel' ? src(n, '_open') : still(n); if (!open) st[n].cur = 0; };

  let gazeT = 0;
  function gazeAt(who) {                           // все (кроме говорящего) смотрят на него; who = null — перестают
    clearTimeout(gazeT);
    for (const m of Object.keys(el)) {
      const s = st[m], g = who && m !== who ? GAZE[m][who] || null : null;
      if (s.gaze === g || s.talkN) continue;
      const was = s.gaze; s.gaze = g;
      if (g === 'side') { face(m); continue; }
      if (MOVE[m] && !s.look && !s.chewing && !s.cur) {   // плавно (видео): сначала обратно к обычной, потом к новому взгляду
        const T = MOVE[m], base = FRONT[m] ? '_front' : '';
        (async () => {
          if (FRONT[m] && s.side) { s.side = false; await play(m, 'back', { end: '_front' }); }
          if (was && T[was]) await play(m, T[was] + 'back', { end: base });
          if (!st[m] || st[m].gaze !== g) return;
          if (g && T[g]) await play(m, T[g], { end: g }); else fadeTo(m, still(m));
        })();
        continue;
      }
      if (s.look || s.chewing || s.cur) continue;  // занят (смотрит на яблоко, жуёт, анимация) — картинка сменится потом сама
      fadeTo(m, still(m));
      if (FRONT[m] && !g) home(m, 300);
    }
  }
  async function talk(n, text, o = {}) {           // фраза ребёнка: «говорит», пока её видно / слышно
    const im = el[n], s = st[n]; if (!im) { await say(text, { next: false }); return; }
    s.gaze = null; gazeAt(n);
    if (s.look) look([n], false);                  // говорит — поднимает глаза на остальных
    if (FRONT[n] && !s.side && !RM) { s.side = true; await play(n, 'turn'); }   // Арбель говорит, повернувшись к столу
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
    s.talkN--;
    if (!s.talkN && s.loop) { s.cur = ++seq; fadeTo(n, still(n)); s.cur = 0; }   // фраза кончилась — замолкает сразу (не говорит вместе со следующим)
    home(n, 1500);
    gazeT = setTimeout(() => gazeAt(null), GAZE_KEEP_MS);
  }
  async function lines(list) { for (const [n, t] of list) await talk(n, t); }

  async function gasp(names) {                     // все ахают (клетка, молекула): с обычной позы (Арбель — анфас)
    if (RM) return;
    clearTimeout(gazeT);
    // Арбель ахает анфас: если смотрел на стол — быстро (0,6 с) поворачивается к зрителю; остальные ахают вместе с ним
    const turn = names.some(n => FRONT[n] && st[n] && st[n].side) ? DUR.arbel_backfast : 0;
    await Promise.all(names.map(async n => {
      const s = st[n]; if (!s) return;
      s.gaze = null; s.look = false; s.cur = ++seq;
      if (FRONT[n] && s.side) { s.side = false; await play(n, 'backfast', { end: '_front' }); }
      else { fadeTo(n, still(n)); await sleep(turn); }
      await play(n, 'gasp');
    }));
  }
  async function laugh(names) {                    // все смеются (3 с); без движения на экране — просто пауза
    if (RM) { await wait(1200); return; }
    look(names, false);
    await Promise.all(names.map(n => play(n, FRONT[n] && !st[n].side ? 'laughf' : 'laugh')));
    for (const n of names) home(n);
  }
  function lean(n, deg, ms = 1100) {               // наклониться к столу и выпрямиться (вращение вокруг ног)
    const im = el[n]; if (!im) return Promise.resolve();
    im.style.transformOrigin = `50% ${(im._foot - im.offsetTop)}px`;
    return im.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${deg}deg) translateY(4px)`, offset: 0.3 },
      { transform: `rotate(${deg}deg) translateY(4px)`, offset: 0.7 }, { transform: 'rotate(0)' }], { duration: ms * K, easing: 'ease-in-out' }).finished.catch(() => {});
  }
  /* ест: видео «берёт рукой, откусывает, жуёт»; вернёт [x, y] руки на экране и через сколько мс кусочек должен быть там */
  function eat(n) {
    const s = st[n], [fx, fy, ms] = HAND[n];
    s.chewing = true; s.look = false;
    const done = play(n, 'eat').then(() => { if (st[n]) st[n].chewing = false; home(n); });
    return { hand: at(n, fx, fy), ms, done };
  }
  async function chew(n) {                         // жуёт: анимация из кадров видео; без неё — рот закрыт — открыт, три раза
    if (!RM && await load(n, 'chew')) {
      for (const t of [0, 600, 1200]) setTimeout(() => el[n] && sfx('chomp'), t);
      st[n].chewing = true; await play(n, 'chew', { ms: CHEW_MS }); if (st[n]) st[n].chewing = false; home(n); return;
    }
    for (let i = 0; i < 3 && el[n]; i++) { mouth(n, false); sfx('chomp'); await wait(170); mouth(n, true); await wait(170); }
    mouth(n, false);
  }
  /* где кадр анимации в px сцены: доли кадра 9:16 (fx, fy) → координаты на экране (для ножика в руке Лаэль) */
  function at(n, fx, fy) { const im = el[n]; return im ? [im.offsetLeft + fx * im.offsetWidth, im.offsetTop + fy * im.offsetHeight] : [0, 0]; }
  function clear() { clearTimeout(gT); clearTimeout(gazeT); for (const n of Object.keys(el)) { clearTimeout(st[n].idle); el[n].remove(); delete el[n]; } }
  function reset() { clear(); for (const n of Object.keys(st)) delete st[n]; }
  return { add, face, eat, gasp, talk, lines, laugh, look, glances, play, lean, mouth, chew, at, clear, reset, el: n => el[n] };
})();
