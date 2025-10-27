import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ParallaxContext } from './ParallaxContainer';

/**
 * 패럴랙스 효과가 적용된 레이어 컴포넌트
 * 
 * @param {React.ReactNode} children - 레이어 내부에 렌더링할 컴포넌트 [Required]
 * @param {number} depthZ - Z축 깊이 값 (0~10) [Optional, 기본값: 0]
 * @param {string} className - 추가 CSS 클래스 [Optional]
 * @param {object} style - 인라인 스타일 객체 [Optional]
 * 
 * Example usage:
 * <ParallaxLayer depthZ={5}>
 *   <div>중간 레이어 콘텐츠</div>
 * </ParallaxLayer>
 */
function ParallaxLayer({ 
  children, 
  depthZ = 0, 
  className = '', 
  style = {} 
}) {
  // 컨텍스트에서 최대 Z값과 현재 스크롤 위치 가져오기
  const { maxZ, scrollY } = useContext(ParallaxContext);
  
  // depthZ가 maxZ 범위 내에 있도록 제한
  const safeDepthZ = Math.max(0, Math.min(maxZ, depthZ));
  
  // 패럴랙스 속도: depthZ가 높을수록 느리게
  const parallaxSpeed = 1 - (safeDepthZ / maxZ);
  const translateY = -scrollY * parallaxSpeed; // 음수로 방향 반전
  
  return (
    <div
      className={`parallax-layer ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        transform: `translateY(${translateY}px)`,
        zIndex: maxZ - safeDepthZ, // depthZ가 작을수록 더 위에 표시
        padding: '2rem 0', // 레이어 간 간격 제공
        ...style
      }}
    >
      {children}
    </div>
  );
}

ParallaxLayer.propTypes = {
  children: PropTypes.node.isRequired,
  depthZ: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ParallaxLayer; 