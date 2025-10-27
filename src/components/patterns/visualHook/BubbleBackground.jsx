import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { Box } from "@mui/material";
import BubbleEffect from "./BubbleEffect";

// Throttle 유틸리티 함수 (60FPS)
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * BubbleBackground 컴포넌트
 *
 * Props:
 * @param {ReactNode} children - BubbleSection 배열 [Optional]
 * @param {number} bubbleCount - 버블 개수 [Optional, 기본값: 120]
 * @param {number} scrollProgress - 스크롤 진행률 (0-1) - 고급 사용법 [Optional]
 *
 * Example usage:
 * <BubbleBackground>
 *   <BubbleSection>Content 1</BubbleSection>
 *   <BubbleSection>Content 2</BubbleSection>
 * </BubbleBackground>
 */
export default function BubbleBackground({
  children,
  bubbleCount = 120,
  scrollProgress: externalScrollProgress,
}) {
  const scrollRef = useRef(null);
  const [internalScrollProgress, setInternalScrollProgress] = useState(0);

  // 외부에서 scrollProgress를 제공하면 그것을 사용, 아니면 내부 스크롤 처리
  const scrollProgress =
    externalScrollProgress !== undefined
      ? externalScrollProgress
      : internalScrollProgress;
  const useInternalScroll = externalScrollProgress === undefined;

  // 메모이제이션된 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (!useInternalScroll) return;

    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const progress =
        scrollHeight > clientHeight
          ? scrollTop / (scrollHeight - clientHeight)
          : 0;

      // 소수점 2자리로 반올림하여 불필요한 업데이트 방지
      const roundedProgress = Math.round(progress * 100) / 100;

      setInternalScrollProgress((prevProgress) => {
        // 값이 실제로 변경된 경우만 업데이트
        return Math.abs(prevProgress - roundedProgress) > 0.01
          ? roundedProgress
          : prevProgress;
      });
    }
  }, [useInternalScroll]);

  // Throttled 스크롤 핸들러 (16ms = 60FPS)
  const throttledHandleScroll = useCallback(throttle(handleScroll, 16), [
    handleScroll,
  ]);

  useEffect(() => {
    if (!useInternalScroll) return;

    const element = scrollRef.current;
    if (element) {
      handleScroll();
      element.addEventListener("scroll", throttledHandleScroll, {
        passive: true,
      });
      return () => element.removeEventListener("scroll", throttledHandleScroll);
    }
  }, [handleScroll, throttledHandleScroll, useInternalScroll]);

  // children이 없고 외부 scrollProgress만 있는 경우 (기존 방식)
  if (!children && externalScrollProgress !== undefined) {
    return (
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 60, position: [0, 0, 20], near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#0040a0"]} />
        <directionalLight
          position={[0, 30, 10]}
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <BubbleEffect
          scrollProgress={scrollProgress}
          bubbleCount={bubbleCount}
        />
        <EffectComposer disableNormalPass>
          <N8AO
            aoRadius={4}
            intensity={3}
            distanceFalloff={1}
            color="#030f24"
          />
        </EffectComposer>
      </Canvas>
    );
  }

  // 새로운 방식: children을 포함한 전체 스크롤 컨테이너
  const sectionCount = React.Children.count(children) || 1;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 버블 배경 Canvas */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 60, position: [0, 0, 20], near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#0040a0"]} />
        <directionalLight
          position={[0, 30, 10]}
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <BubbleEffect
          scrollProgress={scrollProgress}
          bubbleCount={bubbleCount}
        />
        <EffectComposer disableNormalPass>
          <N8AO
            aoRadius={4}
            intensity={3}
            distanceFalloff={1}
            color="#030f24"
          />
        </EffectComposer>
      </Canvas>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <Box
        ref={scrollRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          zIndex: 1,
          color: "#e0e0e0",
          fontFamily: "'Poppins', sans-serif",
          scrollbarWidth: "thin",
          scrollbarColor: "#555 #333",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(30, 30, 30, 0.4)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        {/* 전체 스크롤 콘텐츠 높이 */}
        <Box sx={{ height: `${sectionCount * 100}vh` }}>{children}</Box>
      </Box>
    </Box>
  );
}

// BubbleSection 컴포넌트 export
export { default as BubbleSection } from "../../commons/container/BubbleSection";
