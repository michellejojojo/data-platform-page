import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export const LogoTypeUnitPartialLoop = ({
	data,
	width = 144,
	strokeWidth,
	startDelay = 0,
	delay = 0,
	scale = 1,
	pathClassName = "path",
	color = "#002AFF",
	loopDuration = 2000,
	visiblePercent = 80, // 경로의 80%만 보이도록 설정
	isTrigger = true,
	ease = d3.easeQuadOut,
}) => {
	const svgRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const pathRef = useRef(null);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();
		svg.attr("width", width * scale).attr("height", 144 * scale);

		const gOriginalPath = svg.append("g").attr("class", `g_original_${pathClassName}`).attr("transform", `translate(0,0) scale(${scale})`);

		pathRef.current = gOriginalPath.append("path")
			.attr("class", `path_original_${pathClassName}`)
			.attr("d", data)
			.attr("fill", "none")
			.attr("stroke", color)
			.attr("stroke-width", strokeWidth)
			.node();

		setIsLoaded(true);
	}, [
		data, width, scale, pathClassName, strokeWidth, color
	]);

	useEffect(() => {
		if (isLoaded && pathRef.current && isTrigger) {
			const pathElement = d3.select(pathRef.current);
			const length = pathRef.current.getTotalLength();
			
			// 보여질 길이 (기본 80%)
			const visibleLength = (length * visiblePercent) / 100;
			
			// 초기 설정
			pathElement
				.attr("stroke-dasharray", `${visibleLength} ${length}`)
				.attr("stroke-dashoffset", 0);
				
			// 루프 애니메이션 실행
			function animateLoop() {
				pathElement
					.transition()
					.duration(loopDuration)
					.ease(d3.easeLinear)
					.attr("stroke-dashoffset", -length)
					.on("end", () => {
						// 처음 위치로 돌아가서 다시 시작 (깜빡임 없이)
						pathElement
							.attr("stroke-dashoffset", 0)
							.call(() => animateLoop());
					});
			}
			
			// 초기 지연 시간 후 애니메이션 시작
			setTimeout(() => {
				animateLoop();
			}, startDelay + delay);
		}
	}, [isTrigger, isLoaded, visiblePercent, delay, startDelay, loopDuration, ease]);

	useEffect(() => {
		if (isLoaded && pathRef.current) {
			d3.select(pathRef.current).attr("stroke", color);
		}
	}, [color, isLoaded]);

	return <svg ref={svgRef} />;
};