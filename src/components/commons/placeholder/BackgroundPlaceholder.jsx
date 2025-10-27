import React from 'react';
import { Box } from '@mui/material';

/**
 * 배경 플레이스홀더 컴포넌트
 * 
 * Props:
 * @param {string} width - 컴포넌트 너비 [Optional, 기본값: '100%']
 * @param {string} height - 컴포넌트 높이 [Optional]
 * @param {number} aspectRatio - 컴포넌트 종횡비 (width:height) [Optional, 기본값: 16/9]
 * @param {string|object} background - 배경색 또는 그라데이션 [Optional, 기본값: '#f5f5f5']
 *   문자열 또는 { type: 'linear|radial', colors: [], direction: 'to right|to bottom|...' } 형태의 객체
 * @param {string} borderRadius - 테두리 둥글기 [Optional, 기본값: '4px']
 * @param {object} sx - 추가 스타일 속성 [Optional]
 *
 * Example usage:
 * <BackgroundPlaceholder aspectRatio={4/3} background="#f0f0f0" />
 * <BackgroundPlaceholder 
 *   width="300px" 
 *   height="200px" 
 *   background={{ 
 *     type: 'linear', 
 *     colors: ['#f0f0f0', '#e0e0e0'], 
 *     direction: 'to right' 
 *   }} 
 * />
 */
function BackgroundPlaceholder({ 
  width = '100%',
  height,
  aspectRatio = 16/9,
  background = '#f5f5f5',
  borderRadius = '4px',
  sx = {}
}) {
  // 배경이 그라데이션인지 확인하고 CSS 문자열 생성
  const getBackground = () => {
    if (typeof background === 'string') {
      return background;
    }
    
    // 그라데이션 객체로부터 CSS 생성
    if (background.type === 'linear') {
      const direction = background.direction || 'to right';
      const colorStops = background.colors.join(', ');
      return `linear-gradient(${direction}, ${colorStops})`;
    } else if (background.type === 'radial') {
      const colorStops = background.colors.join(', ');
      return `radial-gradient(circle, ${colorStops})`;
    }
    
    return '#f5f5f5'; // 기본값
  };
  
  // height가 지정되지 않았으면 aspectRatio를 사용
  const calculatedHeight = height || (typeof width === 'number' ? width / aspectRatio : 'auto');
  
  return (
    <Box
      sx={{
        width,
        height: calculatedHeight,
        background: getBackground(),
        borderRadius,
        overflow: 'hidden',
        ...((!height && typeof width !== 'number') && {
          position: 'relative',
          '&::before': {
            content: '""',
            display: 'block',
            paddingTop: `${(1 / aspectRatio) * 100}%`
          }
        }),
        ...sx
      }}
    />
  );
}

export default BackgroundPlaceholder; 