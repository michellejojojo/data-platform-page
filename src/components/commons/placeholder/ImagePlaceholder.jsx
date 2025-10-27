import React from 'react';
import { Box } from '@mui/material';

/**
 * 이미지 플레이스홀더 컴포넌트
 * 
 * Props:
 * @param {string} width - 컴포넌트 너비 [Optional, 기본값: '100%']
 * @param {string} height - 컴포넌트 높이 [Optional]
 * @param {number} aspectRatio - 컴포넌트 종횡비 (width:height) [Optional, 기본값: 16/9]
 * @param {string} bgColor - 배경색 [Optional, 기본값: '#f0f0f0']
 * @param {string} iconColor - 아이콘 색상 [Optional, 기본값: '#bdbdbd']
 * @param {object} sx - 추가 스타일 속성 [Optional]
 *
 * Example usage:
 * <ImagePlaceholder aspectRatio={4/3} />
 * <ImagePlaceholder width="300px" height="200px" />
 */
function ImagePlaceholder({ 
  width = '100%',
  height,
  aspectRatio = 16/9,
  bgColor = '#f0f0f0',
  iconColor = '#bdbdbd',
  sx = {}
}) {
  // height가 지정되지 않았으면 aspectRatio를 사용
  const calculatedHeight = height || (typeof width === 'number' ? width / aspectRatio : 'auto');
  
  return (
    <Box
      sx={{
        width,
        height: calculatedHeight,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 1,
        position: 'relative',
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
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '20%',
          height: 'auto',
          maxWidth: '60px',
          maxHeight: '60px'
        }}
      >
        <path 
          d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5ZM8.5 13.5L10.5 16L13.5 12L17.5 17H6.5L8.5 13.5Z" 
          fill={iconColor}
        />
      </svg>
    </Box>
  );
}

export default ImagePlaceholder; 