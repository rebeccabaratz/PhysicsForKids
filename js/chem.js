/* ===================== ГЛАВА «ВЕЩЕСТВА» (атомы с ручками) =====================
   Атомы, связи и звук — из проб чата (репозиторий PhysicsForKids-Chat: atoms-svg/lib.js, chem-game/game.js),
   решения автора 2026-11-09 — в README того репозитория. Здесь они подключены к игре: фразы — say() игры
   (пока текстом; озвучка — в конце), Эли — спрайт игры, кнопки ◀ ▶ и карта — как в других главах.
   Всё внутри CHEM, чтобы имена (ring, slot, badge, SFX, P) не путались с именами игры.
   Глава: 6 веществ по картинке → свободный режим «Что получится?» с полкой веществ.
   Наружу: CHEM.scene() — сцена главы, CHEM.relayout(), CHEM.eli() — говорящий (для speaker()).

   Атомы: внешние электроны H 1, C 4, O 6, Na 1, Cl 7; рук — столько, сколько связей (H 1, O 2, C 4, Cl 1).
   Ковалентная связь — держатся за руки, в ладонях общая пара; ручки у обоих одинаковые и самые короткие: ладони ровно
   посередине между атомами (решение автора: электроны общие). Что на самом деле: в воде и кислоте пара сдвинута
   к тому, кто сильнее тянет (O, Cl) — об этом говорит фраза «הכלור מושך חזק יותר», на рисунке сдвига нет.
   Ионная связь — натрий отдаёт электрон, у него «+», у принявшего «−»; они притягиваются (пружинка), за руки не держатся.
   Что на самом деле: «кислота» — это HCl, растворённый в воде; соль, хлорка и сода — ионные кристаллы из многих
   ионов (здесь одна «пара»); молекулы показаны плоскими; правило «полное кольцо» (октет) — упрощение, верное для этих веществ. */
