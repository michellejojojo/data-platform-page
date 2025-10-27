import React from 'react';
import { Box } from '@mui/material';

/**
 * ParticleBackground 내에서 사용되는 섹션 컴포넌트
 * FullPageSection과 동일하지만 ParticleBackground와의 통합을 위해 별도로 분리
 * 
 * Props:
 * @param {React.ReactNode} children - 섹션 내부에 렌더링될 자식 요소들 [Required]
 * @param {object} sx - 추가적인 MUI sx 스타일 객체 [Optional]
 * 
 * Example usage:
 * <ParticleSection>
 *   <Typography variant="h2">섹션 제목</Typography>
 * </ParticleSection>
 */
const ParticleSection = React.forwardRef(({ children, sx }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
});

ParticleSection.displayName = 'ParticleSection';

export default ParticleSection; 