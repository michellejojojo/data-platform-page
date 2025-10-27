import React, { useRef, useMemo } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// 커스텀 셰이더 머티리얼 정의
const WaveMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uScrollProgress: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uPrevMouse: new THREE.Vector2(0.5, 0.5),
    uWaveIntensity: 1.0,
    uWaveSpeed: 1.0,
    uColorStart: new THREE.Color('#0066ff'),
    uColorEnd: new THREE.Color('#00ffcc'),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    varying float vMouseInfluence;
    
    uniform float uTime;
    uniform float uScrollProgress;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform float uWaveIntensity;
    uniform float uWaveSpeed;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // 스크롤 진행률에 따른 증폭 계산 (디스토션 방지)
      float scrollAmplifier = pow(uScrollProgress, 0.9) * 0.8 + 1.0; // 1.0 ~ 1.8 범위
      
      // 기본 웨이브 패턴
      float distanceFromCenter = distance(uv, vec2(0.5));
      
      // 기본 웨이브들
      float baseWave = 
        sin(modelPosition.x * 3.0 + uTime * uWaveSpeed) * 0.1 +
        sin(modelPosition.y * 4.0 + uTime * uWaveSpeed * 0.8) * 0.05 +
        sin(distanceFromCenter * 10.0 - uTime * uWaveSpeed * 2.0) * 0.1;
      
      // 마우스 효과 개선 - 매우 정밀한 제어를 위한 좁은 영향 범위
      float mouseDistance = distance(uv, uMouse);
      float mouseRadius = 0.15; // 매우 정밀한 제어를 위한 좁은 반경
      float mouseInfluence = smoothstep(mouseRadius, 0.0, mouseDistance);
      
      // 마우스 벡터 방향으로의 파동
      vec2 mouseDirection = normalize(uv - uMouse);
      float directionalWave = sin(dot(mouseDirection, uv) * 20.0 - uTime * 2.0) * 0.1;
      
      // 부드러운 리플 효과 (주파수 감소, 진폭 증가)
      float mouseRipple = sin(mouseDistance * 8.0 - uTime * uWaveSpeed * 2.0) * 0.2;
      mouseRipple *= mouseInfluence * mouseInfluence; // 제곱으로 더 부드러운 감쇠
      
      // 마우스 이동 속도에 따른 추가 효과
      float mouseVelocity = distance(uMouse, uPrevMouse) * 50.0;
      float velocityBoost = clamp(mouseVelocity, 0.0, 1.0);
      
      // 전체 높이 계산
      float elevation = baseWave * scrollAmplifier + 
                       mouseRipple * (1.0 + velocityBoost) + 
                       directionalWave * mouseInfluence * 0.5;
      
      // 스크롤에 따른 추가 웨이브 (디스토션 방지)
      elevation += sin(modelPosition.x * 5.0 + modelPosition.y * 3.0 - uTime * uWaveSpeed * 1.5) * 
                   0.05 * scrollAmplifier * uScrollProgress;
      
      // 최종 웨이브 강도 적용
      elevation *= uWaveIntensity;
      
      modelPosition.z += elevation;
      
      vElevation = elevation;
      vUv = uv;
      vMouseInfluence = mouseInfluence;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying float vElevation;
    varying float vMouseInfluence;
    
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    uniform float uScrollProgress;
    uniform float uTime;
    uniform vec2 uMouse;
    
    void main() {
      // 스크롤에 따른 극적인 색상 변화
      float scrollColorMix = pow(uScrollProgress, 0.8);
      
      // 높이 기반 색상 믹싱 (더 강한 대비)
      float elevationMix = clamp((vElevation + 0.2) * 3.0, 0.0, 1.0);
      
      // 시간에 따른 색상 변화
      float colorWave = sin(vUv.x * 10.0 + uTime * 0.5) * 0.5 + 0.5;
      
      // 마우스 영향에 따른 색상 부스트
      float mouseColorBoost = vMouseInfluence * 0.5;
      
      // 최종 색상 계산
      float finalMixStrength = clamp(
        elevationMix + scrollColorMix * 0.5 + mouseColorBoost + colorWave * 0.2, 
        0.0, 
        1.0
      );
      
      vec3 color = mix(uColorStart, uColorEnd, finalMixStrength);
      
      // 마우스 주변 하이라이트 효과 (매우 좁은 반경에 맞춤)
      float mouseDistance = distance(vUv, uMouse);
      float highlight = exp(-mouseDistance * 10.0) * vMouseInfluence;
      color += vec3(highlight * 0.3);
      
      // 엣지 페이드 (스크롤에 따라 변화)
      float edgeFade = 1.0 - distance(vUv, vec2(0.5)) * (2.0 - uScrollProgress * 0.5);
      edgeFade = clamp(edgeFade, 0.0, 1.0);
      
      // 스크롤에 따른 전체 밝기 조절
      float brightness = 1.0 + uScrollProgress * 0.3;
      
      gl_FragColor = vec4(color * brightness, edgeFade);
    }
  `
)

// Three.js에 커스텀 머티리얼 등록
extend({ WaveMaterial })

/**
 * WaveEffect 컴포넌트
 * 셰이더 기반 웨이브 메시 효과를 렌더링합니다.
 */
export default function WaveEffect({ 
  scrollProgress,
  mousePosition,
  waveIntensity,
  waveSpeed,
  colorStart,
  colorEnd
}) {
  const meshRef = useRef()
  const materialRef = useRef()
  const prevMouseRef = useRef({ x: 0.5, y: 0.5 })
  
  // 색상을 Three.js Color 객체로 변환
  const colors = useMemo(() => ({
    start: new THREE.Color(colorStart),
    end: new THREE.Color(colorEnd)
  }), [colorStart, colorEnd])
  
  // 매 프레임마다 유니폼 업데이트
  useFrame((state) => {
    if (materialRef.current) {
      // 이전 마우스 위치 저장
      materialRef.current.uPrevMouse.x = prevMouseRef.current.x
      materialRef.current.uPrevMouse.y = prevMouseRef.current.y
      
      // 현재 값 업데이트
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uScrollProgress = scrollProgress
      materialRef.current.uMouse.x = mousePosition.x
      materialRef.current.uMouse.y = 1.0 - mousePosition.y // Y축 반전
      materialRef.current.uWaveIntensity = waveIntensity
      materialRef.current.uWaveSpeed = waveSpeed
      materialRef.current.uColorStart = colors.start
      materialRef.current.uColorEnd = colors.end
      
      // 다음 프레임을 위해 현재 마우스 위치 저장
      prevMouseRef.current.x = mousePosition.x
      prevMouseRef.current.y = 1.0 - mousePosition.y
    }
  })
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      <waveMaterial 
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
} 