const CHEM = (() => {
const G = { SPREAD: 1.5,                          // насколько раздвинуты атомы до связи (1 — уже стоят вместе)
  BOND: 32, ION: 14 };                            // промежуток между атомами (px рисунка): за руки / «+» и «−» (решение автора 2026-11-09:
                                                  // ручки короче, чтобы вода выглядела привычно; в пробах чата было 72 и 52)

/* ---------- атомы: тело, лицо, ручки, ножки, электроны (из atoms-svg/lib.js) ---------- */
const P = {
  COLORS: { H: '#eef0f7', C: '#5a6078', O: '#f0605a', Na: '#a873f0', Cl: '#62c97a' },
  R: { H: 34, C: 46, O: 46, Na: 52, Cl: 52 },
  E_COLOR: '#3fd2ff', E_R: 7, E_GLOW: 5,
  LIMB: { c: '#dba584', w: 6 },   // светло-персиковые — выбрано автором (вариант Б из limb-choice.png)
  SPRING: '#ffd45a',                // цвет пружинки притяжения между «+» и «−»
  PULL: 0.3,
  WATER: { ANGLE: 104.45, DIST: 155, CLASP: 70 },   // вода: угол H–O–H (настоящий, 104,45°), расстояние O–H и где сцепляются ладошки (от центра O), px
  SMILE: { w: 0.17, depth: 0.12 },
  HAND: 1.0,                        // размер ладони (1 — ладонь ~26 px длиной); автор: «ещё меньше»
  LABEL_SIZE: 0.85,                 // наибольший размер букв на лбу (доля радиуса); код сам уменьшит, чтобы буквы влезли над глазами
  TURN: 26,                         // на сколько градусов голова поворачивается к тому, на кого смотрит (look = 1)
  LABEL: 'forehead',                // символ атома: 'forehead' — на лбу, 'below' — под ногами, 'none' — без подписи (адрес ?label=below)
  VOLUME: 0.45,                       // сила блика (0 — плоский, 1 — глянцевый)   // ширина и глубина улыбки (доли радиуса)
};
const NS = 'http://www.w3.org/2000/svg';
const shade = (hex, k) => {                       // светлее (k>0) / темнее (k<0)
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255]
    .map(v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
};
function defs(svg) {
  let d = `<filter id="eglow" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur stdDeviation="${P.E_GLOW}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fglow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="eg" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${P.E_COLOR}"/><stop offset="1" stop-color="${shade(P.E_COLOR, -0.35)}"/></radialGradient>`;
  for (const [k, c] of Object.entries(P.COLORS))
    d += `<radialGradient id="g${k}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${shade(c, 0.4)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c, -0.38)}"/></radialGradient>`;
  svg.insertAdjacentHTML('afterbegin', `<defs>${d}</defs>`);
}
const electron = (x, y) => `<circle cx="${x}" cy="${y}" r="${P.E_R}" fill="url(#eg)" filter="url(#eglow)"/>`;
function shadow(x, y, r) { return `<ellipse cx="${x}" cy="${y + r + 46}" rx="${r * 1.05}" ry="${r * 0.16}" fill="#000" opacity=".28"/>`; }
function legs(x, y, r) {                          // ножки-«шланги» и ботинки носком наружу (как в примере автора)
  const L = P.LIMB, dark = shade(L.c, -0.3); let s = '';
  for (const d of [-1, 1]) {
    const lx = x + d * 0.36 * r, ly = y + r * 0.9, fy = y + r + 40;
    s += `<path d="M${lx} ${ly} C${lx + d * 10} ${ly + 14} ${lx - d * 6} ${fy - 16} ${lx} ${fy}" stroke="${L.c}" stroke-width="${L.w}" fill="none" stroke-linecap="round"/>`
      + `<path d="M${lx - d * 7} ${fy + 4} Q${lx - d * 8} ${fy - 6} ${lx + d * 2} ${fy - 5} Q${lx + d * 17} ${fy - 4} ${lx + d * 19} ${fy + 3} Q${lx + d * 19} ${fy + 7} ${lx + d * 12} ${fy + 7} L${lx - d * 5} ${fy + 7} Q${lx - d * 7} ${fy + 7} ${lx - d * 7} ${fy + 4} Z" fill="${L.c}" stroke="${dark}" stroke-width="1.5"/>`;
  }
  return s;
}
/* ладошка: ладонь и большой палец (силуэт варежки). (hx, hy) — запястье, ang — куда смотрит рука.
   У руки, которая смотрит влево, рисунок отражаем: большой палец всегда сверху. Электрон кладём в ладонь: palm() */
function glove(hx, hy, ang, fl = 0) {               // fl = ±1 — задать, с какой стороны большой палец (для симметрии)
  const L = P.LIMB, flip = fl || (Math.cos(ang) < 0 ? -1 : 1), k = P.HAND, w = L.w / 2 / k;   // w — полтолщины руки в единицах ладони
  // ладонь — вариант Б из hands.html (выбор автора): запястье той же толщины, что рука, плавно расширяется в ладонь;
  // большой палец отходит сбоку у запястья под ~45° к пальцам; два лёгких штриха — намёк на пальцы
  return `<g transform="translate(${hx} ${hy}) rotate(${ang / D}) scale(${k} ${k * flip})">`
    + `<path d="M-4 ${w} C1 ${w} 4 7 8 7 L18.5 6.8 C23.5 6.8 23.5 -5.8 18.5 -5.8 L12.5 -5.9 C10.5 -5.9 9.4 -6.3 9.6 -7.6`
    + ` C10.2 -9.5 12.4 -10.6 13.2 -12 C14 -13.8 11.4 -15.4 9.6 -14.3 C6.5 -12.6 3.5 -9.5 1.5 -7 C0 -5 -2 ${-w} -4 ${-w} Z" fill="${L.c}"/>`
    + `<path d="M17.2 -2.2 Q19.6 -2 21.4 -1.2 M17.2 2.4 Q19.6 2.6 21.4 3.3" stroke="${shade(L.c, -0.32)}" stroke-width="0.8" fill="none" stroke-linecap="round" opacity=".55"/></g>`;
}
const palm = (hx, hy, ang) => [hx + Math.cos(ang) * 10 * P.HAND, hy + Math.sin(ang) * 10 * P.HAND];   // середина ладони
/* рука: от плеча (угол a на теле) к ладони (hx, hy); изгиб — «шланг»; withGlove=false — ладонь рисуется отдельно */
function arm(x, y, r, a, hx, hy, bend = 0.25, withGlove = true) {
  const L = P.LIMB, sx = x + Math.cos(a) * r * 0.95, sy = y + Math.sin(a) * r * 0.95;
  const mx = (sx + hx) / 2 - (hy - sy) * bend, my = (sy + hy) / 2 + (hx - sx) * bend;
  return `<path d="M${sx} ${sy} Q${mx} ${my} ${hx} ${hy}" stroke="${L.c}" stroke-width="${L.w}" fill="none" stroke-linecap="round"/>`
    + (withGlove ? glove(hx, hy, Math.atan2(hy - my, hx - mx)) : '');
}
const handAng = (x, y, r, a, hx, hy, bend) => {   // направление ладони — как в arm()
  const sx = x + Math.cos(a) * r * 0.95, sy = y + Math.sin(a) * r * 0.95;
  return Math.atan2(hy - ((sy + hy) / 2 + (hx - sx) * bend), hx - ((sx + hx) / 2 - (hy - sy) * bend));
};
/* лицо. Голова — шар; лицо нарисовано на нём, как переводная картинка (в покое — плоский рисунок, как раньше).
   look/lookY — куда смотреть (-1…1: влево/вверх … вправо/вниз). Шар поворачивается так, что середина лица уходит
   в сторону взгляда на угол |look|·P.TURN; глаза, рот, щёки и буквы на лбу поворачиваются вместе с ним и сжимаются
   в перспективе (как у настоящей головы). Всё, что ушло за край шара, обрезается. Буквы на лбу не поворачиваются:
   они стоят прямо над глазами, чтобы их было легко прочитать.
   k — символ атома (H, O, Na…): P.LABEL — где его писать; roll — не используется (наклон получается из геометрии) */
let FACE_N = 0;
const CH_W = { H: 0.72, C: 0.69, O: 0.77, N: 0.73, a: 0.56, l: 0.26 };   // ширина букв в долях кегля (приблизительно)
function relLum(hex) {                            // яркость цвета по WCAG — чтобы выбрать, тёмные буквы или белые
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function face(x0, y0, r, mood = 'smile', depth = P.SMILE.depth, look = 0, lookY = 0, k = '', roll = 0) {
  const len = Math.hypot(look, lookY), m = Math.min(1, len), phi = m * P.TURN * D;
  let R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  if (len > 1e-6) {                               // поворот шара: ось — перпендикуляр к направлению взгляда (формула Родрига)
    const ax = -lookY / len, ay = look / len, c = Math.cos(phi), sn = Math.sin(phi), t = 1 - c;
    R = [[c + t * ax * ax, t * ax * ay, sn * ay], [t * ax * ay, c + t * ay * ay, -sn * ax], [-sn * ay, sn * ax, c]];
  }
  const rot = v => R.map(row => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
  // точка картинки (u, v) в долях радиуса → место на экране и матрица для рисования маленькой детали в этом месте
  const at = (u, v) => {
    const z = Math.sqrt(Math.max(0.05, 1 - u * u - v * v)), p = rot([u, v, z]), eu = rot([1, 0, -u / z]), ev = rot([0, 1, -v / z]);
    const X = x0 + r * p[0], Y = y0 + r * p[1];
    return { vis: p[2] > 0.04, tr: `matrix(${eu[0] * r} ${eu[1] * r} ${ev[0] * r} ${ev[1] * r} ${X} ${Y})` };
  };
  const id = 'fc' + (++FACE_N), er = Math.max(4, r * 0.11) / r, NS = 'vector-effect="non-scaling-stroke"';
  let s = `<clipPath id="${id}"><circle cx="${x0}" cy="${y0}" r="${r * 0.985}"/></clipPath><g clip-path="url(#${id})">`;
  for (const d of [-1, 1]) { const e = at(d * 0.3, -0.12);
    if (e.vis) s += `<g transform="${e.tr}"><ellipse rx="${er}" ry="${er * 1.25}" fill="#1b1e3a"/><circle cx="${er * 0.35}" cy="${-er * 0.45}" r="${er * 0.35}" fill="#fff"/></g>`; }
  const mo = at(0, 0.27), mw = P.SMILE.w;         // лёгкая улыбка: без открытого рта (автор: «непонятно, чему он смеётся»)
  if (mo.vis) s += `<path transform="${mo.tr}" d="M${-mw} 0 Q0 ${depth} ${mw} 0" stroke="#1b1e3a" stroke-width="3" ${NS} fill="none" stroke-linecap="round"/>`;
  for (const d of [-1, 1]) { const c = at(d * 0.55, 0.18);
    if (c.vis) s += `<ellipse transform="${c.tr}" rx="0.13" ry="0.08" fill="#ff7a9a" opacity=".45"/>`; }
  s += '</g>';
  if (k && P.LABEL === 'forehead') {
    // буквы на лбу — прямые (не поворачиваются и не сжимаются — чтобы читались), над глазами, куда бы ни смотрела голова;
    // кегль — самый крупный, при котором буквы целиком внутри шара (P.LABEL_SIZE — потолок)
    const eyes = [-1, 1].map(d => { const c = rot([d * 0.3, -0.12, Math.sqrt(1 - 0.09 - 0.0144)]), t = rot([d * 0.3, -0.12 - er * 1.25, Math.sqrt(Math.max(0.05, 1 - 0.09 - (0.12 + er * 1.25) ** 2))]);
      return { x: x0 + r * c[0], top: y0 + r * t[1], vis: c[2] > 0.04 }; }).filter(e => e.vis);
    if (eyes.length) {
      // по горизонтали буквы сдвигаются за глазами наполовину — к середине лба, где шар шире и буквы крупнее
      const lx = x0 + (eyes.reduce((a, e) => a + e.x, 0) / eyes.length - x0) * 0.5, ly = Math.min(...eyes.map(e => e.top)) - r * 0.06;
      const wch = [...k].reduce((a, ch) => a + (CH_W[ch] || 0.7), 0), lim = (r * 0.94) ** 2;
      const inside = fs => [-1, 1].every(d => [ly, ly - 0.72 * fs].every(yy => (lx + d * wch * fs / 2 - x0) ** 2 + (yy - y0) ** 2 <= lim));
      let fs = r * P.LABEL_SIZE;
      while (fs > r * 0.2 && !inside(fs)) fs -= r * 0.01;
      const L = relLum(P.COLORS[k]), dark = (L + 0.05) / 0.064 > 1.05 / (L + 0.05);   // что контрастнее: тёмно-синие или белые буквы
      s += `<text x="${lx}" y="${ly}" font-size="${fs}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="400"`
        + ` fill="${dark ? '#1b1e3a' : '#ffffff'}" stroke="${dark ? '#ffffff' : '#1b1e3a'}" stroke-opacity="${dark ? 0.3 : 0.45}" stroke-width="3" paint-order="stroke">${k}</text>`;
    }
  }
  if (k && P.LABEL === 'below')                   // запасной вариант: табличка-подпись под ботинками
    s += `<text x="${x0}" y="${y0 + r + 76}" font-size="${Math.max(22, r * 0.55)}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="400" fill="#e8ebff" opacity=".9">${k}</text>`;
  return s;
}
/* тело: объём — градиент от светлого верха к тёмному краю, мягкий блик слева сверху (VOLUME — его сила) */
const body = (k, x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#g${k})"/>`
  + `<ellipse cx="${x - r * 0.36}" cy="${y - r * 0.42}" rx="${r * 0.3}" ry="${r * 0.18}" transform="rotate(-30 ${x - r * 0.36} ${y - r * 0.42})" fill="#fff" opacity="${P.VOLUME}" filter="url(#soft)"/>`;
const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 15}" fill="none" stroke="#c9d4ff" stroke-width="1.5" stroke-dasharray="3 6" opacity=".45"/>`;
/* пары на кольце: стороны — углы (рад), на каждой стороне два электрона рядом */
function pairs(x, y, r, angles) {
  const rr = r + 15, gap = 0.17 * (52 / r);
  return angles.map(a => electron(x + Math.cos(a - gap) * rr, y + Math.sin(a - gap) * rr) + electron(x + Math.cos(a + gap) * rr, y + Math.sin(a + gap) * rr)).join('');
}
const charge = (x, y, r, sign, k = 1) => `<g transform="translate(${x + r * 0.72} ${y - r * 0.78}) scale(${k}) translate(${-(x + r * 0.72)} ${-(y - r * 0.78)})"><circle cx="${x + r * 0.72}" cy="${y - r * 0.78}" r="15" fill="#fff" opacity=".92"/>`
  + `<path d="M${x + r * 0.72 - 7} ${y - r * 0.78} H${x + r * 0.72 + 7}${sign === '+' ? ` M${x + r * 0.72} ${y - r * 0.78 - 7} V${y - r * 0.78 + 7}` : ''}" stroke="#1b1e3a" stroke-width="3.5" stroke-linecap="round"/></g>`;
const D = Math.PI / 180;
/* пружинка между «+» и «−»: показывает, что они тянутся друг к другу.
   Рисуется как витая пружина сбоку (проекция спирали): растянута — витки редкие, сжата — витки-петельки.
   Что на самом деле: притяжение зарядов — электрическая сила; она СИЛЬНЕЕ, когда заряды БЛИЖЕ
   (закон Кулона, ~1/r²), а пружина тянет сильнее, когда растянута. Пружинка — только образ «тянутся друг к другу». */
function spring(x0, y0, x1, y1, coils = 7, R = 9, lead = 12) {
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len, px = -uy, py = ux;
  const L = Math.max(8, len - 2 * lead), tilt = 0.55, steps = coils * 24;
  const at = (a, b) => `${(x0 + ux * (lead + a) + px * b).toFixed(1)} ${(y0 + uy * (lead + a) + py * b).toFixed(1)}`;
  let d = `M${x0} ${y0} L${at(0, 0)}`;
  for (let i = 1; i <= steps; i++) { const u = i / steps, f = 2 * Math.PI * coils * u;
    d += ` L${at(L * u + tilt * R * (Math.cos(f) - 1), R * Math.sin(f))}`; }
  d += ` L${x1} ${y1}`;
  return `<path d="${d}" stroke="${P.SPRING}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#fglow)"/>`;
}
/* пустое место на кольце: сюда встанет электрон соседа (показываем только в начале, до связи) */
const slot = (x, y, r, a, op = 0.75) => `<circle cx="${x + Math.cos(a) * (r + 15)}" cy="${y + Math.sin(a) * (r + 15)}" r="${P.E_R}" fill="none" stroke="#dfe6ff" stroke-width="1.8" stroke-dasharray="2.5 2.5" opacity="${op}"/>`;

/* ===================== ВЕЩЕСТВА =====================
   atoms: [символ, x, y] — в «натуральных» пикселях рисунка (H r=34, C и O r=46, Na и Cl r=52);
   bonds: [a, b, кратность] — ковалентная (1 — одна пара рук, 2 — две); [донор, акцептор, 'ion'] — ионная.
   Расстояния: связь = r1 + r2 + 72 (руки), двойная — + 80, ионная пара — r1 + r2 + 52.
   Что на самом деле: молекулы показаны плоскими; соль, хлорка, сода — ионные кристаллы (здесь одна «пара»),
   заряд в ионе HCO₃⁻ и OCl⁻ размазан по атомам кислорода — «−» рисуем над тем, кто принял электрон. */
const SUB = {
  NaCl: { atoms: [['Na', -78, 0], ['Cl', 78, 0]], bonds: [[0, 1, 'ion']] },
  HCl: { atoms: [['H', -79, 0], ['Cl', 79, 0]], bonds: [[0, 1, 1]] },
  H2O: { atoms: [['O', 0, -45], ['H', -122.5, 50], ['H', 122.5, 50]], bonds: [[0, 1, 1], [0, 2, 1]] },   // угол H–O–H 104,5°
  NaClO: { atoms: [['Na', -160, 0], ['O', -10, 0], ['Cl', 160, 0]], bonds: [[0, 1, 'ion'], [1, 2, 1]] },
  NaHCO3: { atoms: [['C', 60, 0], ['O', 60, -172], ['O', 202, 82], ['H', 354, 82], ['O', -82, 82], ['Na', -232, 82]],
    bonds: [[0, 1, 2], [0, 2, 1], [2, 3, 1], [0, 4, 1], [5, 4, 'ion']] },
  CH3COOH: { atoms: [['C', 70, -40], ['O', 70, -212], ['O', 212, 42], ['H', 364, 42], ['C', -72, 42], ['H', 4, 174], ['H', -204, 118], ['H', -148, -90]],
    bonds: [[0, 1, 2], [0, 2, 1], [2, 3, 1], [0, 4, 1], [4, 5, 1], [4, 6, 1], [4, 7, 1]] },
  // ацетат натрия (уксус + сода): как уксус, но вместо водорода — натрий; он отдал электрон кислороду
  NaAc: { atoms: [['C', 70, -40], ['O', 70, -212], ['O', 212, 42], ['C', -72, 42], ['H', 4, 174], ['H', -204, 118], ['H', -148, -90], ['Na', 362, 42]],
    bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [3, 4, 1], [3, 5, 1], [3, 6, 1], [7, 2, 'ion']] },
  // свободный режим (до 5 атомов)
  H2: { atoms: [['H', -70, 0], ['H', 70, 0]], bonds: [[0, 1, 1]] },
  O2: { atoms: [['O', -86, 0], ['O', 86, 0]], bonds: [[0, 1, 2]] },
  Cl2: { atoms: [['Cl', -88, 0], ['Cl', 88, 0]], bonds: [[0, 1, 1]] },
  CO2: { atoms: [['O', -172, 0], ['C', 0, 0], ['O', 172, 0]], bonds: [[0, 1, 2], [1, 2, 2]] },
  CH4: { atoms: [['C', 0, 0], ['H', 107, -107], ['H', -107, -107], ['H', -107, 107], ['H', 107, 107]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
  H2O2: { atoms: [['H', -190, -100], ['O', -82, 0], ['O', 82, 0], ['H', 190, 100]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]] },
  NaOH: { atoms: [['Na', -150, 0], ['O', 0, 0], ['H', 152, 0]], bonds: [[0, 1, 'ion'], [1, 2, 1]] },
  // исключения: правило «полных колец» их не объясняет — атомы просто стоят вместе, без рук
  O3: { atoms: [['O', -112, 20], ['O', 0, -20], ['O', 112, 20]], bonds: [], exception: true },
  CO: { atoms: [['C', -60, 0], ['O', 60, 0]], bonds: [], exception: true },
  Na2: { atoms: [['Na', -62, 0], ['Na', 62, 0]], bonds: [], exception: true },      // кусочек металла натрия
};
const RECIPES = [['salt', 'NaCl'], ['acid', 'HCl'], ['water', 'H2O'], ['bleach', 'NaClO'], ['soda', 'NaHCO3'], ['vinegar', 'CH3COOH']];
const ICON = {                                    // карточки веществ (те же, что в основной игре)
  NaCl: '<path d="M50 14 L84 32 L84 70 L50 88 L16 70 L16 32 Z" fill="#f3f5ff"/><path d="M50 14 L84 32 L50 50 L16 32 Z" fill="#fff"/><path d="M50 50 L84 32 L84 70 L50 88 Z" fill="#c9cfee"/>',
  HCl: '<path d="M40 10 H60 V36 L82 82 Q84 90 74 90 H26 Q16 90 18 82 L40 36 Z" fill="rgba(220,235,255,.25)" stroke="#dff3ff" stroke-width="4"/><path d="M28 64 H72 L80 82 Q81 86 74 86 H26 Q19 86 20 82 Z" fill="#b6ff6a"/>',
  H2O: '<path d="M50 10 Q76 46 76 62 A26 26 0 0 1 24 62 Q24 46 50 10 Z" fill="#4fb6ff"/><ellipse cx="40" cy="58" rx="6" ry="10" fill="#fff" opacity=".6"/>',
  NaClO: '<rect x="40" y="8" width="20" height="12" rx="3" fill="#3d6bff"/><path d="M34 20 H66 Q78 28 78 44 V86 Q78 92 72 92 H28 Q22 92 22 86 V44 Q22 28 34 20 Z" fill="#f3f5ff"/><rect x="30" y="48" width="40" height="24" rx="5" fill="#3d6bff"/>',
  NaHCO3: '<rect x="22" y="20" width="56" height="64" rx="6" fill="#ff8a3d"/><rect x="30" y="34" width="40" height="22" rx="4" fill="#f3f5ff"/><path d="M14 92 Q50 70 86 92 Z" fill="#f3f5ff"/>',
  CH3COOH: '<rect x="42" y="6" width="16" height="14" rx="3" fill="#7a4a24"/><path d="M40 20 H60 V34 Q74 40 74 54 V86 Q74 92 68 92 H32 Q26 92 26 86 V54 Q26 40 40 34 Z" fill="rgba(255,214,140,.55)" stroke="#ffe0a8" stroke-width="3"/><circle cx="50" cy="66" r="12" fill="#ff4a4a"/><rect x="49" y="50" width="3" height="6" fill="#7a4a24"/>',
};
const V = { H: 1, C: 4, O: 6, Na: 1, Cl: 7 };                 // внешние электроны
const NEED = { H: 1, C: 4, O: 2, Cl: 1, Na: 0 };              // сколько связей нужно (сколько рук)
const PULLK = { Na: 0, H: 1, C: 2, Cl: 3, O: 4 };             // кто сильнее тянет общую пару
const ELEMS = ['H', 'C', 'O', 'Na', 'Cl'];
const angOf = (dx, dy) => Math.atan2(dy, dx);

/* пары на кольце — в самые большие промежутки между занятыми направлениями (по очереди туда, где просторнее) */
function freeAngles(occ, n) {
  if (!n) return [];
  if (!occ.length) return [...Array(n)].map((_, j) => -Math.PI / 2 + 2 * Math.PI * j / n);
  const o = occ.map(a => (a + 2 * Math.PI) % (2 * Math.PI)).sort((a, b) => a - b);
  const gaps = o.map((a, i) => ({ s: a, len: (i + 1 < o.length ? o[i + 1] : o[0] + 2 * Math.PI) - a, k: 0 }));
  for (let j = 0; j < n; j++) gaps.reduce((b, g) => g.len / (g.k + 1) > b.len / (b.k + 1) + 1e-9 ? g : b).k++;
  const out = [];
  for (const g of gaps) for (let j = 1; j <= g.k; j++) out.push(g.s + g.len * j / (g.k + 1));
  return out;
}

/* подготовить вещество: кто с кем связан, сколько рук и пар, где пары на кольце */
function prep(key, spread = G.SPREAD) {           // spread — насколько раздвинуты атомы до связи
  const S = SUB[key];
  const A = S.atoms.map(([k, x, y], i) => ({ i, k, fx: x, fy: y, r: P.R[k], cov: 0, gain: 0, give: 0, partners: [] }));
  const B = S.bonds.map(([a, b, o]) => ({ a, b, ion: o === 'ion', n: o === 'ion' ? 0 : o }));
  {                                                 // связи короче: направления — как на рисунке чата, длина — r1 + r2 + промежуток
    const placed = new Set([0]), q = [0];
    while (q.length) { const i = q.shift();
      for (const b of B) { const j = b.a === i ? b.b : b.b === i ? b.a : -1; if (j < 0 || placed.has(j)) continue;
        const dx = S.atoms[j][1] - S.atoms[i][1], dy = S.atoms[j][2] - S.atoms[i][2], d = Math.hypot(dx, dy) || 1, len = A[i].r + A[j].r + (b.ion ? G.ION : G.BOND);
        A[j].fx = A[i].fx + dx / d * len; A[j].fy = A[i].fy + dy / d * len; placed.add(j); q.push(j); } }
  }
  for (const b of B) {
    A[b.a].partners.push(b.b); A[b.b].partners.push(b.a);
    if (b.ion) { A[b.a].give++; A[b.b].gain++; } else { A[b.a].cov += b.n; A[b.b].cov += b.n; }
  }
  const cx = A.reduce((s, a) => s + a.fx, 0) / A.length, cy = A.reduce((s, a) => s + a.fy, 0) / A.length;
  for (const a of A) {
    a.sx = cx + (a.fx - cx) * spread; a.sy = cy + (a.fy - cy) * spread;
    const occ = [];
    for (const b of B) if (!b.ion && (b.a === a.i || b.b === a.i)) { const o = A[b.a === a.i ? b.b : b.a]; occ.push(angOf(o.fx - a.fx, o.fy - a.fy)); }
    if (a.gain) { const d = A[B.find(b => b.ion && b.b === a.i).a]; a.ionA = angOf(d.fx - a.fx, d.fy - a.fy); occ.push(a.ionA); }
    if (S.exception) { a.lp = freeAngles([], Math.floor(V[a.k] / 2)); a.single = V[a.k] % 2 ? -Math.PI / 2 + 0.6 : null; }
    else a.lp = freeAngles(occ, (V[a.k] - a.cov - a.gain - a.give) / 2);
    if (S.exception) {                             // смотрят на ближайшего соседа
      let best = null, bd = 1e9;
      for (const o of S.atoms.map((v, i) => i)) if (o !== a.i) { const d = Math.hypot(A[o].fx - a.fx, A[o].fy - a.fy); if (d < bd) { bd = d; best = o; } }
      a.partners = best === null ? [] : [best];
    }
  }
  return { key, A, B, hasIon: B.some(b => b.ion), hasCov: B.some(b => !b.ion), exception: !!S.exception };
}

/* ===================== РИСОВАНИЕ ВЕЩЕСТВА =====================
   st: wOut — натрий протянул руку; fly — электрон летит; sign — «+» и «−»; reach — руки тянутся друг к другу;
   join — электроны в ладонях становятся общей парой; pull — атомы сходятся (0 — раздвинуты, 1 — вместе);
   tension — пружинка натянута; boing — качнулись при встрече; hop — подпрыгнули от радости; t — время (для дрожи) */
const ST0 = { wOut: 0, fly: 0, sign: 0, reach: 0, join: 0, pull: 0, tension: 0, boing: 0, hop: 0, t: 0 };
function badge(x, y, sign, k) {                   // знак заряда в кружке над головой
  return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="16" fill="#fff" opacity=".95"/>`
    + `<path d="M-7 0 H7${sign === '+' ? ' M0 -7 V7' : ''}" stroke="#1b1e3a" stroke-width="3.5" stroke-linecap="round"/></g>`;
}
function drawMol(M, st, vis, over) {              // over — позиции атомов, заданные снаружи (в реакциях атомы идут к новым соседям)
  const A = M.A, show = i => !vis || vis.has(i);
  const pos = A.map(a => over ? { x: over[a.i].x, y: over[a.i].y - st.hop } : { x: lerp(a.sx, a.fx, st.pull), y: lerp(a.sy, a.fy, st.pull) - st.hop });
  for (const b of M.B) if (b.ion && st.boing) {      // пружинка чуть качнула ионную пару при встрече
    const p = pos[b.a], q = pos[b.b], d = Math.hypot(q.x - p.x, q.y - p.y) || 1, ux = (q.x - p.x) / d, uy = (q.y - p.y) / d;
    if (!A[b.a].cov) { p.x += ux * st.boing; p.y += uy * st.boing; }
    if (!A[b.b].cov) { q.x -= ux * st.boing; q.y -= uy * st.boing; }
  }
  // наклон к соседу, пока пружинка натянута (только у атомов без рук-связей: их тянут за голову, ноги стоят)
  const lean = A.map(a => {
    if (a.cov || !M.hasIon || !a.partners.length) return 0;
    const o = pos[a.partners[0]];
    return Math.sign(o.x - pos[a.i].x || 1) * 7 * st.tension * (1 + 0.18 * Math.sin(st.t * 2 * Math.PI * 13 + 1));
  });
  const feet = i => [pos[i].x, pos[i].y + A[i].r + 44];
  const wrap = (i, s) => lean[i] ? `<g transform="rotate(${lean[i]} ${feet(i)[0]} ${feet(i)[1]})">${s}</g>` : s;
  const turn = (p, i) => { if (!lean[i]) return p; const [fx, fy] = feet(i), a = lean[i] * D, dx = p[0] - fx, dy = p[1] - fy;
    return [fx + dx * Math.cos(a) - dy * Math.sin(a), fy + dx * Math.sin(a) + dy * Math.cos(a)]; };
  let sh = '', lg = '', rg = '', ar = '', bd = '', gl = '', fc = '', el = '', tp = '';
  const handsOf = A.map(() => 0);
  // ---- общая тень под веществом
  const vi = A.filter(a => show(a.i));
  if (over) sh = vi.map(a => shadow(pos[a.i].x, pos[a.i].y + st.hop, a.r)).join('');   // атомы идут поодиночке — тень у каждого своя
  else if (vi.length) {
    const xs = vi.map(a => pos[a.i].x), ys = vi.map(a => pos[a.i].y + a.r + 46);
    const mx = (Math.min(...xs) + Math.max(...xs)) / 2, w = (Math.max(...xs) - Math.min(...xs)) / 2 + 60;
    sh = `<ellipse cx="${mx}" cy="${Math.max(...ys) + st.hop}" rx="${w}" ry="${12 + w * 0.06}" fill="#000" opacity=".28"/>`;
  }
  // ---- ковалентные связи: по линии на каждую пару рук
  for (const b of M.B) if (!b.ion) {
    const ia = b.a, ib = b.b, P1 = pos[ia], P2 = pos[ib], d = Math.hypot(P2.x - P1.x, P2.y - P1.y) || 1;
    const ux = (P2.x - P1.x) / d, uy = (P2.y - P1.y) / d, px = -uy, py = ux;
    const c = [(P1.x + ux * A[ia].r + P2.x - ux * A[ib].r) / 2, (P1.y + uy * A[ia].r + P2.y - uy * A[ib].r) / 2];   // ладони — посередине между краями атомов
    for (let l = 0; l < b.n; l++) {
      const off = l - (b.n - 1) / 2, cl = [c[0] + px * off * 22, c[1] + py * off * 22];
      for (const [i, sgn] of [[ia, 1], [ib, -1]]) {
        if (!show(i)) continue;
        const a = A[i], Pi = pos[i], th = angOf(ux * sgn, uy * sgn) + off * 0.34 * sgn;
        const pre = [Pi.x + Math.cos(th) * (a.r + 30), Pi.y + Math.sin(th) * (a.r + 30)];
        const fin = [cl[0] - ux * 12 * sgn, cl[1] - uy * 12 * sgn];
        const w = [lerp(pre[0], fin[0], st.reach), lerp(pre[1], fin[1], st.reach)];
        const sa = angOf(w[0] - Pi.x, w[1] - Pi.y), bend = 0.1 * (off >= 0 ? 1 : -1) * sgn;
        const ha = handAng(Pi.x, Pi.y, a.r, sa, w[0], w[1], bend);
        ar += arm(Pi.x, Pi.y, a.r, sa, w[0], w[1], bend, false); gl += glove(w[0], w[1], ha); handsOf[i]++;
        const e0 = palm(w[0], w[1], ha);
        const e1 = b.n === 1 ? [c[0] + px * 9 * sgn, c[1] + py * 9 * sgn] : [cl[0] - ux * 8 * sgn, cl[1] - uy * 8 * sgn];
        tp += electron(lerp(e0[0], e1[0], st.join), lerp(e0[1], e1[1], st.join));
        if (st.join < 1) tp += slot(Pi.x, Pi.y, a.r, th + (off >= 0 ? 0.45 : -0.45) * sgn, 0.75 * (1 - st.join));   // пустое место — ждёт электрон соседа
      }
    }
  }
  // ---- ионные связи: натрий отдаёт электрон, «+» и «−», пружинка
  for (const b of M.B) if (b.ion) {
    const dn = A[b.a], ac = A[b.b], D0 = pos[b.a], A0 = pos[b.b];
    const d = Math.hypot(A0.x - D0.x, A0.y - D0.y) || 1, ux = (A0.x - D0.x) / d, uy = (A0.y - D0.y) / d;
    const gap = 0.17 * (52 / ac.r), slotA = ac.ionA - gap;
    const target = [A0.x + Math.cos(slotA) * (ac.r + 15), A0.y + Math.sin(slotA) * (ac.r + 15)];
    if (show(b.a)) {                                 // рука натрия: опущена → протянута к соседу → снова опущена
      const side = Math.sign(ux) || 1, rest = [D0.x + side * dn.r * 0.8, D0.y + dn.r * 0.85];
      const out = [D0.x + ux * (dn.r + 26), D0.y + uy * (dn.r + 26) - 20], w = [lerp(rest[0], out[0], st.wOut), lerp(rest[1], out[1], st.wOut)];
      const hang = lerp(Math.PI / 2, angOf(ux, uy) - 0.3 * side, st.wOut);
      ar += wrap(b.a, arm(D0.x, D0.y, dn.r, lerp(side > 0 ? 35 : 145, angOf(ux, uy) / D, st.wOut) * D, w[0], w[1], -0.2 * side, false));
      gl += wrap(b.a, glove(w[0], w[1], hang, side > 0 ? 0 : -1)); handsOf[b.a]++;
      if (st.fly <= 0) el += wrap(b.a, electron(...palm(w[0], w[1], hang)));
      else {                                         // электрон летит дугой на пустое место у соседа
        const from = palm(out[0], out[1], angOf(ux, uy) - 0.3 * side), ctrl = [(from[0] + target[0]) / 2, Math.min(from[1], target[1]) - 130], q = st.fly;
        tp += electron((1 - q) ** 2 * from[0] + 2 * (1 - q) * q * ctrl[0] + q * q * target[0], (1 - q) ** 2 * from[1] + 2 * (1 - q) * q * ctrl[1] + q * q * target[1]);
      }
    }
    if (show(b.b)) {                                 // у принимающего: свой одиночный электрон и пустое место рядом
      el += wrap(b.b, electron(A0.x + Math.cos(ac.ionA + gap) * (ac.r + 15), A0.y + Math.sin(ac.ionA + gap) * (ac.r + 15)));
      if (st.fly < 1) el += wrap(b.b, slot(A0.x, A0.y, ac.r, slotA, 0.75 * (1 - clamp(st.fly * 3 - 2))));
    }
    if (st.sign > 0 && show(b.a) && show(b.b)) {     // «+» и «−» над головами и пружинка между ними (дрожит, пока натянута)
      const bN = turn([D0.x, D0.y - dn.r - 52], b.a), bC = turn([A0.x, A0.y - ac.r - 52], b.b);
      const sh1 = Math.sin(st.t * 2 * Math.PI * 19), sh2 = Math.sin(st.t * 2 * Math.PI * 13 + 1), jit = 1.3 * st.tension * sh1;
      const dir = Math.sign(bC[0] - bN[0]) || 1;
      tp += `<g opacity="${st.sign}">${spring(bN[0] + 16 * dir, bN[1] + jit, bC[0] - 16 * dir, bC[1] - jit, 7, 9 + 1.4 * st.tension * sh2)}</g>`;
      tp += badge(bN[0], bN[1], '+', st.sign) + badge(bC[0], bC[1], '−', st.sign);
    }
  }
  // ---- атомы
  for (const a of A) {
    if (!show(a.i)) continue;
    const p = pos[a.i];
    lg += wrap(a.i, legs(p.x, p.y, a.r));
    const lost = a.give && st.fly >= 1;              // натрий отдал электрон — внешнего кольца больше нет
    if (!lost) rg += wrap(a.i, ring(p.x, p.y, a.r));
    if (!handsOf[a.i]) {                             // без рук-связей — рука опущена со стороны соседа
      const o = a.partners.length ? pos[a.partners[0]] : null, side = o ? Math.sign(o.x - p.x) || 1 : 1;
      const w = [p.x + side * a.r * 0.8, p.y + a.r * 0.85];
      ar += wrap(a.i, arm(p.x, p.y, a.r, (side > 0 ? 35 : 145) * D, w[0], w[1], 0.2 * -side, false));
      gl += wrap(a.i, glove(w[0], w[1], Math.PI / 2, side > 0 ? 0 : -1));
    }
    bd += wrap(a.i, body(a.k, p.x, p.y, a.r));
    let lx = 0, ly = 0;                              // смотрит на соседа (если сосед один)
    if (a.partners.length === 1) { const o = pos[a.partners[0]], dd = Math.hypot(o.x - p.x, o.y - p.y) || 1; lx = (o.x - p.x) / dd; ly = (o.y - p.y) / dd; }
    fc += wrap(a.i, face(p.x, p.y, a.r, 'smile', P.SMILE.depth - 0.04 * st.tension, lx, ly, a.k));
    let e = pairs(p.x, p.y, a.r, a.lp);
    if (a.single != null) e += electron(p.x + Math.cos(a.single) * (a.r + 15), p.y + Math.sin(a.single) * (a.r + 15));
    if (a.gain && st.fly >= 1) { const g2 = 0.17 * (52 / a.r); e += electron(p.x + Math.cos(a.ionA - g2) * (a.r + 15), p.y + Math.sin(a.ionA - g2) * (a.r + 15)); }
    el += wrap(a.i, e);
  }
  return sh + lg + rg + ar + bd + gl + fc + el + tp;
}

/* ===================== АТОМ «СТОИТ» (свободный режим, до проверки) ===================== */
const HAND_ANG = { H: [-30], C: [-30, -150, 25, 155], O: [-25, -155], Cl: [-25], Na: [-30] };
const PAIR_ANG = { H: [], C: [], O: [-90, 90], Cl: [-90, 180, 90], Na: [] };
function standing(k, x, y) {
  const r = P.R[k]; let s = shadow(x, y, r) + legs(x, y, r) + ring(x, y, r), top = '';
  for (const ad of HAND_ANG[k]) {
    const a = ad * D, hx = x + Math.cos(a) * (r + 30), hy = y + Math.sin(a) * (r + 30), bend = a > -Math.PI / 2 ? 0.2 : -0.2;
    const ha = handAng(x, y, r, a, hx, hy, bend);
    s += arm(x, y, r, a, hx, hy, bend); top += electron(...palm(hx, hy, ha));
    if (k !== 'Na') top += slot(x, y, r, a + (Math.cos(a) > 0 ? -0.42 : 0.42));
  }
  return s + body(k, x, y, r) + face(x, y, r, 'smile', P.SMILE.depth, 0, 0, k) + pairs(x, y, r, PAIR_ANG[k].map(v => v * D)) + top;
}

let TBL = { s: 1, tx: 0, ty: 0 };                 // масштаб и сдвиг стола (натуральные пиксели → экран)
function fitBox(box) {                             // box: [minX, minY, maxX, maxY] в натуральных пикселях → масштаб и сдвиг
  const [x0, y0, x1, y1] = box, th = LY.tblBot - LY.tblTop;
  const s = Math.min(1, (W * 0.94) / (x1 - x0), th / (y1 - y0));
  return { s, tx: W / 2 - s * (x0 + x1) / 2, ty: LY.tblTop + th / 2 - s * (y0 + y1) / 2 };
}
const fitTable = box => { TBL = fitBox(box); };
const toScreen = (x, y) => [TBL.tx + TBL.s * x, TBL.ty + TBL.s * y];
function molBox(M, which = 'spread') {             // рамка вещества: 'spread' — атомы раздвинуты, 'final' — вместе
  let b = [1e9, 1e9, -1e9, -1e9];
  for (const a of M.A) for (const [x, y] of [which === 'final' ? [a.fx, a.fy] : [a.sx, a.sy]])
    b = [Math.min(b[0], x - a.r - 70), Math.min(b[1], y - a.r - (M.hasIon ? 105 : 60)), Math.max(b[2], x + a.r + 70), Math.max(b[3], y + a.r + 62)];
  return b;
}
function drawTable(inner, op = 1) {
  layer.tbl.setAttribute('transform', `translate(${TBL.tx} ${TBL.ty}) scale(${TBL.s})`);
  layer.tbl.setAttribute('opacity', op);
  layer.tbl.innerHTML = inner;
}

/* карточка-рецепт: шарики нужных атомов; положенные — тусклые. В свободном режиме — три звёздочки */
function drawCard(list, placed) {
  if (!list) { layer.card.innerHTML = ''; return; }
  const n = list.length, d = Math.min(36, (W * 0.84) / n), w = n * d + 16, x0 = W / 2 - w / 2;
  let s = `<rect x="${x0}" y="${LY.cardY}" width="${w}" height="${LY.cardH}" rx="14" fill="rgba(13,16,51,.75)" stroke="rgba(201,207,238,.35)"/>`;
  list.forEach((k, i) => {
    const cx = x0 + 8 + d * (i + 0.5), cy = LY.cardY + LY.cardH / 2, r = d * 0.42 * (P.R[k] / 52 * 0.3 + 0.7), c = P.COLORS[k];
    const dark = relLum(c) > 0.18;
    s += `<g opacity="${placed[i] ? 0.28 : 1}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${k})"/>`
      + `<text x="${cx}" y="${cy + r * 0.36}" font-size="${r * 0.95}" text-anchor="middle" font-family="system-ui,sans-serif" fill="${dark ? '#1b1e3a' : '#fff'}">${k}</text></g>`;
  });
  layer.card.innerHTML = s;
}
function drawStars(n) {
  let s = '';
  for (let i = 0; i < G.FREE_GOAL; i++) {
    const cx = W / 2 + (i - (G.FREE_GOAL - 1) / 2) * 46, cy = LY.cardY + LY.cardH / 2, on = i < n;
    const pts = [...Array(10)].map((_, j) => { const a = -Math.PI / 2 + j * Math.PI / 5, rr = j % 2 ? 8 : 18; return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`; }).join(' ');
    s += `<polygon points="${pts}" fill="${on ? '#ffd45a' : 'rgba(255,255,255,.12)'}" stroke="${on ? '#fff3b0' : 'rgba(201,207,238,.4)'}" stroke-width="1.5"/>`;
  }
  layer.card.innerHTML = s;
}
function showIcon(key, on) {                       // большая карточка вещества над столом
  layer.fx.innerHTML = on && ICON[key] ? `<g transform="translate(${W / 2 - 40} ${Z.mode === 'free' ? LY.shelfY : LY.cardY - 4}) scale(.8)"><rect x="-6" y="-6" width="112" height="112" rx="18" fill="rgba(13,16,51,.8)" stroke="rgba(255,212,90,.6)"/><svg width="100" height="100" viewBox="0 0 100 100">${ICON[key]}</svg></g>` : '';
}

/* ===================== СВЯЗЬ: вся анимация вещества ===================== */
async function bondAnim(M) {
  const ion = M.hasIon, cov = M.hasCov;
  const a = ion ? 1.6 : 0.2, c = a + (cov ? 1.1 : 0.5), total = c + 2.2;
  const fired = new Set(), at = (t, when, name) => { if (t >= when && !fired.has(name + when)) { fired.add(name + when); csfx(name); } };
  const F0 = fitBox(molBox(M, 'spread')), F1 = fitBox(molBox(M, 'final'));
  await tween(total, k => {
    const t = k * total, pc = clamp((t - c) / 1.4), z = ease(clamp((t - c) / 1.7));   // «камера» приближается, пока атомы сходятся
    TBL = { s: lerp(F0.s, F1.s, z), tx: lerp(F0.tx, F1.tx, z), ty: lerp(F0.ty, F1.ty, z) };
    const st = {
      wOut: ion ? seg(t, 0.1, 0.6) * (1 - seg(t, 0.75, 1.45)) : 0, fly: ion ? seg(t, 0.65, 1.45) : 0, sign: ion ? seg(t, 1.45, 1.8) : 0,
      reach: cov ? seg(t, a, a + 0.7) : 0, join: cov ? seg(t, a + 0.6, a + 1.0) : 0, pull: pc ** 3,
      tension: ion ? clamp((t - 1.6) / 0.3) * (1 - pc ** 2) : 0,
      boing: ion && t > c + 1.4 ? 7 * Math.sin((t - c - 1.4) * 13) * Math.exp(-(t - c - 1.4) * 4) : 0,
      hop: t > c + 1.45 ? Math.sin(clamp((t - c - 1.45) / 0.55) * Math.PI) * 14 : 0, t,
    };
    drawTable(drawMol(M, st));
    if (ion) { at(t, 1.45, 'ping'); at(t, 1.5, 'pop'); at(t, 1.9, 'squeak'); if (c - 1.9 > 0.6) at(t, c - 0.3, 'squeak'); }
    if (cov) at(t, a + 0.75, 'dink');
    at(t, c, 'whisper'); at(t, c + 1.4, 'boing');
  });
}

/* ===================== ПОМОЩНИКИ ===================== */
const clamp = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = v => v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2;
const seg = (t, a, b) => ease(clamp((t - a) / (b - a)));
function tween(sec, fn) {                         // анимация: fn(k), k от 0 до 1 за sec секунд (K — общая скорость игры)
  return new Promise(res => {
    const t0 = performance.now();
    const step = now => { const k = clamp((now - t0) / (sec * 1000 * K)); fn(k); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
}

/* ===================== ЗВУК СОЛИ «Шёпот с искорками» (выбор автора; синтез из пробы чата) =====================
   динь (ping) — электрон на месте, пип (pop) — «+» и «−», скрип (squeak) — натянутая пружинка, ш-ш-ш (whisper) —
   сближение с искорками, мягкий высокий боинг (boing) — встреча; dink — общая пара, win — вещество готово.
   Громкость — как в пробе (мимо общего регулятора эффектов игры); ?mute — тишина. */
let OUT = null, NOISE = null;
function auCtx() {
  if (!soundOn()) return null;
  if (!OUT) { OUT = SND.ac.createGain(); OUT.gain.value = MUTE ? 0 : 1; OUT.connect(SND.ac.destination); }
  return SND.ac;
}
function auTone(at, f0, f1, dur, type, vol) {
  const c = SND.ac, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, at); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at + dur);
  g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  o.connect(g).connect(OUT); o.start(at); o.stop(at + dur + 0.05);
}
const auBell = (at, f, dur, vol) => { auTone(at, f, f, dur, 'sine', vol); auTone(at, 2.01 * f, 2.01 * f, dur, 'sine', vol * 0.35); };
function auNoise() {
  if (NOISE) return NOISE;
  const c = SND.ac, b = c.createBuffer(1, Math.ceil(c.sampleRate * 1.5), c.sampleRate), ch = b.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  return (NOISE = b);
}
const CS = {
  ping: at => auBell(at, 1046, 0.5, 0.12),
  pop: at => auTone(at, 660, 990, 0.09, 'sine', 0.08),
  squeak: at => auTone(at, 520, 760, 0.13, 'sine', 0.05),
  dink: at => auBell(at, 1319, 0.35, 0.07),
  whisper: at => {                                  // лёгкое высокое «ш-ш-ш» и тихие искорки — чаще к концу
    const c = SND.ac, dur = 1.42, n = 120, src = c.createBufferSource(); src.buffer = auNoise();
    const lo = c.createBiquadFilter(), hi = c.createBiquadFilter(), gl = c.createGain(), gh = c.createGain();
    lo.type = hi.type = 'bandpass'; lo.frequency.value = 3150; lo.Q.value = 1.4; hi.frequency.value = 6360; hi.Q.value = 1.4;
    const cl = new Float32Array(n), chh = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) * dur, p = Math.min(1, t / 1.4) ** 3, breath = 1 + 0.15 * Math.sin(2 * Math.PI * 3 * t);
      const env = t < 0.3 ? t / 0.3 * 0.6 : t < dur - 0.12 ? 0.6 + 0.4 * (t - 0.3) / (dur - 0.42) : (dur - t) / 0.12;
      cl[i] = 0.09 * (1 - p) * breath * env; chh[i] = 0.09 * p * breath * env;
    }
    gl.gain.setValueCurveAtTime(cl, at, dur); gh.gain.setValueCurveAtTime(chh, at, dur);
    src.connect(lo).connect(gl).connect(OUT); src.connect(hi).connect(gh).connect(OUT); src.start(at); src.stop(at + dur);
    for (let k = 0; k < 12; k++) auBell(at + 1.4 * Math.random() ** (1 / 3), [2093, 2349, 2637, 3136, 3520][Math.floor(Math.random() * 5)], 0.15, 0.012 + Math.random() * 0.013);
  },
  boing: at => {
    const c = SND.ac, o = c.createOscillator(), g = c.createGain(), v = c.createOscillator(), vg = c.createGain();
    o.frequency.value = 620; v.frequency.value = 12; vg.gain.value = 40; v.connect(vg).connect(o.frequency);
    g.gain.setValueAtTime(0.1, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.45);
    o.connect(g).connect(OUT); o.start(at); v.start(at); o.stop(at + 0.5); v.stop(at + 0.5);
  },
  win: at => [1047, 1319, 1568, 2093].forEach((f, i) => auBell(at + i * 0.12, f, 0.6, 0.08)),
};
function csfx(name) { const c = auCtx(); if (!c) return; try { CS[name](c.currentTime + 0.01); } catch (e) {} }

