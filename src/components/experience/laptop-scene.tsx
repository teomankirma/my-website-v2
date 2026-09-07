'use client';

import {useEffect, useRef, type RefObject} from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type WebGLRenderTarget,
} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createMacBook} from './macbook-geometry';
import {createScreenTexture, type ScreenCopy} from './screen-texture';
import {getLaptopPose, SCREEN_IMAGES, type StoryMotion} from '@/lib/scroll-story';

interface Props {
  motion: StoryMotion;
  invalidateRef: RefObject<(() => void) | null>;
  copy: ScreenCopy;
  onReady: () => void;
  onFailure: () => void;
}

// The scroll playhead is the scene's only time source. Render one frame when
// invalidated instead of running a clock/continuous render loop in the background.
export default function LaptopScene({motion, invalidateRef, copy, onReady, onFailure}: Props) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    // A fresh canvas per effect also supports React Strict Mode's cleanup/remount.
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);
    let disposed = false;
    let frame = 0;
    let renderer: WebGLRenderer | undefined;
    let environment: WebGLRenderTarget | undefined;
    let screen: ReturnType<typeof createScreenTexture> | undefined;
    let hardware: ReturnType<typeof createMacBook> | undefined;
    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 60);
    let width = 1,
      height = 1,
      ready = false;

    const fail = () => {
      if (!disposed) onFailure();
    };
    const render = () => {
      frame = 0;
      if (disposed || document.hidden || !renderer || !hardware || !screen) return;
      try {
        const mobile = width < 768;
        const pose = getLaptopPose(motion.progress, mobile);
        const aspect = width / height;
        const fit = Math.min(1, aspect / (mobile ? 0.53 : 1.45));
        const model = hardware.root;
        model.visible = pose.visible;
        model.position.set(pose.x, pose.y, 0);
        model.rotation.set(
          pose.rotationX + motion.pointerY * 0.016,
          pose.rotationY + motion.pointerX * 0.025,
          pose.rotationZ,
        );
        model.scale.setScalar(pose.scale * fit);
        hardware.hinge.rotation.x = pose.lid;
        camera.position.set(pose.cameraX, pose.cameraY, pose.cameraZ);
        camera.lookAt(0, pose.targetY, 0);
        screen.update(motion.progress);
        renderer.render(scene, camera);
        if (!ready) {
          ready = true;
          onReady();
        }
      } catch {
        fail();
      }
    };
    const invalidate = () => {
      if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer?.setSize(width, height, false);
      invalidate();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else resize();
    };
    const observer = new ResizeObserver(resize);
    canvas.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('resize', resize);
    invalidateRef.current = invalidate;

    try {
      const context = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      if (!context) throw new Error('WebGL unavailable');
      renderer = new WebGLRenderer({canvas, context, alpha: true, antialias: true});
      renderer.outputColorSpace = SRGBColorSpace;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      renderer.setClearColor(0x000000, 0);
      const room = new RoomEnvironment();
      const pmrem = new PMREMGenerator(renderer);
      try {
        environment = pmrem.fromScene(room, 0.04);
      } finally {
        room.dispose();
        pmrem.dispose();
      }
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.85;
      scene.add(new AmbientLight(0xffffff, 0.25));
      const key = new DirectionalLight(0xffffff, 1.8);
      key.position.set(-4, 7, 4);
      const rim = new DirectionalLight(0xffffff, 1.2);
      rim.position.set(5, 2, -3);
      scene.add(key, rim);
      resize();
      observer.observe(container);
      Promise.all(
        SCREEN_IMAGES.map(
          (url) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = reject;
              image.src = url;
            }),
        ),
      )
        .then((images) => {
          if (disposed) return;
          screen = createScreenTexture(images, copy);
          hardware = createMacBook(screen.texture);
          scene.add(hardware.root);
          invalidate();
        })
        .catch(fail);
    } catch {
      fail();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('resize', resize);
      if (invalidateRef.current === invalidate) invalidateRef.current = null;
      hardware?.dispose();
      screen?.dispose();
      environment?.dispose();
      renderer?.dispose();
      const context = renderer?.getContext();
      if (context && !context.isContextLost() && context.getExtension('WEBGL_lose_context')) {
        renderer?.forceContextLoss();
      }
      canvas.remove();
    };
  }, [motion, invalidateRef, copy, onReady, onFailure]);
  return <div ref={host} style={{width: '100%', height: '100%'}} aria-hidden="true" />;
}
