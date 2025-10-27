import React from 'react';
import ParticlePathAnimator from "./ParticlePathAnimator";
import {
	path_D_reverse,
	path_a,
	path_t,
	path_r,
	path_i,
	path_v,
	path_e,
	path_g,
	path_n,
	path_s,
	path_o,
	path_u_2,
	path_o_filled,
	path_u_serif,
	path_B_geometric,
	path_L,
} from "../../../data/logoTypePathData";

// Helper function to create particle components to reduce redundancy
const createParticleComponent = (defaultPathData, defaultWidth, defaultStrokeWidth) => {
  return ({
    data = defaultPathData,
    width = defaultWidth,
    strokeWidth = defaultStrokeWidth, // Use the passed defaultStrokeWidth
    startDelay = 0,
    scale = 1,
    color = '#002AFF',
    duration = 500, // Default duration for particle animation
    isTrigger = true,
    ease, // Will use ParticlePathAnimator's default if not provided
    particleType,
    particleNum,
    particleSize,
    particleOpacity,
  }) => {
    return (
      <ParticlePathAnimator
        data={data}
        width={width}
        strokeWidth={strokeWidth} // Pass it to ParticlePathAnimator
        startDelay={startDelay}
        scale={scale}
        color={color}
        duration={duration}
        isTrigger={isTrigger}
        ease={ease}
        particleType={particleType}
        particleNum={particleNum}
        particleSize={particleSize}
        particleOpacity={particleOpacity}
      />
    );
  };
};

export const D_Particle = createParticleComponent(path_D_reverse, 144, 72);
export const A_Particle = createParticleComponent(path_a, 120, 48); // Adjusted width based on 'a' visual
export const T_Particle = createParticleComponent(path_t, 96, 48);
export const TS_Particle = createParticleComponent(path_t, 80, 48); // path_t is used, width as in UnitSet
export const R_Particle = createParticleComponent(path_r, 80, 48);
export const I_Particle = createParticleComponent(path_i, 48, 48);
export const V_Particle = createParticleComponent(path_v, 144, 44);
export const E_Particle = createParticleComponent(path_e, 144, 40);
export const G_Particle = createParticleComponent(path_g, 144, 40);
export const N_Particle = createParticleComponent(path_n, 144, 56);
export const S_Particle = createParticleComponent(path_s, 144, 48);
export const O_Particle = createParticleComponent(path_o, 144, 48);
export const O2_Particle = createParticleComponent(path_o_filled, 144, 72);
export const U_Particle = createParticleComponent(path_u_serif, 144, 48);
export const U2_Particle = createParticleComponent(path_u_2, 144, 48);
export const B_Particle = createParticleComponent(path_B_geometric, 140, 36);
export const L_Particle = createParticleComponent(path_L, 120, 48);
