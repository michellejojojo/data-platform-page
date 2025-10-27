import React, { useRef, useEffect } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * InteractiveTypography 컴포넌트
 * 마우스 위치에 따라 개별 글자의 weight와 font-size가 동적으로 변하는 Typography 컴포넌트
 * 
 * Props:
 * @param {node} children - 표시할 텍스트 내용 [Required]
 * @param {string} variant - MUI Typography variant (h1, h2, body1 등) [Optional, 기본값: 'body1']
 * @param {number} initialWeight - 기본 font-weight 값 [Optional, 기본값: 400]
 * @param {number} hoverWeight - 호버 시 최대 font-weight 값 [Optional, 기본값: 700]
 * @param {number} hoverSizeRatio - 호버 시 크기 증가 비율(%) [Optional, 기본값: 20]
 * @param {number} transitionDuration - 트랜지션 지속 시간(초) [Optional, 기본값: 0.1]
 * @param {number} effectRadius - 마우스 효과 범위(px) [Optional, 기본값: 150]
 * @param {number} intensityFactor - 마우스 주변 효과 집중도 (값이 클수록 효과가 마우스 근처에 집중됨) [Optional, 기본값: 2.5]
 * @param {object} sx - MUI sx 스타일 객체 [Optional, 기본값: {}]
 *
 * Example usage:
 * <InteractiveTypography 
 *   variant="h4" 
 *   hoverWeight={800} 
 *   hoverSizeRatio={30}
 * >
 *   Interactive Text Effect
 * </InteractiveTypography>
 */
