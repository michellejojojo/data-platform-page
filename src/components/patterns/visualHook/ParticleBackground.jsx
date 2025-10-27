import React, {
  Suspense,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleGlowEffect from "./ParticleGlowEffect";

// 유틸리티 함수 임포트
import {
  rafThrottle,
  createColorLerp,
  createBatchUpdater,
} from "../../../utils/animationHelpers";

// 상수 임포트
import { PERFORMANCE_CONFIG } from "../../../constants";

gsap.registerPlugin(ScrollTrigger);

// 성능 최적화 설정 상수
const CANVAS_PERFORMANCE_CONFIG = {
  cameraUpdateInterval: 2,
  backgroundUpdateInterval: 3,
  cameraLerpFactor: 0.05,
  particleUpdateInterval: 2,
  sphereSegments: 8,
};

// Canvas WebGL 설정 상수
const CANVAS_GL_CONFIG = {
  antialias: false,
  alpha: true,
  powerPreference: "high-performance",
  stencil: false,
  depth: true,
  preserveDrawingBuffer: false,
};

// 조명 설정 상수
const LIGHTING_CONFIG = {
  ambient: { intensity: 0.4 },
  directional: { position: [10, 10, 5], intensity: 0.6 },
};

// 최적화된 카메라 업데이트 컴포넌트
function CameraUpdater({ positionRef }) {
  const { camera } = useThree();
  let frameCount = 0;

  useFrame(() => {
    if (
      frameCount++ % CANVAS_PERFORMANCE_CONFIG.cameraUpdateInterval === 0 &&
      positionRef?.current !== undefined
    ) {
      const targetZ = positionRef.current;
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetZ,
        CANVAS_PERFORMANCE_CONFIG.cameraLerpFactor
      );
    }
  });

  return null;
}

// 최적화된 배경색 업데이트 컴포넌트
function BackgroundUpdater({ colorRef }) {
  const { scene } = useThree();
  let frameCount = 0;

  useFrame(() => {
    if (
      frameCount++ % CANVAS_PERFORMANCE_CONFIG.backgroundUpdateInterval === 0 &&
      colorRef?.current
    ) {
      if (!(scene.background instanceof THREE.Color)) {
        scene.background = new THREE.Color();
      }
      if (!scene.background.equals(colorRef.current)) {
        scene.background.copy(colorRef.current);
      }
    }
  });

  return null;
}

/**
 * ParticleBackground 컴포넌트
 * sections props를 받아서 내부에서 모든 스크롤 인터랙션 처리
 */
