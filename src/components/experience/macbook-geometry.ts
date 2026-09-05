import {
  CanvasTexture,
  ExtrudeGeometry,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RingGeometry,
  Shape,
  SRGBColorSpace,
  type Texture,
  type BufferGeometry,
  type Material,
} from 'three';
import {APPLE_PATH, KEYBOARD, MACBOOK, MODEL_SCALE} from '@/lib/macbook';

function rectangle(width: number, height: number, radius: number) {
  const x = -width / 2,
    y = -height / 2,
    r = radius;
  return new Shape()
    .moveTo(x + r, y)
    .lineTo(x + width - r, y)
    .quadraticCurveTo(x + width, y, x + width, y + r)
    .lineTo(x + width, y + height - r)
    .quadraticCurveTo(x + width, y + height, x + width - r, y + height)
    .lineTo(x + r, y + height)
    .quadraticCurveTo(x, y + height, x, y + height - r)
    .lineTo(x, y + r)
    .quadraticCurveTo(x, y, x + r, y);
}
function slab(width: number, depth: number, height: number, radius: number, bevel = 0.008) {
  const geometry = new ExtrudeGeometry(rectangle(width - 2 * bevel, depth - 2 * bevel, radius), {
    depth: height - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 8,
    steps: 1,
  });
  geometry.translate(0, 0, -(height - 2 * bevel) / 2);
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}
function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.anisotropy = 4;
  return texture;
}

