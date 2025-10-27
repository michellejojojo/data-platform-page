import React from 'react';
import { Box } from '@mui/material';
import ParticlePathAnimator from './ParticlePathAnimator';
import * as pathData from '../../../data/logoTypePathData';
import * as UnitSet from './UnitSet'; // Import all UnitSet components

const createAnimatedUnit = (
  unitName, // e.g., "V", "I", "B", "E"
  // basePathData, baseStrokeWidth, baseWidth are primarily for ParticlePathAnimator
  // and should align with what the UnitSet component internally uses.
  unitConfig // Object: { path: pathData.path_v, stroke: 44, width: 144 }
) => {
  const {
    // Default duration for the UnitSet drawing animation
    defaultUnitSetDrawDuration = 600, 
    // Default duration for particle animation (can be normalized inside ParticlePathAnimator)
    defaultParticleAnimDuration = 3600, 
    defaultParticleNum = 50, 
    defaultParticleSize = 4,
    defaultUnitSetPathColor = 'rgba(255, 255, 255, 1)', 
  } = {}; // Options can be passed here if needed in the future

  const SpecificUnitSetComponent = UnitSet[unitName];

  if (!SpecificUnitSetComponent) {
    console.error(`UnitSet component for ${unitName} not found.`);
    // React.memo로 감싸기 전에 null을 반환하는 컴포넌트를 정의
    const NullComponent = () => null;
    return React.memo(NullComponent);
  }

  // 실제 렌더링 로직을 담당하는 내부 컴포넌트
  const AnimatedUnitComponent = ({
    // Common props
    scale = 1,
    startDelay = 0, 
    isTrigger = true,

    // UnitSet specific appearance & animation props
    unitSetColor = defaultUnitSetPathColor,
    unitSetDuration = defaultUnitSetDrawDuration,
    unitSetEase, 
    unitSetIsReverse, 
    unitSetStartWithReserve, 
    unitSetPathClassName,

    // ParticlePathAnimator specific props
    particleColor1 = 'rgba(0, 0, 255, 0.75)',
    particleColor2 = 'rgba(100, 100, 255, 0.75)',
    particleOpacity = 0.75, 
    particleNum = defaultParticleNum,
    particleSize = defaultParticleSize,
    particleType,
    particleEase, 
    particleAnimDuration = defaultParticleAnimDuration,
    // referencePathLength, minNormalizedDuration for ParticlePathAnimator can be set here or directly if varied per unit

  }) => {
    const particleStartDelay = startDelay;

    // unitConfig는 createAnimatedUnit 호출 시 고정되므로, 
    // scale에 따른 div 크기 계산은 렌더링 시마다 수행됩니다.
    const containerWidth = unitConfig.width * scale;
    // unitConfig에 height가 없다면 기본값(144) 사용 또는 unitConfig에 height 추가 고려
    const containerHeight = (unitConfig.height || 144) * scale; 

    return (
      <div style={{ position: 'relative', width: containerWidth, height: containerHeight, overflow: 'hidden' }}> 
        <SpecificUnitSetComponent
          // UnitSet components like V, I, etc., define their own path, width, strokeWidth internally via LogoTypeUnitSingle.
          // We only pass props they are designed to accept externally.
          scale={scale}
          startDelay={startDelay}
          isTrigger={isTrigger}
          color={unitSetColor}
          duration={unitSetDuration}
          ease={unitSetEase}
          isReverse={unitSetIsReverse}
          startWithReserve={unitSetStartWithReserve}
          pathClassName={unitSetPathClassName}
          // Explicitly pass strokeWidth to UnitSet if it's meant to be configurable for the drawing itself
          // For now, assuming UnitSet components use their predefined strokeWidth for drawing
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <ParticlePathAnimator
            data={unitConfig.path} // Use path from unitConfig
            width={unitConfig.width} // Use width from unitConfig
            strokeWidth={unitConfig.stroke} // Use stroke from unitConfig for particle spread
            startDelay={particleStartDelay} 
            scale={scale}
            color1={particleColor1}
            color2={particleColor2}
            duration={particleAnimDuration} // This will be the referenceDuration for ParticlePathAnimator
            isTrigger={isTrigger}
            ease={particleEase}
            particleType={particleType}
            particleNum={particleNum}
            particleSize={particleSize}
            particleOpacity={particleOpacity}
            // referencePathLength & minNormalizedDuration can be props of ParticlePathAnimator, 
            // or passed here if they need to be configured per AnimatedUnit instance.
          />
        </Box>
      </div>
    );
  };

  // 생성된 내부 컴포넌트를 React.memo로 감싸서 반환
  return React.memo(AnimatedUnitComponent);
};

// Define units, passing the UnitSet component name and its configuration for particles
export const D_Animated = createAnimatedUnit('D', { path: pathData.path_D_reverse, stroke: 72, width: 144, height: 144 });
export const A_Animated = createAnimatedUnit('A', { path: pathData.path_a, stroke: 48, width: 144, height: 144 }); 
export const T_Animated = createAnimatedUnit('T', { path: pathData.path_t, stroke: 48, width: 96, height: 144 });
export const TS_Animated = createAnimatedUnit('TS', { path: pathData.path_t, stroke: 48, width: 80, height: 144 });
export const R_Animated = createAnimatedUnit('R', { path: pathData.path_r, stroke: 48, width: 80, height: 144 });
export const I_Animated = createAnimatedUnit('I', { path: pathData.path_i, stroke: 48, width: 48, height: 144 });
export const V_Animated = createAnimatedUnit('V', { path: pathData.path_v, stroke: 44, width: 144, height: 144 });
export const E_Animated = createAnimatedUnit('E', { path: pathData.path_e, stroke: 40, width: 144, height: 144 });
export const G_Animated = createAnimatedUnit('G', { path: pathData.path_g, stroke: 40, width: 144, height: 144 });
export const N_Animated = createAnimatedUnit('N', { path: pathData.path_n, stroke: 56, width: 144, height: 144 });
export const S_Animated = createAnimatedUnit('S', { path: pathData.path_s, stroke: 48, width: 144, height: 144 });
export const O_Animated = createAnimatedUnit('O', { path: pathData.path_o, stroke: 48, width: 144, height: 144 });
export const O2_Animated = createAnimatedUnit('O2', { path: pathData.path_o_filled, stroke: 72, width: 144, height: 144 });
export const U_Animated = createAnimatedUnit('U', { path: pathData.path_u_serif, stroke: 48, width: 144, height: 144 });
export const U2_Animated = createAnimatedUnit('U2', { path: pathData.path_u_2, stroke: 48, width: 144, height: 144 });
export const B_Animated = createAnimatedUnit('B', { path: pathData.path_B_geometric, stroke: 36, width: 136, height: 144 });
export const L_Animated = createAnimatedUnit('L', { path: pathData.path_L, stroke: 48, width: 120, height: 144 }); 