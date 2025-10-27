import React from 'react';
import { Box } from '@mui/material';

/**
 * 페이지 전체를 감싸는 최상위 컨테이너 컴포넌트
 * 
 * Props:
 * @param {React.ReactNode} children - 컨테이너 내부 콘텐츠 [Required]
 * @param {object} sx - 추가 스타일 속성 [Optional]
 *
 * Example usage:
 * <PageContainer>
 *   {content}
 * </PageContainer>
 */
function PageContainer({ children, sx = {} }) {
  return (
    <Box 
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default PageContainer; 