export function createMacBook(screen: Texture) {
  const root = new Group();
  const hinge = new Group();
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures: Texture[] = [];
  const metal = new MeshStandardMaterial({color: '#b9bdc5', metalness: 0.72, roughness: 0.28});
  const edge = new MeshStandardMaterial({color: '#8f959f', metalness: 0.8, roughness: 0.23});
  const rubber = new MeshStandardMaterial({color: '#08090c', metalness: 0.08, roughness: 0.65});
  const keys = new MeshStandardMaterial({color: '#15161b', roughness: 0.48, metalness: 0.05});
  const add = (
    parent: Group,
    geometry: BufferGeometry,
    material: Material,
    position: [number, number, number],
    rotation?: [number, number, number],
  ) => {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    parent.add(mesh);
    geometries.add(geometry);
    materials.add(material);
    return mesh;
  };
  const width = MACBOOK.width * MODEL_SCALE,
    depth = MACBOOK.depth * MODEL_SCALE;
  const lidThickness = 0.085,
    bodyThickness = MACBOOK.height * MODEL_SCALE - lidThickness - 0.012;
  add(root, slab(width, depth, bodyThickness, 0.16), metal, [0, -bodyThickness / 2, 0]);
  add(root, slab(width - 0.035, depth - 0.035, 0.027, 0.15, 0.005), edge, [
    0,
    -bodyThickness + 0.019,
    0,
  ]);
  // Keyboard well, 78 individually modeled ANSI keycaps, full-height function row.
  add(root, slab(6.04, 2.44, 0.022, 0.1, 0.004), rubber, [0, 0.005, -0.69]);
  const atlas = document.createElement('canvas');
  atlas.width = 3600;
  atlas.height = 1440;
  const ctx = atlas.getContext('2d')!;
  const keyboardWidth = 5.96,
    keyboardDepth = 2.4,
    step = keyboardWidth / 15;
  KEYBOARD.forEach((key) => {
    const x = -keyboardWidth / 2 + (key.start + key.units / 2) * step;
    const z = -1.69 + key.row * 0.4 + (key.half === 'bottom' ? 0.1 : key.half === 'top' ? -0.1 : 0);
    const w = key.units * step - 0.048,
      h = key.half ? 0.15 : 0.35;
    add(root, slab(w, h, 0.037, 0.045, 0.004), keys, [x, 0.026, z]);
    if (key.label === '◎') {
      add(
        root,
        new RingGeometry(0.09, 0.105, 32),
        new MeshStandardMaterial({color: '#282a30', metalness: 0.5, roughness: 0.35}),
        [x, 0.047, z],
        [-Math.PI / 2, 0, 0],
      );
      return;
    }
    const px = ((x + keyboardWidth / 2) / keyboardWidth) * atlas.width;
    const py = ((z + 1.89) / keyboardDepth) * atlas.height;
    ctx.fillStyle = '#f5f5f8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = key.label.split('\n');
    const named = key.label.length > 2 && lines.length === 1;
    lines.forEach((line, i) => {
      if (key.row === 0 && key.label.endsWith('F5') && i === 0) {
        ctx.strokeStyle = '#f5f5f8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(px - 7, py - 37, 14, 22, 7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py - 20, 12, 0, Math.PI);
        ctx.moveTo(px, py - 8);
        ctx.lineTo(px, py - 1);
        ctx.moveTo(px - 7, py - 1);
        ctx.lineTo(px + 7, py - 1);
        ctx.stroke();
        return;
      }

      if (key.row === 0 && /F1[012]$/.test(key.label) && i === 0) {
        const cy = py - 22;
        ctx.fillStyle = '#f5f5f8';
        ctx.beginPath();
        ctx.moveTo(px - 12, cy - 5);
        ctx.lineTo(px - 6, cy - 5);
        ctx.lineTo(px + 1, cy - 12);
        ctx.lineTo(px + 1, cy + 12);
        ctx.lineTo(px - 6, cy + 5);
        ctx.lineTo(px - 12, cy + 5);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#f5f5f8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (key.label.endsWith('F10')) {
          ctx.moveTo(px + 7, cy - 5);
          ctx.lineTo(px + 16, cy + 5);
          ctx.moveTo(px + 7, cy + 5);
          ctx.lineTo(px + 16, cy - 5);
        } else {
          ctx.arc(px + 1, cy, 9, -0.8, 0.8);
          if (key.label.endsWith('F12')) {
            ctx.moveTo(px + 1 + Math.cos(-0.8) * 16, cy + Math.sin(-0.8) * 16);
            ctx.arc(px + 1, cy, 16, -0.8, 0.8);
          }
        }
        ctx.stroke();
        return;
      }

      ctx.font = `${named || line.length > 2 ? 23 : 34}px -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
      ctx.fillText(line, px, py + (i - (lines.length - 1) / 2) * 42);
    });
  });
  const legends = canvasTexture(atlas);
  textures.push(legends);
  add(
    root,
    new PlaneGeometry(keyboardWidth, keyboardDepth),
    new MeshBasicMaterial({map: legends, transparent: true, toneMapped: false, depthWrite: false}),
    [0, 0.047, -0.69],
    [-Math.PI / 2, 0, 0],
  );
  // Trackpad has a narrow machined seam, not a bright outline.
  add(root, slab(2.91, 1.69, 0.011, 0.11, 0.002), edge, [0, 0.002, 1.43]);
  add(root, slab(2.887, 1.667, 0.012, 0.105, 0.002), metal, [0, 0.007, 1.43]);
  // Dense perforation texture avoids thousands of speaker meshes.
  const speaker = document.createElement('canvas');
  speaker.width = 96;
  speaker.height = 900;
  const sp = speaker.getContext('2d')!;
  sp.fillStyle = '#202127';
  for (let y = 5; y < 900; y += 9)
    for (let x = 5; x < 96; x += 9) {
      sp.beginPath();
      sp.arc(x, y, 1.7, 0, Math.PI * 2);
      sp.fill();
    }
  const perforations = canvasTexture(speaker);
  textures.push(perforations);
  const speakerMat = new MeshBasicMaterial({
    map: perforations,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  [-1, 1].forEach((side) =>
    add(
      root,
      new PlaneGeometry(0.22, 2.4),
      speakerMat,
      [side * 3.19, 0.008, -0.69],
      [-Math.PI / 2, 0, 0],
    ),
  );
  add(root, slab(0.9, 0.05, 0.023, 0.02, 0.003), edge, [0, -0.008, depth / 2 - 0.007]);
  add(root, slab(4.8, 0.13, 0.105, 0.05, 0.005), rubber, [0, 0.015, -depth / 2 + 0.12]);
  // Recessed port silhouettes, grouped on the same sides as the M5 Pro.
  [-1.35, -0.78].forEach((z) =>
    add(root, slab(0.018, 0.29, 0.075, 0.007, 0.002), rubber, [-width / 2 - 0.001, -0.12, z]),
  );
  add(root, slab(0.018, 0.42, 0.067, 0.008, 0.002), rubber, [-width / 2 - 0.001, -0.12, -1.91]);
  add(root, slab(0.018, 0.42, 0.087, 0.008, 0.002), rubber, [width / 2 + 0.001, -0.12, -1.79]);
  add(root, slab(0.018, 0.29, 0.075, 0.007, 0.002), rubber, [width / 2 + 0.001, -0.12, -1.13]);
  add(root, slab(0.018, 0.65, 0.025, 0.008, 0.002), rubber, [width / 2 + 0.001, -0.12, -0.35]);
  hinge.position.set(0, 0.059, -depth / 2 + 0.055);
  root.add(hinge);
  const lidCenter = depth / 2 - 0.055;
  add(hinge, slab(width, depth, lidThickness, 0.16, 0.008), metal, [0, 0, lidCenter]);
  add(hinge, slab(width - 0.075, depth - 0.075, 0.012, 0.135, 0.003), rubber, [
    0,
    -0.047,
    lidCenter,
  ]);
  const sw = MACBOOK.screenWidth * MODEL_SCALE,
    sh = MACBOOK.screenHeight * MODEL_SCALE;
  const screenTop = depth - 0.17;
  // 3024:1964, exactly the published panel aspect. Rounded top corners and notch.
  const panel = add(
    hinge,
    new PlaneGeometry(sw, sh),
    new MeshBasicMaterial({map: screen, toneMapped: false}),
    [0, -0.055, screenTop - sh / 2],
    [Math.PI / 2, 0, 0],
  );
  panel.name = 'display';
  add(hinge, slab(0.47, 0.16, 0.012, 0.035, 0.002), rubber, [0, -0.064, screenTop - 0.06]);
  const cameraCanvas = document.createElement('canvas');
  cameraCanvas.width = 64;
  cameraCanvas.height = 64;
  const cam = cameraCanvas.getContext('2d')!;
  cam.fillStyle = '#152137';
  cam.beginPath();
  cam.arc(32, 32, 25, 0, Math.PI * 2);
  cam.fill();
  cam.fillStyle = '#253f60';
  cam.beginPath();
  cam.arc(26, 26, 8, 0, Math.PI * 2);
  cam.fill();
  const cameraTex = canvasTexture(cameraCanvas);
  textures.push(cameraTex);
  add(
    hinge,
    new PlaneGeometry(0.03, 0.03),
    new MeshBasicMaterial({map: cameraTex, transparent: true}),
    [0, -0.072, screenTop - 0.06],
    [Math.PI / 2, 0, 0],
  );
  const logo = document.createElement('canvas');
  logo.width = 512;
  logo.height = 512;
  const lc = logo.getContext('2d')!;
  lc.scale(512 / 24, 512 / 24);
  lc.fillStyle = '#0b0c0e';
  lc.fill(new Path2D(APPLE_PATH));
  const logoTexture = canvasTexture(logo);
  textures.push(logoTexture);
  // Leaf points toward the front edge when closed; upright on the back when open.
  add(
    hinge,
    new PlaneGeometry(0.67, 0.67),
    new MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      metalness: 0.4,
      roughness: 0.2,
      depthWrite: false,
    }),
    [0, 0.047, lidCenter],
    [-Math.PI / 2, 0, Math.PI],
  );
  return {
    root,
    hinge,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
