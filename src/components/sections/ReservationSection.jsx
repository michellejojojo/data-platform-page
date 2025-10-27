import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Box, 
  Stack,
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import ScrambleText from '../patterns/typoraphy/ScrambleText';
import GradientButton from '../patterns/motion/GradientButton';
import CourseBanner from '../commons/banner/CourseBanner';
import { sectionsData } from '../../data/sectionsData';

/**
 * 예약 섹션 컴포넌트
 * 우주관광 예약을 위한 폼이 포함된 섹션
 * 
 * Props:
 * @param {Array} sections - 전체 섹션 배열 [Required]
 * @param {function} onSectionsUpdate - 섹션 업데이트 콜백 [Required]
 *
 * Example usage:
 * <ReservationSection sections={sections} onSectionsUpdate={setSections} />
 */
function ReservationSection({ sections, onSectionsUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    spacecraft: '',
    date: '',
    passengers: 1,
  });

  // CTA hover 상태 관리 (내부 UI 반전용)
  const [isHovered, setIsHovered] = useState(false);
  
  // 강제 리렌더링용 키 (hover 상태 변경 시 컴포넌트 완전 리렌더링 보장)
  const [renderKey, setRenderKey] = useState(0);

  // 원본 마지막 섹션 데이터 저장 (고정된 원본 데이터 사용)
  const originalLastSection = useRef(null);

  // 컴포넌트 마운트 시 원본 데이터 저장 (한 번만 실행)
  useEffect(() => {
    if (!originalLastSection.current) {
      // sectionsData에서 마지막 섹션의 원본 색상 정보 가져오기
      const reservationSection = sectionsData.find(section => section.id === 'reservation');
      if (reservationSection) {
        originalLastSection.current = {
          backgroundColor: reservationSection.backgroundColor,
          particleColor: reservationSection.particleColor,
          movementSpeed: reservationSection.movementSpeed,
        };
      }
    }
  }, []); // 빈 배열로 한 번만 실행

  // CTA hover 처리 함수
  const handleCtaHover = useCallback((isHovering) => {
    if (!sections || !onSectionsUpdate || !originalLastSection.current) {
      console.warn('handleCtaHover: Missing required data', {
        sections: !!sections,
        onSectionsUpdate: !!onSectionsUpdate,
        originalLastSection: !!originalLastSection.current
      });
      return;
    }

    // 먼저 내부 UI 상태 업데이트
    setIsHovered(isHovering);
    
    // 강제 리렌더링 트리거 (ScrambleText 등의 완전한 색상 변경 보장)
    setRenderKey(prev => prev + 1);

    // 그 다음 섹션 색상 업데이트
    const updatedSections = [...sections];
    const lastIndex = updatedSections.length - 1;

    if (isHovering) {
      // hover 시: 마지막 섹션 색상을 반전
      updatedSections[lastIndex] = {
        ...updatedSections[lastIndex],
        backgroundColor: "#FFFFFF",
        particleColor: "#000000",
      };
    } else {
      // hover 해제 시: 원본 색상으로 복구
      updatedSections[lastIndex] = {
        ...updatedSections[lastIndex],
        backgroundColor: originalLastSection.current.backgroundColor,
        particleColor: originalLastSection.current.particleColor,
        movementSpeed: originalLastSection.current.movementSpeed,
      };
    }

    onSectionsUpdate(updatedSections);
  }, [sections, onSectionsUpdate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Reservation submitted:', formData);
    // 실제 예약 처리 로직은 여기에 구현
  };

  // 폼 필드 공통 스타일
  const getFieldStyles = () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: isHovered 
        ? 'rgba(26,27,35,0.05)' 
        : 'rgba(255,255,255,0.05)',
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: isHovered 
          ? 'rgba(26,27,35,0.4)' 
          : 'rgba(255,255,255,0.3)',
      },
      '&:hover fieldset': {
        borderColor: isHovered 
          ? 'rgba(26,27,35,0.6)' 
          : 'rgba(255,255,255,0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: isHovered 
          ? 'rgba(26,27,35,0.8)' 
          : 'rgba(255,255,255,0.8)',
      },
    },
    '& .MuiInputLabel-root': {
      color: isHovered 
        ? 'rgba(26,27,35,0.8)' 
        : 'rgba(255,255,255,0.7)',
      transition: 'all 0.3s ease',
    },
    '& .MuiOutlinedInput-input': {
      color: isHovered ? '#1A1B23' : 'white',
      transition: 'all 0.3s ease',
    },
  });

  // Select 필드 스타일
  const getSelectStyles = () => ({
    backgroundColor: isHovered 
      ? 'rgba(26,27,35,0.05)' 
      : 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    color: isHovered ? '#1A1B23' : 'white',
    transition: 'all 0.3s ease',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: isHovered 
        ? 'rgba(26,27,35,0.4)' 
        : 'rgba(255,255,255,0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: isHovered 
        ? 'rgba(26,27,35,0.6)' 
        : 'rgba(255,255,255,0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: isHovered 
        ? 'rgba(26,27,35,0.8)' 
        : 'rgba(255,255,255,0.8)',
    },
    '& .MuiSvgIcon-root': {
      color: isHovered 
        ? 'rgba(26,27,35,0.8)' 
        : 'rgba(255,255,255,0.7)',
      transition: 'all 0.3s ease',
    },
  });

  return (
    <Stack
      gap={4}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Grid container spacing={6} sx={{ maxWidth: 1200 }}>
        <Grid size={{ xs: 12 }}>
          {/* 섹션 타이틀 */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ScrambleText
              key={`scramble-${renderKey}`}
              text="Join the Data Journey"
              variant="h2"
              color={isHovered ? "#1A1B23" : "white"}
              startDelay={500}
              useViewportTrigger={true}
              viewportThreshold={0.3}
              sx={{
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                  md: '3rem',
                  lg: '3.5rem',
                },
                fontWeight: 800,
                letterSpacing: '0.1em',
                mb: 2,
                textShadow: isHovered 
                  ? '0 0 20px rgba(26,27,35,0.3)' 
                  : '0 0 20px rgba(255,255,255,0.3)',
                textAlign: 'center',
                width: '100%',
                transition: 'all 0.3s ease',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: isHovered 
                  ? 'rgba(26,27,35,0.8)' 
                  : 'rgba(255,255,255,0.7)',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                fontWeight: 300,
                letterSpacing: '0.05em',
                textAlign: 'center',
                width: '100%',
                transition: 'all 0.3s ease',
              }}
            >
              From Data to Discovery — LEAD the Future of Insight
            </Typography>
          </Box>

          {/* 예약 폼 */}
          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12, md: 8, lg: 6 }}>
              <Card
                sx={{
                  backgroundColor: isHovered 
                    ? 'rgba(26,27,35,0.1)' 
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(60px)',
                  border: isHovered 
                    ? '1px solid rgba(26,27,35,0.2)' 
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  boxShadow: isHovered 
                    ? '0 20px 40px rgba(26,27,35,0.3)' 
                    : '0 20px 40px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* 이름 */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          sx={getFieldStyles()}
                        />
                      </Grid>

                      {/* 이메일 */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          sx={getFieldStyles()}
                        />
                      </Grid>

                      {/* 우주선 선택 */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                          <InputLabel 
                            sx={{ 
                              color: isHovered 
                                ? 'rgba(26,27,35,0.8)' 
                                : 'rgba(255,255,255,0.7)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            Spacecraft
                          </InputLabel>
                          <Select
                            name="spacecraft"
                            value={formData.spacecraft}
                            onChange={handleInputChange}
                            sx={getSelectStyles()}
                          >
                            <MenuItem value="lunar-voyager">Lunar Voyager</MenuItem>
                            <MenuItem value="martian-pioneer">Martian Pioneer</MenuItem>
                            <MenuItem value="stellar-explorer">Stellar Explorer</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* 승객 수 */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="passengers"
                          label="Number of Passengers"
                          type="number"
                          value={formData.passengers}
                          onChange={handleInputChange}
                          inputProps={{ min: 1, max: 12 }}
                          required
                          sx={getFieldStyles()}
                        />
                      </Grid>

                      {/* 날짜 */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          name="date"
                          label="Preferred Date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          required
                          sx={getFieldStyles()}
                        />
                      </Grid>

                      {/* 제출 버튼 */}
                      <Grid size={{ xs: 12 }}>
                        <GradientButton
                          key={`gradient-btn-${renderKey}`}
                          type="submit"
                          fullWidth
                          size="large"
                          angle={90}
                          colors={isHovered 
                            ? ['#1A1B23', '#2C2D35', '#1A1B23'] 
                            : ['#fff', '#bbb', '#fff']
                          }
                          textColor={isHovered ? '#F8F9FA' : '#000'}
                          animationDuration="4s"
                          onMouseEnter={() => {
                            handleCtaHover(true);
                          }}
                          onMouseLeave={() => {
                            handleCtaHover(false);
                          }}
                          sx={{
                            mt: 2,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'all 0.3s ease',
                            border: isHovered 
                              ? '1px solid rgba(26,27,35,0.3)' 
                              : '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: isHovered 
                                ? '0 10px 30px rgba(26,27,35,0.3)' 
                                : '0 10px 30px rgba(14,165,233,0.4)',
                            },
                          }}
                          onClick={handleSubmit}
                        >
                          Reserve Your Journey
                        </GradientButton>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default ReservationSection; 