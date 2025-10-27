import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// 성능 최적화 설정 상수
const PERFORMANCE_CONFIG = {
  particleUpdateInterval: 2,
  sphereSegments: 8,
};

/**
 * Particles 컴포넌트
 * 3D 공간에서 움직이는 파티클 시스템을 구현합니다.
 * 마우스 인터랙션과 스크롤에 반응하는 파티클 애니메이션을 제공합니다.
 *
 * Props:
 * @param {number} count - 파티클 개수 [Optional, 기본값: 5000]
 * @param {number} particleSize - 파티클 크기 [Optional, 기본값: 0.05]
 * @param {string} particleColor - 파티클 색상 [Optional, 기본값: '#ffffff']
 * @param {number} movementSpeed - 파티클 움직임 속도 [Optional, 기본값: 0.005]
 * @param {number} movementRadius - 파티클 움직임 반경 [Optional, 기본값: 5]
 * @param {object} mouse - 마우스 위치 ref 객체 [Optional]
 * @param {object} scrollProgress - 스크롤 진행률 ref 객체 [Optional]
 *
 * Example usage:
 * <Particles
 *   count={1000}
 *   particleSize={0.08}
 *   particleColor="#ADD8E6"
 *   movementSpeed={0.01}
 * />
 */
function Particles({
  count = 5000,
  particleSize = 0.05,
  particleColor = "#ffffff",
  movementSpeed = 0.005,
  movementRadius = 5,
  mouse,
  scrollProgress,
}) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const materialRef = useRef();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(particleColor);
    }
  }, [particleColor]);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 2 + Math.random() * 3;
      const speed = movementSpeed + Math.random() * (movementSpeed / 2);
      const x = (Math.random() - 0.5) * movementRadius * 2;
      const y = (Math.random() - 0.5) * movementRadius * 2;
      const z = (Math.random() - 0.5) * movementRadius * 2;
      const mouseSensitivity = 0.01 + Math.random() * 0.02;
      const scrollSensitivity = 0.5 + Math.random() * 1;
      temp.push({
        t,
        factor,
        speed,
        x,
        y,
        z,
        mouseX: 0,
        mouseY: 0,
        mouseSensitivity,
        scrollSensitivity,
      });
    }
    return temp;
  }, [count, movementRadius, movementSpeed]);

  // 프레임 카운터
  const frameCount = useRef(0);

  useFrame((state) => {
    // 프레임 스킵 - 설정된 간격마다만 업데이트
    frameCount.current++;
    if (frameCount.current % PERFORMANCE_CONFIG.particleUpdateInterval !== 0)
      return;

    const targetMouseX = mouse?.current
      ? (mouse.current.x / state.size.width - 0.5) * 2
      : 0;
    const targetMouseY = mouse?.current
      ? -(mouse.current.y / state.size.height - 0.5) * 2
      : 0;
    const currentScroll = scrollProgress?.current || 0;

    // 모든 파티클을 한 번에 업데이트 (배치 처리 제거로 단순화)
    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      let { t, factor, speed, x, y, z } = particle;
      t = particle.t += speed * 0.5; // 속도 감소

      // 마우스 효과 간소화 - 매우 간단한 선형 변환
      particle.mouseX = targetMouseX * 0.5;
      particle.mouseY = targetMouseY * 0.5;

      // 삼각함수 대신 더 간단한 계산 사용
      const cycle = (t * 0.01) % (Math.PI * 2);
      let newX = x + cycle * factor * 0.1;
      let newY = y + cycle * 1.3 * factor * 0.1;
      let newZ = z + cycle * factor * 0.05;

      // 마우스 효과 확대
      newX += particle.mouseX * factor * 0.8;
      newY += particle.mouseY * factor * 0.8;
      newZ += currentScroll * factor * 0.1;

      dummy.position.set(newX, newY, newZ);

      // 고정 스케일 사용 (계산 제거)
      const s = 0.8 + currentScroll * 0.2;
      dummy.scale.setScalar(s);

      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry
        args={[
          particleSize,
          PERFORMANCE_CONFIG.sphereSegments,
          PERFORMANCE_CONFIG.sphereSegments,
        ]}
      />
      <meshBasicMaterial
        ref={materialRef}
        color={particleColor}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// 메모이제이션된 파티클 컴포넌트
const MemoizedParticles = React.memo(Particles);

/**
 * ParticleGlowEffect 컴포넌트
 * 3D 파티클 시스템과 글로우 효과를 결합한 시각적 효과를 제공합니다.
 * 마우스 인터랙션과 스크롤에 반응하는 파티클들이 움직이며 블룸 효과를 생성합니다.
 *
 * Props:
 * @param {object} mouse - 마우스 위치를 담고 있는 ref 객체 [Optional]
 * @param {object} scrollProgress - 스크롤 진행률을 담고 있는 ref 객체 [Optional]
 * @param {number} particleCount - 파티클 개수 [Optional, 기본값: 100]
 * @param {number} particleSize - 파티클 크기 [Optional, 기본값: 0.12]
 * @param {string} particleColor - 파티클 색상 [Optional, 기본값: '#ADD8E6']
 * @param {number} movementSpeed - 파티클 움직임 속도 [Optional, 기본값: 0.00075]
 * @param {number} movementRadius - 파티클 움직임 반경 [Optional, 기본값: 20]
 *
 * Example usage:
 * <ParticleGlowEffect
 *   mouse={mouseRef}
 *   scrollProgress={scrollRef}
 *   particleCount={150}
 *   particleColor="#00AAFF"
 *   movementSpeed={0.001}
 * />
 */
const ParticleGlowEffect = React.memo(
  ({
    mouse,
    scrollProgress,
    particleCount = 100,
    particleSize = 0.12,
    particleColor = "#ADD8E6",
    movementSpeed = 0.00075,
    movementRadius = 20,
  }) => {
    return (
      <MemoizedParticles
        mouse={mouse}
        scrollProgress={scrollProgress}
        count={particleCount}
        particleSize={particleSize}
        particleColor={particleColor}
        movementSpeed={movementSpeed}
        movementRadius={movementRadius}
      />
    );
  }
);

ParticleGlowEffect.displayName = "ParticleGlowEffect";

export default ParticleGlowEffect;
