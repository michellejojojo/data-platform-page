import React, { useRef, useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * 텍스트에 그라데이션을 적용하는 Typography 컴포넌트
 *
 * Props:
 * @param {string} text - 표시할 텍스트 내용 [Required]
 * @param {string|array} gradient - 그라데이션 색상 (단일 문자열 또는 색상 배열) [Required]
 * @param {number} angle - 그라데이션 각도 (도 단위, 0-360) [Optional, 기본값: 0]
 * @param {string} variant - Typography 변형 (h1, h2, body1 등) [Optional, 기본값: 'body1']
 * @param {number} animationSpeed - 애니메이션 속도 (초 단위) [Optional, 기본값: 3]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <GradientTypography
 *   text="그라데이션 텍스트"
 *   gradient={['#ff0000', '#00ff00', '#0000ff']}
 *   variant="h1"
 *   angle={45}
 *   animationSpeed={2}
 * />
 */
function GradientTypography({
  text,
  gradient,
  angle = 0,
  variant = "body1",
  animationSpeed = 3,
  sx = {},
  ...props
}) {
  const boxRef = useRef(null);
  const animationRef = useRef(null);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // 색상 interpolation 함수
  const interpolateColor = (color1, color2, progress) => {
    // hex 색상을 RGB로 변환
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    // RGB를 hex로 변환
    const rgbToHex = (r, g, b) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

    return rgbToHex(r, g, b);
  };

  // 그라데이션 문자열 생성
  const getGradientString = (colors) => {
    // 색상이 배열인 경우 처리
    if (Array.isArray(colors)) {
      if (colors.length === 0) return "#000000";
      if (colors.length === 1) return colors[0];

      const direction = `${angle}deg`;
      const lastColor = colors[colors.length - 1];

      // 트랜지션 진행 중인 경우
      if (transitionProgress > 0) {
        // 각 색상을 마지막 색으로 점진적으로 interpolation
        const interpolatedColors = colors.map((color) =>
          interpolateColor(color, lastColor, transitionProgress)
        );
        return `linear-gradient(${direction}, ${interpolatedColors.join(
          ", "
        )})`;
      }

      // 기본 상태: 원래 색상의 선형 그라데이션
      return `linear-gradient(${direction}, ${colors.join(", ")})`;
    }

    // 색상이 문자열인 경우 그대로 사용
    return colors;
  };

  // 트랜지션 애니메이션 함수
  const animateTransition = (from, to, duration = 500) => {
    // 기존 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOut 함수로 자연스러운 애니메이션
      const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
      const easedProgress = easeInOut(progress);

      const currentValue = from + (to - from) * easedProgress;
      setTransitionProgress(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // 마우스 이벤트 핸들러
  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    animateTransition(transitionProgress, 1, 500); // 0.5초 동안 1로
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    animateTransition(transitionProgress, 0, 500); // 0.5초 동안 0으로
  };

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // gradient prop 변경 시 상태 초기화
  useEffect(() => {
    console.log('🔄 Gradient changed, resetting transitionProgress');
    
    // 진행 중인 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // 상태 초기화
    setTransitionProgress(0);
  }, [gradient]);

  // 애니메이션 키프레임 정의
  const keyframes = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <Box
        ref={boxRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: "inline-block",
          position: "relative",
          cursor: "pointer",
          ...sx,
        }}
        {...props}
      >
        <Typography
          variant={variant}
          sx={{
            backgroundImage: getGradientString(gradient),
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            backgroundSize: "200% 200%",
            animation: `gradientAnimation ${animationSpeed}s ease infinite`,
            ...sx,
          }}
        >
          {text}
        </Typography>
      </Box>
    </>
  );
}

GradientTypography.propTypes = {
  text: PropTypes.string.isRequired,
  gradient: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  angle: PropTypes.number,
  variant: PropTypes.string,
  animationSpeed: PropTypes.number,
  sx: PropTypes.object,
};

export default GradientTypography;
