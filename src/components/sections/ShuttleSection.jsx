import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Chip } from '@mui/material';
import ScrambleText from '../patterns/typoraphy/ScrambleText';
import FullPageSection from '../commons/container/FullPageSection';
import FadeInContainer from '../patterns/motion/FadeInContainer';

/**
 * 우주선 섹션 컴포넌트
 * 개별 우주선의 정보를 표시하는 섹션
 * 
 * Props:
 * @param {object} spacecraftData - 우주선 데이터 객체 [Required]
 * @param {string} spacecraftData.title - 우주선 이름
 * @param {string} spacecraftData.description - 우주선 설명
 * @param {Array} spacecraftData.features - 우주선 특징 배열
 * @param {string} spacecraftData.imageUrl - 우주선 이미지 URL
 * @param {string} spacecraftData.imagePosition - 이미지 위치 ('left' 또는 'right')
 * @param {string} spacecraftData.cardBackgroundColor - 카드 배경색
 *
 * Example usage:
 * <ShuttleSection spacecraftData={spacecraftData[0]} />
 */
function ShuttleSection({ spacecraftData }) {
  if (!spacecraftData) {
    return null;
  }

  const {
    title,
    description,
    features = [],
    imageUrl,
    imagePosition = 'right',
    cardBackgroundColor = 'rgba(10, 10, 20, 0.3)',
  } = spacecraftData;

  const isImageLeft = imagePosition === 'left';
  const [mainTitle, subTitle] = String(title || '').split('\n');

  return (
    <FullPageSection
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        mb: { xs: 4, md: 0 },
      }}
    >
      <Grid container spacing={{ xs: 2, md: 6 }} sx={{ maxWidth: 1400, alignItems: 'center' }}>
        {/* 콘텐츠 그리드 - 60% */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            order: { xs: 1, md: isImageLeft ? 2 : 1 },
          }}
        >
          <FadeInContainer
            direction="left"
            duration={0.6}
            once={false}
            delay={0}
            offset={0}
            amount={0.2}
          >
            <Card
              sx={{
                backgroundColor: cardBackgroundColor,
                backdropFilter: 'blur(60px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                {/* 우주선 이름 - 스크램블 효과 (두 줄 지원) */}
                <Box sx={{ mb: 3 }}>
                  <ScrambleText
                    text={mainTitle}
                    variant="h2"
                    color="white"
                    startDelay={500}
                    useViewportTrigger={true}
                    viewportThreshold={0.3}
                    sx={{
                      fontSize: {
                        xs: '1.8rem',
                        sm: '2.2rem',
                        md: '2.8rem',
                        lg: '3.2rem',
                      },
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      mb: subTitle ? 0.5 : 2,
                      textShadow: '0 0 20px rgba(255,255,255,0.3)',
                    }}
                  />
                  {subTitle && (
                    <ScrambleText
                      text={subTitle}
                      variant="h5"
                      color="rgba(255,255,255,0.85)"
                      startDelay={700}
                      useViewportTrigger={true}
                      viewportThreshold={0.3}
                      sx={{
                        fontSize: {
                          xs: '0.9rem',
                          sm: '1rem',
                          md: '1.1rem',
                          lg: '1.2rem',
                        },
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>

                {/* 우주선 설명 */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    lineHeight: 1.6,
                    mb: 4,
                    letterSpacing: '0.02em',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {description}
                </Typography>

                {/* 우주선 특징 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature.text}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        fontWeight: 400,
                        px: 1.5,
                        py: 0.5,
                        height: 'auto',
                        borderRadius: 16,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-1px)',
                        },
                        '& .MuiChip-label': {
                          px: 1,
                          py: 0.25,
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </FadeInContainer>
        </Grid>

        {/* 이미지 그리드 - 40% */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            order: { xs: 2, md: isImageLeft ? 1 : 2 },
          }}
        >
          <FadeInContainer
            direction="left"
            duration={0.8}
            delay={0}
            once={false}
            offset={0}
            amount={0.2}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
              }}
            >
              <Box
                component="img"
                src={imageUrl}
                alt={title}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Box>
          </FadeInContainer>
        </Grid>
      </Grid>
    </FullPageSection>
  );
}

export default ShuttleSection; 