import { useState, useEffect } from 'react';

/**
 * 테마 모드(라이트/다크)를 관리하는 커스텀 훅
 * 
 * @returns {Object} 테마 모드 상태와 토글 함수를 포함한 객체
 */
const useThemeMode = () => {
  // 시스템 다크모드 설정 확인
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 로컬 스토리지에서 테마 모드 확인 또는 시스템 설정 사용
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  // 테마 모드 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // 테마 모드 토글 함수
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { mode, toggleMode };
};

export default useThemeMode; 