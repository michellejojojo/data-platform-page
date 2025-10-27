import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gradientPalettes } from "../../../data/gradientPalettes";

// GSAP ScrollTrigger 등록
gsap.registerPlugin(ScrollTrigger);

/**
 * 스크롤 기반 동적 그라데이션 배경 컴포넌트
 * 
 * Props:
 * @param {Array} sectionRefs - 섹션 참조 배열 [Required]
 * @param {Array} sectionColors - 섹션별 색상 구성 배열. 색상명 문자열 또는 [color1, color2] 배열 [Required]
 *   - 예: ['pureRed', 'pureBlue'] 또는 [['#FF0000', '#FF4444'], ['#0000FF', '#4444FF']]
 * @param {boolean} enableGlow - 발광 효과 활성화 [Optional, 기본값: false]
 * @param {number} blurIntensity - 블러 강도 [Optional, 기본값: 320]
 * @param {number} circleOpacity - 원형 요소 투명도 [Optional, 기본값: 0.3]
 * @param {number} colorIntensity - 색상 집중도 (0.1-1.0, 낮을수록 희미) [Optional, 기본값: 0.8]
 * @param {boolean} enableAnimation - 섹션 전환 애니메이션 활성화 [Optional, 기본값: true]
 * @param {React.RefObject} scrollContainer - 스크롤 컨테이너 참조 [Optional]
 * @param {number} maxCircles - 최대 원형 요소 개수 [Optional, 기본값: 2]
 * @param {string} orbitalType - 오비탈 움직임 타입 ('rightBottom', 'center', 'corners') [Optional, 기본값: 'rightBottom']
 *
 * Example usage:
 * <ScrollGradientBackground 
 *   sectionRefs={sectionRefs} 
 *   sectionColors={['pureRed', 'pureBlue', 'pureGreen', 'pureYellow']}
 *   enableGlow={false}
 *   colorIntensity={0.8}
 *   scrollContainer={scrollContainerRef}
 * />
 */
