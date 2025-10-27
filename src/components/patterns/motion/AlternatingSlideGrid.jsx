import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import { useAnimation, useInView } from 'framer-motion';
import { motion as Motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * AlternatingSlideGrid 컴포넌트
 * 그리드 아이템들이 좌우 번갈아가며 슬라이드 인 애니메이션으로 등장하는 그리드
 * 
 * Props:
 * @param {React.ReactNode} children - 그리드에 표시할 아이템 요소들 [Required]
 * @param {number} animationDuration - 애니메이션 지속 시간(초) [Optional, 기본값: 0.8]
 * @param {number} animationDelay - 각 아이템 애니메이션 사이 지연 시간(초) [Optional, 기본값: 0.15]
 * @param {string} maskColor - 마스킹 효과에 사용할 배경색 [Optional, 기본값: '#ffffff']
 * @param {boolean} animateOnScroll - 스크롤 시 애니메이션 시작 여부 [Optional, 기본값: true]
 * @param {number} scrollThreshold - 스크롤 애니메이션 시작 임계값(0-1) [Optional, 기본값: 0.2]
 * @param {object} sx - 추가 스타일 객체 [Optional]
 *
 * Example usage:
 * <AlternatingSlideGrid 
 *   animationDelay={0.2}
 * >
 *   <Grid item>
 *     <CardContainer>첫 번째 행 (왼쪽에서 등장)</CardContainer>
 *   </Grid>
 *   <Grid item>
 *     <CardContainer>두 번째 행 (오른쪽에서 등장)</CardContainer>
 *   </Grid>
 * </AlternatingSlideGrid>
 */
function AlternatingSlideGrid({
  children,
  animationDuration = 0.8,
  animationDelay = 0.15,
  maskColor = '#ffffff',
  animateOnScroll = true,
  scrollThreshold = 0.2,
  sx = {},
}) {
  // 기본 콘텐츠 스타일
  const contentStyle = {
    width: '100%',
    height: 'auto',
    minHeight: '100%',
    background: maskColor,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  };
  
  // 개별 행 컴포넌트 - 각 행은 독립적으로 뷰포트에 진입 감지
  const RowItem = ({ child, index }) => {
    const rowRef = useRef(null);
    const hasAnimated = useRef(false); // 행별 애니메이션 중복 방지
    const controls = useAnimation();
    
    // 이 행이 뷰포트에 들어왔는지 감지
    const isRowInView = useInView(rowRef, { 
      once: true, 
      amount: scrollThreshold
    });
    
    // 개별 행 애니메이션 트리거
    useEffect(() => {
      // 이미 애니메이션이 시작된 경우 다시 실행하지 않음
      if (!hasAnimated.current && (isRowInView || !animateOnScroll)) {
        hasAnimated.current = true;
        
        // 애니메이션 시작 (약간의 지연 적용)
        const timer = setTimeout(() => {
          controls.start("visible");
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }, [isRowInView, animateOnScroll, controls]);
    
    const isEvenIndex = index % 2 === 0;
    
    // 애니메이션 오버레이 속성
    const overlayVariants = {
      hidden: { x: 0 },
      visible: { 
        x: isEvenIndex ? '100%' : '-100%',
        transition: {
          duration: animationDuration,
          delay: animateOnScroll ? 0 : index * animationDelay, // 스크롤 애니메이션 시 지연 제거
          ease: [0.4, 0, 0.2, 1] // Material UI의 표준 easing
        }
      }
    };
    
    // 콘텐츠 요소 생성
    const contentElement = (
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box style={contentStyle}>
          {child.props.children}
        </Box>
        <Motion.div
          initial="hidden"
          animate={controls}
          variants={overlayVariants}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: maskColor,
            zIndex: 1
          }}
        />
      </Box>
    );
    
    // 그리드 레이아웃 - 짝수/홀수 행에 따라 콘텐츠 위치 다르게 배치
    return (
      <Grid ref={rowRef} container spacing={0} sx={{ marginBottom: 2 }}>
        <Grid item size={{ xs: 12, md: 6 }}>
          {isEvenIndex && contentElement}
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          {!isEvenIndex && contentElement}
        </Grid>
      </Grid>
    );
  };
  
  // 각 자식 요소들을 행 아이템으로 변환
  const wrappedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return (
        <RowItem 
          key={index}
          child={child} 
          index={index}
        />
      );
    }
    return child;
  });
  
  return (
    <Box 
      sx={{ 
        width: '100%',
        height: 'auto',
        ...sx 
      }}
    >
      {wrappedChildren}
    </Box>
  );
}

AlternatingSlideGrid.propTypes = {
  children: PropTypes.node.isRequired,
  animationDuration: PropTypes.number,
  animationDelay: PropTypes.number,
  maskColor: PropTypes.string,
  animateOnScroll: PropTypes.bool,
  scrollThreshold: PropTypes.number,
  sx: PropTypes.object
};

export default AlternatingSlideGrid; 