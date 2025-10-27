import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
/**
 * GradientButton 컴포넌트
 * CTA를 유도하기 위한 방향성 있는 그라데이션 배경이 적용된 버튼 (Linear Gradient 전용)
 *
 * Props:
 * @param {number} angle - 그라데이션 각도(방향) (degrees) [Optional, 기본값: 90]
 *                       - 0°: 아래→위, 90°: 왼쪽→오른쪽, 180°: 위→아래, 270°: 오른쪽→왼쪽
 * @param {string[]} colors - 그라데이션 색상 배열 [Optional, 기본값: ['#0ea5e9', '#22d3ee', '#0ea5e9']]
 * @param {string} size - 버튼 크기 ('small', 'medium', 'large') [Optional, 기본값: 'medium']
 * @param {function} onClick - 클릭 이벤트 핸들러 [Optional]
 * @param {React.ReactNode} children - 버튼 내용 [Required]
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {boolean} fullWidth - 버튼 너비를 부모 요소 전체 너비로 확장 [Optional, 기본값: false]
 * @param {string} animationDuration - 애니메이션 지속 시간 [Optional, 기본값: '6s']
 * @param {boolean} disabled - 버튼 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <GradientButton
 *   angle={45}
 *   colors={['#0ea5e9', '#22d3ee', '#0ea5e9']}
 *   onClick={handleClick}
 * >
 *   버튼 텍스트
 * </GradientButton>
 */
function GradientButton({
	angle = 90,
	textColor = "#fff",
	colors = ["#0ea5e9", "#22d3ee", "#0ea5e9"],
	size = "large",
	onClick,
	children,
	sx = {},
	fullWidth = false,
	animationDuration = "6s",
	disabled = false,
	...rest
}) {
	const gradientRef = useRef(null);
	const animationRef = useRef(null);

	// 그라데이션 문자열 생성 함수 (Linear 전용)
	const getGradientString = (gradientAngle, gradientColors) => {
		const circularColors = [...gradientColors, gradientColors[0]];
		// Linear 그라데이션 문자열만 반환
		return `linear-gradient(${gradientAngle}deg, ${circularColors.join(", ")})`;
	};

	// 각도에 따른 애니메이션 설정 계산 함수 (그라데이션 진행 방향과 일치)
	const getAnimationSettingsByAngle = (angleDegree) => {
		// 각도를 0-360 범위로 정규화
		const normalizedAngle = ((angleDegree % 360) + 360) % 360;
		
		// CSS 그라데이션 각도 기준
		// 0° = 아래→위 (북쪽), 90° = 왼쪽→오른쪽 (동쪽)
		// 180° = 위→아래 (남쪽), 270° = 오른쪽→왼쪽 (서쪽)
		
		// 수직 그라데이션 (0°, 180° 부근): 위아래 방향 애니메이션
		if ((normalizedAngle >= 337.5 || normalizedAngle < 22.5) || 
			(normalizedAngle >= 157.5 && normalizedAngle < 202.5)) {
			return {
				backgroundSize: "100% 400%",
				keyframes: [
					{ backgroundPosition: "50% 0%" },
					{ backgroundPosition: "50% 400%" }
				]
			};
		}
		// 수평 그라데이션 (90°, 270° 부근): 좌우 방향 애니메이션
		else if ((normalizedAngle >= 67.5 && normalizedAngle < 112.5) || 
				(normalizedAngle >= 247.5 && normalizedAngle < 292.5)) {
			return {
				backgroundSize: "400% 100%",
				keyframes: [
					{ backgroundPosition: "0% 50%" },
					{ backgroundPosition: "400% 50%" }
				]
			};
		}
		// 대각선 (북동, 남서: 45°, 225° 부근)
		else if ((normalizedAngle >= 22.5 && normalizedAngle < 67.5) || 
				(normalizedAngle >= 202.5 && normalizedAngle < 247.5)) {
			return {
				backgroundSize: "400% 400%",
				keyframes: [
					{ backgroundPosition: "0% 0%" },
					{ backgroundPosition: "100% 100%" }
				]
			};
		}
		// 대각선 (북서, 남동: 135°, 315° 부근)
		else {
			return {
				backgroundSize: "400% 400%",
				keyframes: [
					{ backgroundPosition: "100% 0%" },
					{ backgroundPosition: "0% 100%" }
				]
			};
		}
	};

	// Web Animations API 설정 (Linear 애니메이션)
	useEffect(() => {
		const gradientElement = gradientRef.current;
		if (!gradientElement) return undefined;

		// --- 기존 애니메이션 정리 ---
		if (animationRef.current) {
			animationRef.current.cancel();
			animationRef.current = null;
		}

		// --- 각도에 따른 애니메이션 설정 계산 ---
		const { backgroundSize, keyframes } = getAnimationSettingsByAngle(angle);
		
		const options = {
			duration: (parseInt(animationDuration, 10) || 6) * 1000,
			iterations: Infinity,
			easing: "linear",
		};

		// 배경 스타일 설정 (애니메이션 시작 전)
		gradientElement.style.backgroundImage = getGradientString(angle, colors);
		gradientElement.style.backgroundSize = backgroundSize;
		gradientElement.style.backgroundPosition = keyframes[0].backgroundPosition;

		// --- WAAPI 애니메이션 적용 ---
		animationRef.current = gradientElement.animate(keyframes, options);

		// --- 컴포넌트 언마운트 시 정리 ---
		return () => {
			if (animationRef.current) {
				animationRef.current.cancel();
				animationRef.current = null;
			}
		};
	}, [angle, colors, animationDuration]);

	// Hover 이벤트 핸들러
	const handleMouseEnter = () => {
		if (animationRef.current) {
			animationRef.current.updatePlaybackRate(0.3); // 속도 감소
		}
	};

	const handleMouseLeave = () => {
		if (animationRef.current) {
			animationRef.current.updatePlaybackRate(1); // 속도 복구
		}
	};

	return (
		<>
			<Button
				variant="contained"
				size={size}
				onClick={onClick}
				fullWidth={fullWidth}
				disabled={disabled}
				sx={{
					position: "relative",
					overflow: "hidden",
					color: textColor,
					background: "transparent",

					"& .gradient-bg": {
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 0,
						transformOrigin: "center center",
						transition: "transform 0.3s ease",
					},

					"&:hover .gradient-bg": {
						transform: "scale(2)",
					},

					"& .MuiButton-label, & > span:not(.gradient-bg)": {
						position: "relative",
						zIndex: 1,
					},
					...sx,
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...rest}
			>
				{/* 배경 요소: WAAPI 애니메이션 및 스타일 적용 대상 */}
				<Box 
					ref={gradientRef} 
					component="span" 
					className="gradient-bg" 
				/>

				{/* 버튼 내용 */}
				<Box
					component="span"
					className="text-content"
					sx={{
						position: "relative",
						zIndex: 1,
					}}
				>
					{children}
				</Box>
			</Button>
		</>
	);
}

GradientButton.propTypes = {
	angle: PropTypes.number,
	colors: PropTypes.arrayOf(PropTypes.string),
	size: PropTypes.oneOf(["small", "medium", "large"]),
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
	sx: PropTypes.object,
	fullWidth: PropTypes.bool,
	animationDuration: PropTypes.string,
	disabled: PropTypes.bool,
};

export default GradientButton;
 