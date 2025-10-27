import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ImagePlaceholder } from '../placeholder';

/**
 * 기본 카드 컨테이너 컴포넌트
 * 
 * Props:
 * @param {string} imageSrc - 이미지 URL [Optional] (없으면 placeholder 사용)
 * @param {number} aspectRatio - 이미지 영역 비율 [Optional, 기본값: 4/3]
 * @param {string} hoverEffect - 호버 효과 타입 [Optional, 기본값: 'scale']
 *                               'scale', 'shadow', 'border', 'glow', 'none' 중 선택
 * @param {string} linkTo - 링크 경로 [Optional] (제공되면 카드가 링크로 작동)
 * @param {React.ReactNode} children - 카드 내용 [Required]
 * @param {string} placeholderBgColor - 플레이스홀더 배경색 [Optional, 기본값: '#f0f0f0']
 * @param {string} placeholderIconColor - 플레이스홀더 아이콘 색상 [Optional, 기본값: '#bdbdbd']
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {object} imageSx - 이미지 영역 추가 스타일 [Optional, 기본값: {}]
 * @param {object} contentSx - 내용 영역 추가 스타일 [Optional, 기본값: {}]
 *
 * Example usage:
 * <CardContainer 
 *   imageSrc="/images/example.jpg"
 *   aspectRatio={16/9}
 *   hoverEffect="shadow"
 *   linkTo="/some-page"
 * >
 *   <Typography>카드 내용</Typography>
 * </CardContainer>
 */
function CardContainer({ 
  imageSrc,
  aspectRatio = 4/3,
  hoverEffect = 'scale',
  linkTo,
  children,
  placeholderBgColor = '#121212',
  placeholderIconColor = '#232323',
  sx = {},
  imageSx = {},
  contentSx = {}
}) {
  // 호버 효과 스타일 정의
  const hoverStyles = {
    scale: {
      transform: 'scale(1.03)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.08)'
    },
    shadow: {
      boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
    },
    border: {
      borderColor: 'primary.main'
    },
    glow: {
      boxShadow: '0 0 15px rgba(66, 133, 244, 0.4)'
    },
    none: {}
  };
  
  // 기본 카드 스타일
  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    backgroundColor: '',
    border: '1px solid #232323',
    transition: 'all 0.3s',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': hoverStyles[hoverEffect] || hoverStyles.none,
    ...sx
  };
  
  // 링크가 있는 경우 Link 컴포넌트를 사용하기 위한 속성
  const linkProps = linkTo ? {
    component: Link,
    to: linkTo,
    sx: {
      ...cardStyles,
      textDecoration: 'none',
      color: 'text.primary'
    }
  } : {
    sx: cardStyles
  };
  
  return (
    <Box {...linkProps}>
      {/* 이미지 영역 */}
      <Box sx={{ position: 'relative', ...imageSx }}>
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt=""
            sx={{
              width: '100%',
              height: 'auto',
              aspectRatio: `${aspectRatio}`,
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          <ImagePlaceholder 
            aspectRatio={aspectRatio}
            bgColor={placeholderBgColor}
            iconColor={placeholderIconColor}
            sx={{ borderRadius: 0 }}
          />
        )}
      </Box>
      
      {/* 컨텐츠 영역 */}
      <Box sx={{ p: 0, flex: 1, ...contentSx }}>
        {children}
      </Box>
    </Box>
  );
}

export default CardContainer; 