import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 스크롤 도중 특정 섹션이 화면에 고정되고, 배열로 받은 여러 컨텐츠가 순차적으로 페이드 전환되는 컴포넌트
 * 
 * Props:
 * @param {React.ReactNode[]} sections - 전환할 컨텐츠 섹션 배열 [Required]
 * @param {number} duration - 고정 상태가 유지되는 스크롤 거리(px) [Optional, 기본값: 1200]
 * @param {boolean} scrub - 스크롤 위치에 애니메이션 동기화 여부 [Optional, 기본값: true]
 * @param {string} start - 고정 시작 위치 (ScrollTrigger start 형식) [Optional, 기본값: 'top top']
 * @param {string} backgroundColor - 고정 섹션의 배경색 [Optional, 기본값: '#000']
 * @param {boolean} showProgress - 진행 상태 표시기 표시 여부 [Optional, 기본값: false]
 * @param {function} onSectionChange - 섹션 변경 시 호출되는 콜백 함수 [Optional]
 * @param {number} fadeRatio - 페이드 인/아웃이 차지하는 비율 (0-0.5) [Optional, 기본값: 0.2]
 *
 * Example usage:
 * <PinnedScrollTransition 
 *   sections={[
 *     <Box>첫 번째 컨텐츠</Box>,
 *     <Box>두 번째 컨텐츠</Box>,
 *     <Box>세 번째 컨텐츠</Box>
 *   ]}
 *   duration={1500}
 *   backgroundColor="#1a1a1a"
 * />
 */
function PinnedScrollTransition({ 
  sections = [],
  duration = 1200,
  scrub = true,
  start = 'top top',
  backgroundColor = '#000',
  showProgress = false,
  onSectionChange,
  fadeRatio = 0.2
}) {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const triggerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  
  useEffect(() => {
    if (!containerRef.current || sections.length === 0) return;
    
    // 섹션 수에 따른 자동 duration 계산 (섹션당 최소 200px의 스크롤 거리 보장)
    const calculatedDuration = Math.max(duration, sections.length * 200);
    
    // 모든 섹션 초기 상태 설정
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { 
          opacity: index === 0 ? 1 : 0,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        });
      }
    });
    
    // ScrollTrigger 생성
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: start,
      end: `+=${calculatedDuration}`,
      pin: true,
      scrub: scrub ? 1 : false,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalSections = sections.length;
        
        // 각 섹션당 할당된 진행률 범위 계산
        const sectionDuration = 1 / totalSections;
        
        // 현재 섹션 인덱스 계산
        const newCurrentSection = Math.min(
          Math.floor(progress * totalSections), 
          totalSections - 1
        );
        
        // 각 섹션의 opacity 업데이트
        sectionRefs.current.forEach((ref, index) => {
          if (!ref) return;
          
          const sectionStart = index * sectionDuration;
          const sectionEnd = (index + 1) * sectionDuration;
          
          let opacity = 0;
          
          if (progress <= sectionStart) {
            // 아직 이 섹션에 도달하지 않음
            opacity = 0;
          } else if (progress >= sectionEnd && index < totalSections - 1) {
            // 이미 지나간 섹션 (마지막 섹션 제외)
            opacity = 0;
          } else if (progress > sectionStart && progress < sectionEnd) {
            // 현재 활성 섹션
            const localProgress = (progress - sectionStart) / sectionDuration;
            
            if (localProgress < fadeRatio) {
              // 페이드 인
              opacity = localProgress / fadeRatio;
            } else if (localProgress > (1 - fadeRatio)) {
              // 페이드 아웃 (마지막 섹션이 아닌 경우에만)
              if (index < totalSections - 1) {
                opacity = (1 - localProgress) / fadeRatio;
              } else {
                opacity = 1; // 마지막 섹션은 페이드 아웃하지 않음
              }
            } else {
              // 완전히 보이는 구간
              opacity = 1;
            }
          } else if (index === totalSections - 1 && progress >= sectionStart) {
            // 마지막 섹션은 시작되면 계속 보임
            opacity = 1;
          }
          
          gsap.to(ref, { 
            opacity, 
            duration: 0,
            ease: 'none'
          });
        });
        
        // 현재 섹션 변경 감지 및 콜백 호출
        if (newCurrentSection !== currentSection) {
          setCurrentSection(newCurrentSection);
          if (onSectionChange) {
            onSectionChange(newCurrentSection);
          }
        }
      }
    });
    
    triggerRef.current = trigger;
    
    // 클린업
    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [sections, duration, scrub, start, onSectionChange, fadeRatio]);
  
  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundColor,
        overflow: 'hidden',
      }}
    >
      {/* 컨텐츠 섹션들 */}
      {sections.map((section, index) => (
        <Box
          key={index}
          ref={el => sectionRefs.current[index] = el}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {section}
        </Box>
      ))}
      
      {/* 진행 상태 표시기 */}
      {showProgress && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
          }}
        >
          {sections.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentSection === index 
                  ? 'rgba(255, 255, 255, 0.8)' 
                  : 'rgba(255, 255, 255, 0.3)',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

PinnedScrollTransition.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.node).isRequired,
  duration: PropTypes.number,
  scrub: PropTypes.bool,
  start: PropTypes.string,
  backgroundColor: PropTypes.string,
  showProgress: PropTypes.bool,
  onSectionChange: PropTypes.func,
  fadeRatio: PropTypes.number,
};

export default PinnedScrollTransition; 