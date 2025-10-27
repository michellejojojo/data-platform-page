import React, { useRef, createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// throttle 함수 추가
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// 패럴럭스 컨텍스트 생성 (updateCurrentTranslateY 제거)
export const ParallaxContext = createContext({
  maxZ: 10,
  scrollY: 0,
});

/**
 * 패럴럭스 스크롤 효과를 제공하는 컨테이너 컴포넌트
 * 
 * @param {React.ReactNode} children - 컨테이너 내부에 렌더링할 컴포넌트 [Required]
 * @param {number} maxZ - 패럴럭스 효과의 최대 Z값 [Optional, 기본값: 10]
 * @param {string} className - 추가 CSS 클래스 [Optional]
 * @param {object} style - 인라인 스타일 객체 [Optional]
 * 
 * Example usage:
 * <ParallaxContainer maxZ={12}>
 *   <ParallaxLayer depthZ={10}>배경</ParallaxLayer>
 *   <ParallaxLayer depthZ={5}>중간 레이어</ParallaxLayer>
 *   <ParallaxLayer depthZ={0}>전경</ParallaxLayer>
 * </ParallaxContainer>
 */
function ParallaxContainer({ 
  children, 
  maxZ = 10,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const [relativeScrollY, setRelativeScrollY] = useState(0);
  const [bottomSpace, setBottomSpace] = useState(0);
  
  // translateY 변화 감지해서 스페이서 높이 조정
  useEffect(() => {
    const updateBottomSpace = () => {
      if (!containerRef.current) return;
      
      // 모든 레이어의 현재 위치 체크
      const layers = containerRef.current.querySelectorAll('.parallax-layer');
      if (layers.length === 0) return;
      
      let minTranslateY = 0; // 가장 많이 올라간 값 (음수)
      
      layers.forEach(layer => {
        // transform 스타일에서 translateY 값 추출
        const transform = window.getComputedStyle(layer).transform;
        if (transform && transform !== 'none') {
          // matrix(1, 0, 0, 1, 0, -100) 형태에서 마지막 값 추출
          const matrix = transform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            const translateY = parseFloat(values[5]) || 0;
            minTranslateY = Math.min(minTranslateY, translateY);
          }
        }
      });
      
      // 가장 많이 올라간 레이어의 translateY 값만큼 보정
      // minTranslateY가 음수이므로 절댓값으로 변환
      const compensation = Math.abs(minTranslateY);
      setBottomSpace(compensation);
    };
    
    // 스크롤할 때마다 업데이트 (throttle 적용)
    const throttledUpdate = throttle(updateBottomSpace, 50); // 더 빠른 응답을 위해 50ms로
    
    // 초기 실행
    setTimeout(updateBottomSpace, 100);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', throttledUpdate);
    window.addEventListener('resize', throttledUpdate);
    
    // Lenis 스크롤 이벤트도 구독
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', throttledUpdate);
    }
    
    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
      if (window.lenis && typeof window.lenis.off === 'function') {
        window.lenis.off('scroll', throttledUpdate);
      }
    };
  }, []);
  
  // Lenis 스크롤 이벤트 구독
  useEffect(() => {
    const handleLenisScroll = (e) => {
      if (containerRef.current) {
        const containerTop = containerRef.current.offsetTop;
        const relativeScroll = e.scroll - containerTop;
        setRelativeScrollY(relativeScroll);
      }
    };
    
    const handleNativeScroll = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.offsetTop;
        const relativeScroll = window.scrollY - containerTop;
        setRelativeScrollY(relativeScroll);
      }
    };
    
    // 초기 설정
    handleNativeScroll();
    
    // Lenis 인스턴스 구독 시도
    const setupScrollListener = () => {
      if (window.lenis && typeof window.lenis.on === 'function') {
        // Lenis 사용
        window.lenis.on('scroll', handleLenisScroll);
        return () => {
          if (window.lenis && typeof window.lenis.off === 'function') {
            window.lenis.off('scroll', handleLenisScroll);
          }
        };
      } else {
        // 네이티브 스크롤 사용
        window.addEventListener('scroll', handleNativeScroll, { passive: true });
        return () => {
          window.removeEventListener('scroll', handleNativeScroll);
        };
      }
    };
    
    // 즉시 시도하고, 100ms 후에도 재시도 (Lenis 초기화 대기)
    let cleanup = setupScrollListener();
    const timeoutId = setTimeout(() => {
      if (cleanup) cleanup();
      cleanup = setupScrollListener();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <ParallaxContext.Provider value={{ maxZ, scrollY: relativeScrollY }}>
      <div 
        ref={containerRef}
        className={`parallax-container ${className}`}
        style={{
          position: 'relative',
          minHeight: '200vh',
          marginBottom: `-${bottomSpace}px`, // 음수 마진으로 빈 공간 제거
          transition: 'margin-bottom 0.1s ease-out', // 부드러운 전환
          ...style
        }}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

ParallaxContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxZ: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ParallaxContainer; 