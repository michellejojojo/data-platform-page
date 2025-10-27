import React from "react";
import { Box } from "@mui/material";
import FadeInContainer from "../../patterns/motion/FadeInContainer";
import ScrambleText from "../../patterns/typoraphy/ScrambleText";

/**
 * 패턴 이미지 카드 컴포넌트
 * 이미지를 배경으로 하고 ScrambleText를 오버레이로 표시합니다.
 * 실제 뷰포트 진입 시에만 애니메이션이 트리거됩니다.
 *
 * Props:
 * @param {string} imageSrc - 배경 이미지 URL [Required]
 * @param {string} title - 카드에 표시할 텍스트 [Required]
 * @param {number} aspectRatio - 카드 비율 [Optional, 기본값: 16/9]
 * @param {number} delay - FadeIn 애니메이션 지연 시간 [Optional, 기본값: 0]
 * @param {string} direction - FadeIn 애니메이션 방향 [Optional, 기본값: 'bottom']
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {string} variant - ScrambleText Typography 변형 [Optional, 기본값: 'h2']
 * @param {number} scrambleSpeed - 스크램블 애니메이션 속도 [Optional, 기본값: 30]
 * @param {number} startDelay - 스크램블 시작 지연 시간 [Optional, 기본값: 500]
 * @param {number} viewportThreshold - 뷰포트 감지 임계값 (0~1) [Optional, 기본값: 0.5]
 *
 * Example usage:
 * <PatternImageCard
 *   imageSrc="/images/pattern1.jpg"
 *   title="Typography"
 *   delay={0.2}
 * />
 */
function PatternImageCard({
  imageSrc,
  title,
  aspectRatio = 16 / 9,
  delay = 0,
  direction = "bottom",
  sx = {},
  variant = "h2",
  scrambleSpeed = 30,
  startDelay = 500,
  viewportThreshold = 0.5,
}) {
  return (
    <FadeInContainer
      direction={direction}
      duration={0.6}
      offset={20}
      delay={delay}
      once={true}
      amount={viewportThreshold}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: `${aspectRatio}`,
          borderRadius: 5,
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "0.5px solid #686868",
          "&:hover": {
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
            border: "0.5px solid rgba(255, 255, 255, 0.5)",
          },
          ...sx,
        }}
      >
        {/* 배경 이미지 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        
        {/* 다크 오버레이 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        
        {/* 텍스트 컨텐츠 */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2, sm: 3, md: 4 },
            zIndex: 1,
          }}
        >
          <ScrambleText
            text={title}
            variant={variant}
            scrambleSpeed={scrambleSpeed}
            startDelay={startDelay}
            useViewportTrigger={true}
            viewportThreshold={viewportThreshold}
            color="white"
            sx={{
              textAlign: "left",
              py: 0,
              mb: 0,
              "& .MuiTypography-root": {
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.8rem",
                  md: "2.2rem",
                },
                fontWeight: 900,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              },
            }}
          />
        </Box>
      </Box>
    </FadeInContainer>
  );
}

export default PatternImageCard; 