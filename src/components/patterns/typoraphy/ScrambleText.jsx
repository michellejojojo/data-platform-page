import React, { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import useIsInView from "../../../hooks/useIsInView";

/**
 * 텍스트 스크램블 효과 컴포넌트
 *
 * Props:
 * @param {string} text - 표시할 텍스트 [Optional, 기본값: 'Hello World!']
 * @param {string} scrambleChars - 스크램블에 사용할 문자들 [Optional, 기본값: '!<>-_\\/[]{}—=+*^?#_~']
 * @param {number} scrambleSpeed - 스크램블 속도 (ms) [Optional, 기본값: 20]
 * @param {number} iterationStep - 스크램블 복원 단계 증가량 [Optional, 기본값: 0.8]
 * @param {string} color - 텍스트 색상 [Optional, 기본값: 'inherit']
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {string} variant - Typography 변형 [Optional, 기본값: 'h1']
 * @param {number} startDelay - 시작 지연 시간 (ms) [Optional, 기본값: 500]
 * @param {boolean} useViewportTrigger - 뷰포트 감지 사용 여부 [Optional, 기본값: false]
 * @param {number} viewportThreshold - 뷰포트 감지 임계값 (0~1) [Optional, 기본값: 0.3]
 * @param {boolean} autoHeight - 자동 높이 조정 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <ScrambleText text="Hello Designers" variant="h2" startDelay={1000} useViewportTrigger={true} />
 */
function ScrambleText({
  text = "Hello World!",
  scrambleChars = "!<>-_\\/[]{}—=+*^?#_~",
  scrambleSpeed = 20,
  iterationStep = 0.8,
  color = "inherit",
  sx = {},
  variant = "h1",
  startDelay = 500,
  useViewportTrigger = false,
  viewportThreshold = 0.3,
  autoHeight = false,
}) {
  // 뷰포트 감지 훅
  const [viewportRef, isInView] = useIsInView({
    threshold: viewportThreshold,
    triggerOnce: true,
  });

  // 초기 상태를 랜덤 스크램블 문자들로 설정
  const getInitialScrambledText = () => {
    return text
      .split("")
      .map(
        () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      )
      .join("");
  };

  const [displayText, setDisplayText] = useState(getInitialScrambledText);
  const intervalRef = useRef(null);
  const effectActive = useRef(false);

  const scramble = () => {
    if (effectActive.current) return;

    effectActive.current = true;
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const scrambled = text
        .split("")
        .map((_, index) => {
          // 원래 글자로 복원될 확률 계산 (더 부드러운 전환)
          if (index < iteration) {
            return text[index];
          }
          // 랜덤 문자 반환
          return scrambleChars[
            Math.floor(Math.random() * scrambleChars.length)
          ];
        })
        .join("");

      setDisplayText(scrambled);
      iteration += iterationStep;

      // 모든 글자가 복원되면 인터벌 중지
      if (iteration >= text.length) {
        setDisplayText(text); // 정확한 최종 텍스트 설정
        clearInterval(intervalRef.current);
        effectActive.current = false;
      }
    }, scrambleSpeed);
  };

  // 뷰포트 감지 vs 자동 실행 분기
  useEffect(() => {
    // 초기 스크램블 상태 설정
    setDisplayText(getInitialScrambledText());

    if (useViewportTrigger) {
      // 뷰포트 감지 방식
      if (isInView) {
        const timer = setTimeout(() => {
          scramble();
        }, startDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // 기존 자동 실행 방식
      const autoStart = setTimeout(() => {
        scramble();
      }, startDelay);

      return () => {
        clearTimeout(autoStart);
        clearInterval(intervalRef.current);
      };
    }
  }, [text, startDelay, useViewportTrigger, isInView]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Box
      ref={useViewportTrigger ? viewportRef : null}
      sx={{ 
        textAlign: "left",
        ...(autoHeight && {
          height: "auto",
          minHeight: "auto",
        }),
      }}
    >
      <Typography
        variant={variant}
        color={color}
        sx={{
          minHeight: autoHeight ? "auto" : "48px",
          letterSpacing: "0.05em",
          fontWeight: "900",
          mb: autoHeight ? 0 : 1,
          textAlign: "left",
          lineHeight: autoHeight ? "1" : "1.2",
          height: autoHeight ? "auto" : "auto",
          ...sx,
        }}
      >
        {displayText}
      </Typography>
    </Box>
  );
}

export default ScrambleText;
