import React from 'react';
import { Stack, Box } from '@mui/material';
import * as d3 from 'd3'; // d3 import 추가
import { V, I, B, E, D, S, G, N, L, A } from './UnitSet'; // 필요한 유닛들을 가져옵니다.

/**
 * VibeDesignLabLogo 컴포넌트
 * Vibe Design Lab 텍스트를 인터랙티브 로고 형태로 표시합니다.
 * 
 * Props:
 * @param {number} scale - 전체 로고의 크기 배율 [Optional, 기본값: 1]
 * @param {string} color - 로고 색상 [Optional, 기본값: 'text.primary']
 * @param {number} initialDelay - 첫 글자 애니메이션 시작 전 딜레이 (ms) [Optional, 기본값: 0]
 * @param {number} letterDelay - 각 글자 사이의 애니메이션 딜레이 (ms) [Optional, 기본값: 100]
 * @param {number} wordSpacing - 단어 사이의 간격 (Stack spacing unit) [Optional, 기본값: 2]
 * @param {number} letterSpacing - 글자 사이의 간격 (Stack spacing unit) [Optional, 기본값: 0.5]
 * 
 * Example usage:
 * <VibeDesignLabLogo scale={1.5} color="primary.main" />
 */
function VibeDesignLabLogo({
  scale = 1,
  color = '#0000ff',
  initialDelay = 0,
  letterDelay = 100,
  wordSpacing = 2,
  letterSpacing = 0.5,
}) {
  const commonProps = {
    scale,
    color,
    duration: 600, // 각 유닛의 애니메이션 시간
    ease: d3.easeCubicOut, // 배열 대신 d3 easing 함수 사용 (예: d3.easeCubicOut)
    isTrigger: true,
  };

  return (
    <Stack direction="row" alignItems="center" spacing={letterSpacing}>
      {/* Vibe */}
      <Stack direction="row" alignItems="center" spacing={letterSpacing}>
        <V {...commonProps} startDelay={initialDelay} />
        <I {...commonProps} startDelay={initialDelay + letterDelay} />
        <B {...commonProps} startDelay={initialDelay + letterDelay * 2} />
        <E {...commonProps} startDelay={initialDelay + letterDelay * 3} />
      </Stack>

      <Box sx={{ width: (theme) => theme.spacing(wordSpacing) }} /> 

      {/* Design */}
      <Stack direction="row" alignItems="center" spacing={letterSpacing}>
        <D {...commonProps} startDelay={initialDelay + letterDelay * 4} />
        <E {...commonProps} startDelay={initialDelay + letterDelay * 5} />
        <S {...commonProps} startDelay={initialDelay + letterDelay * 6} />
        <I {...commonProps} startDelay={initialDelay + letterDelay * 7} />
        <G {...commonProps} startDelay={initialDelay + letterDelay * 8} />
        <N {...commonProps} startDelay={initialDelay + letterDelay * 9} />
      </Stack>
      
      <Box sx={{ width: (theme) => theme.spacing(wordSpacing) }} />

      {/* Lab */}
      <Stack direction="row" alignItems="center" spacing={letterSpacing}>
        <L {...commonProps} startDelay={initialDelay + letterDelay * 10} />
        <A {...commonProps} startDelay={initialDelay + letterDelay * 11} />
        <B {...commonProps} startDelay={initialDelay + letterDelay * 12} />
      </Stack>
    </Stack>
  );
}

export default VibeDesignLabLogo; 