/* ===================== СЦЕНА ===================== */
const Z = {};                                     // состояние главы: root, svg, eli, redraw, binHandler
let svg = null, LY = {};
const layer = {};
function layout() {
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
  LY = { cardY: 100, cardH: 56, tblTop: 172, tblBot: H - 150, binY: H - 62, binR: Math.min(27, W / 14), shelfY: 92 };   // полка — ниже фразы (она бывает в две строки)
  if (Z.mode === 'free') LY.tblTop = LY.shelfY + 2 * (shelfD() + 4) + 56;   // свободный режим: сверху полка (и место для подсказки)
}
function initSvg() {
  svg.innerHTML = ''; defs(svg);
  svg.insertAdjacentHTML('afterbegin', '<defs><filter id="sil"><feColorMatrix type="matrix" values="0 0 0 0 .8  0 0 0 0 .83  0 0 0 0 .95  0 0 0 .3 0"/></filter></defs>');   // силуэт на полке
  svg.insertAdjacentHTML('beforeend', '<g id="tbl"></g><g id="obj"></g><g id="card"></g><g id="bins"></g><g id="fx"></g>');
  for (const id of ['tbl', 'obj', 'card', 'bins', 'fx']) layer[id] = svg.querySelector('#' + id);
}
/* корзинки: пять атомов внизу (только «головы» — тело, лицо, буква, вокруг — внешние электроны, поровну по кругу);
   нажатие — взять атом; ждут — светятся */
