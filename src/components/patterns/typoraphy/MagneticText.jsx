import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";

/**
 * 마우스 위치에 따라 텍스트가 자석처럼 끌려오는 효과를 가진 컴포넌트
 * 
 * Props:
 * @param {string} text - 표시할 텍스트 [Optional, 기본값: 'Magnetic Effect Sample']
 * @param {string} variant - 텍스트 크기 variant [Optional, 기본값: 'h1']
 * @param {string} textColor - 텍스트 색상 [Optional, 기본값: 'inherit']
 *
 * Example usage:
 * <MagneticText text="Hello Designers" variant="h2" textColor="primary.main" />
 */
function MagneticText({ text = "Magnetic Effect Sample", variant = "h1", textColor = "inherit" }) {
	const textRef = useRef(null);
	const containerRef = useRef(null);
	const lettersRef = useRef([]);
	const isMouseInside = useRef(false); // 마우스가 컴포넌트 내부에 있는지 추적

	// GSAP의 quickSetter를 사용해 성능 최적화
	const xTo = useRef({});
	const yTo = useRef({});

	const handleMouseMove = (e) => {
		isMouseInside.current = true; // 마우스가 내부에 있음을 표시
		
		const { clientX, clientY } = e;

		lettersRef.current.forEach((letter, index) => {
			if (!letter) return;

			const letterRect = letter.getBoundingClientRect();
			const letterCenterX = letterRect.left + letterRect.width / 2;
			const letterCenterY = letterRect.top + letterRect.height / 2;

			// 마우스와 글자 중심 사이의 거리 계산
			const deltaX = clientX - letterCenterX;
			const deltaY = clientY - letterCenterY;
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			// 최대 영향 반경 설정
			const maxDistance = 100; // 100px 반경 내에서만 반응
			const influence = Math.max(0, 1 - distance / maxDistance);

			// 이동 거리 계산 (영향력에 따라)
			const moveX = deltaX * influence * 1;
			const moveY = deltaY * influence * 1;

			// quickSetter로 부드럽게 이동 (마우스가 내부에 있을 때만)
			if (isMouseInside.current) {
			if (!xTo.current[index]) {
				xTo.current[index] = gsap.quickTo(letter, "x", {
					duration: 0.8,
					ease: "elastic.out(1, 0.3)",
				});
				yTo.current[index] = gsap.quickTo(letter, "y", {
					duration: 0.8,
					ease: "elastic.out(1, 0.3)",
				});
			}
			xTo.current[index](moveX);
			yTo.current[index](moveY);
			}
		});
	};

	const handleMouseLeave = () => {
		isMouseInside.current = false; // 마우스가 벗어났음을 표시
		
		lettersRef.current.forEach((letter, index) => {
			if (letter) {
				// quickSetter 인스턴스 제거 (새로운 업데이트 방지)
			if (xTo.current[index]) {
					delete xTo.current[index];
				}
				if (yTo.current[index]) {
					delete yTo.current[index];
				}
				
				// 기존 애니메이션 중단 후 부드럽게 원위치로 이동
				gsap.to(letter, {
					x: 0,
					y: 0,
					duration: 0.6,
					ease: "elastic.out(1, 0.3)",
					overwrite: true, // 기존 애니메이션을 덮어쓰기
				});
			}
		});
	};

	return (
		<Box
			ref={containerRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				cursor: "pointer",
				py: 4, // 상하 여백
			}}
		>
			<Typography
				ref={textRef}
				variant={variant}
				color={textColor}
				sx={{
					display: "inline-block",
					position: "relative",
					letterSpacing: "-0.05em", // 자간 줄이기
				}}
			>
				{text.split("").map((char, index) => (
					<Typography
						key={index}
						variant={variant}
						color={textColor}
						ref={(el) => (lettersRef.current[index] = el)}
						component="span"
						sx={{
							display: "inline-block", // 개별 글자 컨트롤
							whiteSpace: "pre", // 공백 유지
							position: "relative", // quickTo 적용 위해
							letterSpacing: "-0.05em", // 자간 줄이기
							marginLeft: index > 0 ? "-0.1em" : "initial", // 첫 글자 제외하고 자간 줄이기
						}}
					>
						{char === " " ? "\u00A0" : char} {/* 공백 처리 */}
					</Typography>
				))}
			</Typography>
		</Box>
	);
}

export default MagneticText;
