// 섹션별 테마 설정
export const SECTION_THEMES = {
  welcome: {
    particleColor: '#ADD8E6', // 라이트 블루
    backgroundColor: '#000011',
    movementSpeed: 0.001,
    title: 'Welcome to Particle Universe',
    description: '마우스를 움직이고 스크롤해보세요'
  },
  interactive: {
    particleColor: '#00AAFF', // 브라이트 블루  
    backgroundColor: '#001122',
    movementSpeed: 0.0012,
    title: 'Interactive Particles',
    description: '실시간으로 마우스 움직임에 반응하는 파티클들'
  },
  scroll: {
    particleColor: '#6600FF', // 퍼플
    backgroundColor: '#0a0033', 
    movementSpeed: 0.0015,
    title: 'Scroll & Mouse Response',
    description: '스크롤 진행률에 따라 카메라와 배경색이 변화합니다'
  },
  dynamic: {
    particleColor: '#FF00AA', // 마젠타
    backgroundColor: '#1a0033',
    movementSpeed: 0.0018,
    title: 'Dynamic 3D Experience', 
    description: 'WebGL 기반의 고성능 3D 렌더링'
  },
  immersive: {
    particleColor: '#FF6600', // 오렌지
    backgroundColor: '#330011',
    movementSpeed: 0.002,
    title: 'Immersive Background',
    description: '몰입형 웹 경험을 위한 파티클 시스템'
  }
};

// 성능 최적화 설정
export const PERFORMANCE_CONFIG = {
  mouseThrottleInterval: 16, // 60fps
  scrollThrottleInterval: 8, // 120fps  
  particleCount: 200,
  particleSize: 0.15,
  movementRadius: 30,
  cameraStartZ: 50,
  cameraEndZ: 15
};

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  scrollTrigger: {
    start: 'top top',
    end: 'bottom bottom', 
    scrub: 1
  },
  colorTransition: {
    duration: 0.8,
    ease: 'power2.out'
  },
  fadeTransition: {
    duration: 1000
  }
}; 