import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { ParallaxContext } from './ParallaxContainer';

/**
 * 개별 요소에 커스텀 패럴랙스 효과를 적용하는 컴포넌트
 * 
 * @param {React.ReactNode} children - 패럴랙스 효과를 적용할 요소 [Required]
 * @param {number} depthZ - Z축 깊이 값 (0~10) [Optional, 기본값: 0]
 * @param {number} speed - 패럴랙스 속도 배율 [Optional, 기본값: 1]
 * @param {string} className - 추가 CSS 클래스 [Optional]
 * @param {object} style - 인라인 스타일 객체 [Optional]
 * 
 * Example usage:
 * <ParallaxItem depthZ={3} speed={0.5}>
 *   <div>커스텀 패럴랙스 요소</div>
 * </ParallaxItem>
 */
function ParallaxItem({ 
  children, 
  depthZ = 0, 
  speed = 1,
  className = '', 
  style = {} 
}) {
  const itemRef = useRef(null);
  const { maxZ, scrollY } = useContext(ParallaxContext);
  
  // depthZ가 maxZ 범위 내에 있도록 제한
  const safeDepthZ = Math.max(0, Math.min(maxZ, depthZ));
  
  // 패럴랙스 속도 계산: depthZ가 높을수록 느리게, speed로 추가 조정
  const parallaxSpeed = (1 - (safeDepthZ / maxZ)) * speed;
  const translateY = -scrollY * parallaxSpeed;
  
  return (
    <div
      ref={itemRef}
      className={`parallax-item ${className}`}
      style={{
        position: 'relative',
        transform: `translateY(${translateY}px)`,
        zIndex: maxZ - safeDepthZ,
        ...style
      }}
    >
      {children}
    </div>
  );
}

ParallaxItem.propTypes = {
  children: PropTypes.node.isRequired,
  depthZ: PropTypes.number,
  speed: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ParallaxItem; 