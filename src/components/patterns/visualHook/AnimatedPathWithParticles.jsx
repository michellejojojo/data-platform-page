import React from "react";
import useIsInView from "../../../hooks/useIsInView";
import ParticleGeneratePath from "./ParticleGeneratePath";
import AnimatedPath from "./AnimatedPath";

/**
 * AnimatedPathWithParticles 컴포넌트
 * SVG path가 그려지면서 동시에 파티클 효과도 함께 나타나는 컴포넌트입니다.
 * AnimatedPath와 ParticleGeneratePath를 결합한 효과를 제공합니다.
 *
 * Props:
 * @param {string} data - SVG path data (d 속성값) [Required]
 * @param {number} width - SVG 너비 [Optional, 기본값: 144]
 * @param {number} strokeWidth - 선의 두께 및 파티클 분산 범위 [Optional, 기본값: 44]
 * @param {number} startDelay - 애니메이션 시작 지연 시간(ms) [Optional, 기본값: 0]
 * @param {number} scale - 전체 크기 비율 [Optional, 기본값: 1]
 * @param {string} triggerMode - 트리거 방식 ('manual' | 'viewport') [Optional, 기본값: 'manual']
 * @param {boolean} isTrigger - 수동 트리거 활성화 여부 (triggerMode='manual'일 때) [Optional, 기본값: true]
 * @param {string} pathColor - path 선의 색상 [Optional, 기본값: '#FFFFFF']
 * @param {string} particleColor1 - 파티클 색상1 [Optional, 기본값: '#FFFFFF']
 * @param {string} particleColor2 - 파티클 색상2 [Optional, 기본값: '#FFFFFF']
 * @param {number} pathDuration - path 그리기 애니메이션 지속 시간(ms) [Optional, 기본값: 600]
 * @param {number} particleDuration - 파티클 애니메이션 지속 시간(ms) [Optional, 기본값: 2000]
 * @param {number} particleNum - 파티클 개수 [Optional, 기본값: 50]
 * @param {number} particleSize - 파티클 크기 [Optional, 기본값: 4]
 * @param {number} particleOpacity - 파티클 투명도 [Optional, 기본값: 0.8]
 * @param {string} particleType - 파티클 형태 [Optional, 기본값: 'circle']
 * @param {number} particleFadeInDuration - 파티클 페이드인 시간(ms) [Optional, 기본값: 500]
 * @param {number} particleStartDelay - 파티클 시작 지연 시간(ms) [Optional, 기본값: 300]
 * @param {boolean} startWithReserve - 숨겨진 상태로 시작할지 여부 [Optional, 기본값: false]
 * @param {function} pathEase - path 애니메이션 easing 함수 [Optional, 기본값: d3.easeQuadOut]
 * @param {function} particleEase - 파티클 애니메이션 easing 함수 [Optional, 기본값: d3.easeLinear]
 * @param {object} viewportOptions - 뷰포트 감지 옵션 (triggerMode='viewport'일 때) [Optional]
 *
 * Example usage:
 * <AnimatedPathWithParticles
 *   data={path_v}
 *   pathColor="#FFFFFF"
 *   particleColor1="#FFFFFF"
 *   particleColor2="#FFFFFF"
 *   triggerMode="viewport"
 * />
 */
function AnimatedPathWithParticles({
	data,
	width = 144,
	strokeWidth = 44,
	startDelay = 0,
	scale = 1,
	triggerMode = "manual",
	isTrigger = true,
	pathColor = "#FFFFFF",
	particleColor1 = "#FFFFFF",
	particleColor2 = "#FFFFFF",
	pathDuration = 600,
	particleDuration = 2000,
	particleNum = 50,
	particleSize = 4,
	particleOpacity = 0.8,
	particleType = "circle",
	particleFadeInDuration = 500,
	particleStartDelay = 300,
	startWithReserve = false,
	pathEase,
	particleEase,
	viewportOptions = {}
}) {
	// 뷰포트 감지 훅
	const [viewportRef, isInView] = useIsInView({
		threshold: 0.3,
		triggerOnce: true,
		...viewportOptions
	});
	
	// 실제 트리거 상태 결정
	const shouldTrigger = triggerMode === 'viewport' ? isInView : isTrigger;

	return (
		<div
			ref={(node) => {
				if (triggerMode === 'viewport' && viewportRef) {
					viewportRef.current = node;
				}
			}}
			style={{
				width: width * scale,
				height: 144 * scale,
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
			}}
		>
			{/* Path 그리기 */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
				}}
			>
				<AnimatedPath
					data={data}
					width={width}
					strokeWidth={strokeWidth}
					startDelay={startDelay}
					scale={scale}
					triggerMode={triggerMode}
					isTrigger={shouldTrigger}
					color={pathColor}
					duration={pathDuration}
					startWithReserve={startWithReserve}
					ease={pathEase}
					viewportOptions={viewportOptions}
				/>
			</div>
			
			{/* 파티클 효과 */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
				}}
			>
				<ParticleGeneratePath
					data={data}
					width={width}
					strokeWidth={strokeWidth}
					startDelay={startDelay + particleStartDelay}
					scale={scale}
					triggerMode={triggerMode}
					isTrigger={shouldTrigger}
					color1={particleColor1}
					color2={particleColor2}
					duration={particleDuration}
					particleNum={particleNum}
					particleSize={particleSize}
					particleOpacity={particleOpacity}
					particleType={particleType}
					particleFadeInDuration={particleFadeInDuration}
					ease={particleEase}
					viewportOptions={viewportOptions}
				/>
			</div>
		</div>
	);
}

export default React.memo(AnimatedPathWithParticles); 