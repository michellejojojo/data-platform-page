import React from 'react';
import { Box } from '@mui/material';

/**
 * 컨텐츠를 감싸는 반응형 컨테이너 컴포넌트
 * 
 * Props:
 * @param {React.ReactNode} children - 컨테이너 내부 콘텐츠 [Required]
 * @param {object} sx - 추가 스타일 속성 [Optional]
 *
 * Example usage:
 * <ContentContainer>
 *   {content}
 * </ContentContainer>
 */
function ContentContainer({ children, sx = {} }) {
  return (
    <Box 
      sx={{
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4, lg: 8 },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default ContentContainer; 