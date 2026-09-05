import {CanvasTexture, SRGBColorSpace, LinearFilter} from 'three';
import {APPLE_PATH} from '@/lib/macbook';
import {SCREEN_CODE, segment} from '@/lib/scroll-story';
export interface ScreenCopy {
  codeLabel: string;
  screenCaption: string;
  menu: string;
  codeMenu: string;
  safariMenu: string;
  finderTitle: string;
  finderSidebar: string;
  screenDate: string;
}
const W = 1512,
  H = 982;
const BOX = {x: 42, y: 65, w: 1428, h: 808};
const URLS = ['heycirkle.com', 'teo-job-flow.vercel.app', 'bytesandpixels.co/clue-clash'];
function round(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
function apple(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.fill(new Path2D(APPLE_PATH));
  ctx.restore();
}
function desktop(ctx: CanvasRenderingContext2D, app: string, copy: ScreenCopy) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#111f85');
  g.addColorStop(0.48, '#566def');
  g.addColorStop(1, '#e994bf');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const wave = ctx.createLinearGradient(0, 400, 0, H);
  wave.addColorStop(0, '#9585ef');
  wave.addColorStop(1, '#22269d');
  ctx.fillStyle = wave;
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.bezierCurveTo(370, 420, 390, 950, W, 410);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();
  ctx.fillStyle = '#10194438';
  ctx.fillRect(0, 0, W, 34);
  ctx.fillStyle = '#fff';
  apple(ctx, 22, 8, 17);
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(app, 61, 23);
  ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
  let mx = 61 + ctx.measureText(app).width + 30;
  const activeMenu =
    app === 'Safari' ? copy.safariMenu : app === 'Code' ? copy.codeMenu : copy.menu;
  activeMenu.split('|').forEach((item) => {
    if (mx + ctx.measureText(item).width > 690) return;
    ctx.fillText(item, mx, 23);
    mx += ctx.measureText(item).width + 20;
  });
  // Notch-safe status area. Draw recognizable status icons instead of random glyphs.
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.roundRect(1190, 11, 27, 12, 3);
  ctx.stroke();
  ctx.fillRect(1193, 14, 20, 6);
  ctx.fillRect(1219, 15, 2, 4);
  [6, 10, 14].forEach((r) => {
    ctx.beginPath();
    ctx.arc(1250, 25, r, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(1288, 16, 4.5, 0, Math.PI * 2);
  ctx.moveTo(1292, 20);
  ctx.lineTo(1297, 25);
  ctx.stroke();
  round(ctx, 1316, 11, 18, 5, 3, '#fff');
  round(ctx, 1316, 20, 18, 5, 3, '#fff');
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText(copy.screenDate, W - 20, 23);
  ctx.textAlign = 'left';
  // Glass dock with a compact, deliberately decorative set of application icons.
  round(ctx, 535, 904, 442, 66, 19, '#e6e9ff5e');
  ctx.strokeStyle = '#ffffff66';
  ctx.lineWidth = 1;
  ctx.stroke();
  const colors = ['#5cb2ff', '#ffffff', '#277bc5', '#24242c', '#faf4d7', '#e8eaf4'];
  colors.forEach((color, i) => {
    const x = 548 + i * 70;
    round(ctx, x, 913, 49, 49, 12, color);
    ctx.fillStyle = i === 3 ? '#6bf0b0' : i === 4 ? '#d78633' : '#ffffff';
    ctx.font = '28px -apple-system,sans-serif';
    ctx.textAlign = 'center';
    if (i === 0) {
      ctx.strokeStyle = '#17346c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 14, 928);
      ctx.lineTo(x + 14, 934);
      ctx.moveTo(x + 35, 928);
      ctx.lineTo(x + 35, 934);
      ctx.moveTo(x + 11, 943);
      ctx.quadraticCurveTo(x + 25, 952, x + 38, 941);
      ctx.stroke();
    } else if (i === 1) {
      ctx.strokeStyle = '#327bde';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 25, 938, 17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff5f62';
      ctx.beginPath();
      ctx.moveTo(x + 32, 925);
      ctx.lineTo(x + 25, 941);
      ctx.lineTo(x + 19, 946);
      ctx.fill();
    } else ctx.fillText(['', '', '‹›', '>_', '≡', '▤'][i], x + 25, 948);
    ctx.textAlign = 'left';
  });
}
function chrome(ctx: CanvasRenderingContext2D, title: string, dark: boolean) {
  const {x, y, w, h} = BOX;
  ctx.save();
  ctx.shadowColor = '#100c4059';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 12;
  round(ctx, x, y, w, h, 18, dark ? '#171921' : '#fdfdff');
  ctx.restore();
  round(ctx, x, y, w, 68, 18, dark ? '#31313de8' : '#e7eaf4eb');
  ctx.fillRect(x, y + 34, w, 34);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 25 + i * 25, y + 31, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = dark ? '#c9cad7' : '#585965';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x + 112, y + 21, 24, 20, 4);
  ctx.moveTo(x + 120, y + 21);
  ctx.lineTo(x + 120, y + 41);
  ctx.stroke();
  ctx.font = '31px -apple-system,sans-serif';
  ctx.fillStyle = dark ? '#e3e4ef' : '#555763';
  ctx.fillText('‹', x + 167, y + 40);
  ctx.fillText('›', x + 203, y + 40);
  round(ctx, 410, y + 12, 690, 40, 12, dark ? '#181923bb' : '#ffffffaa');
  ctx.font = '18px -apple-system,sans-serif';
  ctx.fillStyle = dark ? '#e4e5f4' : '#41434f';
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, y + 38);
  ctx.textAlign = 'left';
  ctx.font = '27px -apple-system,sans-serif';
  ctx.fillText('↥', W - 132, y + 40);
  ctx.fillText('+', W - 88, y + 40);
}
function finder(ctx: CanvasRenderingContext2D, copy: ScreenCopy) {
  desktop(ctx, 'Finder', copy);
  chrome(ctx, copy.finderTitle, false);
  round(ctx, BOX.x, BOX.y + 68, 230, BOX.h - 68, 0, '#e4e6f1');
  ctx.font = '18px -apple-system,sans-serif';
  ctx.fillStyle = '#616273';
  copy.finderSidebar
    .split('|')
    .forEach((item, i) => ctx.fillText(item, BOX.x + 27, BOX.y + 116 + i * 45));
  ['Cirkle', 'Job Flow', 'Clue Clash'].forEach((name, i) => {
    const x = 422 + i * 312;
    round(ctx, x, 285, 134, 92, 10, '#53b8f4');
    round(ctx, x, 274, 58, 20, 6, '#53b8f4');
    round(ctx, x + 3, 300, 128, 74, 8, '#77cfff');
    ctx.font = '20px -apple-system,sans-serif';
    ctx.fillStyle = '#323343';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + 67, 412);
    ctx.textAlign = 'left';
  });
}
function code(ctx: CanvasRenderingContext2D, p: number, copy: ScreenCopy) {
  desktop(ctx, 'Code', copy);
  chrome(ctx, 'SelectedWork.tsx', true);
  const count = Math.floor(segment(p, 0.18, 0.345) * SCREEN_CODE.length),
    lines = SCREEN_CODE.slice(0, count).split('\n');
  ctx.font = '26px monospace';
  lines.forEach((line, i) => {
    const y = 205 + i * 54;
    ctx.fillStyle = '#888da3';
    ctx.fillText(String(i + 1).padStart(2, ' '), 65, y);
    let x = 135;
    line
      .split(/('[^']*'|\b(?:import|from|export|function|return|const)\b|[<>/{}()])/g)
      .forEach((token) => {
        ctx.fillStyle = /^'/.test(token)
          ? '#ffe091'
          : /^(import|from|export|function|return|const)$/.test(token)
            ? '#d69cff'
            : /^[<>/{}()]$/.test(token)
              ? '#65ddff'
              : '#f2f3ff';
        ctx.fillText(token, x, y);
        x += ctx.measureText(token).width;
      });
    if (i === lines.length - 1 && count < SCREEN_CODE.length) {
      ctx.fillStyle = '#ff817a';
      ctx.fillRect(x + 4, y - 25, 3, 31);
    }
  });
  ctx.fillStyle = '#403dcc';
  ctx.fillRect(BOX.x, BOX.y + BOX.h - 35, BOX.w, 23);
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';
  ctx.fillText(copy.screenCaption, 63, BOX.y + BOX.h - 18);
  ctx.textAlign = 'right';
  ctx.fillText(copy.codeLabel + ' · TypeScript React', W - 63, BOX.y + BOX.h - 18);
  ctx.textAlign = 'left';
}
function project(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  i: number,
  p: number,
  copy: ScreenCopy,
) {
  desktop(ctx, 'Safari', copy);
  chrome(ctx, URLS[i], false);
  const x = BOX.x,
    y = BOX.y + 68,
    w = BOX.w,
    h = BOX.h - 68;
  const scale = i === 0 ? w / image.width : Math.min(w / image.width, h / image.height);
  const iw = image.width * scale,
    ih = image.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, [0, 0, 18, 18]);
  ctx.clip();
  ctx.fillStyle = i === 1 ? '#0b0d10' : i === 2 ? '#f7f1e9' : '#fff';
  ctx.fillRect(x, y, w, h);
  ctx.drawImage(
    image,
    x + (w - iw) / 2,
    y + (ih > h ? -(ih - h) * segment(p, 0.395, 0.54) * 0.48 : (h - ih) / 2),
    iw,
    ih,
  );
  ctx.restore();
}
export function createScreenTexture(images: HTMLImageElement[], copy: ScreenCopy) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const next = document.createElement('canvas');
  next.width = W;
  next.height = H;
  const nextCtx = next.getContext('2d')!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  let previous = -1;
  function update(p: number) {
    const key = Math.round(p * 1500);
    if (key === previous) return;
    previous = key;
    ctx!.globalAlpha = 1;
    const starts = [0.35, 0.515, 0.65],
      ends = [0.395, 0.56, 0.69];
    const active = p >= 0.65 ? 2 : p >= 0.515 ? 1 : p >= 0.35 ? 0 : -1;
    if (active < 0) {
      if (p < 0.175) finder(ctx!, copy);
      else code(ctx!, p, copy);
    } else {
      const blend = segment(p, starts[active], ends[active]);
      if (blend < 1) {
        if (active === 0) code(ctx!, p, copy);
        else project(ctx!, images[active - 1], active - 1, p, copy);
        project(nextCtx, images[active], active, p, copy);
        ctx!.globalAlpha = blend;
        ctx!.drawImage(next, 0, 0);
        ctx!.globalAlpha = 1;
      } else project(ctx!, images[active], active, p, copy);
    }
    ctx!.globalAlpha = segment(p, 0.83, 0.9);
    ctx!.fillStyle = '#030305';
    ctx!.fillRect(0, 0, W, H);
    ctx!.globalAlpha = 1;
    texture.needsUpdate = true;
  }
  update(0);
  return {texture, update, dispose: () => texture.dispose()};
}
