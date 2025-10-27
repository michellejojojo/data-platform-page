import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

// 랜덤 문자 생성 함수
const getRandomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';
  return chars[Math.floor(Math.random() * chars.length)];
};

/**
 * 여러 단어를 스크램블 효과와 함께 전환하는 타이포그래피 컴포넌트
 * (실제 텍스트 렌더링 폭을 측정하여 정확한 폭 고정 구현)
 *
 * Props:
 * @param {string[]} words - 전환할 단어 배열 (2개 이상) [Required]
 * @param {string} variant - MUI Typography variant [Optional, 기본값: 'body1']
 * @param {number} interval - 각 단어 안정 상태 유지 시간 (ms) [Optional, 기본값: 2000]
 * @param {number} scrambleDuration - 스크램블 전환 애니메이션 시간 (ms) [Optional, 기본값: 800]
 * @param {object} sx - MUI sx prop [Optional]
 *
 * Example usage:
 * <WordSwitcherTypography words={['창조', '혁신', '영감']} interval={2000} scrambleDuration={1000}/>
 */
function WordSwitcherTypography({
  words,
  variant = 'body1',
  interval = 2000, // 단어가 안정적으로 표시되는 시간
  scrambleDuration = 800, // 전환(스크램블)에 걸리는 시간
  sx = {},
  ...props
}) {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 목표 단어 인덱스
  const [displayedText, setDisplayedText] = useState(words?.[0] || '');
  const [maxWidth, setMaxWidth] = useState(0); // 실제 측정된 최대 폭 (픽셀)
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentWordRef = useRef(words?.[0] || ''); // 애니메이션 시작 시점의 단어
  const measureRef = useRef(null); // 실제 폭 측정용 ref
  const hiddenMeasureRef = useRef(null); // 숨겨진 측정 요소 ref
  
  // 가장 긴 단어의 길이 계산 (fallback용)
  const maxWordLength = words ? Math.max(...words.map(w => w.length)) : 0;

  // 실제 텍스트 렌더링 폭 측정 함수
  const measureTextWidth = useCallback((text, referenceElement) => {
    if (!referenceElement || !text) return 0;
    
    // 숨겨진 측정 요소 생성 또는 재사용
    let measurer = hiddenMeasureRef.current;
    if (!measurer) {
      measurer = document.createElement('span');
      measurer.style.position = 'absolute';
      measurer.style.visibility = 'hidden';
      measurer.style.whiteSpace = 'pre';
      measurer.style.pointerEvents = 'none';
      document.body.appendChild(measurer);
      hiddenMeasureRef.current = measurer;
    }
    
    // 참조 요소의 계산된 스타일 복사
    const computedStyle = getComputedStyle(referenceElement);
    measurer.style.font = computedStyle.font;
    measurer.style.fontSize = computedStyle.fontSize;
    measurer.style.fontFamily = computedStyle.fontFamily;
    measurer.style.fontWeight = computedStyle.fontWeight;
    measurer.style.fontStyle = computedStyle.fontStyle;
    measurer.style.letterSpacing = computedStyle.letterSpacing;
    
    // 텍스트 설정 및 폭 측정
    measurer.textContent = text;
    const width = measurer.getBoundingClientRect().width;
    
    return width;
  }, []);

  // words 변경 시 모든 단어의 폭을 측정하여 최대값 설정
  useLayoutEffect(() => {
    if (!words || words.length === 0 || !measureRef.current) return;
    
    // 모든 단어의 실제 렌더링 폭 측정
    const widths = words.map(word => measureTextWidth(word, measureRef.current));
    const calculatedMaxWidth = Math.max(...widths);
    
    setMaxWidth(calculatedMaxWidth);
  }, [words, measureTextWidth, variant, sx]); // sx나 variant 변경 시에도 재측정

  // 컴포넌트 언마운트 시 숨겨진 측정 요소 제거
  useEffect(() => {
    return () => {
      if (hiddenMeasureRef.current && hiddenMeasureRef.current.parentNode) {
        hiddenMeasureRef.current.parentNode.removeChild(hiddenMeasureRef.current);
      }
    };
  }, []);

  // 스크램블 및 전환 애니메이션 함수
  const scrambleTransition = useCallback((targetIndex) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (!words || words.length < 2) return; // 단어가 2개 미만이면 실행 안 함

    const sourceWord = currentWordRef.current; // 현재 화면의 단어 (또는 이전 목표)
    const targetWord = words[targetIndex];    // 새로 목표가 된 단어
    const startTime = Date.now();

    const animate = () => {
      if (!isMountedRef.current) return;

      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(1, elapsedTime / scrambleDuration);

      let tempText = '';
      for (let i = 0; i < maxWordLength; i++) {
        const sourceChar = sourceWord[i] || '';
        const targetChar = targetWord[i] || '';

        // ScrambleText.jsx와 유사한 로직 + 전환 개념 추가
        // progress가 1에 가까워질수록 targetChar 나올 확률 증가
        // progress가 0에 가까울수록 sourceChar 나올 확률 증가 (부드러운 시작)
        const showTargetProb = progress * progress; // 제곱으로 비선형적 전환
        const showSourceProb = (1 - progress) * (1-progress);

        if (Math.random() < showTargetProb) {
            tempText += targetChar;
        } else if (Math.random() < showSourceProb && progress < 0.5) { // 초반에는 이전 글자 유지 확률
            tempText += sourceChar;
        }
        else {
            tempText += getRandomChar();
        }
      }

      setDisplayedText(tempText);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayedText(targetWord); // 최종 단어 보장
        currentWordRef.current = targetWord; // 현재 단어 업데이트

        // 다음 전환 예약
        if (isMountedRef.current) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if (!isMountedRef.current) return;
                const nextIndex = (targetIndex + 1) % words.length;
                setCurrentIndex(nextIndex); // 다음 단어를 목표로 설정 -> useEffect 트리거
            }, interval); // 안정 시간 후 다음 전환 시작
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [words, scrambleDuration, interval, maxWordLength]);

  // currentIndex가 변경될 때 스크램블 시작
  useEffect(() => {
      // 초기 렌더링 시나 words가 없을 때는 실행하지 않음 (이미 초기값 설정됨)
      // 또는 words가 1개일 때도 실행 필요 없음
      if (words && words.length > 1 && currentIndex !== undefined) {
          scrambleTransition(currentIndex);
      }
  // scrambleTransition 함수는 useCallback으로 메모이즈되어 안전
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, scrambleTransition]); // currentIndex 변경 시 스크램블 시작

  // 마운트 상태 추적 및 초기화/정리
  useEffect(() => {
    isMountedRef.current = true;
    // 초기 단어 설정 (words prop이 바뀔 수도 있으므로)
    currentWordRef.current = words?.[currentIndex] || '';
    setDisplayedText(currentWordRef.current);

    // 첫 번째 전환 시작 예약
    if (words && words.length > 1) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentIndex(nextIndex);
      }, interval);
    }

    // 클린업
    return () => {
      isMountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]); // words 배열 자체가 바뀔 때 초기화

  return (
    <Typography
      ref={measureRef}
      variant={variant}
      sx={{
        display: 'inline-block',
        // 실제 측정된 폭 사용, fallback으로 ch 단위 사용
        minWidth: maxWidth > 0 ? `${maxWidth}px` : `${maxWordLength}ch`,
        width: maxWidth > 0 ? `${maxWidth}px` : `${maxWordLength}ch`,
        whiteSpace: 'pre', // 공백 유지 중요
        fontVariantNumeric: 'tabular-nums', // 숫자 폭 통일
        overflow: 'hidden', // 넘치는 텍스트 숨김
        textAlign: 'left', // 좌측 정렬로 시작점 고정
        ...sx
       }}
      {...props}
    >
      {displayedText}
    </Typography>
  );
}

WordSwitcherTypography.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  variant: PropTypes.string,
  interval: PropTypes.number,
  scrambleDuration: PropTypes.number,
  sx: PropTypes.object,
};

export default WordSwitcherTypography; 