import React, { useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Box,
} from "@mui/material";
import "./App.css";

// 커스텀 테마 불러오기
import { darkTheme } from "./styles/theme";

// 컴포넌트 임포트
import ParticleBackground, { ParticleSection } from "./components/patterns/visualHook/ParticleBackground";
import NavigationHeader from "./components/commons/navigation/NavigationHeader";
import { sectionsData, getParticleSections } from "./data/sectionsData";

/**
 * 우주관광 랜딩 페이지 메인 App 컴포넌트
 * ParticleBackground로 전체를 감싸고 5개 섹션을 순차적으로 배치
 */
function App() {
  const theme = darkTheme;
  
  // 파티클 섹션 데이터를 상태로 관리 (CTA hover 시 동적 변경을 위해)
  const [particleSections, setParticleSections] = useState(getParticleSections());
  
  // 네비게이션 헤더용 스크롤 상태 관리
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    isScrolled: false,
    isVisible: true,
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 네비게이션 헤더 */}
      <NavigationHeader 
        scrollState={scrollState}
      />
      
      {/* 파티클 배경으로 전체 페이지 감싸기 */}
      <ParticleBackground 
        sections={particleSections}
        onScrollUpdate={setScrollState}
      >
        {/* 각 섹션을 순차적으로 렌더링 */}
        {sectionsData.map((section) => {
          const SectionComponent = section.component;
          
          // ReservationSection에만 sections 관련 props 전달
          const sectionProps = section.id === 'reservation' 
            ? { 
                ...section.props, 
                sections: particleSections,
                onSectionsUpdate: setParticleSections
              }
            : section.props;
          
          return (
            <Box
              key={section.id}
              id={section.id}
              sx={{
                position: 'relative',
                zIndex: 1,
                mb: { xs: 12, md: 0 },
              }}
            >
              <SectionComponent {...sectionProps} />
            </Box>
          );
        })}
      </ParticleBackground>
    </ThemeProvider>
  );
}

export default App;
