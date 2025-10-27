import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

/**
 * 스크롤에 따라 clip-path 마스킹 효과로 섹션 전환을 보여주는 컴포넌트
 * 
 * Props:
 * @param {string} wipeDirection - 와이프 방향 ('left', 'right') [Optional, 기본값: 'left']
 * @param {string} wipeColor - 배경 오버레이 색상 [Optional, 기본값: '#000000']
 * @param {number} wipeOpacity - 배경 오버레이 불투명도 [Optional, 기본값: 0.8]
 * @param {number} wipeDuration - 와이프 애니메이션 지속 시간(초) [Optional, 기본값: 0.5]
 * @param {number} contentDelay - 컨텐츠 표시 지연 시간(초) [Optional, 기본값: 0.2]
 * @param {React.ReactNode} children - 섹션에 표시할 컨텐츠 [Required]
 *
 * Example usage:
 * <ScrollSectionWithWipe 
 *   wipeDirection="left"
 *   wipeColor="#0000ff"
 *   wipeOpacity={0.7}
 *   wipeDuration={0.8}
 *   contentDelay={0.3}
 * >
 *   <Typography variant="h2">섹션 내용</Typography>
 * </ScrollSectionWithWipe>
 */
function ScrollSectionWithWipe({
  wipeDirection = "left",
  wipeColor = "#000000",
  wipeOpacity = 0.8,
  wipeDuration = 0.5,
  contentDelay = 0.2,
  children
}) {
  // 상태 관리
  const [isVisible, setIsVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  // clip-path 값 계산 함수
  const getClipPath = () => {
    if (isVisible) {
      return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"; // 전체 표시
    }
    
    return wipeDirection === "left" 
      ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" // 왼쪽에서 시작 (width: 0)
      : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"; // 오른쪽에서 시작 (width: 0)
  };

  // IntersectionObserver 설정 및 해제
  useEffect(() => {
    // 화면 중앙에 왔을 때 요소 가시성 감지
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // 섹션이 화면 중앙에 진입할 때 마스킹 효과 시작
          setIsVisible(true);
          
          // 마스킹 효과 후 컨텐츠 세부 애니메이션 (지연 적용)
          const contentTimer = setTimeout(() => {
            setIsContentVisible(true);
          }, contentDelay * 1000);
          
          return () => clearTimeout(contentTimer);
        } else {
          // 화면에서 벗어날 때 상태 초기화 (선택적)
          // setIsVisible(false);
          // setIsContentVisible(false);
        }
      },
      { 
        threshold: 0.5, // 50% 이상 보일 때 (중앙 감지)
        rootMargin: "0px" // 기본 마진으로 설정
      }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    // 컴포넌트 언마운트 시 Observer 해제
    return () => {
      if (observerRef.current && sectionRef.current) {
        observerRef.current.unobserve(sectionRef.current);
      }
    };
  }, [contentDelay]);

  // prefers-reduced-motion 감지
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 전체 섹션 - clip-path 마스킹 적용 (배경색과 컨텐츠 모두 포함) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          backgroundColor: wipeColor, // 클리핑 대상에 배경색 적용
          opacity: wipeOpacity, // 클리핑 대상에 불투명도 적용
          // clip-path 마스킹 효과
          clipPath: prefersReducedMotion ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : getClipPath(),
          transition: prefersReducedMotion 
            ? "none" 
            : `clip-path ${wipeDuration}s cubic-bezier(0.23, 1, 0.32, 1)`,
          willChange: "clip-path",
        }}
      >
        {/* 컨텐츠 래퍼 - 세부 애니메이션 적용 */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            opacity: prefersReducedMotion ? 1 : (isContentVisible ? 1 : 0.8),
            transform: prefersReducedMotion ? "none" : `translateY(${isContentVisible ? 0 : 20}px)`,
            transition: prefersReducedMotion 
              ? "none" 
              : `opacity ${wipeDuration / 2}s ease-out, transform ${wipeDuration / 2}s ease-out`,
            transitionDelay: `${contentDelay}s`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// PropTypes 업데이트
ScrollSectionWithWipe.propTypes = {
  wipeDirection: PropTypes.oneOf(["left", "right"]),
  wipeColor: PropTypes.string,
  wipeOpacity: PropTypes.number,
  wipeDuration: PropTypes.number,
  contentDelay: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default ScrollSectionWithWipe; 