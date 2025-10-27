import React from 'react';
import { PathFollowingGradientDot } from './PathFollowingGradientDot';
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
} from '../../../data/logoTypePathData';

// PathFollowingGradientDot에 전달될 기본 props 중 UnitSet.jsx의 값과 관계 없는 것들
const defaultSharedAnimatorProps = {
  scale: 1, // 이 값은 각 유닛 사용 시 외부에서 주로 설정됨
  pathStrokeWidth: 1.5, // 배경 경로 두께 기본값 (UnitSet.jsx의 strokeWidth와는 별개)
  pathColor: 'rgba(100, 100, 100, 0.5)',
  dotColor1: 'rgba(255, 255, 255, 1)',
  dotColor2: 'rgba(0, 255, 255, 1)',
  duration: 2000,
  loop: true,
  isTrigger: true,
  startDelay: 0,
  height: 144, // 기본 높이값을 설정 (LogoTypeUnitSingle의 기본 height와 유사)
};

// 각 유닛은 UnitSet.jsx와 동일한 width, strokeWidth(dot 지름), 그리고 pathData를 가짐
// 그 외 애니메이션/색상 관련 props는 defaultSharedAnimatorProps를 따르거나 외부에서 오버라이드
const getUnitProps = (unitSpecificProps, externalProps) => ({
  ...defaultSharedAnimatorProps, // 공통 기본값
  ...unitSpecificProps,       // 각 유닛의 고정된 pathData, width, strokeWidth, height
  ...externalProps,           // 외부에서 전달된 props (scale, 색상, 시간 등 오버라이드 가능)
});

// UnitSet.jsx의 D: strokeWidth={72}, width (기본값 144)
export const D_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_D_reverse, width: 144, strokeWidth: 72 }, props)} />
);

// UnitSet.jsx의 A: strokeWidth={48}, width (기본값 144)
export const A_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_a, width: 144, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 T: strokeWidth={48}, width={96}
export const T_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_t, width: 96, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 TS: strokeWidth={48}, width={80}
export const TS_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_t, width: 80, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 R: strokeWidth={48}, width={80}
export const R_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_r, width: 80, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 I: strokeWidth={48}, width={48}
export const I_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_i, width: 48, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 V: strokeWidth={44}, width={144}
export const V_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_v, width: 144, strokeWidth: 44 }, props)} />
);

// UnitSet.jsx의 E: strokeWidth={40}, width={144}
export const E_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_e, width: 144, strokeWidth: 40 }, props)} />
);

// UnitSet.jsx의 G: strokeWidth={40}, width={144}
export const G_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_g, width: 144, strokeWidth: 40 }, props)} />
);

// UnitSet.jsx의 N: strokeWidth={56}, width={144}
export const N_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_n, width: 144, strokeWidth: 56 }, props)} />
);

// UnitSet.jsx의 S: strokeWidth={48}, width={144}
export const S_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_s, width: 144, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 O: strokeWidth={48}, width={144}
export const O_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_o, width: 144, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 O2: strokeWidth={72}, width={144}
export const O2_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_o_filled, width: 144, strokeWidth: 72 }, props)} />
);

// UnitSet.jsx의 U: strokeWidth={48}, width={144} (path_u_serif 기준)
export const U_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_u_serif, width: 144, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 U2: strokeWidth={48}, width={144} (path_u_2 기준)
export const U2_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_u_2, width: 144, strokeWidth: 48 }, props)} />
);

// UnitSet.jsx의 B: strokeWidth={36}, width={140}
export const B_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_B_geometric, width: 140, strokeWidth: 36 }, props)} />
);

// UnitSet.jsx의 L: strokeWidth={48}, width={120}
export const L_GradientDot = (props) => (
  <PathFollowingGradientDot {...getUnitProps({ pathData: path_L, width: 120, strokeWidth: 48 }, props)} />
); 