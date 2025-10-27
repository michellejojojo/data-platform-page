import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { gradientPalettes } from "../../../data/gradientPalettes";

/**
 * GradientBox 컴포넌트
 * CSS를 직접 수정하지 않고도 MUI 스타일 체계 내에서 다양한 그라데이션 배경을 만들 수 있도록 지원합니다.
 * Linear, Radial, Conic 타입을 지원하고, 대비 강도(contrast)와 컬러 프리셋(palette)을 조합해 다양한 베리에이션을 생성 가능합니다.
 *
 * Props:
 * 🎨 시각적 정의 우선 Props:
 * @param {string|array} palette - 사용할 팔레트 이름 또는 색상 배열 [Optional, 기본값: 'sunsetGlow']
 * @param {string} type - 그라데이션 타입 (linear, radial, conic) [Optional, 기본값: 'linear']
 * @param {string} contrast - 대비 강도 (ambient, highlight, bigContrast) [Optional, 기본값: 'ambient']
 *        - ambient: 가장 균일한 색상 분포
 *        - highlight: 두 번째 색이 하이라이트처럼 끝에 집중됨
 *        - bigContrast: 두 색의 경계가 강하게 구분됨
 * @param {number} angle - linear 그라데이션의 각도 (0-360) [Optional, 기본값: 45]
 * @param {boolean} animated - 부드러운 애니메이션 적용 여부 [Optional, 기본값: false]
 * @param {number} animationDuration - 애니메이션 지속시간(초) [Optional, 기본값: 8]
 * @param {boolean} noise - 노이즈 텍스처 적용 여부 [Optional, 기본값: false]
 * @param {string} noiseColor - 노이즈 색상 (HEX 또는 RGB) [Optional, 기본값: '#ffffff']
 * @param {number} noiseIntensity - 노이즈 강도 (0.1~1.0) [Optional, 기본값: 0.3]
 * @param {string} noiseType - 노이즈 타입 ('subtle', 'medium', 'strong') [Optional, 기본값: 'subtle']
 *
 * ⚙️ 세부 조정 Props:
 * @param {object} sx - 추가 스타일링을 위한 MUI sx prop [Optional]
 * @param {node} children - 그라데이션 박스 내부에 표시할 컨텐츠 [Optional]
 *
 * Example usage:
 * <GradientBox palette="sunsetGlow" type="linear" contrast="highlight" angle={135} animated={true} noise={true} noiseColor="#000000" noiseType="medium" sx={{ height: 200, borderRadius: 2 }}>
 *   <Typography>보기 좋은 그라데이션</Typography>
 * </GradientBox>
 */
