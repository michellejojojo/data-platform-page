import React, { useRef, useEffect, useState, useCallback, Children } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box } from '@mui/material'
import WaveEffect from './WaveEffect'

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
 * WaveSection 컴포넌트
 * WaveBackground의 각 섹션을 정의합니다.
 * 
 * Props:
 * @param {ReactNode} children - 섹션 내용 [Required]
 * 
 * Example usage:
 * <WaveSection>섹션 내용</WaveSection>
 */
export function WaveSection({ children }) {
  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {children}
    </Box>
  );
}

/**
 * WaveBackground 컴포넌트
 * 3D 공간에서 스크롤과 마우스에 반응하는 동적인 웨이브 배경 효과
 * 
 * 두 가지 사용 방식을 지원:
 * 1. 기존 방식: scrollProgress와 mousePosition을 직접 전달
 * 2. 새로운 방식: children 배열을 전달하면 자동으로 스크롤 처리
 * 
 * Props:
 * @param {ReactNode} children - WaveSection 배열 (새로운 방식) [Optional]
 * @param {number} scrollProgress - 스크롤 진행률 (기존 방식) [Optional, 기본값: 자동 계산]
 * @param {object} mousePosition - 마우스 위치 (기존 방식) [Optional, 기본값: 자동 계산]
 * @param {number} waveIntensity - 웨이브 강도 [Optional, 기본값: 1.0]
 * @param {number} waveSpeed - 웨이브 속도 [Optional, 기본값: 1.0]
 * @param {string} colorStart - 시작 색상 [Optional, 기본값: '#0066ff']
 * @param {string} colorEnd - 끝 색상 [Optional, 기본값: '#00ffcc']
 * 
 * Example usage (새로운 방식):
 * <WaveBackground>
 *   <WaveSection>첫 번째 섹션</WaveSection>
 *   <WaveSection>두 번째 섹션</WaveSection>
 * </WaveBackground>
 * 
 * Example usage (기존 방식):
 * <WaveBackground scrollProgress={0.5} mousePosition={{x: 0.5, y: 0.5}} />
 */
export default function WaveBackground({ 
  children,
  scrollProgress: externalScrollProgress,
  mousePosition: externalMousePosition,
  waveIntensity = 1.0,
  waveSpeed = 1.0,
  colorStart = '#0066ff',
  colorEnd = '#00ffcc'
}) {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  
  // 상태 관리
  const [internalScrollProgress, setInternalScrollProgress] = useState(0);
  const [internalMousePosition, setInternalMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // children이 있으면 새로운 방식, 없으면 기존 방식
  const hasChildren = Children.count(children) > 0;
  const childrenArray = Children.toArray(children);
  
  // 실제 사용할 값들 (외부에서 전달되면 외부 값, 아니면 내부 계산 값)
  const scrollProgress = externalScrollProgress !== undefined ? externalScrollProgress : internalScrollProgress;
  const mousePosition = externalMousePosition !== undefined ? externalMousePosition : internalMousePosition;

  // 메모이제이션된 스크롤 핸들러
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      
      // 소수점 2자리로 반올림하여 불필요한 업데이트 방지
      const roundedProgress = Math.round(progress * 100) / 100;
      
      setInternalScrollProgress(prevProgress => {
        // 값이 실제로 변경된 경우만 업데이트
        return Math.abs(prevProgress - roundedProgress) > 0.01 ? roundedProgress : prevProgress;
      });
    }
  }, []);

  // 메모이제이션된 마우스 핸들러
  const handleMouseMove = useCallback((event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      setInternalMousePosition({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y))
      });
    }
  }, []);

  // Throttled 핸들러
  const throttledHandleScroll = useCallback(
    throttle(handleScroll, 16),
    [handleScroll]
  );
  
  const throttledHandleMouseMove = useCallback(
    throttle(handleMouseMove, 16),
    [handleMouseMove]
  );

  // 이벤트 리스너 등록 (새로운 방식일 때만)
  useEffect(() => {
    if (!hasChildren) return;
    
    const element = scrollRef.current;
    if (element) {
      handleScroll();
      element.addEventListener('scroll', throttledHandleScroll, { passive: true });
      return () => element.removeEventListener('scroll', throttledHandleScroll);
    }
  }, [hasChildren, handleScroll, throttledHandleScroll]);

  useEffect(() => {
    if (!hasChildren) return;
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', throttledHandleMouseMove);
      return () => container.removeEventListener('mousemove', throttledHandleMouseMove);
    }
  }, [hasChildren, throttledHandleMouseMove]);

  // 기존 방식 (children 없음): Canvas만 렌더링
  if (!hasChildren) {
    return (
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false
        }}
      >
        <color attach="background" args={['#001122']} />
        <ambientLight intensity={0.5} />
        <WaveEffect 
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
          waveIntensity={waveIntensity}
          waveSpeed={waveSpeed}
          colorStart={colorStart}
          colorEnd={colorEnd}
        />
      </Canvas>
    );
  }

  // 새로운 방식 (children 있음): 전체 컨테이너 렌더링
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        backgroundColor: '#001122',
      }}
    >
      {/* 웨이브 배경 */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false
        }}
      >
        <color attach="background" args={['#001122']} />
        <ambientLight intensity={0.5} />
        <WaveEffect 
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
          waveIntensity={waveIntensity}
          waveSpeed={waveSpeed}
          colorStart={colorStart}
          colorEnd={colorEnd}
        />
      </Canvas>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <Box
        ref={scrollRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          zIndex: 1,
          color: '#e0e0e0',
          fontFamily: "'Poppins', sans-serif",
          scrollbarWidth: 'thin',
          scrollbarColor: '#555 #333',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(30, 30, 30, 0.4)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        {/* 자동으로 계산된 전체 높이 */}
        <Box sx={{ height: `${childrenArray.length * 100}vh` }}>
          {childrenArray.map((child, index) => (
            <Box key={index}>
              {child}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
} 