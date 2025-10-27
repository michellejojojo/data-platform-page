import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box } from "@mui/material";

/**
 * GridBG Component
 * Renders a responsive grid of squares as a background.
 *
 * Props:
 * @param {number} rows - Number of rows in the grid. [Optional, 기본값: 10]
 * @param {number} cols - Number of columns in the grid. [Optional, 기본값: 10]
 * @param {string} color1 - First color for grid squares (left-top). [Optional, 기본값: 'rgba(255, 255, 255, 0.2)']
 * @param {string} color2 - Second color for grid squares (right-bottom). [Optional, 기본값: 'rgba(255, 255, 255, 0.2)']
 * @param {string} dotColor - Legacy color of all grid squares (for backward compatibility). [Optional]
 * @param {number} squareSize - Size of the square. [Optional, 기본값: 4]
 * @param {number} cornerSquareSize - Size of the corner squares. [Optional, 기본값: 8]
 * @param {number} transitionDelayMaxMs - Maximum delay time for square appearance. [Optional, 기본값: 1000]
 * @param {number} transitionDurationMs - Duration of square appearance animation. [Optional, 기본값: 500]
 * @param {boolean} triggerAnimation - Trigger for appearance animation. [Optional, 기본값: true]
 * @param {object} sx - Custom styles for the component. [Optional, 기본값: {}]
 *
 * Example usage:
 * <GridBG rows={15} cols={20} color1="#ff0000" color2="#0000ff" />
 */
const GridBG = ({
	rows: numRows = 10,
	cols: numCols = 10,
	color1 = "rgba(128, 128, 128, 0.5)",
	color2 = "rgba(128, 128, 128, 0.5)",
	dotColor,
	squareSize = 4,
	transitionDelayMaxMs = 1000,
	transitionDurationMs = 500,
	triggerAnimation = true,
	sx = {},
}) => {
	const svgRef = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const timeoutsRef = useRef([]);

	// 하위 호환성을 위해 dotColor가 제공되면 color1과 color2를 모두 해당 값으로 설정
	const actualColor1 = dotColor || color1;
	const actualColor2 = dotColor || color2;

	// RGB 문자열을 파싱하는 함수 (예: 'rgb(255, 0, 0)' 또는 '#ff0000')
	const parseColor = (color) => {
		// hex 형식 처리 (#RRGGBB, #RGB, #RRGGBBAA)
		if (color.startsWith("#")) {
			let hex = color.slice(1);
			let alpha = 1;
			
			// #RRGGBBAA 형식 처리
			if (hex.length === 8) {
				alpha = parseInt(hex.substring(6, 8), 16) / 255;
				hex = hex.substring(0, 6);
			}
			// #RGB 형식을 #RRGGBB로 변환
			else if (hex.length === 3) {
				hex = hex
					.split("")
					.map((h) => h + h)
					.join("");
			}
			
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);
			return { r, g, b, a: alpha };
		}
		// rgba 형식 처리
		else if (color.startsWith("rgba")) {
			const rgba = color.match(
				/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/
			);
			if (rgba) {
				return {
					r: parseInt(rgba[1], 10),
					g: parseInt(rgba[2], 10),
					b: parseInt(rgba[3], 10),
					a: rgba[4] ? parseFloat(rgba[4]) : 1,
				};
			}
		}
		// rgb 형식 처리
		else if (color.startsWith("rgb")) {
			const rgb = color.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (rgb) {
				return {
					r: parseInt(rgb[1], 10),
					g: parseInt(rgb[2], 10),
					b: parseInt(rgb[3], 10),
					a: 1,
				};
			}
		}

		// 기본값 반환
		return { r: 128, g: 128, b: 128, a: 0.2 };
	};

	// 두 색상을 비율에 따라 보간하는 함수
	const interpolateColor = (color1, color2, ratio) => {
		const parsed1 = parseColor(color1);
		const parsed2 = parseColor(color2);

		const r = Math.round(parsed1.r + (parsed2.r - parsed1.r) * ratio);
		const g = Math.round(parsed1.g + (parsed2.g - parsed1.g) * ratio);
		const b = Math.round(parsed1.b + (parsed2.b - parsed1.b) * ratio);
		const a = parsed1.a + (parsed2.a - parsed1.a) * ratio;

		return `rgba(${r}, ${g}, ${b}, ${a})`;
	};

	useEffect(() => {
		const svgElement = svgRef.current;
		if (!svgElement || !svgElement.parentElement) return;

		const resizeObserver = new ResizeObserver((entries) => {
			if (entries && entries.length > 0) {
				const { width, height } = entries[0].contentRect;
				setDimensions({ width, height });
			}
		});

		resizeObserver.observe(svgElement.parentElement);

		return () => {
			if (svgElement && svgElement.parentElement) {
				resizeObserver.unobserve(svgElement.parentElement);
			}
			resizeObserver.disconnect();
			timeoutsRef.current.forEach(clearTimeout);
		};
	}, []);

	const gridPoints = useMemo(() => {
		if (
			dimensions.width === 0 ||
			dimensions.height === 0 ||
			numRows <= 1 ||
			numCols <= 1
		) {
			return [];
		}

		// 그리드에 패딩 적용을 위해 실제 사용할 너비와 높이 계산
		const usableWidth = (dimensions.width * (numCols - 1)) / (numCols + 1);
		const usableHeight = (dimensions.height * (numRows - 1)) / (numRows + 1);

		// 각 셀의 크기 (패딩 포함)
		const cellWidth = usableWidth / (numCols - 1);
		const cellHeight = usableHeight / (numRows - 1);

		// 패딩 크기 (셀 한 칸 만큼)
		const paddingX = cellWidth;
		const paddingY = cellHeight;

		const points = [];

		for (let i = 0; i < numRows; i++) {
			for (let j = 0; j < numCols; j++) {
				// 패딩을 고려한 실제 위치 계산
				const x = paddingX + j * cellWidth;
				const y = paddingY + i * cellHeight;
				const id = `grid-${i}-${j}`;

				// 위치에 따른 색상 보간 비율 계산 (좌상단: 0, 우하단: 1)
				const xRatio = j / (numCols - 1);
				const yRatio = i / (numRows - 1);

				// color1에 1.5배 더 큰 가중치를 적용
				const rawRatio = (xRatio + yRatio) / 2;
				const colorRatio = rawRatio / 1.5; // color1에 1.5배 가중치 적용

				points.push({
					id,
					x,
					y,
					colorRatio,
				});
			}
		}
		return points;
	}, [dimensions, numRows, numCols]);

	useEffect(() => {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];

		if (triggerAnimation && gridPoints.length > 0) {
			// 애니메이션 로직이 있다면 유지하되, 사용하지 않는 visibleGridItems 제거
		}
	}, [gridPoints, triggerAnimation, transitionDelayMaxMs]);

	return (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 0,
				pointerEvents: "none",
				...sx,
			}}
		>
			<svg ref={svgRef} width="100%" height="100%">
				{gridPoints.map((point) => {
					// 위치에 기반한 색상 보간
					const squareColor = interpolateColor(
						actualColor1,
						actualColor2,
						point.colorRatio
					);
					const size = squareSize;
					const halfSize = size / 2;

					return (
						<rect
							key={point.id}
							x={point.x - halfSize}
							y={point.y - halfSize}
							width={size}
							height={size}
							fill={squareColor}
							style={{
								transition: `opacity ${transitionDurationMs}ms ease-in-out`,
							}}
						/>
					);
				})}
			</svg>
		</Box>
	);
};

export default GridBG;
