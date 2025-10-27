import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";

/**
 * FullPageScroll 컴포넌트
 * 섹션별로 전체 화면 스크롤이 가능한 단일 페이지 애플리케이션을 구현합니다.
 * 마우스 휠, 키보드, 터치 제스처를 통한 네비게이션을 지원합니다.
 *
 * Props:
 * @param {React.ReactNode} children - 각 섹션에 해당하는 자식 요소들 [Required]
 * @param {number} animationDuration - 섹션 전환 애니메이션 지속 시간(초) [Optional, 기본값: 0.8]
 * @param {string} direction - 스크롤 방향 ('vertical' | 'horizontal') [Optional, 기본값: 'vertical']
 * @param {boolean} enableMouseWheel - 마우스 휠 스크롤 활성화 [Optional, 기본값: true]
 * @param {boolean} enableKeyboard - 키보드 네비게이션 활성화 [Optional, 기본값: true]
 * @param {boolean} enableTouch - 터치/스와이프 네비게이션 활성화 [Optional, 기본값: true]

 * @param {number} touchSensitivity - 터치 감도 (픽셀) [Optional, 기본값: 50]
 * @param {boolean} showDots - 네비게이션 도트 표시 여부 [Optional, 기본값: true]
 * @param {string} dotsPosition - 도트 위치 ('right' | 'left' | 'bottom' | 'top') [Optional, 기본값: 'right']
 * @param {string} dotsColor - 네비게이션 도트 색상 [Optional, 기본값: theme.palette.primary.main]
 * @param {number} currentSectionIndex - 초기 섹션 인덱스 [Optional, 기본값: 0]
 * @param {function} onSectionChange - 섹션 변경 시 호출되는 콜백 함수 [Optional]
 * @param {object} sx - 추가 스타일 객체 [Optional]
 * @param {boolean} loop - 마지막 섹션에서 첫 번째 섹션으로 루프 [Optional, 기본값: false]
 *
 * Example usage:
 * <FullPageScroll
 *   animationDuration={1.0}
 *   direction="vertical"
 *   showDots={true}
 *   dotsColor="#ff6b6b"
 *   currentSectionIndex={0}
 *   onSectionChange={(index) => console.log('Current section:', index)}
 * >
 *   <Section1 />
 *   <Section2 />
 *   <Section3 />
 * </FullPageScroll>
 */
