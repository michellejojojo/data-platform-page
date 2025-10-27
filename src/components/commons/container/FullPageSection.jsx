import React from 'react';
import { Box } from '@mui/material';

/**
 * 화면 전체 높이(100vh)를 차지하는 기본 섹션 컴포넌트.
 * 이제 React.forwardRef를 사용하여 ref를 내부 Box 요소로 전달합니다.
 * @param {object} props
 * @param {React.ReactNode} props.children - 섹션 내부에 렌더링될 자식 요소들.
 * @param {object} props.sx - 추가적인 MUI sx 스타일 객체.
 * @param {React.Ref} ref - 상위 컴포넌트로부터 전달받는 ref.
 */
const FullPageSection = React.forwardRef(({ children, sx }, ref) => {
  return (
    <Box
      ref={ref} // 전달받은 ref를 Box에 연결
      sx={{
        width: '100%',
        minHeight: '100vh', // 최소 높이를 100vh로 설정
        display: 'flex',       // 기본적으로 flex 컨테이너로 설정 (가운데 정렬 등에 유용)
        flexDirection: 'column', // 자식 요소를 세로로 배치
        justifyContent: 'center', // 기본 세로 중앙 정렬
        alignItems: 'center',   // 기본 가로 중앙 정렬
        position: 'relative',    // 자식 요소의 position 기준점
        ...sx,                   // 외부에서 전달된 sx prop 적용
      }}
    >
      {children}
    </Box>
  );
});

// forwardRef 사용 시 displayName 설정 (개발 도구에서 유용)
FullPageSection.displayName = 'FullPageSection';

export default FullPageSection; 