const ParticleBackground = React.memo(
  ({
    sections = [],
    cameraStartZ = PERFORMANCE_CONFIG.cameraStartZ,
    cameraEndZ = PERFORMANCE_CONFIG.cameraEndZ,
    particleCount = PERFORMANCE_CONFIG.particleCount,
    particleSize = PERFORMANCE_CONFIG.particleSize,
    movementRadius = PERFORMANCE_CONFIG.movementRadius,
    bloomRadius = 0.3,
    bloomThreshold = 0.9,
    onScrollUpdate,
    children,
  }) => {
    // refs
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const cameraZRef = useRef(cameraStartZ);
    const backgroundColorRef = useRef(
      new THREE.Color(sections[0]?.backgroundColor || "#000011")
    );

    // 상태 관리
    const [particleColor, setParticleColor] = useState(
      sections[0]?.particleColor || "#ADD8E6"
    );
    const [movementSpeed, setMovementSpeed] = useState(
      sections[0]?.movementSpeed || 0.001
    );

    // 현재 섹션 인덱스 추적
    const currentSectionRef = useRef(0);

    // 메모이제이션된 색상 보간 함수
    const lerpColor = useMemo(() => createColorLerp(), []);

    // 배치 상태 업데이트 함수
    const _updateParticleEffects = useCallback(
      createBatchUpdater(setParticleColor, setMovementSpeed),
      []
    );

    // 최적화된 마우스 이벤트 핸들러
    const handleMouseMove = useCallback(
      rafThrottle((event) => {
        mouseRef.current = { x: event.clientX, y: event.clientY };
      }, PERFORMANCE_CONFIG.mouseThrottleInterval),
      []
    );

    useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    // 스크롤 핸들러 - 섹션 감지와 줌 효과 모두 처리
    const handleScroll = useCallback(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const totalProgress = Math.min(scrollTop / Math.max(scrollHeight, 1), 1);

      // 전체 스크롤 진행률 업데이트
      scrollRef.current = totalProgress;

      // 네비게이션 헤더용 스크롤 상태 업데이트
      onScrollUpdate?.({
        scrollY: scrollTop,
        isScrolled: scrollTop > 50,
        isVisible: true, // ParticleBackground에서는 항상 true
      });

      // 카메라 줌 업데이트
      const newCameraZ =
        cameraStartZ - (cameraStartZ - cameraEndZ) * totalProgress;
      cameraZRef.current = newCameraZ;

      // 현재 섹션 계산
      const sectionHeight = container.scrollHeight / sections.length;
      const currentSectionIndex = Math.floor(scrollTop / sectionHeight);
      const sectionProgress = (scrollTop % sectionHeight) / sectionHeight;

      // 섹션이 변경되었거나 스크롤 중일 때
      if (
        currentSectionIndex !== currentSectionRef.current ||
        sectionProgress > 0
      ) {
        const currentSection =
          sections[currentSectionIndex] || sections[sections.length - 1];
        const nextSection = sections[currentSectionIndex + 1] || currentSection;

        // 색상 보간
        const newColor = lerpColor(
          currentSection.particleColor,
          nextSection.particleColor,
          sectionProgress
        );

        // 속도 보간
        const newSpeed =
          currentSection.movementSpeed +
          (nextSection.movementSpeed - currentSection.movementSpeed) *
            sectionProgress;

        // 상태 업데이트 - 단순화된 로직
        setParticleColor(newColor);
        setMovementSpeed(newSpeed);

        // 배경색 보간
        const currentBgColor = new THREE.Color(currentSection.backgroundColor);
        const nextBgColor = new THREE.Color(nextSection.backgroundColor);
        backgroundColorRef.current.copy(
          currentBgColor.lerp(nextBgColor, sectionProgress)
        );

        currentSectionRef.current = currentSectionIndex;
      }
    }, [sections, lerpColor, cameraStartZ, cameraEndZ, onScrollUpdate]);

    // 스크롤 이벤트 리스너
    useEffect(() => {
      const container = containerRef.current;
      if (container) {
        const throttledScroll = rafThrottle(
          handleScroll,
          PERFORMANCE_CONFIG.scrollThrottleInterval
        );
        container.addEventListener("scroll", throttledScroll, {
          passive: true,
        });
        handleScroll(); // 초기 실행
        return () => container.removeEventListener("scroll", throttledScroll);
      }
    }, [handleScroll]);

    // sections가 변경되면 현재 섹션의 색상 즉시 적용
    useEffect(() => {
      const currentSection = sections[currentSectionRef.current] || sections[0];
      if (currentSection) {
        setParticleColor(currentSection.particleColor);
        setMovementSpeed(currentSection.movementSpeed);
        backgroundColorRef.current = new THREE.Color(currentSection.backgroundColor);
      }
    }, [sections]);

    return (
      <Box
        ref={containerRef}
        data-scroll-container="true"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "auto",
          zIndex: 0,
          backgroundColor: sections[0]?.backgroundColor || "#000011",
        }}
      >
        {/* 전체 스크롤 컨테이너 */}
        <Box
          sx={{ height: `${sections.length * 100}vh`, position: "relative" }}
        >
          {/* 파티클 배경 */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100%",
            }}
          >
            <Canvas
              dpr={[1, 1.5]}
              gl={CANVAS_GL_CONFIG}
              camera={{ position: [0, 0, cameraStartZ], fov: 75 }}
            >
              <CameraUpdater positionRef={cameraZRef} />
              <BackgroundUpdater colorRef={backgroundColorRef} />

              <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />
              <directionalLight
                position={LIGHTING_CONFIG.directional.position}
                intensity={LIGHTING_CONFIG.directional.intensity}
              />

              <Suspense fallback={null}>
                <ParticleGlowEffect
                  mouse={mouseRef}
                  scrollProgress={scrollRef}
                  particleColor={particleColor}
                  movementSpeed={movementSpeed}
                  particleCount={particleCount}
                  particleSize={particleSize}
                  movementRadius={movementRadius}
                  bloomRadius={bloomRadius}
                  bloomThreshold={bloomThreshold}
                />
              </Suspense>
            </Canvas>
          </Box>

          {/* 콘텐츠 섹션들 */}
          <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
        </Box>
      </Box>
    );
  }
);

ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;
export { default as ParticleSection } from "../../commons/container/ParticleSection";
