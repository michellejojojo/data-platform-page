import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

/**
 * StickyContainer 컴포넌트
 * 스크롤 시 요소를 상단 또는 하단에 고정(sticky)하는 컨테이너
 *
 * Props:
 * @param {string} position - sticky 위치 ('top', 'bottom') [Optional, 기본값: 'top']
 * @param {number} offset - sticky 위치 오프셋(px) [Optional, 기본값: 0]
 * @param {object} activeStyle - sticky 활성화 시 적용할 스타일 [Optional]
 * @param {object} sx - 기본 스타일 [Optional]
 * @param {boolean} detectSticky - sticky 상태 감지 여부 [Optional, 기본값: false]
 * @param {function} onStickyChange - sticky 상태 변경 시 호출될 콜백 [Optional]
 */
function StickyContainer({
  position = "top",
  offset = 0,
  activeStyle = { boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  sx = {},
  detectSticky = false,
  onStickyChange,
  children,
  ...rest
}) {
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef(null);
  const sentinelRef = useRef(null);

  // IntersectionObserver는 sticky 상태 감지가 필요한 경우에만 설정
  useEffect(() => {
    if (!detectSticky || !sentinelRef.current) return;

    // 가장 가까운 스크롤 컨테이너를 찾는 함수
    const findScrollContainer = (element) => {
      while (element && element !== document.body) {
        const style = window.getComputedStyle(element);
        if (
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll"
        ) {
          return element;
        }
        element = element.parentElement;
      }
      return null; // viewport 사용
    };

    const scrollContainer = findScrollContainer(sentinelRef.current);

    // 초기 상태 확인: sentinel이 실제로 보이는지 확인
    const checkInitialState = () => {
      if (!sentinelRef.current) return;

      const sentinelRect = sentinelRef.current.getBoundingClientRect();
      const containerRect = scrollContainer
        ? scrollContainer.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };

      // sentinel이 컨테이너 내부에 보이는지 확인
      const isVisible =
        sentinelRect.bottom > containerRect.top + offset &&
        sentinelRect.top < containerRect.bottom - offset;

      const initialSticky = !isVisible;
      setIsSticky(initialSticky);
      if (onStickyChange) onStickyChange(initialSticky);
    };

    // 초기 상태 확인 (약간의 지연을 두어 렌더링 완료 후 실행)
    const timeoutId = setTimeout(checkInitialState, 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const newIsSticky = !entry.isIntersecting;
        setIsSticky(newIsSticky);
        if (onStickyChange) onStickyChange(newIsSticky);
      },
      {
        root: scrollContainer, // 동적으로 찾은 스크롤 컨테이너 설정
        threshold: [0],
        rootMargin:
          position === "top"
            ? `${-offset}px 0px 0px 0px`
            : `0px 0px ${-offset}px 0px`,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [detectSticky, offset, onStickyChange, position]);

  // 기본 및 활성화 스타일 계산
  const stickyStyle = {
    position: "sticky",
    [position]: `${offset}px`,
    zIndex: 9,
    transition: "all 0.3s ease",
    ...(isSticky && activeStyle),
    ...sx,
  };

  return (
    <>
      {/* Sentinel은 sticky 상태 감지가 필요한 경우에만 렌더링 */}
      {detectSticky && (
        <Box
          ref={sentinelRef}
          sx={{
            position: "relative",
            top: position === "top" ? 0 : "auto",
            bottom: position === "bottom" ? 0 : "auto",
            height: "1px",
            width: "100%",
            visibility: "hidden",
          }}
        />
      )}

      <Box ref={stickyRef} sx={stickyStyle} {...rest}>
        {children}
      </Box>
    </>
  );
}

StickyContainer.propTypes = {
  position: PropTypes.oneOf(["top", "bottom"]),
  offset: PropTypes.number,
  activeStyle: PropTypes.object,
  sx: PropTypes.object,
  detectSticky: PropTypes.bool,
  onStickyChange: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default StickyContainer;
