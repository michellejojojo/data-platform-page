import React, { useState, useEffect, useMemo } from "react";
import { Stack, Box, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as d3 from "d3"; // UnitSet 컴포넌트가 d3를 사용할 수 있으므로 다시 추가\
import { D, E, S, I, G, N, L, A, B } from "./UnitSet";

// _Animated 컴포넌트는 AnimatedUnit 에서 가져옵니다.
import {
  I_Animated, // VIBE용
  V_Animated,
  E_Animated, // VIBE용
  // G_Animated,
  // N_Animated,
  // S_Animated,
  B_Animated, // VIBE용
  // L_Animated
} from "./AnimatedUnit";

// 새로 추가한 GradientDot 유닛 import
import {
  D_GradientDot,
  E_GradientDot,
  S_GradientDot,
  I_GradientDot,
  G_GradientDot,
  N_GradientDot,
  L_GradientDot,
  A_GradientDot,
  B_GradientDot,
} from "./UnitSetFollowingGradientDot";

// TextLineRenderer 컴포넌트 import (별도 파일로 분리됨)
import TextLineRenderer from "./TextLineRenderer";

/**
 * TwoLineVibeDesignLabLogo 컴포넌트
 * VIBE를 첫 줄에 크게 (AnimatedUnit 사용), Design Lab을 두 번째 줄에 작게 (UnitSet 또는 GradientDot 사용) 표시하는 로고
 *
 * Props:
 * @param {number} initialScale - 기본 로고의 크기 배율 [Optional, 기본값: 1]
 * @param {string} vibeParticleColor1 - VIBE 파티클 색상1
 * @param {string} vibeParticleColor2 - VIBE 파티클 색상2
 * @param {string} vibeUnitSetPathColor - VIBE 라인의 배경 경로 색상
 * @param {string} designLabPathColor - DESIGN LAB 배경 경로 색상 (D_GradientDot용) [Optional, 기본값: PathFollowingGradientDot의 기본값]
 * @param {string} designLabDotColor1 - DESIGN LAB D_GradientDot의 점 색상1 [Optional, 기본값: PathFollowingGradientDot의 기본값]
 * @param {string} designLabDotColor2 - DESIGN LAB D_GradientDot의 점 색상2 [Optional, 기본값: PathFollowingGradientDot의 기본값]
 * @param {number} initialDelay - 첫 글자 애니메이션 시작 전 딜레이 (ms)
 * @param {number} letterDelay - 각 글자 사이의 애니메이션 딜레이 (ms)
 * @param {number} wordSpacing - 단어 사이의 간격
 * @param {number} letterSpacing - 글자 사이의 간격
 * @param {number} lineSpacing - 줄 사이의 간격
 * @param {number} vibeUnitSetDrawDuration - VIBE UnitSet 그리기 시간
 * @param {number} vibeParticleAnimDuration - VIBE 파티클 애니메이션 시간
 * @param {number} vibeParticleNum - VIBE 글자 파티클 개수
 * @param {number} vibeParticleSize - VIBE 글자 파티클 크기
 *
 * Example usage:
 * <TwoLineVibeDesignLabLogo vibeParticleColor1="#FF0000" vibeParticleColor2="#0000FF" designLabPathColor="#555" designLabDotColor1="#FFF" designLabDotColor2="#F00" />
 */
function TwoLineVibeDesignLabLogo({
  // General Layout & Timing
  initialScale = 1,
  initialDelay = 0,
  letterDelay = 100,
  wordSpacing = 4,
  letterSpacing = 0.5,
  lineSpacing = 8,
  isTrigger = true,

  // VIBE Line (AnimatedUnit) Props
  vibeScaleMultiplier = 4,

  // VIBE - UnitSet Path Drawing Part
  vibeUnitSetPathColor = "rgba(255, 255, 255, 1)",
  vibeUnitSetDrawDuration = 600,
  vibeUnitSetEase = d3.easeCubicOut,
  vibeUnitSetIsReverse = false,
  vibeUnitSetStartWithReserve = true,
  vibeUnitSetPathClassName,

  // VIBE - Particle Animation Part
  vibeParticleColor1 = "rgba(0, 0, 0, 1)",
  vibeParticleColor2 = "rgba(100, 100, 100, 1)",
  vibeParticleOpacity = 0.75,
  vibeParticleNum = 50,
  vibeParticleSize = 8,
  vibeParticleAnimDuration = 3600,
  vibeParticleEase = d3.easeCubicInOut,

  // DESIGN LAB Line Props
  designLabPathColor, // For GradientDot pathColor
  designLabDotColor1, // For GradientDot dotColor1
  designLabDotColor2, // For GradientDot dotColor2
  // 아래 주석 처리된 props들은 TextLineRenderer 도입으로 더 이상 직접 사용되지 않음 (필요시 TextLineRenderer 내부 또는 dGradientDotProps를 통해 관리)
  // designLabUnitSetColor = "#ffffff",
  // designLabDrawDuration = 600,
  // designLabEase = d3.easeCubicOut,
  // designLabIsReverse = false,
  // designLabStartWithReserve = true,
  // designLabPathClassName,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isXl = useMediaQuery(theme.breakpoints.up("xl"));

  const [currentScale, setCurrentScale] = useState(initialScale);

  useEffect(() => {
    let newScale = initialScale;
    if (isXs) newScale = initialScale * 0.35;
    else if (isSm) newScale = initialScale * 0.5;
    else if (isMd) newScale = initialScale * 0.75;
    else if (isLg) newScale = initialScale * 0.9;
    else if (isXl) newScale = initialScale * 1.0;
    if (newScale !== currentScale) setCurrentScale(newScale);
  }, [isXs, isSm, isMd, isLg, isXl, initialScale, currentScale]);

  const vibeBaseProps = useMemo(
    () => ({
      scale: currentScale * vibeScaleMultiplier,
      isTrigger: isTrigger,
      unitSetColor: vibeUnitSetPathColor,
      unitSetDuration: vibeUnitSetDrawDuration,
      unitSetEase: vibeUnitSetEase,
      unitSetIsReverse: vibeUnitSetIsReverse,
      unitSetStartWithReserve: vibeUnitSetStartWithReserve,
      unitSetPathClassName: vibeUnitSetPathClassName,
      particleColor1: vibeParticleColor1,
      particleColor2: vibeParticleColor2,
      particleOpacity: vibeParticleOpacity,
      particleNum: vibeParticleNum,
      particleSize: isXs
        ? vibeParticleSize * 1.8
        : isSm
        ? vibeParticleSize * 1.5
        : vibeParticleSize,
      particleAnimDuration: vibeParticleAnimDuration,
      particleEase: vibeParticleEase,
    }),
    [
      currentScale,
      vibeScaleMultiplier,
      isTrigger,
      vibeUnitSetPathColor,
      vibeUnitSetDrawDuration,
      vibeUnitSetEase,
      vibeUnitSetIsReverse,
      vibeUnitSetStartWithReserve,
      vibeUnitSetPathClassName,
      vibeParticleColor1,
      vibeParticleColor2,
      vibeParticleOpacity,
      vibeParticleNum,
      vibeParticleSize,
      vibeParticleAnimDuration,
      vibeParticleEase,
    ]
  );

  // Props for D_GradientDot (이제 모든 DESIGN LAB 글자에 공통으로 사용)
  const designLabBaseProps = useMemo(
    () => ({
      scale: currentScale,
      isTrigger: isTrigger,
      color: designLabPathColor,
      dotColor1: designLabDotColor1,
      dotColor2: designLabDotColor2,
      // PathFollowingGradientDot에 새로 추가된 경로 그리기 props도 필요시 여기에 추가 가능
      // 예: pathDrawDuration, pathDrawEase 등
    }),
    [
      currentScale,
      isTrigger,
      designLabPathColor,
      designLabDotColor1,
      designLabDotColor2,
    ]
  );

  // VIBE 라인 설정
  const vibeUnits = [
    {
      UnitComponent: V_Animated,
      customProps: { particleType: "circle" },
    },
    { UnitComponent: I_Animated, customProps: { particleType: "circle" } },
    { UnitComponent: B_Animated, customProps: { particleType: "circle" } },
    { UnitComponent: E_Animated, customProps: { particleType: "circle" } },
  ];

  // DESIGN LAB 라인 설정 - UnitSet 컴포넌트로 교체
  const designLabDesignUnits = [
    { UnitComponent: D },
    { UnitComponent: E },
    { UnitComponent: S },
    { UnitComponent: I },
    { UnitComponent: G },
    { UnitComponent: N },
  ];

  const designLabLabUnits = [
    { UnitComponent: L },
    { UnitComponent: A },
    { UnitComponent: B },
  ];

  return (
    <Stack spacing={lineSpacing * currentScale} alignItems="center">
      {/* VIBE Line */}
      <TextLineRenderer
        units={vibeUnits}
        baseProps={vibeBaseProps}
        initialDelay={initialDelay} // TwoLineVibeDesignLabLogo의 initialDelay
        letterDelay={letterDelay}
        letterSpacing={letterSpacing} // TwoLineVibeDesignLabLogo의 letterSpacing
        scale={currentScale * vibeScaleMultiplier} // VIBE 라인의 실제 스케일
      />

      {/* DESIGN LAB Line */}
      <Stack
        direction="row"
        alignItems="center"
        pl={letterSpacing * 0 * currentScale}
      >
        {" "}
        {/* DESIGN과 LAB을 묶는 외부 스택 */}
        <TextLineRenderer
          units={designLabDesignUnits}
          baseProps={designLabBaseProps}
          initialDelay={initialDelay + letterDelay * 4} // "D"의 시작 딜레이
          letterDelay={letterDelay}
          letterSpacing={letterSpacing * 4}
          scale={currentScale}
        />
        <Box
          sx={{
            width: (theme) => theme.spacing(wordSpacing * 6 * currentScale),
          }}
        />
        <TextLineRenderer
          units={designLabLabUnits}
          baseProps={designLabBaseProps}
          initialDelay={
            initialDelay + letterDelay * (4 + designLabDesignUnits.length + 0)
          } // "L"의 시작 딜레이, wordSpacing 고려는 상위에서
          letterDelay={letterDelay}
          letterSpacing={letterSpacing * 4}
          scale={currentScale}
        />
      </Stack>
    </Stack>
  );
}

export default TwoLineVibeDesignLabLogo;