function ScrollGradientBackground({
  sectionRefs = [],
  sectionColors = [],
  enableGlow = false,
  blurIntensity = 320,
  circleOpacity = 0.3,
  colorIntensity = 0.8,
  enableAnimation = true,
  scrollContainer,
  maxCircles = 2,
  orbitalType = "rightBottom",
  children,
  sx = {},
}) {
  const bgRef = useRef(null);

  // 반응형 오비탈 설정 자동 계산
  const getResponsiveOrbitalConfig = () => {
    // 화면 크기 감지
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const configs = {
      rightBottom: {
        mobile: {
          largeCircle: { baseX: "98%", baseY: "98%", size: "80vh" },
          smallCircle: { 
            positions: [
              { x: "75%", y: "75%" }, // 좌측 상단
              { x: "98%", y: "75%" }, // 우측 상단
              { x: "98%", y: "98%" }, // 우측 하단
              { x: "75%", y: "98%" }  // 좌측 하단
            ],
            sizes: ["35vh", "32vh", "34vh", "30vh"]
          }
        },
        tablet: {
          largeCircle: { baseX: "96%", baseY: "96%", size: "100vh" },
          smallCircle: {
            positions: [
              { x: "70%", y: "70%" }, // 좌측 상단
              { x: "96%", y: "70%" }, // 우측 상단
              { x: "96%", y: "96%" }, // 우측 하단
              { x: "70%", y: "96%" }  // 좌측 하단
            ],
            sizes: ["40vh", "38vh", "42vh", "36vh"]
          }
        },
        desktop: {
          largeCircle: { baseX: "95%", baseY: "95%", size: "120vh" },
          smallCircle: {
            positions: [
              { x: "60%", y: "60%" }, // 좌측 상단
              { x: "95%", y: "60%" }, // 우측 상단
              { x: "95%", y: "95%" }, // 우측 하단
              { x: "60%", y: "95%" }  // 좌측 하단
            ],
            sizes: ["45vh", "40vh", "42vh", "38vh"]
          }
        }
      },
      center: {
        mobile: {
          largeCircle: { baseX: "50%", baseY: "50%", size: "60vh" },
          smallCircle: {
            positions: [
              { x: "30%", y: "30%" },
              { x: "70%", y: "30%" },
              { x: "70%", y: "70%" },
              { x: "30%", y: "70%" }
            ],
            sizes: ["30vh", "28vh", "32vh", "29vh"]
          }
        },
        tablet: {
          largeCircle: { baseX: "50%", baseY: "50%", size: "80vh" },
          smallCircle: {
            positions: [
              { x: "25%", y: "25%" },
              { x: "75%", y: "25%" },
              { x: "75%", y: "75%" },
              { x: "25%", y: "75%" }
            ],
            sizes: ["35vh", "33vh", "37vh", "34vh"]
          }
        },
        desktop: {
          largeCircle: { baseX: "50%", baseY: "50%", size: "100vh" },
          smallCircle: {
            positions: [
              { x: "20%", y: "20%" },
              { x: "80%", y: "20%" },
              { x: "80%", y: "80%" },
              { x: "20%", y: "80%" }
            ],
            sizes: ["40vh", "38vh", "42vh", "39vh"]
          }
        }
      },
      corners: {
        mobile: {
          largeCircle: { baseX: "85%", baseY: "15%", size: "50vh" },
          smallCircle: {
            positions: [
              { x: "15%", y: "15%" },
              { x: "85%", y: "15%" },
              { x: "85%", y: "85%" },
              { x: "15%", y: "85%" }
            ],
            sizes: ["25vh", "23vh", "27vh", "24vh"]
          }
        },
        tablet: {
          largeCircle: { baseX: "85%", baseY: "15%", size: "65vh" },
          smallCircle: {
            positions: [
              { x: "15%", y: "15%" },
              { x: "85%", y: "15%" },
              { x: "85%", y: "85%" },
              { x: "15%", y: "85%" }
            ],
            sizes: ["30vh", "28vh", "32vh", "29vh"]
          }
        },
        desktop: {
          largeCircle: { baseX: "85%", baseY: "15%", size: "80vh" },
          smallCircle: {
            positions: [
              { x: "15%", y: "15%" },
              { x: "85%", y: "15%" },
              { x: "85%", y: "85%" },
              { x: "15%", y: "85%" }
            ],
            sizes: ["35vh", "33vh", "37vh", "34vh"]
          }
        }
      }
    };

    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    return configs[orbitalType][deviceType];
  };

  // 색상 배열을 표준 형태로 변환
  const normalizeColors = (colorInput) => {
    if (typeof colorInput === 'string') {
      // 팔레트 이름인 경우
      const palette = gradientPalettes.find(p => p.id === colorInput);
      return palette ? palette.colors : ['#f5f5f5', '#e0e0e0'];
    }
    if (Array.isArray(colorInput)) {
      // 직접 색상 배열인 경우
      return colorInput;
    }
    return ['#f5f5f5', '#e0e0e0']; // 기본값
  };

  // 자동으로 색상 구성 데이터 생성
  const generateColorSchemes = () => {
    if (!sectionColors.length) return [];

    const orbitalConfig = getResponsiveOrbitalConfig();
    
    return sectionColors.map((sectionColor, index) => {
      const colors = normalizeColors(sectionColor);
      const lighterColors = colors.map(color => {
        // 색상을 약간 밝게 만들어서 두 번째 원에 사용
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        if (rgb) {
          const r = Math.min(255, parseInt(rgb[1], 16) + 40);
          const g = Math.min(255, parseInt(rgb[2], 16) + 40);
          const b = Math.min(255, parseInt(rgb[3], 16) + 40);
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        return color;
      });

      // 작은 원의 위치는 오비탈 패턴에 따라 순환
      const smallCircleIndex = index % orbitalConfig.smallCircle.positions.length;
      
      return {
        linearGradient: colors,
        radialClusters: [
          { 
            x: orbitalConfig.largeCircle.baseX, 
            y: orbitalConfig.largeCircle.baseY, 
            size: orbitalConfig.largeCircle.size, 
            colors: colors 
          },
          { 
            x: orbitalConfig.smallCircle.positions[smallCircleIndex].x, 
            y: orbitalConfig.smallCircle.positions[smallCircleIndex].y, 
            size: orbitalConfig.smallCircle.sizes[smallCircleIndex], 
            colors: lighterColors 
          },
        ],
      };
    });
  };

  useEffect(() => {
    if (!bgRef.current || !sectionColors.length || !sectionRefs.length) return;

    // 자동으로 색상 구성 생성
    const colorSchemes = generateColorSchemes();
    console.log('Generated colorSchemes:', colorSchemes);
    console.log('Section colors:', sectionColors);
    console.log('Section refs:', sectionRefs.map(ref => ref.current));

    // 스크롤 컨테이너 찾기
    const scroller = scrollContainer?.current || window;
    
    // ScrollTrigger refresh를 위한 설정
    ScrollTrigger.refresh();

    // 색상 보간을 위한 도우미 함수 (미니멀 디자인 최적화)
    const interpolateColor = (color1, color2, factor) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color1);
      const color1Rgb = result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
          ]
        : [255, 255, 255];

      const result2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2);
      const color2Rgb = result2
        ? [
            parseInt(result2[1], 16),
            parseInt(result2[2], 16),
            parseInt(result2[3], 16),
          ]
        : [255, 255, 255];

      const r = Math.round(
        color1Rgb[0] + factor * (color2Rgb[0] - color1Rgb[0])
      );
      const g = Math.round(
        color1Rgb[1] + factor * (color2Rgb[1] - color1Rgb[1])
      );
      const b = Math.round(
        color1Rgb[2] + factor * (color2Rgb[2] - color1Rgb[2])
      );

      // 이전 버전과 동일한 색상 처리 (알파 없이)
      return `rgb(${r}, ${g}, ${b})`;
    };

    // 위치 보간 도우미 함수
    const interpolatePosition = (pos1, pos2, factor) => {
      const p1 = parseFloat(pos1);
      const p2 = parseFloat(pos2);
      return `${p1 + factor * (p2 - p1)}%`;
    };

    // 크기 보간 도우미 함수
    const interpolateSize = (size1, size2, factor) => {
      const s1 = parseFloat(size1);
      const s2 = parseFloat(size2);
      return `${s1 + factor * (s2 - s1)}vh`;
    };

    // 오직 원형 클러스터만 생성 (최대 maxCircles 개)
    const clusters = [];
    const clusterCount = Math.min(colorSchemes[0]?.radialClusters?.length || 0, maxCircles);

    for (let i = 0; i < clusterCount; i++) {
      const clusterElement = document.createElement("div");
      clusterElement.className = `gradient-cluster-${i}`;
      clusterElement.style.position = "fixed";
      clusterElement.style.transform = "translate(-50%, -50%)";
      clusterElement.style.borderRadius = "50%";
      clusterElement.style.filter = `blur(${blurIntensity}px)`;
      clusterElement.style.opacity = circleOpacity.toString(); // circleOpacity를 실제 원의 투명도로 사용
      clusterElement.style.pointerEvents = "none";
      clusterElement.style.zIndex = "0";
      clusterElement.style.mixBlendMode = "normal"; // 색상이 제대로 보이도록 normal로 변경
      
      if (enableGlow) {
        clusterElement.style.boxShadow = `0 0 120px 20px rgba(255, 255, 255, ${circleOpacity * 0.3})`;
      }

      // 초기 클러스터 상태 설정
      if (colorSchemes[0]?.radialClusters?.[i]) {
        const initialCluster = colorSchemes[0].radialClusters[i];
        clusterElement.style.left = initialCluster.x;
        clusterElement.style.top = initialCluster.y;
        clusterElement.style.width = initialCluster.size;
        clusterElement.style.height = initialCluster.size;
        
        // colorIntensity에 따라 color stop 비율 계산
        const innerStop = Math.max(0, colorIntensity * 40); // 0% ~ 40%
        const outerStop = Math.max(innerStop + 10, colorIntensity * 70); // innerStop+10% ~ 70%
        
        clusterElement.style.background = `radial-gradient(circle, ${initialCluster.colors[0]} 0%, ${initialCluster.colors[1]} ${innerStop}%, transparent ${outerStop}%)`;
      }

      bgRef.current.appendChild(clusterElement);
      clusters.push(clusterElement);
    }

    // 초기 상태에서 바로 블렌딩이 보이도록 설정 (circleOpacity 사용)
    clusters.forEach((cluster) => {
      cluster.style.opacity = circleOpacity.toString(); // circleOpacity를 실제 투명도로 사용
    });

    // ScrollTrigger 설정을 위한 공통 옵션
    const scrollTriggerOptions = scroller !== window ? { scroller } : {};

    // 각 섹션 간의 전환을 위한 ScrollTrigger 설정
    for (let i = 0; i < sectionRefs.length - 1; i++) {
      if (!sectionRefs[i].current || !sectionRefs[i + 1].current) continue;

      const currentSection = sectionRefs[i].current;
      const currentScheme = colorSchemes[i];
      const nextScheme = colorSchemes[i + 1];

      if (!currentScheme || !nextScheme) continue;

      // 각 섹션 전환을 위한 ScrollTrigger 생성
      ScrollTrigger.create({
        trigger: currentSection,
        start: "top top",
        end: "bottom top",
        scrub: enableAnimation,
        ...scrollTriggerOptions,
        onUpdate: (self) => {
          const progress = self.progress;

          // 각 클러스터 업데이트만 수행
          for (let j = 0; j < clusterCount; j++) {
            const currentCluster = currentScheme.radialClusters[j];
            const nextCluster = nextScheme.radialClusters[j];
            const cluster = clusters[j];

            if (!currentCluster || !nextCluster || !cluster) continue;

            // 위치, 크기 보간
            cluster.style.left = interpolatePosition(
              currentCluster.x,
              nextCluster.x,
              progress
            );
            cluster.style.top = interpolatePosition(
              currentCluster.y,
              nextCluster.y,
              progress
            );
            cluster.style.width = interpolateSize(
              currentCluster.size,
              nextCluster.size,
              progress
            );
            cluster.style.height = interpolateSize(
              currentCluster.size,
              nextCluster.size,
              progress
            );

            // 색상 보간
            const innerColor = interpolateColor(
              currentCluster.colors[0],
              nextCluster.colors[0],
              progress
            );
            const outerColor = interpolateColor(
              currentCluster.colors[1],
              nextCluster.colors[1],
              progress
            );
            
            // colorIntensity에 따라 color stop 비율 계산
            const innerStop = Math.max(0, colorIntensity * 40); // 0% ~ 40%
            const outerStop = Math.max(innerStop + 10, colorIntensity * 70); // innerStop+10% ~ 70%
            
            cluster.style.background = `radial-gradient(circle, ${innerColor} 0%, ${outerColor} ${innerStop}%, transparent ${outerStop}%)`;
          }
        },
      });
    }

    // 마지막 섹션을 위한 특별 처리 (화면에서 나갈 때 서서히 사라지기)
    if (sectionRefs[sectionRefs.length - 1].current) {
      ScrollTrigger.create({
        trigger: sectionRefs[sectionRefs.length - 1].current,
        start: "bottom bottom",
        end: "bottom top",
        scrub: enableAnimation,
        ...scrollTriggerOptions,
        onUpdate: (self) => {
          const progress = Math.max(circleOpacity, 1 - self.progress); // 최소 투명도 유지
          clusters.forEach((cluster) => {
            cluster.style.opacity = progress;
          });
        },
      });
    }

    // 클린업 함수
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      clusters.forEach((cluster) => {
        if (cluster && cluster.parentNode) {
          cluster.parentNode.removeChild(cluster);
        }
      });
    };
  }, [sectionColors, sectionRefs, enableGlow, blurIntensity, circleOpacity, colorIntensity, enableAnimation, scrollContainer, maxCircles, orbitalType]);

  return (
    <Box
      ref={bgRef}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "transparent", // 사이트 배경색이 그대로 드러나도록
        pointerEvents: "none", // 다른 요소들과의 상호작용 방해하지 않음
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export default ScrollGradientBackground; 