const outer = (k, r) => ring(0, 0, r) + [...Array(V[k])].map((_, i) => { const a = i / V[k] * 2 * Math.PI - Math.PI / 2; return electron(Math.cos(a) * (r + 15), Math.sin(a) * (r + 15)); }).join('');
const binX = i => W * (0.1 + 0.15 * i);
function drawBins() {
  let s = '';
  ELEMS.forEach((k, i) => {
    const sc = LY.binR / 52 * (P.R[k] / 52 * 0.35 + 0.65);
    s += `<g data-bin="${k}" class="chbin${Z.binsOn ? ' tappable' : ''}"><circle cx="${binX(i)}" cy="${LY.binY}" r="${LY.binR + 10}" fill="rgba(255,255,255,.06)" stroke="rgba(201,207,238,.25)"/>`
      + `<g class="binatom" transform="translate(${binX(i)} ${LY.binY}) scale(${sc})">${outer(k, P.R[k])}${body(k, 0, 0, P.R[k])}${face(0, 0, P.R[k], 'smile', P.SMILE.depth, 0, 0, k)}</g></g>`;
  });
  layer.bins.innerHTML = s;
}
function binsOn(on) { Z.binsOn = on; layer.bins.querySelectorAll('[data-bin]').forEach(g => g.classList.toggle('tappable', on)); }
function shakeBin(k) {
  const g = layer.bins.querySelector(`[data-bin="${k}"] .binatom`); if (!g) return;
  const base = g.getAttribute('transform');
  tween(0.45, q => g.setAttribute('transform', base + ` rotate(${Math.sin(q * Math.PI * 4) * 14 * (1 - q)})`));
}
const waitBin = () => new Promise(res => { Z.binHandler = k => { Z.binHandler = null; binsOn(false); res(k); }; binsOn(true); });
function placeEli() { setB(Z.eli, L.eli * 0.8); put(Z.eli, W * 0.88, LY.binY - 6, Z.eli._k ?? 1); }   // справа в ряду корзинок — не заслоняет вещество