function GradientBox({
	type = "linear",
	palette = "sunsetGlow",
	contrast = "ambient",
	angle = 45,
  animated = false,
  animationDuration = 8,
  noise = false,
  noiseColor = "#ffffff",
  noiseIntensity = 0.3,
  noiseType = "subtle",
	sx,
	children,
}) {
  // 노이즈 필터 ID 생성 (컴포넌트 인스턴스별로 고유한 ID)
  const noiseFilterId = React.useMemo(
    () => `noise-filter-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // HEX 색상을 RGB로 변환
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // 노이즈 색상을 RGB 값으로 변환
  const getNoiseRgb = () => {
    const rgb = hexToRgb(noiseColor);
    return rgb ? rgb : { r: 255, g: 255, b: 255 }; // 기본값 흰색
  };

  // 노이즈 타입별 설정값
  const getNoiseSettings = () => {
    const settings = {
      subtle: {
        baseFrequency: "0.8",
        numOctaves: "3",
        opacity: 0.6 * noiseIntensity,
        blendMode: "overlay",
      },
      medium: {
        baseFrequency: "1.2",
        numOctaves: "4",
        opacity: 0.8 * noiseIntensity,
        blendMode: "overlay",
      },
      strong: {
        baseFrequency: "1.8",
        numOctaves: "5",
        opacity: 0.1 * noiseIntensity,
        blendMode: "overlay",
      },
    };
    return settings[noiseType] || settings.subtle;
  };

	// 팔레트 색상 배열 가져오기
	const getPaletteColors = () => {
		// 팔레트 이름이 문자열로 전달된 경우 (프리셋 사용)
		if (typeof palette === "string") {
			// gradientPalettes 배열에서 해당 id를 가진 팔레트 찾기
      const found = gradientPalettes.find((item) => item.id === palette);
			return found ? found.colors : ["#f5f5f5", "#e0e0e0"]; // 기본 회색 그라데이션
		}
		// 색상 배열이 직접 전달된 경우
		return Array.isArray(palette) ? palette : ["#f5f5f5", "#e0e0e0"];
	};

  // 두 색상의 중간색 계산
  const blendColors = (color1, color2, ratio = 0.5) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

	// 색상 대비 강도에 따른 색상 분포 설정
	const getColorStops = (colors) => {
		switch (contrast) {
      case "highlight": {
        // 빛 반사 효과: 대부분 첫 번째 색상, 끝에서 나머지 색상들로 강조
        if (colors.length === 2) {
          const midColor = blendColors(colors[0], colors[1], 0.3);
          return `${colors[0]} 0%, ${colors[0]} 60%, ${midColor} 80%, ${colors[1]} 100%`;
        }

        // 3개 이상: 첫 번째 색상이 60%까지 유지, 나머지 색상들이 60%-100% 구간에 압축
        let stops = [`${colors[0]} 0%`, `${colors[0]} 60%`];
        const remainingColors = colors.slice(1);
        const remainingSpace = 40; // 60% ~ 100%

        remainingColors.forEach((color, index) => {
          const percentage =
            60 + (remainingSpace / (remainingColors.length - 1)) * index;
          stops.push(`${color} ${percentage}%`);
        });

        return stops.join(", ");
      }
      case "bigContrast": {
        // 양 극단 집중: 처음 10%, 마지막 90%에 색상들 집중
        if (colors.length === 2) {
          return `${colors[0]} 10%, ${colors[1]} 90%`;
        }

        // 3개 이상: 첫 절반은 0%-10%에, 나머지 절반은 90%-100%에 집중
        const halfPoint = Math.ceil(colors.length / 2);
        let stops = [];

        // 첫 절반 색상들을 0%-10% 구간에 배치
        for (let i = 0; i < halfPoint; i++) {
          const percentage = (10 / (halfPoint - 1)) * i;
          stops.push(`${colors[i]} ${percentage}%`);
        }

        // 나머지 색상들을 90%-100% 구간에 배치
        for (let i = halfPoint; i < colors.length; i++) {
          const percentage =
            90 + (10 / (colors.length - halfPoint - 1)) * (i - halfPoint);
          stops.push(`${colors[i]} ${percentage}%`);
        }

        return stops.join(", ");
      }
			case "ambient":
      default: {
        // 균등한 분포로 자연스러운 그라데이션
        return colors
          .map((color, index) => {
            const percentage = (100 / (colors.length - 1)) * index;
            return `${color} ${percentage}%`;
          })
          .join(", ");
      }
    }
  };

  // conic 그라데이션용 균등 분할 색상 생성 (각도 오프셋 지원)
  const getConicColorStops = (colors, angleOffset = 0) => {
    if (colors.length < 2) return colors.join(", ");

    const totalSegments = colors.length;
    const segmentAngle = 360 / totalSegments;

    let colorStops = [];

    // 각 색상을 균등한 각도로 배치 (오프셋 적용)
    colors.forEach((color, index) => {
      const angle = segmentAngle * index + angleOffset;
      colorStops.push(`${color} ${angle}deg`);
    });

    // 마지막에 첫 번째 색상을 다시 추가하여 원형으로 자연스럽게 연결
    colorStops.push(`${colors[0]} ${360 + angleOffset}deg`);

    return colorStops.join(", ");
  };

  // 타입별 gentle 애니메이션 스타일 생성
  const getAnimationStyles = () => {
    if (!animated) return {};

    const duration = `${animationDuration}s`;

    switch (type) {
      case "linear":
        return {
          backgroundSize: "200% 200%",
          animation: `gradientSlide ${duration} ease-in-out infinite`,
          "@keyframes gradientSlide": {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
        };
      case "radial":
        return {
          animation: `radialPulse ${duration} ease-in-out infinite`,
          "@keyframes radialPulse": {
            "0%, 100%": { 
              backgroundSize: "100% 100%",
              transform: "scale(1)",
            },
            "50%": { 
              backgroundSize: "120% 120%",
              transform: "scale(1.02)",
            },
          },
        };
      case "conic": {
        const colors = getPaletteColors();
        return {
          animation: `conicRotate ${duration} ease-in-out infinite`,
          "@keyframes conicRotate": {
            "0%": { 
              backgroundImage: `conic-gradient(from ${angle}deg, ${getConicColorStops(colors, 0)})`,
            },
            "25%": { 
              backgroundImage: `conic-gradient(from ${angle}deg, ${getConicColorStops(colors, 5)})`,
            },
            "50%": { 
              backgroundImage: `conic-gradient(from ${angle}deg, ${getConicColorStops(colors, 10)})`,
            },
            "75%": { 
              backgroundImage: `conic-gradient(from ${angle}deg, ${getConicColorStops(colors, 5)})`,
            },
            "100%": { 
              backgroundImage: `conic-gradient(from ${angle}deg, ${getConicColorStops(colors, 0)})`,
            },
          },
        };
      }
			default:
        return {};
		}
	};

  // 그라데이션 생성 (애니메이션 고려)
	const createGradient = () => {
		const colors = getPaletteColors();
		
		switch (type) {
      case "radial": {
        const radialColorStops = getColorStops(colors);
        return `radial-gradient(circle, ${radialColorStops})`;
      }
      case "conic": {
        const conicColorStops = getConicColorStops(colors);
        return `conic-gradient(from ${angle}deg, ${conicColorStops})`;
      }
			case "linear":
      default: {
        const linearColorStops = getColorStops(colors);
        return `linear-gradient(${angle}deg, ${linearColorStops})`;
		}
    }
  };

  // 노이즈 SVG 필터 생성
  const createNoiseFilter = () => {
    if (!noise) return null;
    
    const settings = getNoiseSettings();
    const rgb = getNoiseRgb();
    
    return (
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={noiseFilterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={settings.baseFrequency}
              numOctaves={settings.numOctaves}
              stitchTiles="stitch"
              result="turbulence"
            />
            {/* 1단계: 그레이스케일로 변환하여 RGB 채널 동기화 */}
            <feColorMatrix 
              in="turbulence" 
              type="saturate" 
              values="0" 
              result="grayscale"
            />
            {/* 2단계: 0.5 기준으로 완전 투명(0) 또는 완전 불투명(1)만 */}
            <feComponentTransfer in="grayscale" result="binaryMask">
              <feFuncA type="discrete" tableValues="0 1"/>
            </feComponentTransfer>
            {/* 3단계: 원하는 색상으로 칠하기 */}
            <feFlood 
              flood-color={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              flood-opacity="1" 
              result="colorFill"
            />
            {/* 4단계: 마스크 적용하여 노이즈 패턴에만 색상 적용 */}
            <feComposite 
              in="colorFill" 
              in2="binaryMask" 
              operator="in" 
              result="finalNoise"
            />
          </filter>
        </defs>
      </svg>
    );
	};

	return (
    <>
      {createNoiseFilter()}
		<Box
			sx={{
				background: createGradient(),
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				color: "#fff",
				textShadow: "0 1px 2px rgba(0,0,0,0.2)",
				minHeight: 50,
				p: 2,
          position: "relative",
          ...getAnimationStyles(),
				...sx,
			}}
		>
        {noise && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              filter: `url(#${noiseFilterId}) contrast(300%) brightness(150%)`,
              opacity: getNoiseSettings().opacity,
              mixBlendMode: getNoiseSettings().blendMode,
              pointerEvents: 'none',
              background: noiseColor,
            }}
          />
        )}
        <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
		</Box>
    </>
	);
}

GradientBox.propTypes = {
	type: PropTypes.oneOf(["linear", "radial", "conic"]),
  palette: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	contrast: PropTypes.oneOf(["ambient", "highlight", "bigContrast"]),
	angle: PropTypes.number,
  animated: PropTypes.bool,
  animationDuration: PropTypes.number,
  noise: PropTypes.bool,
  noiseColor: PropTypes.string,
  noiseIntensity: PropTypes.number,
  noiseType: PropTypes.oneOf(["subtle", "medium", "strong"]),
	sx: PropTypes.object,
  children: PropTypes.node,
};

export default GradientBox;