function FullPageScroll({
  children,
  animationDuration = 0.6,
  direction = "vertical",
  enableMouseWheel = true,
  enableKeyboard = true,
  enableTouch = true,
  touchSensitivity = 50,
  showDots = true,
  dotsPosition = "right",
  dotsColor,
  currentSectionIndex,
  onSectionChange,
  sx = {},
  loop = false,
}) {
  const theme = useTheme();
  const [currentSection, setCurrentSection] = useState(currentSectionIndex || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastScrollTimeRef = useRef(0); // 시간 기반 스크롤 제어
  const currentSectionRef = useRef(currentSection);
  const isAnimatingRef = useRef(isAnimating);
  const processingScrollRef = useRef(false); // 스크롤 처리 중 플래그

  // state 값 변경될 때마다 ref 업데이트
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // 자식 요소들을 배열로 변환
  const sections = React.Children.toArray(children);
  const totalSections = sections.length;

  /**
   * ===========================================
   * 🎯 도트 네비게이션을 통한 직접 섹션 이동
   * ===========================================
   * 사용자가 도트를 클릭했을 때 해당 섹션으로 바로 이동
   */
  
  const goToSection = useCallback(
    (sectionIndex) => {
      // 🔒 애니메이션 중이면 클릭 무시
      if (isAnimatingRef.current) return;

      // 📍 타겟 섹션 검증 및 보정
      let targetIndex = sectionIndex;

      if (loop) {
        // 루프 모드: 인덱스 순환 처리
        if (targetIndex < 0) {
          targetIndex = totalSections - 1;
        } else if (targetIndex >= totalSections) {
          targetIndex = 0;
        }
      } else {
        // 일반 모드: 유효 범위로 제한
        targetIndex = Math.max(0, Math.min(targetIndex, totalSections - 1));
      }

      if (targetIndex !== currentSection) {
        // 🎬 애니메이션 제어 및 실행
        
        // 🚫 중복 클릭 방지 플래그 즉시 설정
        isAnimatingRef.current = true;
        setIsAnimating(true);
        
        // 🎬 선택된 섹션으로 애니메이션 시작
        setCurrentSection(targetIndex);

        // 📢 섹션 변경 알림
        if (onSectionChange) {
          onSectionChange(targetIndex);
        }

        // ⏰ 애니메이션 완료 후 다음 클릭 허용
        setTimeout(() => {
          currentSectionRef.current = targetIndex;
          isAnimatingRef.current = false;
          setIsAnimating(false);
        }, animationDuration * 1000);
      }
    },
    [totalSections, loop, onSectionChange, animationDuration, currentSection]
  );

  /**
   * ===========================================
   * 🖱️ 1. 스크롤 발생을 감지하고 해석하는 부분
   * ===========================================
   * 마우스 휠, 키보드, 터치 등의 사용자 입력을 감지하고
   * 어떤 방향으로 스크롤하려는지 해석합니다.
   */
  
  // 마우스 휠 이벤트 핸들러 - 안전한 섹션 추적
  const handleWheel = useCallback(
    (event) => {
      if (!enableMouseWheel) return;

      // 🔒 애니메이션 중에는 새로운 스크롤 무시 (끊김 방지)
      if (isAnimatingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // 🎯 스크롤 방향과 크기 감지
      const delta = direction === "vertical" ? event.deltaY : event.deltaX;
      
      // 너무 작은 움직임은 무시 (의도치 않은 스크롤 방지)
      if (Math.abs(delta) < 10) {
        return;
      }

      // 브라우저 기본 스크롤 동작 차단
      event.preventDefault();
      event.stopPropagation();
      
      /**
       * ===========================================
       * 🎯 2. 어디로 넘길지 결정하고 섹션을 지정하는 부분
       * ===========================================
       * 스크롤 방향을 분석해서 다음에 보여줄 섹션을 결정합니다.
       */
      
      // 🧭 스크롤 방향 해석 (양수: 아래/오른쪽, 음수: 위/왼쪽)
      const scrollDirection = delta > 0 ? 1 : -1;
      
      // 📍 현재 섹션에서 다음 섹션 계산 (state 값 사용)
      const currentSec = currentSection;
      let targetIndex = currentSec + scrollDirection;

      // 🔄 루프 설정과 섹션 범위 체크
      if (loop) {
        // 루프 활성화: 첫 번째 ↔ 마지막 순환
        if (targetIndex < 0) {
          targetIndex = totalSections - 1; // 첫 번째에서 위로 → 마지막으로
        } else if (targetIndex >= totalSections) {
          targetIndex = 0; // 마지막에서 아래로 → 첫 번째로
        }
      } else {
        // 루프 비활성화: 범위 벗어나면 스크롤 무시
        if (targetIndex < 0 || targetIndex >= totalSections) {
          return;
        }
      }

      // 이미 같은 섹션이면 무시
      if (targetIndex === currentSec) {
        return;
      }

      /**
       * ===========================================
       * 🎬 3. 애니메이션을 제어하는 부분
       * ===========================================
       * 결정된 섹션으로 부드럽게 이동하는 애니메이션을 시작하고
       * 애니메이션이 끝날 때까지 추가 스크롤을 막습니다.
       */
      
      // 🚫 중복 애니메이션 방지 플래그 즉시 설정
      isAnimatingRef.current = true;
      setIsAnimating(true);
      
      // 🎬 섹션 전환 애니메이션 시작
      setCurrentSection(targetIndex);

      // 📢 섹션 변경 알림 (외부 컴포넌트에서 활용 가능)
      if (onSectionChange) {
        onSectionChange(targetIndex);
      }

      // ⏰ 애니메이션 완료 후 다음 스크롤 허용 (실제 애니메이션 시간과 동기화)
      setTimeout(() => {
        // 🔄 ref 값을 애니메이션 완료 시점에 업데이트
        currentSectionRef.current = targetIndex;
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }, animationDuration * 1000); // 정확한 애니메이션 시간만 사용
    },
    [
      enableMouseWheel,
      direction,
      totalSections,
      loop,
      onSectionChange,
      animationDuration,
      currentSection, // currentSection 의존성 추가
    ]
  );

  /**
   * ===========================================
   * ⌨️ 키보드 입력을 통한 섹션 네비게이션
   * ===========================================
   */
  
  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (event) => {
      if (!enableKeyboard) return;

      // 🔒 처리 중이거나 애니메이션 중이면 차단
      if (processingScrollRef.current || isAnimatingRef.current) return;

      // 🎯 1. 키보드 입력 감지 및 해석
      const { key } = event;
      let targetIndex = currentSectionRef.current;
      let shouldMove = false;

      // 📍 2. 방향별 키 매핑 및 섹션 결정
      if (direction === "vertical") {
        // 세로 스크롤: 위/아래 화살표, 페이지 키, 스페이스바
        if (key === "ArrowDown" || key === "PageDown" || key === " ") {
          targetIndex = currentSection + 1; // 다음 섹션
          shouldMove = true;
        } else if (key === "ArrowUp" || key === "PageUp") {
          targetIndex = currentSection - 1; // 이전 섹션
          shouldMove = true;
        }
      } else {
        // 가로 스크롤: 좌/우 화살표, 페이지 키
        if (key === "ArrowRight" || key === "PageDown") {
          targetIndex = currentSection + 1; // 다음 섹션
          shouldMove = true;
        } else if (key === "ArrowLeft" || key === "PageUp") {
          targetIndex = currentSection - 1; // 이전 섹션
          shouldMove = true;
        }
      }

      // 특수 키: 처음/마지막 섹션으로 바로 이동
      if (key === "Home") {
        targetIndex = 0; // 첫 번째 섹션
        shouldMove = true;
      } else if (key === "End") {
        targetIndex = totalSections - 1; // 마지막 섹션
        shouldMove = true;
      }

      if (shouldMove) {
        event.preventDefault();

        // 루프 및 범위 체크
        if (loop) {
          if (targetIndex < 0) {
            targetIndex = totalSections - 1;
          } else if (targetIndex >= totalSections) {
            targetIndex = 0;
          }
        } else {
          targetIndex = Math.max(0, Math.min(targetIndex, totalSections - 1));
        }

        if (targetIndex !== currentSection) {
          // 🎬 3. 애니메이션 제어 및 실행
          
          // 🚫 중복 입력 방지 플래그 즉시 설정
          isAnimatingRef.current = true;
          processingScrollRef.current = true;
          lastScrollTimeRef.current = Date.now();
          setIsAnimating(true);
          
          // 🎬 섹션 전환 애니메이션 시작
          setCurrentSection(targetIndex);

          // 📢 섹션 변경 알림
          if (onSectionChange) {
            onSectionChange(targetIndex);
          }

          // ⏰ 애니메이션 완료 후 다음 키 입력 허용
          setTimeout(() => {
            currentSectionRef.current = targetIndex;
            isAnimatingRef.current = false;
            setIsAnimating(false);
            processingScrollRef.current = false;
          }, animationDuration * 1000);
        }
      }
    },
    [
      enableKeyboard,
      direction,
      totalSections,
      loop,
      onSectionChange,
      animationDuration,
      currentSection,
    ]
  );

  /**
   * ===========================================
   * 👆 터치/스와이프를 통한 섹션 네비게이션
   * ===========================================
   */
  
  // 터치 시작 위치 기록
  const handleTouchStart = useCallback(
    (event) => {
      if (!enableTouch) return;

      // 🎯 1. 터치 시작 위치 감지
      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    },
    [enableTouch]
  );

  // 터치 종료 이벤트 - 스와이프 거리 계산 및 섹션 이동
  const handleTouchEnd = useCallback(
    (event) => {
      if (!enableTouch) return;

      // 🔒 처리 중이거나 애니메이션 중이면 차단
      if (processingScrollRef.current || isAnimatingRef.current) return;

      // 🎯 1. 터치 종료 위치 감지 및 스와이프 거리 계산
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      const threshold = touchSensitivity;
      let targetIndex = currentSectionRef.current;
      let shouldMove = false;

      // 📍 2. 스와이프 방향 해석 및 섹션 결정
      if (direction === "vertical") {
        // 세로 스와이프: 위/아래 제스처 감지
        if (Math.abs(deltaY) > threshold) {
          if (deltaY < 0) {
            targetIndex = currentSection + 1; // 위로 스와이프 → 다음 섹션
          } else {
            targetIndex = currentSection - 1; // 아래로 스와이프 → 이전 섹션
          }
          shouldMove = true;
        }
      } else {
        // 가로 스와이프: 좌/우 제스처 감지
        if (Math.abs(deltaX) > threshold) {
          if (deltaX < 0) {
            targetIndex = currentSection + 1; // 왼쪽 스와이프 → 다음 섹션
          } else {
            targetIndex = currentSection - 1; // 오른쪽 스와이프 → 이전 섹션
          }
          shouldMove = true;
        }
      }

      if (shouldMove) {
        // 루프 및 범위 체크
        if (loop) {
          if (targetIndex < 0) {
            targetIndex = totalSections - 1;
          } else if (targetIndex >= totalSections) {
            targetIndex = 0;
          }
        } else {
          targetIndex = Math.max(0, Math.min(targetIndex, totalSections - 1));
        }

        if (targetIndex !== currentSection) {
          // 🎬 3. 애니메이션 제어 및 실행
          
          // 🚫 중복 터치 방지 플래그 즉시 설정
          isAnimatingRef.current = true;
          processingScrollRef.current = true;
          lastScrollTimeRef.current = Date.now();
          setIsAnimating(true);
          
          // 🎬 섹션 전환 애니메이션 시작
          setCurrentSection(targetIndex);

          // 📢 섹션 변경 알림
          if (onSectionChange) {
            onSectionChange(targetIndex);
          }

          // ⏰ 애니메이션 완료 후 다음 터치 허용
          setTimeout(() => {
            currentSectionRef.current = targetIndex;
            isAnimatingRef.current = false;
            setIsAnimating(false);
            processingScrollRef.current = false;
          }, animationDuration * 1000);
        }
      }
    },
    [
      enableTouch,
      direction,
      touchSensitivity,
      totalSections,
      loop,
      onSectionChange,
      animationDuration,
      currentSection,
    ]
  );

  // 기본 스크롤 차단
  useEffect(() => {
    // body와 html의 스크롤 차단
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // 이벤트 리스너 등록
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 전역 휠 이벤트 차단 (container에서만 처리하도록 수정)
    const handleGlobalWheel = (e) => {
      if (enableMouseWheel && container.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (enableMouseWheel) {
      // container에만 이벤트 리스너 등록 (중복 방지)
      container.addEventListener("wheel", handleWheel, {
        passive: false,
        capture: true,
      });
      // document 레벨에서는 기본 동작만 차단
      document.addEventListener("wheel", handleGlobalWheel, { passive: false });
    }

    if (enableKeyboard) {
      window.addEventListener("keydown", handleKeyDown);
    }

    if (enableTouch) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (enableMouseWheel) {
        container.removeEventListener("wheel", handleWheel, { capture: true });
        document.removeEventListener("wheel", handleGlobalWheel);
      }
      if (enableKeyboard) {
        window.removeEventListener("keydown", handleKeyDown);
      }
      if (enableTouch) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [
    enableMouseWheel,
    enableKeyboard,
    enableTouch,
    handleWheel,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
  ]);

  // 애니메이션 변형
  const getTransformValue = () => {
    if (direction === "vertical") {
      return `translateY(-${currentSection * 100}%)`;
    } else {
      return `translateX(-${currentSection * 100}%)`;
    }
  };

  // 도트 네비게이션 위치 스타일
  const getDotsPosition = () => {
    const baseStyle = {
      position: "fixed",
      zIndex: 1000,
      display: "flex",
      gap: 1,
    };

    switch (dotsPosition) {
      case "right":
        return {
          ...baseStyle,
          flexDirection: "column",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "left":
        return {
          ...baseStyle,
          flexDirection: "column",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "bottom":
        return {
          ...baseStyle,
          flexDirection: "row",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "top":
        return {
          ...baseStyle,
          flexDirection: "row",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
        };
      default:
        return baseStyle;
    }
  };

  // 컨테이너 포커스 관리
  useEffect(() => {
    const container = containerRef.current;
    if (container && enableKeyboard) {
      container.focus();
    }
  }, [enableKeyboard]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        outline: "none",
        userSelect: "none",
        touchAction: "none",
        ...sx,
      }}
      tabIndex={0}
    >
      {/* 섹션 컨테이너 */}
      <Box
        component={motion.div}
        animate={{
          transform: getTransformValue(),
        }}
        transition={{
          duration: animationDuration,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: direction === "vertical" ? "column" : "row",
        }}
      >
        {sections.map((section, index) => (
          <Box
            key={index}
            sx={{
              height: "100vh",
              width: "100vw",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {section}
          </Box>
        ))}
      </Box>

      {/* 네비게이션 도트 */}
      {showDots && (
        <Box sx={getDotsPosition()}>
          {sections.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSection(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  currentSection === index
                    ? dotsColor || theme.palette.primary.main
                    : theme.palette.action.disabled,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    currentSection === index
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

FullPageScroll.propTypes = {
  children: PropTypes.node.isRequired,
  animationDuration: PropTypes.number,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
  enableMouseWheel: PropTypes.bool,
  enableKeyboard: PropTypes.bool,
  enableTouch: PropTypes.bool,
  touchSensitivity: PropTypes.number,
  showDots: PropTypes.bool,
  dotsPosition: PropTypes.oneOf(["right", "left", "bottom", "top"]),
  dotsColor: PropTypes.string,
  currentSectionIndex: PropTypes.number,
  onSectionChange: PropTypes.func,
  sx: PropTypes.object,
  loop: PropTypes.bool,
};

export default FullPageScroll;