async function flyToTable(k, nx, ny) {             // атом летит из корзинки на своё место на столе
  const i = ELEMS.indexOf(k), [x1, y1] = toScreen(nx, ny), x0 = binX(i), y0 = LY.binY, sc0 = LY.binR / 52, sc1 = TBL.s;
  await tween(0.45, q => {
    const e = ease(q), x = lerp(x0, x1, e), y = lerp(y0, y1, e) - Math.sin(q * Math.PI) * 60, s = lerp(sc0, sc1, e);
    layer.fx.innerHTML = `<g transform="translate(${x} ${y}) scale(${s})">${body(k, 0, 0, P.R[k])}${face(0, 0, P.R[k], 'smile', P.SMILE.depth, 0, 0, k)}</g>`;
  });
  layer.fx.innerHTML = '';
}

/* одно вещество по картинке: «давайте сделаем…» → дети берут атомы из корзинок → связь → «это…» */
async function recipe(id, key, first) {
  const M = prep(key);
  const list = M.A.map(a => a.k), placed = list.map(() => false), vis = new Set();
  Z.redraw = () => { fitTable(molBox(M)); drawCard(list, placed); drawTable(drawMol(M, ST0, vis)); };
  Z.redraw();
  await say(T.chMake[id], { next: false });
  if (first) { await say(T.chHow, { next: false }); showText(T.chMake[id]); }
  let wrongSaid = false;
  while (placed.includes(false)) {
    const k = await waitBin();
    const j = list.findIndex((kk, i) => kk === k && !placed[i]);
    if (j < 0) {                                   // такой атом сейчас не нужен — корзинка мотает головой
      sfx('oops'); shakeBin(k);
      if (!wrongSaid) { wrongSaid = true; await say(T.chWrong, { next: false }); showText(T.chMake[id]); }
      continue;
    }
    placed[j] = true; sfx('tap'); playVoice(T.chNames[k] + '.', true); drawCard(list, placed);
    await flyToTable(k, M.A[j].sx, M.A[j].sy);
    vis.add(j); drawTable(drawMol(M, ST0, vis));
  }
  hideSay(); await wait(300);
  const fin = { ...ST0, pull: 1, sign: M.hasIon ? 1 : 0, fly: 1, reach: 1, join: 1 };
  Z.redraw = null;                                 // пока идёт анимация, поворот экрана её не трогает
  await bondAnim(M);
  Z.redraw = () => { fitTable(molBox(M, 'final')); drawTable(drawMol(M, fin)); showIcon(key, true); };
  csfx('win'); showIcon(key, true); drawCard(null);
  for (const t of T.chAbout[id]) await say(t);
  showIcon(key, false); hideSay(); Z.redraw = null;
  await tween(0.4, q => drawTable(drawMol(M, fin), 1 - q));
}

