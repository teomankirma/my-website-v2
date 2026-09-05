'use client';

import {Component, useEffect, useState, type ReactNode, type RefObject} from 'react';
import {Canvas, useThree} from '@react-three/fiber';
import {LaptopModel} from './laptop-model';
import type {StoryMotion} from '@/lib/scroll-story';
import type {ScreenCopy} from './screen-texture';

interface Props {
  motion: StoryMotion;
  invalidateRef: RefObject<(() => void) | null>;
  copy: ScreenCopy;
  onReady: () => void;
  onFailure: () => void;
}

class SceneBoundary extends Component<
  {children: ReactNode; onFailure: () => void},
  {failed: boolean}
> {
  state = {failed: false};
  static getDerivedStateFromError() {
    return {failed: true};
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function ContextLifecycle({onFailure}: {onFailure: () => void}) {
  const {gl, invalidate} = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const visible = () => {
      if (!document.hidden) invalidate();
    };
    canvas.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', visible);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [gl, invalidate, onFailure]);
  return null;
}

export default function LaptopScene(props: Props) {
  const [supported, setSupported] = useState(false);
  const {onFailure} = props;
  useEffect(() => {
    // Probe before mounting Canvas: its asynchronous renderer setup cannot be
    // caught by a React error boundary when WebGL is unavailable.
    const frame = requestAnimationFrame(() => {
      try {
        const context = document.createElement('canvas').getContext('webgl2');
        if (!context) {
          onFailure();
          return;
        }
        context.getExtension('WEBGL_lose_context')?.loseContext();
        setSupported(true);
      } catch {
        onFailure();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [onFailure]);
  if (!supported) return null;

  return (
    <SceneBoundary onFailure={props.onFailure}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{position: [1.8, 6.6, 12.6], fov: 35, near: 0.1, far: 60}}
        gl={{alpha: true, antialias: true, powerPreference: 'high-performance'}}
        fallback={null}
        style={{pointerEvents: 'none'}}
        aria-hidden="true"
      >
        <ContextLifecycle onFailure={props.onFailure} />
        <LaptopModel {...props} />
      </Canvas>
    </SceneBoundary>
  );
}
