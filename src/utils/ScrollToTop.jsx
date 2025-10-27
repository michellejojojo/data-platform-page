import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop 컴포넌트
 * 라우트가 변경될 때마다 페이지 스크롤을 (0, 0) 위치(최상단)로 이동시킵니다.
 * 이 컴포넌트는 UI를 렌더링하지 않습니다.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop; 