/* ===================== СВОБОДНЫЙ РЕЖИМ «ЧТО ПОЛУЧИТСЯ?» =====================
   Задание чата specs/chem-free-mode.md (идея автора): дети сами кладут на стол до 5 атомов и нажимают на Эли.
   Вещество получается, когда у каждого атома полное внешнее кольцо (H — 2 электрона, остальные — 8); связей нужно
   H 1, Cl 1, O 2, C 4; натрий отдаёт электрон тому, кто возьмёт (Cl, O, H). Проверяем по СПИСКУ (FREE_MAP):
   правило «разрешает» и вещества с трудным именем («такое вещество есть»), а озон и угарный газ им не объясняются.
   Что на самом деле: O₃ и CO существуют, но правилом полных колец не описываются (заряды на атомах / тройная связь) —
   они в списке как исключения, без рук; Na + Na — кусочек металла (электроны общие у всех атомов), пара Na₂ почти не встречается.
   Полка: все вещества, которые можно найти (до 5 атомов); найденные — цветные, остальные — силуэты.
   Четыре вещества из рецептов уже стоят на полке. Цель — найти FREE_GOAL новых.
   Подсказка: после 3 неудач подряд под полкой появляются атомы одного ненайденного вещества, его место мигает.
   Знак опасности (красный треугольник) — у хлора, угарного газа и едкого натра. */
