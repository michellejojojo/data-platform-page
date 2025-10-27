import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import useIsInView from "../../../hooks/useIsInView";

const PARTICLE_TYPES = {
	CIRCLE: "circle",
	SQUARE: "square",
	TRIANGLE: "triangle",
	INVERTED_TRIANGLE: "invertedTriangle",
};

// Helper function to get a point at a certain length along the path
const getPathPoint = (pathNode, length) => pathNode.getPointAtLength(length);

// Helper function to get the angle of the tangent at a certain length along the path
const getPathAngle = (pathNode, length, delta = 0.1) => {
	if (!pathNode) return 0;
	const totalLength = pathNode.getTotalLength();
	if (totalLength === 0) return 0;
	const p1 = getPathPoint(pathNode, Math.max(0, length - delta));
	const p2 = getPathPoint(pathNode, Math.min(totalLength, length + delta));
	return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * ParticleGeneratePath 컴포넌트
 * SVG path를 따라 파티클이 생성되고 움직이는 애니메이션 효과를 제공합니다.
 * AnimatedUnit의 ParticlePathAnimator를 기반으로 만들어진 독립 컴포넌트입니다.
 *
 * Props:
 * @param {string} data - SVG path data (d 속성값) [Required]
 * @param {number} width - SVG 너비 [Optional, 기본값: 144]
 * @param {number} strokeWidth - path 기준 파티클 분산 범위 [Optional, 기본값: 10]
 * @param {number} startDelay - 애니메이션 시작 지연 시간(ms) [Optional, 기본값: 0]
 * @param {number} scale - 전체 크기 비율 [Optional, 기본값: 1]
 * @param {string} triggerMode - 트리거 방식 ('manual' | 'viewport') [Optional, 기본값: 'manual']
 * @param {boolean} isTrigger - 수동 트리거 활성화 여부 (triggerMode='manual'일 때) [Optional, 기본값: true]
 * @param {string} color1 - 파티클 색상1 [Optional, 기본값: '#002AFF']
 * @param {string} color2 - 파티클 색상2 [Optional, 기본값: '#00AAFF']
 * @param {number} duration - 애니메이션 지속 시간(ms) [Optional, 기본값: 2000]
 * @param {number} particleNum - 파티클 개수 [Optional, 기본값: 10]
 * @param {number} particleSize - 파티클 크기 [Optional, 기본값: 3]
 * @param {number} particleOpacity - 파티클 투명도 [Optional, 기본값: 0.8]
 * @param {string} particleType - 파티클 형태 ('circle' | 'square' | 'triangle' | 'invertedTriangle') [Optional, 기본값: 'circle']
 * @param {number} particleFadeInDuration - 파티클 페이드인 시간(ms) [Optional, 기본값: 500]
 * @param {function} ease - d3 easing 함수 [Optional, 기본값: d3.easeLinear]
 * @param {object} viewportOptions - 뷰포트 감지 옵션 (triggerMode='viewport'일 때) [Optional]
 *
 * Example usage:
 * // 수동 트리거 방식
 * <ParticleGeneratePath
 *   data="M10,30 A20,20 0,0,1 50,30 A20,20 0,0,1 90,30"
 *   triggerMode="manual"
 *   isTrigger={true}
 * />
 * 
 * // 뷰포트 감지 방식
 * <ParticleGeneratePath
 *   data="M10,30 A20,20 0,0,1 50,30 A20,20 0,0,1 90,30"
 *   triggerMode="viewport"
 *   viewportOptions={{ threshold: 0.3, triggerOnce: true }}
 * />
 */
function ParticleGeneratePath({
	data,
	width = 144,
	strokeWidth = 10,
	startDelay = 0,
	scale = 1,
	triggerMode = "manual",
	isTrigger = true,
	color1 = "#FFFFFF",
	color2 = "#FFFFFF",
	duration = 2000,
	particleNum = 100,
	particleSize = 3,
	particleOpacity = 0.8,
	particleType = PARTICLE_TYPES.CIRCLE,
	particleFadeInDuration = 500,
	ease = d3.easeLinear,
	viewportOptions = {}
}) {
	const svgRef = useRef(null);
	const pathNodeRef = useRef(null);
	
	// 뷰포트 감지 훅 (triggerMode가 'viewport'일 때만 사용)
	const [viewportRef, isInView] = useIsInView({
		threshold: 0.3,
		triggerOnce: true,
		...viewportOptions
	});
	
	// 실제 트리거 상태 결정
	const shouldTrigger = triggerMode === 'viewport' ? isInView : isTrigger;

	const pathTotalLength = useMemo(() => {
		if (!data) return 0;
		// Create a temporary path element to measure its length
		const tempPath = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		tempPath.setAttribute("d", data);
		return tempPath.getTotalLength();
	}, [data]);

	useEffect(() => {
		if (!shouldTrigger || !data || !pathTotalLength || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove(); // Clear previous elements

		const viewBoxHeight = 144;

		svg
			.attr("width", width * scale)
			.attr("height", viewBoxHeight * scale)
			.attr("viewBox", `0 0 ${width} ${viewBoxHeight}`);

		// Setup invisible path for calculations
		if (
			!pathNodeRef.current ||
			pathNodeRef.current.getAttribute("d") !== data
		) {
			pathNodeRef.current = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"path"
			);
			pathNodeRef.current.setAttribute("d", data);
		}
		const pathNode = pathNodeRef.current;
		if (!pathNode) return; // Should not happen if data is valid

		// Group for particles
		const particleGroup = svg.append("g").attr("class", "particle-group");

		const particleOffsets = Array.from(
			{ length: particleNum },
			() => (Math.random() - 0.5) * strokeWidth
		);

		function createParticle(particleIndex) {
			let particle;
			const randomOffset = particleOffsets[particleIndex];

			// 랜덤 크기 배율 생성 (0.5 ~ 2.0)
			const sizeMultiplier = Math.random() * 1.5 + 0.5;
			const actualParticleSize = particleSize * sizeMultiplier;
			
			// 두 색상 중 랜덤으로 하나 선택
			const particleColor = Math.random() < 0.5 ? color1 : color2;

			const initialPathPoint =
				pathTotalLength > 0 ? getPathPoint(pathNode, 0) : { x: 0, y: 0 };
			if (!initialPathPoint) return null;
			const initialAngle = pathTotalLength > 0 ? getPathAngle(pathNode, 0) : 0;
			const perpendicularAngle = initialAngle + Math.PI / 2;

			const initialX =
				initialPathPoint.x + randomOffset * Math.cos(perpendicularAngle);
			const initialY =
				initialPathPoint.y + randomOffset * Math.sin(perpendicularAngle);

			switch (particleType) {
				case PARTICLE_TYPES.SQUARE: {
					particle = particleGroup
						.append("rect")
						.attr("x", -actualParticleSize / 2)
						.attr("y", -actualParticleSize / 2)
						.attr("width", actualParticleSize)
						.attr("height", actualParticleSize);
					break;
				}
				case PARTICLE_TYPES.TRIANGLE: {
					const halfSize = actualParticleSize / 2;
					const triangleHeight = (Math.sqrt(3) / 2) * actualParticleSize;
					particle = particleGroup
						.append("path")
						.attr(
							"d",
							`M0 ${-((2 / 3) * triangleHeight)} L${-halfSize} ${
								(1 / 3) * triangleHeight
							} L${halfSize} ${(1 / 3) * triangleHeight} Z`
						);
					break;
				}
				case PARTICLE_TYPES.INVERTED_TRIANGLE: {
					const halfSize = actualParticleSize / 2;
					const triangleHeight = (Math.sqrt(3) / 2) * actualParticleSize;
					particle = particleGroup
						.append("path")
						.attr(
							"d",
							`M0 ${(2 / 3) * triangleHeight} L${-halfSize} ${-(
								(1 / 3) *
								triangleHeight
							)} L${halfSize} ${-((1 / 3) * triangleHeight)} Z`
						);
					break;
				}
				case PARTICLE_TYPES.CIRCLE:
				default: {
					particle = particleGroup
						.append("circle")
						.attr("cx", 0)
						.attr("cy", 0)
						.attr("r", actualParticleSize / 2);
					break;
				}
			}
			if (!particle) return null;
			
			particle.attr("fill", particleColor).attr("opacity", 0);
			particle.attr("transform", `translate(${initialX}, ${initialY})`);
			return particle;
		}

		function animateParticle(particle, particleIndex) {
			if (!particle || pathTotalLength === 0) {
				if (particle) particle.remove();
				return;
			}

			// 각 파티클의 최종 투명도를 0.5와 1.0 사이에서 랜덤하게 설정
			const actualFinalOpacity = (Math.random() * 0.5 + 0.5) * particleOpacity;

			const individualStartDelay = (duration / particleNum) * particleIndex * 2 + startDelay;
			const randomOffset = particleOffsets[particleIndex];

			// Fade-in transition
			particle
				.transition("fade-in")
				.delay(individualStartDelay)
				.duration(Math.min(particleFadeInDuration, duration))
				.ease(d3.easeLinear)
				.attr("opacity", actualFinalOpacity)
				.end()
				.then(() => {
					// Path movement transition
					particle
						.transition("path-movement")
						.delay(0)
						.duration(duration)
						.ease(ease)
						.attrTween("transform", function () {
							return function (t) {
								const currentPathLength = t * pathTotalLength;
								const point = getPathPoint(pathNode, currentPathLength);
								if (!point) return "translate(0,0)";
								const angle = getPathAngle(pathNode, currentPathLength);
								const perpendicularAngle = angle + Math.PI / 2;

								const tx =
									point.x + randomOffset * Math.cos(perpendicularAngle);
								const ty =
									point.y + randomOffset * Math.sin(perpendicularAngle);
								return `translate(${tx}, ${ty})`;
							};
						})
						.on("end", function () {
							d3.select(this).remove();
							const newParticle = createParticle(particleIndex);
							if (newParticle) animateParticle(newParticle, particleIndex);
						});
				})
				.catch(() => {
					/* Handle transition interruption or errors if necessary */
				});

			// If particleFadeInDuration is 0 or not set, set opacity directly
			if (!particleFadeInDuration || particleFadeInDuration <= 0) {
				particle.attr("opacity", actualFinalOpacity);
			}
		}

		if (pathTotalLength > 0) {
			for (let i = 0; i < particleNum; i++) {
				const particle = createParticle(i);
				if (particle) animateParticle(particle, i);
			}
		}

		return () => {
			if (svgRef.current) {
				const svgSelection = d3.select(svgRef.current);
				svgSelection.selectAll("*").remove();
			}
		};
	}, [
		data,
		width,
		strokeWidth,
		startDelay,
		scale,
		color1,
		color2,
		duration,
		shouldTrigger,
		ease,
		particleFadeInDuration,
		particleType,
		particleNum,
		particleSize,
		particleOpacity,
		pathTotalLength,
	]);

	return (
		<svg
			ref={(node) => {
				svgRef.current = node;
				if (triggerMode === 'viewport' && viewportRef) {
					viewportRef.current = node;
				}
			}}
			width={width * scale}
			height={144 * scale}
			viewBox={`0 0 ${width} 144`}
			style={{
				display: "block",
				transformOrigin: "0 0",
				pointerEvents: "none",
				overflow: "visible",
			}}
		/>
	);
}

export default React.memo(ParticleGeneratePath); 