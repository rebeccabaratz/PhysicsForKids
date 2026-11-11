// Склад видео детей: tools/kids_gallery.html — все анимации (img/kids) и исходные видео (art/kids), чтобы выбрать куски.
// Запуск: node tools/make_kids_gallery.mjs; смотреть: http://127.0.0.1:8123/tools/kids_gallery.html
import fs from 'fs';
const NAMES = { lael: 'Лаэль', beeri: 'Беэри', arbel: 'Арбель', shaked: 'Шакед' };
const img = fs.readdirSync('img/kids').filter(f => f.endsWith('.webp')).sort();
const mp4 = fs.readdirSync('art/kids').filter(f => f.endsWith('.mp4')).sort();
let h = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Склад видео детей</title>
<style>body{margin:0;padding:16px;background:#14183a;color:#eef;font:15px Rubik,Arial,sans-serif}h2{font-weight:400;margin:24px 0 8px}
.g{display:flex;flex-wrap:wrap;gap:12px}.c{background:#232a5c;border-radius:10px;padding:6px;width:170px;text-align:center}
.c img,.c video{width:158px;height:281px;object-fit:contain;background:#2e3878;border-radius:6px}.c div{font-size:12px;word-break:break-all;margin-top:4px}
p{color:#aab}</style><h1 style="font-weight:400">Склад видео детей</h1>
<p>Анимации в игре (без фона) и исходные видео (зелёный фон; можно остановить и перемотать — назовите имя файла и секунду).</p>`;
for (const n of Object.keys(NAMES)) {
  h += `<h2>${NAMES[n]} — в игре</h2><div class="g">` + img.filter(f => f.startsWith(n)).map(f => `<div class="c"><img src="../img/kids/${f}" loading="lazy"><div>${f}</div></div>`).join('') + '</div>';
  h += `<h2>${NAMES[n]} — исходные видео</h2><div class="g">` + mp4.filter(f => f.startsWith(n)).map(f => `<div class="c"><video src="../art/kids/${f}" controls loop muted preload="metadata"></video><div>${f}</div></div>`).join('') + '</div>';
}
fs.writeFileSync('tools/kids_gallery.html', h);
console.log('tools/kids_gallery.html:', img.length, 'анимаций и картинок,', mp4.length, 'видео');
