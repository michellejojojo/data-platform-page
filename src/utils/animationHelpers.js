import * as THREE from 'three';
import { SECTION_THEMES } from '../constants';

/**
 * RAF(requestAnimationFrame) 기반 쓰로틀링 함수
 * @param {Function} fn - 실행할 함수  
 * @param {number} delay - 지연 시간 (ms)
 */
export const rafThrottle = (fn, delay) => {
  let lastRun = 0;
  let timeoutId = null;
  
  return (...args) => {
    const now = Date.now();
    
    if (now - lastRun >= delay) {
      lastRun = now;
      fn(...args);
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastRun = Date.now();
        fn(...args);
      }, delay - (now - lastRun));
    }
  };
};

/**
 * 색상 보간을 위한 클로저 함수 생성
 */
export const createColorLerp = () => {
  const colorA = new THREE.Color();
  const colorB = new THREE.Color();
  
  return (startColor, endColor, progress) => {
    colorA.setStyle(startColor);
    colorB.setStyle(endColor);
    return '#' + colorA.lerp(colorB, progress).getHexString();
  };
};

/**
 * 스크롤 진행률 계산
 */
export const calculateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;
  return Math.min(scrollTop / Math.max(scrollHeight, 1), 1);
};

/**
 * 배치 상태 업데이트 함수 생성
 * @param {...Function} setters - 상태 설정 함수들
 */
export const createBatchUpdater = (...setters) => {
  return (...values) => {
    values.forEach((value, index) => {
      if (setters[index]) {
        setters[index](value);
      }
    });
  };
};

/**
 * 섹션 배열 생성 유틸리티
 * @param {Object} refs - 섹션 ref 객체들
 * @param {Object} themes - 테마 설정 객체
 */
export const createSectionArray = (refs, themes) => {
  const themeKeys = Object.keys(themes);
  const refKeys = Object.keys(refs);
  
  return refKeys.map((refKey, index) => ({
    ref: refs[refKey],
    ...themes[themeKeys[index]] || themes[themeKeys[0]]
  }));
};

/**
 * 현재 활성 섹션 계산
 * @param {number} progress - 스크롤 진행률 (0-1)
 * @param {number} sectionCount - 총 섹션 수
 */
export const getCurrentSectionIndex = (progress, sectionCount) => {
  return Math.min(Math.floor(progress * sectionCount), sectionCount - 1);
};

/**
 * 섹션 내 진행률 계산  
 * @param {number} globalProgress - 전체 진행률
 * @param {number} sectionIndex - 섹션 인덱스
 * @param {number} sectionCount - 총 섹션 수
 */
export const getSectionProgress = (globalProgress, sectionIndex, sectionCount) => {
  return (globalProgress * sectionCount) - sectionIndex;
};

/**
 * 디바운스 함수
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연 시간
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}; 