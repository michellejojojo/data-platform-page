import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export const LogoTypeUnitSingle = ({
	data,
	width = 144,
	strokeWidth,
	startDelay = 0,
	delay = 0,
	scale = 1,
	pathClassName = "path",
	isReverse = false,
	color = "#002AFF",
	duration = 600,
	isTrigger = true,
	startWithReserve = false,
	ease = d3.easeQuadOut,
}) => {
	const svgRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isFirstCycle, setIsFirstCycle] = useState(true);
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

			if (isTrigger) {
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
	}, [isReverse, isTrigger, isLoaded, startWithReserve, isFirstCycle, delay, startDelay, duration, ease, pathRef, scale]);

	useEffect(() => {
		if (isLoaded && pathRef.current) {
			d3.select(pathRef.current).attr("stroke", color);
		}
	}, [color, isLoaded, pathRef]);

	return <svg ref={svgRef} />;
};
