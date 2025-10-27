import React, {
	useRef,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

/**
 * MeshGradientBox 컴포넌트
 * canvas를 사용하여 부드러운 메시 그라디언트 배경을 렌더링합니다.
 * 시각적 품질과 유연한 제어를 강화한 버전입니다.
 *
 * Props:
 * 🎨 시각적 정의 우선 Props:
 * @param {string[]} colors - 그라디언트를 구성할 색상 HEX 배열 [Required]
 * @param {number} pointCount - 그라디언트 메시를 구성할 포인트 수 [Optional, 기본값: 8]
 * @param {number} randomness - 포인트 배치의 랜덤성 (0=균일 그리드, 1=완전 랜덤) [Optional, 기본값: 0.3]
 * @param {string} distribution - 포인트 분포 전략 ('grid', 'noise', 'centered') [Optional, 기본값: 'grid']
 * @param {string} colorStrategy - 색상 분배 전략 ('cycle', 'random', 'gradientMap') [Optional, 기본값: 'cycle']
 * 
 * ⚙️ 세부 조정 Props:
 * @param {boolean} animated - 포인트 위치의 애니메이션 적용 여부 [Optional, 기본값: false]
 * @param {number} animationSpeed - 위치 애니메이션 속도 배율 (0.1~3.0) [Optional, 기본값: 1.0]
 * @param {boolean} animateColorShift - 색상 hue 흐름 애니메이션 [Optional, 기본값: false]
 * @param {number} colorShiftSpeed - 색상 변화 애니메이션 속도 배율 (0.1~2.0) [Optional, 기본값: 0.1]
 * @param {string} blendMode - 포인트 보간 방식 ('radial', 'linear') [Optional, 기본값: 'radial']
 * @param {number} falloff - 거리 감쇠 함수의 강도 (0.5~4.0) [Optional, 기본값: 1.5]
 * @param {number} resolution - 그라디언트 렌더링 해상도 비율 (0.1~1.0) [Optional, 기본값: 0.4]
 * @param {number} minBlock - 픽셀 블록의 최소 크기 [Optional, 기본값: 3]
 * @param {number} maxFPS - 애니메이션 최대 FPS [Optional, 기본값: 30]
 * @param {boolean} showPoints - 포인트 위치를 시각적으로 표시할지 여부 [Optional, 기본값: false]
 * @param {number} pointSize - 시각적으로 표시될 포인트의 크기 [Optional, 기본값: 4]
 * @param {object} densityBias - 특정 방향으로 밀도 집중 { x: number, y: number } [Optional]
 * 
 * 🔊 노이즈 관련 Props:
 * @param {boolean} noiseEnabled - 노이즈 효과 활성화 여부 [Optional, 기본값: false]
 * @param {number} noiseIntensity - 노이즈 강도 (0.0~1.0) [Optional, 기본값: 0.05]
 * @param {number} noiseScale - 노이즈 스케일 (작을수록 더 세밀한 노이즈) [Optional, 기본값: 0.0005]
 * 
 * @param {object} sx - 추가 스타일링을 위한 MUI sx prop [Optional]
 * @param {node} children - 그라디언트 위에 표시될 내용 [Optional]
 *
 * Example usage:
 * <MeshGradientBox
 *   colors={["#FF512F", "#DD2476", "#FF0080"]}
 *   pointCount={15}
 *   randomness={0.4}
 *   animated={true}
 *   resolution={0.5}
 *   minBlock={2}
 *   maxFPS={30}
 *   showPoints={true}
 *   pointSize={5}
 *   animateColorShift={true}
 *   distribution="centered"
 *   colorStrategy="gradientMap"
 *   blendMode="radial"
 *   falloff={2.5}
 *   densityBias={{ x: 0.7, y: 0.3 }}
 *   noiseEnabled={true}
 *   noiseIntensity={0.2}
 *   noiseScale={0.0005}
 *   sx={{ height: 300, borderRadius: 2 }}
 * >
 *   <Typography>Enhanced Mesh Gradient Background with Noise</Typography>
 * </MeshGradientBox>
 */
function MeshGradientBox({
	colors,
	pointCount = 8,
	randomness = 0.3,
	animated = false,
	animationSpeed = 1.5,
	resolution: initialResolution = 0.4,
	minBlock = 3,
	maxFPS = 30,
	showPoints = false,
	pointSize = 4,
	animateColorShift = false,
	colorShiftSpeed = 0.1,
	distribution = "grid",
	colorStrategy = "cycle",
	blendMode = "radial",
	falloff = 1.5,
	densityBias,
	// 노이즈 관련 props
	noiseEnabled = false,
	noiseIntensity = 0.05,
	noiseScale = 0.0005,
	sx,
	children,
}) {
	// 캔버스 및 컨테이너 참조
	const canvasRef = useRef(null);
	const containerRef = useRef(null);

	// 애니메이션 프레임 ID 및 포인트 데이터 관리
	const animFrameRef = useRef(null);
	const pointsRef = useRef([]);
	const colorShiftRef = useRef(0);

	// 애니메이션 시간 추적
	const animationTimeRef = useRef(0);
	const lastTimestampRef = useRef(0);

	// 캔버스 크기 상태
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// 마지막 프레임 시간 추적 (스로틀링용)
	const lastFrameTimeRef = useRef(0);

	// Dynamic Resolution 적용
	const resolution = useMemo(() => {
		let currentResolution = initialResolution;
		if (dimensions.width > 0 && dimensions.width < 600) {
			currentResolution = Math.min(initialResolution, 0.4);
		}
		return currentResolution;
	}, [initialResolution, dimensions.width]);

	// 해상도에 따른 픽셀 크기 계산 (메모이제이션) - minBlock 적용
	const pixelSize = useMemo(() => {
		return Math.max(minBlock, Math.floor(1 / resolution));
	}, [resolution, minBlock]);

	// 최대 거리 계산 (메모이제이션)
	const maxDistance = useMemo(() => {
		if (dimensions.width === 0 || dimensions.height === 0) return 0;
		return (
			Math.sqrt(
				dimensions.width * dimensions.width +
					dimensions.height * dimensions.height
			) * 0.5
		);
	}, [dimensions.width, dimensions.height]);

	// 단순화된 노이즈 구현
	const simplexNoise = useMemo(() => {
		// 간단한 2D 노이즈 함수 (해시 기반)
		function noise2D(x, y) {
			const n0 = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
			const n1 = Math.sin((x + 1) * 12.9898 + y * 78.233) * 43758.5453;
			const n2 = Math.sin(x * 12.9898 + (y + 1) * 78.233) * 43758.5453;
			const n3 = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233) * 43758.5453;
			
			const fx = x - Math.floor(x);
			const fy = y - Math.floor(y);
			
			const ix = 1.0 - fx;
			const iy = 1.0 - fy;
			
			const v0 = (n0 - Math.floor(n0)) * ix * iy;
			const v1 = (n1 - Math.floor(n1)) * fx * iy;
			const v2 = (n2 - Math.floor(n2)) * ix * fy;
			const v3 = (n3 - Math.floor(n3)) * fx * fy;
			
			return (v0 + v1 + v2 + v3) * 2.0 - 1.0;
		}

		return { noise2D };
	}, []);

	// 색상 헥스값을 RGB 배열로 변환하는 함수 (메모이제이션)
	const hexToRgb = useCallback((hex) => {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return [r, g, b];
	}, []);

	// 색상 배열을 RGB로 변환 (메모이제이션)
	const rgbColors = useMemo(() => {
		return colors.map((color) => hexToRgb(color));
	}, [colors, hexToRgb]);

	// HSL -> RGB 변환 함수
	const hslToRgb = useCallback((h, s, l) => {
		let r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const hue2rgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}, []);

	// RGB -> HSL 변환 함수
	const rgbToHsl = useCallback((r, g, b) => {
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
				default:
					h = 0;
			}

			h /= 6;
		}

		return [h, s, l];
	}, []);

	// 색상 시프트 적용 함수
	const shiftColor = useCallback(
		(color, shiftAmount) => {
			const [h, s, l] = rgbToHsl(color[0], color[1], color[2]);
			// hue만 변경하고 나머지는 유지
			const newHue = (h + shiftAmount) % 1;
			return hslToRgb(newHue, s, l);
		},
		[rgbToHsl, hslToRgb]
	);

	// 단순화된 노이즈 적용 함수
	const applyNoise = useCallback((weightedColor, x, y) => {
		if (!noiseEnabled) return weightedColor;

		const noiseValue = simplexNoise.noise2D(x * noiseScale, y * noiseScale);

		// 노이즈 값을 0~1 범위로 정규화하고 강도 적용
		const normalizedNoise = (noiseValue + 1) * 0.5; // -1~1을 0~1로 변환
		const noiseFactor = 1 + (normalizedNoise - 0.5) * noiseIntensity;

		// 각 색상 채널에 노이즈 적용
		return [
			Math.max(0, Math.min(255, Math.round(weightedColor[0] * noiseFactor))),
			Math.max(0, Math.min(255, Math.round(weightedColor[1] * noiseFactor))),
			Math.max(0, Math.min(255, Math.round(weightedColor[2] * noiseFactor)))
		];
	}, [
		noiseEnabled,
		noiseIntensity,
		noiseScale,
		simplexNoise
	]);

	// 거리에 따른 가중치 계산 (호환성을 위해 유지)
	// eslint-disable-next-line no-unused-vars
	const calculateWeight = useCallback(
		(distance, maxDistance) => {
			// falloff 파라미터를 사용하여 감쇠 강도 조절
			return Math.max(0, 1 - Math.pow(distance / maxDistance, falloff));
		},
		[falloff]
	);

	// 거리 제곱에 따른 가중치 계산 (제곱근 연산 최적화)
	const calculateWeightSquared = useCallback(
		(distanceSquared, maxDistanceSquared) => {
			// 제곱 거리에 대해 falloff의 절반을 적용 (제곱근 특성 보정)
			return Math.max(
				0,
				1 - Math.pow(distanceSquared / maxDistanceSquared, falloff / 2)
			);
		},
		[falloff]
	);

	// 선형 가중치 계산
	const calculateLinearWeight = useCallback((distance, maxDistance) => {
		return Math.max(0, 1 - distance / maxDistance);
	}, []);

	// 포인트 컬러 선택 전략 (메모이제이션)
	const selectPointColor = useCallback(
		(index, totalPoints) => {
			if (colorStrategy === "cycle") {
				// 순환 방식 - 각 색상이 균등하게 나오도록
				const colorIndex = Math.floor((index / totalPoints) * rgbColors.length);
				return rgbColors[colorIndex % rgbColors.length];
			} else if (colorStrategy === "random") {
				// 완전 랜덤 방식
				return rgbColors[Math.floor(Math.random() * rgbColors.length)];
			} else if (colorStrategy === "gradientMap") {
				// 그라디언트 맵 방식 - 정확한 위치 보간
				const position = index / (totalPoints - 1);
				if (position === 0) return rgbColors[0];
				if (position === 1) return rgbColors[rgbColors.length - 1];

				// 정확한 위치를 그라디언트에 매핑
				const segmentCount = rgbColors.length - 1;
				const segmentPosition = position * segmentCount;
				const segmentIndex = Math.floor(segmentPosition);
				const t = segmentPosition - segmentIndex; // 세그먼트 내에서의 위치 (0~1)

				const color1 = rgbColors[segmentIndex];
				const color2 = rgbColors[segmentIndex + 1];

				// 두 색상 간 선형 보간
				return [
					Math.round(color1[0] * (1 - t) + color2[0] * t),
					Math.round(color1[1] * (1 - t) + color2[1] * t),
					Math.round(color1[2] * (1 - t) + color2[2] * t),
				];
			}

			// 기본 fallback
			return rgbColors[index % rgbColors.length];
		},
		[colorStrategy, rgbColors]
	);

	// 메시 그라디언트 그리기 함수
	const drawMeshGradient = useCallback(
		(timestamp = 0) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			const { width, height } = canvas;

			// 연속적인 애니메이션을 위한 시간 관리
			const deltaTime = lastTimestampRef.current
				? (timestamp - lastTimestampRef.current) / 1000
				: 1 / maxFPS; // 초기 deltaTime은 maxFPS에 맞게 설정
			lastTimestampRef.current = timestamp;

			// 기본 애니메이션 시간 누적 (무한 루프 애니메이션을 위해)
			animationTimeRef.current += deltaTime;
			
			// 위치 애니메이션용 독립 시간 (animationSpeed 적용)
			const positionTime = animationTimeRef.current * animationSpeed;
			
			// 색상 애니메이션용 독립 시간 (colorShiftSpeed 적용)
			const colorTime = animationTimeRef.current * colorShiftSpeed;

			// 색상 시프트 애니메이션 (hue 변화) - 독립적인 colorTime 사용
			if (animateColorShift) {
				colorShiftRef.current = colorTime % 1; // 천천히 회전하는 색상 (0~1 범위)
			}

			// 캔버스 지우기
			ctx.clearRect(0, 0, width, height);

			// 픽셀 데이터 생성
			const imageData = ctx.createImageData(width, height);
			const data = imageData.data;

			// 각 픽셀에 대해 색상 계산 (해상도에 따라 건너뛰기)
			for (let y = 0; y < height; y += pixelSize) {
				for (let x = 0; x < width; x += pixelSize) {
					// 모든 포인트에 대한 가중치 합계 및 가중 색상 계산
					let totalWeight = 0;
					const weightedColor = [0, 0, 0];

					// 각 포인트에 대해 현재 픽셀과의 거리에 따른 가중치 계산
					pointsRef.current.forEach((point) => {
						// 애니메이션이 적용된 현재 위치 계산
						let currentX = point.x;
						let currentY = point.y;

						if (animated) {
							// 각 포인트마다 다른 주파수와 위상을 가진 사인파로 움직임
							// 주파수를 낮추고 진폭을 키워 더 크고 부드러운 움직임 구현
							const offsetX =
								Math.sin(positionTime * point.freqX + point.phaseX) * point.amplitudeX;
							const offsetY =
								Math.cos(positionTime * point.freqY + point.phaseY) * point.amplitudeY;

							currentX += offsetX;
							currentY += offsetY;
						}

						// 픽셀과 포인트 간의 거리 계산
						const dx = x - currentX;
						const dy = y - currentY;
						const distanceSquared = dx * dx + dy * dy;

						// blendMode에 따른 가중치 계산
						let weight;
						if (blendMode === "radial") {
							// 제곱 거리로 직접 계산하여 제곱근 연산 회피
							const maxDistanceSquared = maxDistance * maxDistance;
							weight = calculateWeightSquared(
								distanceSquared,
								maxDistanceSquared
							);
						} else {
							// 'linear'
							// 선형 블렌드 모드는 정확한 거리 필요
							const distance = Math.sqrt(distanceSquared);
							weight = calculateLinearWeight(distance, maxDistance);
						}
						totalWeight += weight;

						// 색상 시프트 적용
						let currentColor = [...point.color];
						if (animateColorShift) {
							currentColor = shiftColor(
								point.color,
								colorShiftRef.current * point.colorFactor
							);
						}

						// 가중치에 따라 색상 누적
						weightedColor[0] += currentColor[0] * weight;
						weightedColor[1] += currentColor[1] * weight;
						weightedColor[2] += currentColor[2] * weight;
					});

					// 모든 가중치의 합으로 정규화
					if (totalWeight > 0) {
						weightedColor[0] = Math.round(weightedColor[0] / totalWeight);
						weightedColor[1] = Math.round(weightedColor[1] / totalWeight);
						weightedColor[2] = Math.round(weightedColor[2] / totalWeight);
					}

					// 노이즈 적용
					const finalColor = applyNoise(weightedColor, x, y);

					// 계산된 색상을 pixelSize x pixelSize 블록으로 채움
					for (
						let blockY = 0;
						blockY < pixelSize && y + blockY < height;
						blockY++
					) {
						for (
							let blockX = 0;
							blockX < pixelSize && x + blockX < width;
							blockX++
						) {
							const blockIdx = ((y + blockY) * width + (x + blockX)) * 4;

							// 픽셀 데이터에 색상 설정
							data[blockIdx] = finalColor[0]; // R
							data[blockIdx + 1] = finalColor[1]; // G
							data[blockIdx + 2] = finalColor[2]; // B
							data[blockIdx + 3] = 255; // A (완전 불투명)
						}
					}
				}
			}

			// 계산된 이미지 데이터를 캔버스에 그리기
			ctx.putImageData(imageData, 0, 0);

			// 포인트 위치 표시 (showPoints가 true인 경우)
			if (showPoints) {
				ctx.save();

				// 각 포인트마다 작은 원 그리기
				pointsRef.current.forEach((point) => {
					let currentX = point.x;
					let currentY = point.y;

					if (animated) {
						// 애니메이션 적용 시 현재 위치 계산 (이미 계산된 값을 재사용하기 어려우므로 여기서는 원래대로 계산)
						const offsetX =
							Math.sin(positionTime * point.freqX + point.phaseX) * point.amplitudeX;
						const offsetY =
							Math.cos(positionTime * point.freqY + point.phaseY) * point.amplitudeY;

						currentX += offsetX;
						currentY += offsetY;
					}

					// 원래 포인트 색상 사용
					const r = point.color[0];
					const g = point.color[1];
					const b = point.color[2];

					// 포인트 그리기
					ctx.beginPath();
					ctx.arc(currentX, currentY, pointSize, 0, Math.PI * 2);
					ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
					ctx.fill();

					// 테두리 추가 (가시성을 위해 검은색 또는 흰색 테두리 선택)
					const brightness = (r * 299 + g * 587 + b * 114) / 1000; // 색상 밝기 계산
					ctx.strokeStyle = brightness > 128 ? "#000000" : "#FFFFFF"; // 밝은 색에는 검은색, 어두운 색에는 흰색 테두리
					ctx.lineWidth = 1;
					ctx.stroke();
				});

				ctx.restore();
			}
		},
		[
			animated,
			animateColorShift,
			calculateLinearWeight,
			calculateWeightSquared,
			resolution,
			pixelSize,
			maxDistance,
			showPoints,
			pointSize,
			blendMode,
			shiftColor,
			colorShiftSpeed,
			animationSpeed,
			applyNoise,
		]
	);

	// 스로틀링된 애니메이션 함수 - maxFPS 적용
	const throttledAnimationFrame = useCallback(
		(timestamp) => {
			const frameMinTime = 1000 / maxFPS;
			// FPS 제한을 위한 스로틀링
			const elapsed = timestamp - lastFrameTimeRef.current;

			if (elapsed >= frameMinTime || lastFrameTimeRef.current === 0) {
				lastFrameTimeRef.current = timestamp - (elapsed % frameMinTime);
				drawMeshGradient(timestamp);
			}

			// 애니메이션 중단 플래그가 없으면 계속 애니메이션 요청
			if (animated || animateColorShift) {
				animFrameRef.current = requestAnimationFrame(throttledAnimationFrame);
			}
		},
		[animated, animateColorShift, drawMeshGradient, maxFPS]
	);

	// 애니메이션 시작/종료 관리
	useEffect(() => {
		// 애니메이션 시작 - animated 또는 animateColorShift가 true이고 캔버스 크기가 설정된 경우
		if (
			(animated || animateColorShift) &&
			dimensions.width > 0 &&
			dimensions.height > 0
		) {
			// 이전 애니메이션 정리
			if (animFrameRef.current) {
				cancelAnimationFrame(animFrameRef.current);
			}

			// 애니메이션 상태 초기화 - 첫 마운트 시 또는 애니메이션 상태 변경 시
			lastTimestampRef.current = 0; // 애니메이션 루프 시작 시 타임스탬프 초기화
			animationTimeRef.current = 0; // 애니메이션 시간도 0부터 시작하도록

			// 새 애니메이션 시작
			animFrameRef.current = requestAnimationFrame(throttledAnimationFrame);
		}

		// 정리 함수
		return () => {
			if (animFrameRef.current) {
				cancelAnimationFrame(animFrameRef.current);
				animFrameRef.current = null;
			}
		};
	}, [animated, animateColorShift, dimensions, throttledAnimationFrame, maxFPS]);

	// 포인트 초기화 시 애니메이션 자동 시작 보장
	useEffect(() => {
		// 포인트가 초기화되었고 애니메이션이 활성화된 경우
		if (
			pointsRef.current.length > 0 &&
			(animated || animateColorShift) &&
			!animFrameRef.current
		) {
			animFrameRef.current = requestAnimationFrame(throttledAnimationFrame);
		}
	}, [animated, animateColorShift, throttledAnimationFrame]);

	// 그리드 기반 포인트 초기화
	const initializeGridPoints = useCallback(
		(width, height) => {
			const cols = Math.ceil(Math.sqrt(pointCount));
			const rows = Math.ceil(pointCount / cols);

			const cellWidth = width / cols;
			const cellHeight = height / rows;

			const points = [];

			for (let i = 0; i < pointCount; i++) {
				// 그리드 인덱스 계산
				const col = i % cols;
				const row = Math.floor(i / cols);

				// 그리드 내에서 균등한 위치 계산 (셀의 중앙)
				const baseX = col * cellWidth + cellWidth / 2;
				const baseY = row * cellHeight + cellHeight / 2;

				// 밀도 바이어스 적용
				let biasX = 0;
				let biasY = 0;
				if (densityBias) {
					biasX = (width / 2 - baseX) * densityBias.x;
					biasY = (height / 2 - baseY) * densityBias.y;
				}

				// 랜덤성에 따른 위치 조정
				const randX = (Math.random() - 0.5) * cellWidth * randomness;
				const randY = (Math.random() - 0.5) * cellHeight * randomness;

				// 최종 위치 계산
				const x = Math.max(0, Math.min(width, baseX + randX + biasX));
				const y = Math.max(0, Math.min(height, baseY + randY + biasY));

				const colorRgb = selectPointColor(i, pointCount);

				// 애니메이션 파라미터 생성 - 더 과감한 움직임을 위해 수정
				const freqX = 0.3 + Math.random() * 0.5; // 더 빠른 주파수 (0.3 ~ 0.8 Hz)
				const freqY = 0.3 + Math.random() * 0.5;
				const phaseX = Math.random() * Math.PI * 2; // 0 ~ 2π
				const phaseY = Math.random() * Math.PI * 2;
				// 극대 진폭 - 셀 크기의 120%~250% 정도로 극대화
				const amplitudeX = cellWidth * (1.2 + randomness * 1.3);
				const amplitudeY = cellHeight * (1.2 + randomness * 1.3);
				const colorFactor = Math.random() * 0.5 + 0.5; // 색상 변화 가중치 (0.5 ~ 1.0)

				points.push({
					x,
					y,
					color: colorRgb,
					freqX,
					freqY,
					phaseX,
					phaseY,
					amplitudeX,
					amplitudeY,
					colorFactor,
				});
			}

			return points;
		},
		[pointCount, randomness, selectPointColor, densityBias]
	);

	// 노이즈 기반 포인트 초기화 (완전 랜덤 + 최소 거리 보장)
	const initializeNoisePoints = useCallback(
		(width, height) => {
			const points = [];
			const minDistanceBetweenPoints =
				(Math.min(width, height) / Math.sqrt(pointCount)) * 0.5;

			// 포인트 생성 시도 횟수 제한
			const maxAttempts = pointCount * 5;
			let attempts = 0;

			for (let i = 0; i < pointCount && attempts < maxAttempts; i++) {
				let x,
					y,
					isValid = false;

				// 유효한 위치를 찾을 때까지 시도
				do {
					x = Math.random() * width;
					y = Math.random() * height;

					// 밀도 바이어스 적용
					if (densityBias) {
						const biasX = (width / 2 - x) * densityBias.x * 0.5;
						const biasY = (height / 2 - y) * densityBias.y * 0.5;
						x += biasX;
						y += biasY;
						x = Math.max(0, Math.min(width, x));
						y = Math.max(0, Math.min(height, y));
					}

					// 기존 포인트와의 거리 확인
					isValid = true;
					for (let j = 0; j < points.length; j++) {
						const dx = x - points[j].x;
						const dy = y - points[j].y;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < minDistanceBetweenPoints) {
							isValid = false;
							break;
						}
					}

					attempts++;
				} while (!isValid && attempts < maxAttempts);

				// 유효한 위치를 찾았으면 포인트 추가
				if (isValid) {
					const colorRgb = selectPointColor(i, pointCount);

					// 애니메이션 파라미터 - 더 과감한 움직임을 위해 수정
					const freqX = 0.3 + Math.random() * 0.5;
					const freqY = 0.3 + Math.random() * 0.5;
					const phaseX = Math.random() * Math.PI * 2;
					const phaseY = Math.random() * Math.PI * 2;
					// 극대 진폭 - 캔버스 크기의 40%~60% 정도로 극대화
					const amplitude = Math.min(width, height) * (0.4 + randomness * 0.2);
					const colorFactor = Math.random() * 0.5 + 0.5;

					points.push({
						x,
						y,
						color: colorRgb,
						freqX,
						freqY,
						phaseX,
						phaseY,
						amplitudeX: amplitude,
						amplitudeY: amplitude,
						colorFactor,
					});
				}
			}

			// 충분한 포인트를 생성하지 못했다면 부족한 만큼 완전 랜덤으로 추가
			while (points.length < pointCount) {
				const x = Math.random() * width;
				const y = Math.random() * height;

				const colorRgb = selectPointColor(points.length, pointCount);

				// 애니메이션 파라미터 - 더 과감한 움직임을 위해 수정
				const freqX = 0.3 + Math.random() * 0.5;
				const freqY = 0.3 + Math.random() * 0.5;
				const phaseX = Math.random() * Math.PI * 2;
				const phaseY = Math.random() * Math.PI * 2;
				// 극대 진폭 - 대폭 극대화
				const amplitude = Math.min(width, height) * (0.4 + randomness * 0.2);
				const colorFactor = Math.random() * 0.5 + 0.5;

				points.push({
					x,
					y,
					color: colorRgb,
					freqX,
					freqY,
					phaseX,
					phaseY,
					amplitudeX: amplitude,
					amplitudeY: amplitude,
					colorFactor,
				});
			}

			return points;
		},
		[pointCount, randomness, selectPointColor, densityBias]
	);

	// 중심 기반 포인트 초기화 (중심에서 방사형으로 배치)
	const initializeCenteredPoints = useCallback(
		(width, height) => {
			const points = [];
			const centerX = width / 2;
			const centerY = height / 2;

			// 방사형 거리와 각도 계산을 위한 파라미터
			const maxRadius = Math.min(width, height) * 0.5;

			for (let i = 0; i < pointCount; i++) {
				// 방사형 배치를 위한 계산
				const angle = (i / pointCount) * Math.PI * 2; // 균등한 각도 분포
				const radiusFactor = Math.sqrt(i / pointCount); // 균등한 면적 분포를 위해 제곱근 사용

				let radius = maxRadius * radiusFactor;

				// 랜덤성 추가
				radius += (Math.random() - 0.5) * maxRadius * 0.1 * randomness;
				const angleOffset = (Math.random() - 0.5) * Math.PI * 0.2 * randomness;

				// 최종 위치 계산
				const x = Math.max(
					0,
					Math.min(width, centerX + Math.cos(angle + angleOffset) * radius)
				);
				const y = Math.max(
					0,
					Math.min(height, centerY + Math.sin(angle + angleOffset) * radius)
				);

				// 색상 선택
				const colorRgb = selectPointColor(i, pointCount);

				// 애니메이션 파라미터 - 더 과감한 움직임을 위해 수정
				const freqX = 0.3 + Math.random() * 0.5;
				const freqY = 0.3 + Math.random() * 0.5;
				const phaseX = Math.random() * Math.PI * 2;
				const phaseY = Math.random() * Math.PI * 2;
				// 극대 진폭 - 반지름의 75%~120% 정도로 극대화 (중심에서 멀수록 더 큰 움직임)
				const amplitude = radius * (0.75 + randomness * 0.45);
				const colorFactor = Math.random() * 0.5 + 0.5;

				points.push({
					x,
					y,
					color: colorRgb,
					freqX,
					freqY,
					phaseX,
					phaseY,
					amplitudeX: amplitude,
					amplitudeY: amplitude,
					colorFactor,
				});
			}

			return points;
		},
		[pointCount, randomness, selectPointColor]
	);

	// 메시 포인트 초기화 함수
	const initializePoints = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || rgbColors.length === 0) return;

		const { width, height } = canvas;

		// 포인트 배치 전략에 따라 초기화
		let points;
		switch (distribution) {
			case "noise":
				points = initializeNoisePoints(width, height);
				break;
			case "centered":
				points = initializeCenteredPoints(width, height);
				break;
			case "grid":
			default:
				points = initializeGridPoints(width, height);
				break;
		}

		pointsRef.current = points;

		// 초기 렌더링 또는 포인트 변경 시 즉시 그리기
		drawMeshGradient(0);
	}, [
		drawMeshGradient,
		distribution,
		rgbColors,
		initializeGridPoints,
		initializeNoisePoints,
		initializeCenteredPoints,
	]);

	// ResizeObserver를 사용한 크기 변경 감지
	useEffect(() => {
		if (!containerRef.current) return;

		const updateSize = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				// 실제 해상도에 따른 캔버스 크기 계산
				const width = Math.floor(rect.width);
				const height = Math.floor(rect.height);
				setDimensions({ width, height });
			}
		};

		// 초기 크기 설정
		updateSize();

		// ResizeObserver 설정
		const resizeObserver = new ResizeObserver((entries) => {
			if (entries.length > 0) {
				const { width, height } = entries[0].contentRect;
				setDimensions({
					width: Math.floor(width),
					height: Math.floor(height),
				});
			}
		});

		resizeObserver.observe(containerRef.current);

		// 창 크기 변경 이벤트 처리
		window.addEventListener("resize", updateSize);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateSize);

			// 애니메이션 정리
			if (animFrameRef.current) {
				cancelAnimationFrame(animFrameRef.current);
			}
		};
	}, []);

	// 크기가 변경되거나 주요 props가 변경될 때 포인트 초기화
	useEffect(() => {
		if (dimensions.width > 0 && dimensions.height > 0) {
			initializePoints();
		}

		// 컴포넌트 언마운트 시 애니메이션 정리 (이 부분은 중요)
		return () => {
			if (animFrameRef.current) {
				cancelAnimationFrame(animFrameRef.current);
				animFrameRef.current = null; // 명시적으로 null 처리
			}
		};
	}, [
		dimensions,
		initializePoints, // initializePoints의 의존성(distribution, colors 등)이 변경되면 이 훅도 실행
		pointCount, // pointCount는 initializeGridPoints 등을 통해 initializePoints에 영향을 줌
		randomness, // 이하 동일
		distribution,
		colorStrategy,
		blendMode,
		falloff,
		// 위 props들은 initializePoints 또는 그 하위 함수(initializeGridPoints 등)의 의존성이므로,
		// 이들이 변경되면 initializePoints 함수 자체가 변경되고, 이 useEffect가 실행됨.
	]);

	return (
		<Box
			ref={containerRef}
			sx={{
				position: "relative",
				overflow: "hidden",
				minHeight: 50,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				...sx,
			}}
		>
			<canvas
				ref={canvasRef}
				width={dimensions.width}
				height={dimensions.height}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 0,
				}}
			/>
			{children && (
				<Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
			)}
		</Box>
	);
}

MeshGradientBox.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.string).isRequired,
	pointCount: PropTypes.number,
	randomness: PropTypes.number,
	animated: PropTypes.bool,
	animationSpeed: PropTypes.number,
	resolution: PropTypes.number,
	minBlock: PropTypes.number,
	maxFPS: PropTypes.number,
	showPoints: PropTypes.bool,
	pointSize: PropTypes.number,
	animateColorShift: PropTypes.bool,
	colorShiftSpeed: PropTypes.number,
	distribution: PropTypes.oneOf(["grid", "noise", "centered"]),
	colorStrategy: PropTypes.oneOf(["cycle", "random", "gradientMap"]),
	blendMode: PropTypes.oneOf(["radial", "linear"]),
	falloff: PropTypes.number,
	densityBias: PropTypes.shape({
		x: PropTypes.number,
		y: PropTypes.number,
	}),
	// 노이즈 관련 props
	noiseEnabled: PropTypes.bool,
	noiseIntensity: PropTypes.number,
	noiseScale: PropTypes.number,
	sx: PropTypes.object,
	children: PropTypes.node,
};

export default React.memo(MeshGradientBox);