const FREE_GOAL = 3, MAX_FREE = 5;
Object.assign(ICON, {
  H2: '<path d="M50 70 Q48 84 54 96" stroke="#c9cfee" stroke-width="2" fill="none"/><ellipse cx="50" cy="38" rx="26" ry="31" fill="#bfe6ff"/><path d="M45 68 L55 68 L50 74 Z" fill="#bfe6ff"/><ellipse cx="40" cy="27" rx="7" ry="10" fill="#fff" opacity=".7"/>',
  O2: '<path d="M50 10 V42 M50 42 Q42 44 40 52 M50 42 Q58 44 60 52" stroke="#ff9ab0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M38 40 Q16 44 16 72 Q16 90 32 90 Q42 90 42 76 V52 Q42 42 38 40 Z" fill="#ff7a9a"/><path d="M62 40 Q84 44 84 72 Q84 90 68 90 Q58 90 58 76 V52 Q58 42 62 40 Z" fill="#ff7a9a"/>',
  Cl2: '<path d="M22 70 Q8 70 10 56 Q12 44 26 46 Q28 28 46 30 Q60 18 72 34 Q90 32 88 50 Q96 64 82 70 Z" fill="#c8e86a" opacity=".9"/>',
  CO2: '<circle cx="34" cy="70" r="14" fill="none" stroke="#9fd8ff" stroke-width="4"/><circle cx="62" cy="48" r="11" fill="none" stroke="#9fd8ff" stroke-width="4"/><circle cx="44" cy="30" r="8" fill="none" stroke="#9fd8ff" stroke-width="4"/><circle cx="72" cy="80" r="7" fill="none" stroke="#9fd8ff" stroke-width="4"/>',
  CH4: '<rect x="16" y="80" width="68" height="12" rx="5" fill="#6b7088"/><path d="M28 78 Q30 50 40 64 Q44 34 50 58 Q56 34 60 64 Q70 50 72 78 Z" fill="#4fb6ff"/><path d="M40 78 Q44 64 50 70 Q56 64 60 78 Z" fill="#bfe6ff"/>',
  H2O2: '<rect x="40" y="8" width="20" height="12" rx="3" fill="#f3f5ff"/><path d="M36 20 H64 Q76 28 76 42 V86 Q76 92 70 92 H30 Q24 92 24 86 V42 Q24 28 36 20 Z" fill="#7a4a24"/><rect x="32" y="48" width="36" height="26" rx="4" fill="#f3f5ff"/><path d="M50 52 V70 M41 61 H59" stroke="#ff4a4a" stroke-width="5"/>',
  NaOH: '<rect x="38" y="6" width="24" height="14" rx="3" fill="#ff4a4a"/><path d="M32 20 H68 Q78 28 78 42 V86 Q78 92 72 92 H28 Q22 92 22 86 V42 Q22 28 32 20 Z" fill="#f3f5ff"/><path d="M32 70 Q50 56 68 70" stroke="#9aa0c8" stroke-width="5" fill="none"/>',
  O3: '<circle cx="50" cy="56" r="40" fill="none" stroke="#9fd8ff" stroke-width="5" opacity=".6"/><circle cx="50" cy="56" r="30" fill="#3d6bff"/><path d="M36 42 Q46 38 48 48 Q40 56 34 50 Z M56 60 Q66 56 68 66 Q60 74 54 68 Z" fill="#3fbf55"/><path d="M84 6 L74 18 M94 18 L80 24" stroke="#ffd45a" stroke-width="4" stroke-linecap="round"/>',
  CO: '<path d="M22 72 Q6 72 8 56 Q10 42 26 44 Q28 26 46 28 Q60 16 72 32 Q92 30 90 50 Q98 66 82 72 Z" fill="#8a90a8"/>',
  Na2: '<path d="M14 62 L34 42 H86 L66 62 Z" fill="#e8ecff"/><path d="M14 62 H66 V82 H14 Z" fill="#b9c0d8"/><path d="M66 62 L86 42 V62 L66 82 Z" fill="#8a90a8"/>',
});
const DANGER = new Set(['Cl2', 'CO', 'NaOH']);
const DANGER_SVG = '<path d="M74 66 L96 98 H52 Z" fill="#ffd45a" stroke="#ff4a4a" stroke-width="5" stroke-linejoin="round"/><path d="M74 76 V87 M74 92 V93" stroke="#1b1e3a" stroke-width="5" stroke-linecap="round"/>';
const SHELF = ['NaCl', 'HCl', 'H2O', 'NaClO', 'H2', 'O2', 'Cl2', 'CO2', 'CH4', 'H2O2', 'NaOH', 'O3', 'CO', 'Na2'];
const shelfD = () => Math.min(46, (W - 32) / 7 - 4);
function drawShelf(found, hint, t = 0) {           // полка в два ряда по 7; hint — подсказка: атомы вещества под полкой
  const d = shelfD(), x0 = W / 2 - 3.5 * (d + 4);
  let s = '';
  SHELF.forEach((key, i) => {
    const col = LANG === 'he' ? 6 - i % 7 : i % 7;   // на иврите полка заполняется справа налево
    const x = x0 + col * (d + 4) + 2, y = LY.shelfY + Math.floor(i / 7) * (d + 4), on = found.has(key);
    s += `<rect x="${x}" y="${y}" width="${d}" height="${d}" rx="9" fill="rgba(13,16,51,.7)" stroke="${key === hint ? '#ffd45a' : 'rgba(201,207,238,.3)'}" stroke-width="${key === hint ? 3 : 1}"${key === hint ? ' class="chhint"' : ''}/>`
      + `<g transform="translate(${x + d * 0.1} ${y + d * 0.1}) scale(${d * 0.8 / 100})"${on ? '' : ' filter="url(#sil)"'}>${ICON[key]}${on && DANGER.has(key) ? DANGER_SVG : ''}</g>`;
  });
  if (hint) {                                      // подсказка: шарики атомов, как на карточке-рецепте
    const list = SUB[hint].atoms.map(a => a[0]), n = list.length, dd = 34, w = n * dd + 16, hx = W / 2 - w / 2, hy = LY.shelfY + 2 * (d + 4) + 6;
    s += `<rect x="${hx}" y="${hy}" width="${w}" height="44" rx="12" fill="rgba(13,16,51,.75)" stroke="#ffd45a"/>`;
    list.forEach((k, i) => { const cx = hx + 8 + dd * (i + 0.5), cy = hy + 22, r = dd * 0.42 * (P.R[k] / 52 * 0.3 + 0.7), dark = relLum(P.COLORS[k]) > 0.18;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${k})"/><text x="${cx}" y="${cy + r * 0.36}" font-size="${r * 0.95}" text-anchor="middle" font-family="system-ui,sans-serif" fill="${dark ? '#1b1e3a' : '#fff'}">${k}</text>`; });
  }
  layer.card.innerHTML = s;
}

const LOOSE = [[0, 0], [-170, 0], [170, 0], [-85, 205], [85, 205]];
const formula = list => ELEMS.map(k => [k, list.filter(x => x === k).length]).filter(([, n]) => n).map(([k, n]) => k + n).join('');
const FREE_MAP = {};
for (const key of Object.keys(SUB)) if (SUB[key].atoms.length <= MAX_FREE) FREE_MAP[formula(SUB[key].atoms.map(a => a[0]))] = key;
/* после того как каждый натрий отдал свой электрон (сначала хлору, потом кислороду, потом водороду; углероду — нет):
   сколько связей ещё нужно каждому из остальных атомов и остались ли натрии без пары */
function needsAfterNa(list) {
  const cov = list.filter(k => k !== 'Na'), need = cov.map(k => NEED[k]);
  let na = list.length - cov.length;
  for (const pref of ['Cl', 'O', 'H']) for (let i = 0; i < cov.length; i++) while (na && cov[i] === pref && need[i] > 0) { need[i]--; na--; }
  return { cov, need, na };
}
/* можно ли из этих атомов собрать вещество по правилу «полных колец» */
function feasible(list) {
  const { need, na } = needsAfterNa(list), n = need.length;
  if (na || !n) return false;                        // натрию некому отдать электрон
  const sum = need.reduce((a, b) => a + b, 0), mx = Math.max(...need);
  if (!sum) return true;                             // все кольца уже полные (кусочек соли)
  if (n === 2) return need[0] === need[1] && need[0] <= 3;
  return sum % 2 === 0 && sum / 2 >= n - 1 && mx <= sum - mx && Math.min(...need) >= 1;
}
function twoKnown(list) {                          // можно ли разделить на два знакомых вещества
  const n = list.length;
  for (let m = 1; m < (1 << n) - 1; m++) {
    const a = list.filter((_, i) => m >> i & 1), b = list.filter((_, i) => !(m >> i & 1));
    if (FREE_MAP[formula(a)] && FREE_MAP[formula(b)]) return true;
  }
  return false;
}
function judge(list) {                              // → { ok:true, key } или { ok:false, text, k — кто мотает головой }
  const F = T.chFail;
  if (list.length === 1) return { ok: false, text: F.alone, k: list[0] };
  const key = FREE_MAP[formula(list)];
  if (key) return { ok: true, key };
  if (feasible(list)) return { ok: false, text: F.unknown };   // по правилу колец получается (напр. муравьиная кислота HCOOH)
  if (twoKnown(list)) return { ok: false, text: F.two };
  const byCount = [...new Set(list)].sort((a, b) => list.filter(x => x === b).length - list.filter(x => x === a).length);
  for (const k of byCount) {                        // лишний атом: без него получается знакомое вещество
    const i = list.indexOf(k), rest = list.filter((_, j) => j !== i);
    if (FREE_MAP[formula(rest)]) return { ok: false, text: F.extra[k], k };
  }
  const { cov, need, na } = needsAfterNa(list);
  if (na) return { ok: false, text: F.naNoTaker, k: 'Na' };
  let best = -1;                                    // кому больше всех не хватает
  cov.forEach((k, i) => { if (need[i] > 0 && (best < 0 || need[i] > need[best])) best = i; });
  if (best < 0) return { ok: false, text: F.unknown };
  return { ok: false, text: F.missing[cov[best]], k: cov[best] };
}
function shakeLoose(table, k) {                    // атом, которому плохо (или лишний), мотает головой
  const i = table.indexOf(k), g = layer.tbl.querySelector(`[data-loose="${i}"]`); if (!g) return;
  const [x, y] = LOOSE[i];
  tween(0.6, q => g.setAttribute('transform', `rotate(${Math.sin(q * Math.PI * 4) * 10 * (1 - q)} ${x} ${y + P.R[k] + 44})`));
}
const eliCall = on => Z.eli.classList.toggle('tappable', on);   // Эли светится: «нажмите на меня — проверим»

async function freeMode() {
  Z.mode = 'free'; layout(); drawCard(null);
  const found = new Set(RECIPES.map(r => r[1]).filter(k => SHELF.includes(k))), table = [];
  let newFound = 0, fails = 0, hint = null;
  const box = [-170 - 52 - 75, -52 - 70, 170 + 52 + 75, 205 + 52 + 62];
  const redraw = (op = 1) => { fitTable(box); drawShelf(found, hint); drawTable(table.map((k, i) => `<g data-loose="${i}" style="cursor:pointer">${standing(k, ...LOOSE[i])}</g>`).join(''), op); };
  Z.redraw = () => redraw();
  redraw();
  for (const t of T.chFreeIntro) await say(t);
  hideSay();
  while (newFound < FREE_GOAL) {
    eliCall(table.length > 0);
    const act = await new Promise(res => {
      Z.binHandler = k => res({ k }); Z.looseHandler = i => res({ remove: i }); Z.eliHandler = () => res({ check: true }); binsOn(true);
    });
    Z.binHandler = Z.looseHandler = Z.eliHandler = null; binsOn(false);
    if (act.k) {                                   // взять атом из корзинки
      if (table.length >= MAX_FREE) { sfx('oops'); shakeBin(act.k); await say(T.chFreeFull, { next: false }); continue; }
      sfx('tap'); playVoice(T.chNames[act.k] + '.', true); fitTable(box);
      await flyToTable(act.k, ...LOOSE[table.length]); table.push(act.k); redraw(); continue;
    }
    if (act.remove != null) { sfx('pop'); table.splice(act.remove, 1); redraw(); continue; }   // атом со стола — обратно в корзинку
    eliCall(false);                                // проверка
    if (!table.length) { await say(T.chFreeEmpty, { next: false }); continue; }
    const res = judge(table);
    if (!res.ok) {
      sfx('oops'); if (res.k) shakeLoose(table, res.k);
      await say(res.text); await say(T.chFreeMore, { next: false });
      if (++fails >= 3 && !hint) {                  // подсказка: атомы одного ненайденного вещества
        const left = SHELF.filter(k => !found.has(k)); hint = left[Math.floor(Math.random() * left.length)]; fails = 0;
        redraw(); sfx('sparkle'); await say(T.chFreeHint, { next: false });
      }
      continue;
    }
    // получилось: атомы встают по местам вещества — и связываются
    fails = 0; Z.redraw = null;
    await tween(0.3, q => redraw(1 - q));
    const M = prep(res.key), fin = { ...ST0, pull: 1, sign: M.hasIon ? 1 : 0, fly: 1, reach: 1, join: 1 };
    fitTable(molBox(M)); drawTable(drawMol(M, ST0), 0);
    await tween(0.3, q => drawTable(drawMol(M, ST0), q));
    await wait(250);
    await bondAnim(M);
    if (found.has(res.key)) { await say(T.chFound[res.key]); await say(T.chFreeAgain); }
    else {
      found.add(res.key); newFound++; if (hint === res.key) hint = null;
      csfx('win'); drawShelf(found, hint); showIcon(res.key, true);
      await say(T.chFound[res.key]); showIcon(res.key, false);
    }
    hideSay();
    await tween(0.4, q => drawTable(drawMol(M, fin), 1 - q));
    table.length = 0; Z.redraw = () => redraw(); redraw();
  }
  eliCall(false); Z.redraw = null;
}

async function scene() {
  await flash();
  clearStage();
  phase = 'chem'; setLabel(T.chLabel);
  for (const k of Object.keys(Z)) delete Z[k];
  Z.root = document.createElement('div'); Z.root.id = 'chem'; stage.appendChild(Z.root);
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.id = 'chsvg'; Z.root.appendChild(svg);
  svg.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-bin]'); if (b && Z.binHandler) { Z.binHandler(b.dataset.bin); return; }
    const l = e.target.closest('[data-loose]'); if (l && Z.looseHandler) Z.looseHandler(+l.dataset.loose);
  });
  Z.eli = sprite('eli_hello', 'front'); Z.eli.addEventListener('click', () => { if (!talkTap() && Z.eliHandler) Z.eliHandler(); });
  layout(); initSvg(); drawBins(); placeEli();
  await unflash();
  for (const t of T.chIntro) await say(t);
  if (!/[?&]free\b/.test(location.search))          // ?free в адресе — сразу свободный режим (для проверки)
    for (let i = 0; i < RECIPES.length; i++) await recipe(RECIPES[i][0], RECIPES[i][1], i === 0);
  drawCard(null);
  await flash(); await unflash();
  await freeMode();
  await say(T.chWin);
  await say(T.fireBye);
  await eliVanish(Z.eli);
  Z.root = null;
}
function relayout() {
  if (!Z.root) return;
  layout(); drawBins(); placeEli();
  if (Z.redraw) Z.redraw();
}

return { scene, relayout, eli: () => Z.eli, test: { judge, FREE_MAP, prep, drawMol, defs, molBox, ST0, SUB } };   // test — для проверки и tools/atoms.html
})();
