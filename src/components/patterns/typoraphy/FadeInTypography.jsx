import React, { useRef, useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import useIsInView from '../../../hooks/useIsInView';

/**
 * 문장을 단어별로 순차적으로 나타나게 하는 Typography 컴포넌트
 *
 * Props:
 * @param {string} text - 표시할 문장 [Required]
 * @param {string} variant - Typography 변형 (h1, h2, body1 등) [Optional, 기본값: 'body1']
 * @param {string} direction - 단어 등장 방향 ('up', 'down', 'left', 'right', 'fade') [Optional, 기본값: 'up']
 * @param {string} color - 텍스트 색상 [Optional, 기본값: 'inherit']
 * @param {boolean} keepVisible - 뷰포트 벗어날 때 유지 여부 [Optional, 기본값: true]
 * @param {number} speed - 각 단어 등장 속도 (ms) [Optional, 기본값: 500]
 * @param {number} wordDelay - 단어간 딜레이 시간 (ms) [Optional, 기본값: 100]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <FadeInTypography 
 *   text="Hello world from designers"
 *   variant="h2"
 *   direction="up"
 *   speed={600}
 *   wordDelay={150}
 * />
 */
function FadeInTypography({
  text,
  variant = 'body1',
  direction = 'up',
  color = 'inherit',
  keepVisible = true,
  speed = 500,
  wordDelay = 100,
  sx = {},
  ...props
}) {
  const [containerRef, isInView] = useIsInView();
  const [visibleWords, setVisibleWords] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutsRef = useRef([]);

  // 텍스트를 단어별로 분리
  const words = text.split(' ').filter(word => word.trim() !== '');

  // 방향별 초기 스타일 설정
  const getInitialStyle = (direction) => {
    const baseStyle = {
      display: 'inline-block',
      margin: '0 0.25em',
      transition: `all ${speed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    };

    switch (direction) {
      case 'up':
        return {
          ...baseStyle,
          transform: 'translateY(30px)',
          opacity: 0,
        };
      case 'down':
        return {
          ...baseStyle,
          transform: 'translateY(-30px)',
          opacity: 0,
        };
      case 'left':
        return {
          ...baseStyle,
          transform: 'translateX(30px)',
          opacity: 0,
        };
      case 'right':
        return {
          ...baseStyle,
          transform: 'translateX(-30px)',
          opacity: 0,
        };
      case 'fade':
      default:
        return {
          ...baseStyle,
          opacity: 0,
        };
    }
  };

  // 최종(보임) 스타일 설정
  const getVisibleStyle = () => {
    return {
      display: 'inline-block',
      margin: '0 0.25em',
      transform: 'translate(0, 0)',
      opacity: 1,
      transition: `all ${speed}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    };
  };

  // 단어별 순차 애니메이션 시작
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      // 각 단어에 대해 딜레이를 주고 보이게 설정
      words.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setVisibleWords(prev => new Set([...prev, index]));
        }, index * wordDelay);
        
        timeoutsRef.current.push(timeout);
      });
    }
  }, [isInView, hasAnimated, words.length, wordDelay]);

  // keepVisible이 false이고 뷰포트를 벗어났을 때 숨김
  useEffect(() => {
    if (!keepVisible && !isInView && hasAnimated) {
      setVisibleWords(new Set());
      setHasAnimated(false);
    }
  }, [isInView, keepVisible, hasAnimated]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'inline-block',
        overflow: 'hidden', // 애니메이션 중 요소가 컨테이너를 벗어나지 않도록
        ...sx,
      }}
      {...props}
    >
      <Typography variant={variant} color={color}>
        {words.map((word, index) => {
          const isVisible = visibleWords.has(index);
          const style = isVisible ? getVisibleStyle() : getInitialStyle(direction);
          
          return (
            <span
              key={`${word}-${index}`}
              style={style}
            >
              {word}
            </span>
          );
        })}
      </Typography>
    </Box>
  );
}

FadeInTypography.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right', 'fade']),
  color: PropTypes.string,
  keepVisible: PropTypes.bool,
  speed: PropTypes.number,
  wordDelay: PropTypes.number,
  sx: PropTypes.object,
};

export default FadeInTypography; 