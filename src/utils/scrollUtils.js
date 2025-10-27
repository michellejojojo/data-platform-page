import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis와 GSAP ScrollTrigger를 통합하는 함수
 * @param {Lenis} lenis - Lenis 인스턴스
 */
export function integrateLenisWithScrollTrigger(lenis) {
  if (!lenis) return;

  // ScrollTrigger를 업데이트하는 함수
  lenis.on('scroll', ScrollTrigger.update);

  // GSAP 애니메이션 프레임과 Lenis를 동기화
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // GSAP 기본 애니메이션 프레임 비활성화
  gsap.ticker.lagSmoothing(0);
}

/**
 * 스크롤 위치로 이동하는 함수
 * @param {number} position - 스크롤 위치 (픽셀)
 * @param {Lenis} lenis - Lenis 인스턴스
 * @param {object} options - 스크롤 옵션
 */
export function scrollTo(position, lenis, options = {}) {
  if (!lenis) {
    window.scrollTo({
      top: position,
      behavior: 'smooth',
      ...options
    });
    return;
  }
  
  lenis.scrollTo(position, options);
}

/**
 * 특정 요소로 스크롤하는 함수
 * @param {string|HTMLElement} target - 스크롤할 요소 또는 선택자
 * @param {Lenis} lenis - Lenis 인스턴스
 * @param {object} options - 스크롤 옵션
 */
export function scrollToElement(target, lenis, options = {}) {
  if (!lenis) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
      
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        ...options
      });
    }
    return;
  }
  
  lenis.scrollTo(target, options);
} 