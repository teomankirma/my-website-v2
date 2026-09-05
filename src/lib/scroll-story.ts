// The scroll story has one playhead. Both the DOM and 3D scene read this value.
export interface StoryMotion {
  progress: number;
  pointerX: number;
  pointerY: number;
}

export const SCREEN_IMAGES = [
  '/experience/cirkle-screen.webp',
  '/experience/job-flow-screen.webp',
  '/experience/clue-clash-screen.webp',
] as const;

export const STORY_CHAPTERS = [
  {key: 'open', progress: 0},
  {key: 'build', progress: 0.28},
  {key: 'work', progress: 0.45},
  {key: 'signature', progress: 0.995},
] as const;

export const SCREEN_CODE = `import { PROJECTS } from '@/lib/projects';

export function SelectedWork() {
  return PROJECTS.map((project) => (
    <a href={project.href} key={project.key}>
      <h2>{project.title}</h2>
      <p>{project.technologies}</p>
    </a>
  ));
}`;

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export const segment = (progress: number, from: number, to: number) =>
  clamp((progress - from) / (to - from));
export const smooth = (value: number) => value * value * (3 - 2 * value);
export const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

export function getLaptopPose(progress: number, mobile: boolean) {
  const open = smooth(segment(progress, 0.035, 0.245));
  const approach = smooth(segment(progress, 0.18, 0.42));
  const close = smooth(segment(progress, 0.785, 0.9));
  const exit = smooth(segment(progress, 0.9, 0.955));
  const pullback = smooth(segment(progress, 0.735, 0.85));
  const showcase = approach * (1 - pullback);

  return {
    lid: -mix(0, 1.94, open) * (1 - close),
    rotationX: mix(0.04, 0, open) + close * 0.1,
    rotationY: mix(-0.42, -0.035, open) + close * 0.19,
    rotationZ: mix(-0.06, 0, open),
    x: mobile ? 0 : mix(1.55, 0.8, open),
    y: (mobile ? -0.8 : -0.68) - exit * 1.8,
    scale: (mobile ? 0.56 : mix(1, 0.92, open)) * mix(1, 0.82, pullback) * mix(1, 0.68, exit),
    cameraX: mobile ? 0 : mix(1.8, 0.15, open),
    cameraY: mix(6.6, 3.1, open) + pullback * 2.4,
    cameraZ: mix(12.6, mobile ? 12.9 : 11.6, showcase),
    targetY: mix(0.15, mobile ? 0.75 : 1.05, open),
    visible: progress < 0.962,
  };
}

export function getStoryChapter(progress: number) {
  if (progress < 0.21) return 0;
  if (progress < 0.37) return 1;
  if (progress < 0.78) return 2;
  return 3;
}
