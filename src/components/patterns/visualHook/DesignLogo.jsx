import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import AnimatedPathWithParticles from './AnimatedPathWithParticles';
import {
  path_D,
  path_e,
  path_s,
  path_i,
  path_g,
  path_n
} from '../../../data/logoTypePathData';

/**
 * DesignLogo 컴포넌트
 * DESIGN 철자를 AnimatedPathWithParticles를 사용해서 표현하는 컴포넌트
 * 
 * Props:
 * @param {string} triggerMode - 애니메이션 트리거 방식 ('manual' | 'viewport') [Optional, 기본값: 'manual']
 * @param {boolean} showControls - 수동 제어 버튼 표시 여부 [Optional, 기본값: true]
 * @param {number} scale - 전체 크기 비율 [Optional, 기본값: 1]
 * @param {string} pathColor - path 선의 색상 [Optional, 기본값: '#FFFFFF']
 * @param {string} particleColor1 - 파티클 색상1 [Optional, 기본값: '#00E5FF']
 * @param {string} particleColor2 - 파티클 색상2 [Optional, 기본값: '#FF4081']
 * @param {number} letterSpacing - 글자 간격 [Optional, 기본값: 20]
 * @param {number} animationDelay - 각 글자별 애니메이션 지연 시간(ms) [Optional, 기본값: 200]
 * @param {number} strokeWidth - 기본 선의 두께 (각 철자별 개별 설정이 우선) [Optional, 기본값: 36]
 * 
 * 각 철자별 strokeWidth 설정:
 * - D: 32, E: 28, S: 36, I: 20, G: 40, N: 34
 *
 * Example usage:
 * <DesignLogo triggerMode="viewport" pathColor="#FFFFFF" strokeWidth={24} />
 */
function DesignLogo({
  triggerMode = 'manual',
  showControls = true,
  scale = 1,
  pathColor = '#FFFFFF',
  particleColor1 = '#00E5FF',
  particleColor2 = '#FF4081',
  letterSpacing = 20,
  animationDelay = 200,
  strokeWidth = 36
}) {
  const [isTriggered, setIsTriggered] = useState(false);

  // DESIGN 글자 정보
  const letters = [
    { path: path_D, width: 144, letter: 'D', strokeWidth: 72 },
    { path: path_e, width: 144, letter: 'E', strokeWidth: 40 },
    { path: path_s, width: 144, letter: 'S', strokeWidth: 48 },
    { path: path_i, width: 48, letter: 'I', strokeWidth: 48 },
    { path: path_g, width: 144, letter: 'G', strokeWidth: 40 },
    { path: path_n, width: 144, letter: 'N', strokeWidth: 48 }
  ];

  const handleTrigger = () => {
    setIsTriggered(true);
    // 애니메이션 완료 후 리셋
    setTimeout(() => {
      setIsTriggered(false);
    }, 4000);
  };

  const handleReset = () => {
    setIsTriggered(false);
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {/* 제어 버튼 */}
      {showControls && triggerMode === 'manual' && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleTrigger}
            disabled={isTriggered}
            sx={{
              mr: 2,
              backgroundColor: pathColor,
              color: '#000',
              '&:hover': {
                backgroundColor: particleColor1,
              }
            }}
          >
            애니메이션 시작
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: pathColor,
              color: pathColor,
              '&:hover': {
                borderColor: particleColor2,
                color: particleColor2,
              }
            }}
          >
            리셋
          </Button>
        </Box>
      )}

      {/* DESIGN 로고 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: `${letterSpacing}px`,
          minHeight: 144 * scale,
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {letters.map((letterData, index) => (
            <Grid 
              key={letterData.letter} 
              size={{ xs: 12, sm: 6, md: 2 }}
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                minWidth: letterData.width * scale
              }}
            >
              <AnimatedPathWithParticles
                data={letterData.path}
                width={letterData.width}
                strokeWidth={letterData.strokeWidth || strokeWidth}
                startDelay={index * animationDelay}
                scale={scale}
                triggerMode={triggerMode}
                isTrigger={triggerMode === 'manual' ? isTriggered : true}
                pathColor={pathColor}
                particleColor1={particleColor1}
                particleColor2={particleColor2}
                pathDuration={800}
                particleDuration={2000}
                particleNum={30}
                particleSize={3}
                particleOpacity={0.9}
                particleType="circle"
                particleFadeInDuration={600}
                particleStartDelay={400}
                startWithReserve={triggerMode === 'manual'}
                viewportOptions={{
                  threshold: 0.5,
                  triggerOnce: true
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 로고 제목 */}
      <Box sx={{ mt: 4 }}>
        <Box
          component="h2"
          sx={{
            color: pathColor,
            fontSize: '2rem',
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.8,
            fontFamily: 'monospace'
          }}
        >
          Design
        </Box>
        <Box
          component="p"
          sx={{
            color: particleColor1,
            fontSize: '1rem',
            mt: 1,
            opacity: 0.7
          }}
        >
          Interactive Typography Animation
        </Box>
      </Box>
    </Box>
  );
}

export default DesignLogo; 