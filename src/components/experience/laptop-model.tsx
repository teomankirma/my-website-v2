'use client';

import {useEffect, useRef, useState, type RefObject} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {Environment} from '@react-three/drei/core/Environment';
import {Lightformer} from '@react-three/drei/core/Lightformer';
import {Group, Vector3} from 'three';
import {createMacBook} from './macbook-geometry';
import {getLaptopPose, SCREEN_IMAGES, type StoryMotion} from '@/lib/scroll-story';
import {createScreenTexture, type ScreenCopy} from './screen-texture';

type Resources = ReturnType<typeof createScreenTexture> & {
  hardware: ReturnType<typeof createMacBook>;
};
interface Props {
  motion: StoryMotion;
  invalidateRef: RefObject<(() => void) | null>;
  copy: ScreenCopy;
  onReady: () => void;
  onFailure: () => void;
}

export function LaptopModel({motion, invalidateRef, copy, onReady, onFailure}: Props) {
  const model = useRef<Group>(null);
  const resourceRef = useRef<Resources | null>(null);
  const [resources, setResources] = useState<Resources | null>(null);
  const {invalidate, camera, size} = useThree();
  const target = useRef(new Vector3());

  useEffect(() => {
    let disposed = false;
    let owned: Resources | undefined;

    const images = SCREEN_IMAGES.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new window.Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = url;
        }),
    );
    Promise.all(images)
      .then((loaded) => {
        if (disposed) return;
        const screen = createScreenTexture(loaded, copy);
        try {
          owned = {...screen, hardware: createMacBook(screen.texture)};
          resourceRef.current = owned;
          setResources(owned);
          invalidate();
        } catch (error) {
          screen.dispose();
          throw error;
        }
      })
      .catch(() => {
        if (!disposed) onFailure();
      });
    return () => {
      disposed = true;
      resourceRef.current = null;
      owned?.dispose();
      owned?.hardware.dispose();
    };
  }, [copy, invalidate, onFailure]);

  useEffect(() => {
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  useEffect(() => {
    if (!resources) return;
    const frame = requestAnimationFrame(() => {
      invalidate();
      onReady();
    });
    return () => cancelAnimationFrame(frame);
  }, [resources, invalidate, onReady]);

  useFrame(() => {
    const active = resourceRef.current;
    if (!model.current || !active) return;
    const mobile = size.width < 768;
    const pose = getLaptopPose(motion.progress, mobile);
    const aspect = size.width / size.height;
    const fit = mobile ? Math.min(1, aspect / 0.53) : Math.min(1, aspect / 1.45);
    model.current.visible = pose.visible;
    model.current.position.set(pose.x, pose.y, 0);
    model.current.rotation.set(
      pose.rotationX + motion.pointerY * 0.016,
      pose.rotationY + motion.pointerX * 0.025,
      pose.rotationZ,
    );
    model.current.scale.setScalar(pose.scale * fit);
    active.hardware.hinge.rotation.x = pose.lid;
    camera.position.set(pose.cameraX, pose.cameraY, pose.cameraZ);
    target.current.set(0, pose.targetY, 0);
    camera.lookAt(target.current);
    active.update(motion.progress);
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[-4, 7, 4]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[5, 2, -3]} intensity={1.5} color="#e0e5ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[-5, 6, 3]} scale={[9, 5]} />
        <Lightformer form="rect" intensity={3} position={[4, 4, 2]} scale={[3, 8]} />
        <Lightformer form="rect" intensity={2} position={[0, 7, 5]} scale={[8, 5]} />
      </Environment>
      {resources ? (
        <group ref={model}>
          <primitive object={resources.hardware.root} dispose={null} />
        </group>
      ) : null}
    </>
  );
}
