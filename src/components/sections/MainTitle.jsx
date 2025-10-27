import React from 'react';
import { Box, Grid } from '@mui/material';
import ScrambleText from '../patterns/typoraphy/ScrambleText';
import TypingEffect from '../patterns/typoraphy/TypingEffect';

/**
 * 메인 타이틀 섹션 컴포넌트
 * 우주관광 랜딩 페이지의 히어로 섹션
 * 글래스모피즘 스타일과 미래적 디자인 적용
 * 
 * Props:
 * 별도의 props는 없음
 *
 * Example usage:
 * <MainTitle />
 */
function MainTitle() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        px: { xs: 2, sm: 4, md: 6 },
        pt: { xs: '18vh', sm: '18vh', md: '22vh' },
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: 1200 }}>
        <Grid size={{ xs: 12 }}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: { xs: 8, sm: 10, md: 12 }
            }}
          >
            {/* 메인 타이틀 - 스크램블 효과 */}
            <ScrambleText
              text="Explore the Invisible."
              variant="h2"
              color="white"
              startDelay={60}
              sx={{
                fontSize: {
                  xs: '2.5rem',
                  sm: '3.5rem',
                  md: '4.5rem',
                  lg: '5.5rem',
                },
                fontWeight: 900,
                letterSpacing: '0.08em',
                mb: 3,
                textShadow: `
                  0 0 30px rgba(255,255,255,0.4),
                  0 0 60px rgba(138,43,226,0.3),
                  0 0 90px rgba(75,0,130,0.2)
                `,
                textAlign: 'center',
                width: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e6ff 50%, #c4b5fd 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />

            {/* 서브 타이틀 - 타이핑 효과 */}
            <Box 
              sx={{ 
                mb: 8, 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TypingEffect
                texts={[
                  'From behavior to meaning,',
                  'from meaning to connection',
                  '— with LEAD Platform.'
                ]}
                startDelay={500}
                typingSpeed={30}
                deleteSpeed={20}
                variant={{
                  xs: 'h6',
                  sm: 'h5',
                  md: 'h4',
                  lg: 'h3'
                }}
                textColor="rgba(255,255,255,0.85)"
                fontWeight="300"
                textAlign="center"
                sx={{
                  minHeight: {
                    xs: '2.5rem',
                    sm: '3rem',
                    md: '3.5rem',
                    lg: '4rem',
                  },
                  textAlign: 'center',
                  width: '100%',
                  letterSpacing: '0.02em',
                  lineHeight: 1.4,
                  textShadow: '0 0 20px rgba(255,255,255,0.2)',
                }}
              />
            </Box>

            {/* Keep Scroll UI */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 3,
                mt: 6,
              }}
            >
              <Box
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 10px rgba(255,255,255,0.3)',
                }}
              >
                Discover the Journey
              </Box>
              
              {/* 개선된 스크롤 인디케이터 */}
              <Box
                sx={{
                  width: '2px',
                  height: '50px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '25px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(138,43,226,0.7) 50%, rgba(75,0,130,0.5) 100%)',
                    borderRadius: '2px',
                    animation: 'scrollIndicator 2.5s ease-in-out infinite',
                  },
                  '@keyframes scrollIndicator': {
                    '0%': {
                      transform: 'translateY(-25px)',
                      opacity: 0,
                    },
                    '20%': {
                      opacity: 1,
                    },
                    '80%': {
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'translateY(50px)',
                      opacity: 0,
                    },
                  },
                }}
              />
              
              {/* 개선된 화살표 아이콘 */}
              <Box
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1.2rem',
                  fontWeight: 300,
                  textShadow: '0 0 15px rgba(255,255,255,0.4)',
                  animation: 'floatArrow 3s ease-in-out infinite',
                  '@keyframes floatArrow': {
                    '0%, 100%': {
                      transform: 'translateY(0px)',
                      opacity: 0.7,
                    },
                    '50%': {
                      transform: 'translateY(-8px)',
                      opacity: 1,
                    },
                  },
                }}
              >
                ↓
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainTitle; 