function InteractiveTypography({
  children,
  variant = 'body1',
  initialWeight = 400,
  hoverWeight = 700,
  hoverSizeRatio = 20,
  transitionDuration = 0.1,
  effectRadius = 150,
  intensityFactor = 2.5,
  sx = {},
  ...props
}) {
  const containerRef = useRef(null);
  const theme = useTheme();
  const rafRef = useRef(null);
  const baseFontSizeRef = useRef(1); // 기본 폰트 사이즈 저장
  const maxHeightValueRef = useRef('auto'); // 계산된 최대 높이 저장

  useEffect(() => {
    if (!containerRef.current || typeof children !== 'string') return;
    
    const container = containerRef.current;
    const typography = container.querySelector('.it-typography');
    
    // variant의 fontSize 계산
    const variantFontSize = theme.typography[variant]?.fontSize || '1rem';
    baseFontSizeRef.current = parseFloat(variantFontSize) * 
                        (variantFontSize.includes('rem') ? 1 : 1/16);
    
    // 최대 폰트 사이즈 계산 (호버 시)
    const maxFontSize = baseFontSizeRef.current * (1 + (hoverSizeRatio / 100));
    
    // 예상 최대 높이 계산 (rem 단위) - 약간의 여유분(1.2) 추가
    const calculatedMaxHeightRem = maxFontSize * 1.2; 
    maxHeightValueRef.current = `${calculatedMaxHeightRem}rem`;

    // 컨테이너의 최소 높이 설정 (레이아웃 쉬프트 방지)
    // Box의 sx prop에서 직접 적용하는 것이 더 React 방식이지만, 
    // useEffect 외부에서 ref 값이 필요하므로 여기에서 직접 설정합니다.
    container.style.minHeight = maxHeightValueRef.current;
    
    // 텍스트를 문자별로 분리
    typography.innerHTML = [...children].map(char => 
      `<span class="it-char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
    
    // 문자 요소들
    const chars = container.querySelectorAll('.it-char');
    
    // 기본 스타일 적용
    chars.forEach(char => {
      char.style.display = 'inline-block';
      char.style.willChange = 'font-weight, font-size';
      char.style.fontWeight = initialWeight;
      char.style.fontSize = `${baseFontSizeRef.current}rem`;
      char.style.verticalAlign = 'middle'; // 수직 정렬 보정
      
      char.style.transitionProperty = 'font-weight, font-size';
      char.style.transitionDuration = `${transitionDuration}s`;
      char.style.transitionTimingFunction = 'ease-out';
    });
    
    // 위치 계산을 위한 배열
    const charPositions = [];
    
    // 위치 계산
    const calculatePositions = () => {
      const rect = container.getBoundingClientRect();
      charPositions.length = 0;
      
      chars.forEach(char => {
        const charRect = char.getBoundingClientRect();
        charPositions.push({
          center: charRect.left - rect.left + charRect.width / 2
        });
      });
    };
    
    calculatePositions();
    
    // 직접 DOM 조작으로 스타일 적용
    const applyStyles = (mouseX) => {
      chars.forEach((char, i) => {
        if (!charPositions[i]) return;
        
        // 거리 계산
        const distance = Math.abs(mouseX - charPositions[i].center);
        
        // 비선형 강도 계산
        let intensity = Math.max(0, 1 - (distance / effectRadius));
        intensity = Math.pow(intensity, intensityFactor);
        
        // 값 적용
        const weight = Math.round(initialWeight + ((hoverWeight - initialWeight) * intensity));
        const size = baseFontSizeRef.current * (1 + (hoverSizeRatio / 100) * intensity);
        
        char.style.fontWeight = weight;
        char.style.fontSize = `${size.toFixed(2)}rem`;
      });
    };
    
    // 마우스 이벤트 핸들러
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        applyStyles(mouseX);
      });
    };
    
    // 마우스 진입 시 위치 다시 계산하고 적용
    const handleMouseEnter = (e) => {
      calculatePositions();
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      applyStyles(mouseX);
    };
    
    // 마우스 떠날 때 원래 스타일로
    const handleLeave = () => {
      // transitionend 이벤트로 추적할 데이터
      let pendingTransitions = chars.length * 2; // 각 글자당 weight와 size 2개
      
      // 트랜지션 완료 카운터 함수
      const transitionDone = () => {
        pendingTransitions--;
        if (pendingTransitions <= 0) {
          // 모든 트랜지션 완료
          chars.forEach(char => {
            char.removeEventListener('transitionend', transitionDone);
          });
        }
      };
      
      // 모든 글자에 transitionend 리스너 추가
      chars.forEach(char => {
        char.removeEventListener('transitionend', transitionDone);
        char.addEventListener('transitionend', transitionDone);
        
        // 초기 스타일로 복원
        char.style.fontWeight = initialWeight;
        char.style.fontSize = `${baseFontSizeRef.current}rem`;
      });
      
      // 백업 타이머
      setTimeout(() => {
        chars.forEach(char => {
          char.style.fontWeight = initialWeight;
          char.style.fontSize = `${baseFontSizeRef.current}rem`;
          char.removeEventListener('transitionend', transitionDone);
        });
      }, transitionDuration * 1000 + 50);
    };
    
    // 이벤트 리스너
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', calculatePositions);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', calculatePositions);
      
      chars.forEach(char => {
        const clone = char.cloneNode(true);
        if (char.parentNode) {
          char.parentNode.replaceChild(clone, char);
        }
      });
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [children, initialWeight, hoverWeight, hoverSizeRatio, transitionDuration, effectRadius, intensityFactor, theme, variant]);
  
  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'inline-flex',
        alignItems: 'center', // 'center'로 변경하여 수직 중앙 정렬 개선
        cursor: 'pointer',
        overflow: 'hidden', // overflow hidden 유지
        minHeight: maxHeightValueRef.current, // 계산된 최소 높이 적용
        ...sx,
      }}
      {...props}
    >
      <Typography 
        variant={variant} 
        component="span" 
        className="it-typography"
        sx={{
          lineHeight: 1, // Typography 자체의 lineHeight 간섭 방지
          '& > span': {
            fontFamily: 'inherit'
          }
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

InteractiveTypography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  initialWeight: PropTypes.number,
  hoverWeight: PropTypes.number,
  hoverSizeRatio: PropTypes.number,
  transitionDuration: PropTypes.number,
  effectRadius: PropTypes.number,
  intensityFactor: PropTypes.number,
  sx: PropTypes.object,
};

export default InteractiveTypography; 