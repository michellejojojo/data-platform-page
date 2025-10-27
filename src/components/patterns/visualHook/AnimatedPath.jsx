import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";
import useIsInView from "../../../hooks/useIsInView";

/**
 * AnimatedPath 컴포넌트
 * SVG path를 stroke-dasharray 애니메이션으로 그려나가는 효과를 제공합니다.
 * d3.js를 활용하여 부드러운 path drawing 애니메이션을 구현합니다.
 *
 * Props:
 * @param {string} data - SVG path data (d 속성값) [Required]
 * @param {number} width - SVG 너비 [Optional, 기본값: 144]
 * @param {number} strokeWidth - 선의 두께 [Optional, 기본값: 2]
 * @param {number} startDelay - 애니메이션 시작 지연 시간(ms) [Optional, 기본값: 0]
 * @param {number} delay - 추가 지연 시간(ms) [Optional, 기본값: 0]
 * @param {number} scale - 전체 크기 비율 [Optional, 기본값: 1]
 * @param {string} pathClassName - path 요소의 클래스명 [Optional, 기본값: 'path']
 * @param {boolean} isReverse - 역방향 애니메이션 여부 [Optional, 기본값: false]
 * @param {string} color - path 색상 [Optional, 기본값: '#002AFF']
 * @param {number} duration - 애니메이션 지속 시간(ms) [Optional, 기본값: 600]
 * @param {string} triggerMode - 트리거 방식 ('manual' | 'viewport') [Optional, 기본값: 'manual']
 * @param {boolean} isTrigger - 수동 트리거 활성화 여부 (triggerMode='manual'일 때) [Optional, 기본값: true]
 * @param {boolean} startWithReserve - 숨겨진 상태로 시작할지 여부 [Optional, 기본값: false]
 * @param {function} ease - d3 easing 함수 [Optional, 기본값: d3.easeQuadOut]
 * @param {object} viewportOptions - 뷰포트 감지 옵션 (triggerMode='viewport'일 때) [Optional]
 *
 * Example usage:
 * // 수동 트리거 방식
 * <AnimatedPath
 *   data="M10,30 A20,20 0,0,1 50,30 A20,20 0,0,1 90,30"
 *   triggerMode="manual"
 *   isTrigger={true}
 * />
 * 
 * // 뷰포트 감지 방식
 * <AnimatedPath
 *   data="M10,30 A20,20 0,0,1 50,30 A20,20 0,0,1 90,30"
 *   triggerMode="viewport"
 *   viewportOptions={{ threshold: 0.3, triggerOnce: true }}
 * />
 */
export const AnimatedPath = ({
	data,
	width = 144,
	strokeWidth = 2,
	startDelay = 0,
	delay = 0,
	scale = 1,
	pathClassName = "path",
	isReverse = false,
	color = "#002AFF",
	duration = 600,
	triggerMode = "manual",
	isTrigger = true,
	startWithReserve = false,
	ease = d3.easeQuadOut,
	viewportOptions = {}
}) => {
	const svgRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isFirstCycle, setIsFirstCycle] = useState(true);
	const pathRef = useRef(null);
	
	// 뷰포트 감지 훅 (triggerMode가 'viewport'일 때만 사용)
	const [viewportRef, isInView] = useIsInView({
		threshold: 0.3,
		triggerOnce: true,
		...viewportOptions
	});
	
	// 실제 트리거 상태 결정
	const shouldTrigger = triggerMode === 'viewport' ? isInView : isTrigger;

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

		const pathNode = pathRef.current;
		const pathElement = d3.select(pathNode);
		const length = pathNode.getTotalLength();

		if (startWithReserve) {
			pathElement.attr("stroke-dasharray", `${length} ${length}`).attr("stroke-dashoffset", length);
		} else {
			pathElement.attr("stroke-dasharray", `${length} ${length}`).attr("stroke-dashoffset", 0);
		}

		setIsLoaded(true);
	}, [
		data, width, scale, pathClassName, strokeWidth, color, startWithReserve
	]);

	useEffect(() => {
		if (isLoaded && pathRef.current) {
			const pathElement = d3.select(pathRef.current);
			const length = pathRef.current.getTotalLength();
			pathElement.interrupt();

			if (shouldTrigger) {
				if (!isReverse) {
					pathElement.attr("stroke-dasharray", `${length} ${length}`).attr("stroke-dashoffset", length)
						.transition().delay(delay + startDelay).ease(ease).duration(duration).attr("stroke-dashoffset", 0);
				} else {
					if (!(isFirstCycle && startWithReserve)) {
						pathElement.attr("stroke-dasharray", `${length} ${length}`).attr("stroke-dashoffset", 0)
							.transition().delay(0).ease(ease).duration(duration).attr("stroke-dashoffset", length);
					}
				}
				if(isFirstCycle) setIsFirstCycle(false);
			} else {
				pathElement.attr("stroke-dashoffset", startWithReserve ? length : 0);
			}
		}
	}, [isReverse, shouldTrigger, isLoaded, startWithReserve, isFirstCycle, delay, startDelay, duration, ease, pathRef, scale]);

	useEffect(() => {
		if (isLoaded && pathRef.current) {
			d3.select(pathRef.current).attr("stroke", color);
		}
	}, [color, isLoaded, pathRef]);

	return (
		<svg 
			ref={(node) => {
				svgRef.current = node;
				if (triggerMode === 'viewport' && viewportRef) {
					viewportRef.current = node;
				}
			}} 
		/>
	);
};

export default AnimatedPath; 