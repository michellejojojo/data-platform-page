import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GradientButton from '../motion/GradientButton';

/**
 * AI 스타트업 IR 페이지의 컨텐츠 섹션 컴포넌트
 *
 * Props:
 * @param {object} data - 섹션 데이터 객체 [Required]
 * @param {string} data.subtitle - 서브타이틀 텍스트 [Required]
 * @param {string} data.title - 메인 타이틀 텍스트 [Required]
 * @param {array} data.content - 컨텐츠 리스트 배열 [Required]
 * @param {number} index - 섹션 인덱스 [Required]
 * @param {number} totalSections - 전체 섹션 수 [Required]
 *
 * Example usage:
 * <IRContentSection 
 *   data={{
 *     subtitle: "Revolutionary Intelligence Platform",
 *     title: "AI의 미래를 선도하다",
 *     content: ["차세대 AI 기술로 비즈니스 혁신을 이끌어갑니다"]
 *   }} 
 *   index={0} 
 *   totalSections={5} 
 * />
 */
function IRContentSection({ data, index, totalSections }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '50%',
          pr: { xs: 4, md: 8 },
          pl: 4,
        }}
      >
        <Box sx={{ maxWidth: '500px' }}>
          {/* 서브타이틀 */}
          <Typography
            variant="overline"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              letterSpacing: '0.15em',
              mb: 2,
              display: 'block',
            }}
          >
            {data.subtitle}
          </Typography>

          {/* 메인 타이틀 */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 4,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            {data.title}
          </Typography>

          <Divider sx={{ mb: 4, width: '60px', height: '2px' }} />

          {/* 컨텐츠 리스트 */}
          <Box sx={{ space: 3 }}>
            {data.content.map((item, itemIndex) => (
              <Box key={itemIndex} sx={{ mb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    opacity: 0.9,
                    position: 'relative',
                    pl: 3,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '0.7em',
                      width: '6px',
                      height: '6px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '50%',
                    }
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 마지막 섹션에만 CTA 버튼 */}
          {index === totalSections - 1 && (
            <Box sx={{ mt: 6 }}>
              <GradientButton
                colors={[theme.palette.primary.main, theme.palette.secondary.main]}
                angle={45}
                size="large"
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  mr: 2,
                }}
              >
                투자 제안서 다운로드
              </GradientButton>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                미팅 예약하기
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default IRContentSection; 