import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

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

function ParticlePathAnimator({
	data, // SVG path data string
	width = 144, // SVG viewbox width (unscaled design width)
	strokeWidth = 10, // This will now only be used for particle spread calculation if needed
	startDelay = 0,
	scale = 1, // Overall scale factor for the SVG element
	color1 = "#002AFF", // 기본 파티클 색상1
	color2 = "#00AAFF", // 기본 파티클 색상2
	duration = 2000, // This is now reference duration for referencePathLength
	referencePathLength = 500, // New prop: Path length for which 'duration' applies directly
	minNormalizedDuration = 200, // New prop: Minimum animation duration
	isTrigger = true,
	ease = d3.easeLinear,
	particleFadeInDuration = 500, // New prop for fade-in duration, defaults to 500ms
	particleType = PARTICLE_TYPES.CIRCLE,
	particleNum = 10,
	particleSize = 3, // Particle size in unscaled viewBox coordinates
	particleOpacity = 0.8,
}) {
	const svgRef = useRef(null);
	const pathNodeRef = useRef(null); // For invisible path calculations

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
		if (!isTrigger || !data || !pathTotalLength || !svgRef.current) return;

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

		// Calculate normalized duration
		let calculatedDuration = duration; // Start with the passed duration as a base
		if (pathTotalLength > 0 && referencePathLength > 0) {
			calculatedDuration = (pathTotalLength / referencePathLength) * duration;
		}
		const actualAnimationDuration = Math.max(
			minNormalizedDuration,
			calculatedDuration
		);

		// Group for particles - rendered after debug path (on top)
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
			// Set initial opacity to 0 for fade-in effect
			particle.attr("fill", particleColor).attr("opacity", 0);
			particle.attr("transform", `translate(${initialX}, ${initialY})`);
			return particle;
		}

		function animateParticle(particle, particleIndex) {
			if (!particle || pathTotalLength === 0) {
				// Do not animate if path has no length
				if (particle) particle.remove(); // remove particle if it can't be animated
				return;
			}

			// 각 파티클의 최종 투명도를 0.5와 1.0 사이에서 랜덤하게 설정
			const actualFinalOpacity = Math.random() * 0.5 + 0.5; // 결과 범위: [0.5, 1.0)

			// Use actualAnimationDuration for delay calculation
			const individualStartDelay =
				(actualAnimationDuration / particleNum) * particleIndex * 2;
			const randomOffset = particleOffsets[particleIndex];

			// Fade-in transition
			particle
				.transition("fade-in") // Named transition
				.delay(individualStartDelay)
				// Use actualAnimationDuration for fade-in max duration
				.duration(Math.min(particleFadeInDuration, actualAnimationDuration)) // Fade-in should not exceed total duration
				.ease(d3.easeLinear) // Linear easing for fade
				.attr("opacity", actualFinalOpacity) // Target opacity를 랜덤 값으로 변경
				.end() // Wait for fade-in to complete before starting path animation or to chain
				.then(() => {
					// Path movement transition (starts after fade-in or simultaneously if not chained with .end().then())
					// If chaining, ensure the path animation starts *after* fade-in
					// If not chaining strictly, the delay should still apply from individualStartDelay
					particle
						.transition("path-movement") // Named transition
						.delay(0) // Starts immediately after fade-in completes
						// Use actualAnimationDuration for path movement
						.duration(actualAnimationDuration) // Total duration for path movement
						.ease(ease) // Easing for path movement
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

			// If particleFadeInDuration is 0 or not set, set opacity directly before movement for old behavior
			if (!particleFadeInDuration || particleFadeInDuration <= 0) {
				particle.attr("opacity", actualFinalOpacity); // 여기도 랜덤 값으로 변경
			}
		}

		if (pathTotalLength > 0) {
			// Only create particles if path has length
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
		color1, // 변경된 prop
		color2, // 변경된 prop
		duration,
		referencePathLength,
		minNormalizedDuration,
		isTrigger,
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
			ref={svgRef}
			width={width * scale}
			height={144 * scale}
			viewBox={`0 0 ${width} 144`}
			style={{
				display: "block", // SVG will use display block by default
				transformOrigin: "0 0", // If additional scaling is needed
				pointerEvents: "none", // Don't intercept mouse events, allow click-through
				overflow: "visible", // Allow overflow for particles
			}}
		/>
	);
}

export default React.memo(ParticlePathAnimator);
