import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ImagePlaceholder } from '../../commons/placeholder';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

/**
 * 모션 효과가 적용된 카드 컨테이너 컴포넌트
 * 
 * Props:
 * @param {string} imageSrc - 이미지 URL [Optional] (없으면 placeholder 사용)
 * @param {number} aspectRatio - 이미지 영역 비율 [Optional, 기본값: 4/3]
 * @param {string} hoverEffect - 호버 효과 타입 [Optional, 기본값: 'scale']
 *                               'scale', 'shadow', 'border', 'glow', 'lift', 'rotate', 'none' 중 선택
 * @param {string} linkTo - 링크 경로 [Optional] (제공되면 카드가 링크로 작동)
 * @param {React.ReactNode} children - 카드 내용 [Required]
 * @param {string} placeholderBgColor - 플레이스홀더 배경색 [Optional, 기본값: '#f0f0f0']
 * @param {string} placeholderIconColor - 플레이스홀더 아이콘 색상 [Optional, 기본값: '#bdbdbd']
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {object} imageSx - 이미지 영역 추가 스타일 [Optional, 기본값: {}]
 * @param {object} contentSx - 내용 영역 추가 스타일 [Optional, 기본값: {}]
 * @param {boolean} animate - 애니메이션 활성화 여부 [Optional, 기본값: true]
 * @param {color} borderColor - 카드 테두리 색상 [Optional, 기본값: 'rgba(128,128,128,0.2)']
 * @param {color} boxShadow - 카드 그림자 색상 [Optional, 기본값: 'rgba(0,0,0,0.05)']
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
  sx = {},
  animate = true,
  borderColor = 'rgba(128,128,128,0.2)',
  boxShadow = 'rgba(0,0,0,0.05)',
  glowColor = 'rgba(0,0,0,0.05)'
}) {
  const theme = useTheme();
  // 호버 효과 스타일과 애니메이션 정의
  const hoverVariants = {
    scale: {
      scale: 1.03,
      boxShadow: boxShadow,
    },
    shadow: {
      boxShadow: theme.shadows[20],
    },
    border: {
      borderColor: borderColor,
    },
    glow: {
      boxShadow: '0 0 32px ' + glowColor,
    },
    lift: {
      y: -10,
      boxShadow: '0 10px 20px ' + boxShadow,
    },
    rotate: {
      rotate: 2,
      scale: 1.02,
    },
    none: {}
  };
  
  // 기본 카드 스타일
  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #e0e0e0',
    transition: animate ? undefined : 'all 0.3s',
    overflow: 'hidden',
    ...(!animate && { '&:hover': hoverVariants[hoverEffect] || hoverVariants.none }),
    ...sx
  };
  
  // 모션 애니메이션 설정
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    whileHover: hoverVariants[hoverEffect] || hoverVariants.none,
    whileTap: { scale: 0.98 },
  } : {};
  
  // 컴포넌트 선택 (motion 또는 일반 Box)
  const Component = animate ? motion(Box) : Box;
  
  // 링크가 있는 경우 처리
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
    <Component {...linkProps} {...motionProps}>
      {/* 이미지 영역 */}
      <Box sx={{ position: 'relative' }}>
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
            bgColor={theme.palette.background.paper}
            iconColor={theme.palette.text.primary}
            sx={{ borderRadius: 0 }}
          />
        )}
      </Box>
      
      {/* 컨텐츠 영역 */}
      <Box sx={{ p: 3, flex: 1 }}>
        {children}
      </Box>
    </Component>
  );
}

export default CardContainer; 