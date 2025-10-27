import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

/**
 * 스크롤 방향을 감지하는 커스텀 훅
 * 
 * @param {number} threshold - 스크롤 방향이 바뀌기 위한 최소 이동 거리(px) [Optional, 기본값: 50]
 * @returns {object} - { scrollDirection, scrollY } 객체 반환
 *   - scrollDirection: 'up' | 'down' - 현재 스크롤 방향
 *   - scrollY: MotionValue - 현재 스크롤 위치 (framer-motion useScroll에서 제공)
 * 
 * Example usage:
 * const { scrollDirection, scrollY } = useScrollDirection(100);
 * // threshold가 클수록 방향 변화에 둔감함 (더 많이 스크롤해야 방향 바뀜)
 */
function useScrollDirection(threshold = 50) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastDirectionChangePosition, setLastDirectionChangePosition] = useState(0);
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    const scrollDelta = latest - previous;
    
    // 스크롤이 정지한 경우 무시
    if (scrollDelta === 0) return;
    
    // 현재 방향과 반대로 스크롤하는 경우
    const isScrollingDown = scrollDelta > 0;
    const isScrollingUp = scrollDelta < 0;
    
    // 현재 방향과 새로운 스크롤 방향이 다른 경우만 체크
    if ((scrollDirection === 'up' && isScrollingDown) || 
        (scrollDirection === 'down' && isScrollingUp)) {
      
      // 마지막 방향 변경 지점으로부터 threshold만큼 이동했는지 확인
      const distanceFromLastChange = Math.abs(latest - lastDirectionChangePosition);
      
      if (distanceFromLastChange >= threshold) {
        const newDirection = isScrollingDown ? 'down' : 'up';
        setScrollDirection(newDirection);
        setLastDirectionChangePosition(latest);
      }
    } else {
      // 같은 방향으로 계속 스크롤하는 경우
      // 이미 설정된 방향을 유지하고 기준점만 업데이트
      if ((scrollDirection === 'down' && isScrollingDown) || 
          (scrollDirection === 'up' && isScrollingUp)) {
        setLastDirectionChangePosition(latest);
      }
    }
  });

  return { scrollDirection, scrollY };
}

export default useScrollDirection; 