import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { Box } from "@mui/material";
import * as THREE from "three";
import AprilFatfaceFont from "../../../assets/font/Abril_Fatface_Regular.json";

/**
 * 3D 공간에서 개별 문자를 나타내는 컴포넌트
 * 
 * Props:
 * @param {string} char - 표시할 문자 [Required]
 * @param {number} index - 문자 인덱스 [Required]
 * @param {number} totalChars - 전체 문자 수 [Required]
 * @param {boolean} isHovered - 호버 여부 [Required]
 * @param {number} size - 문자 크기 [Required]
 * @param {string} textColor - 텍스트 색상 [Required]
 *
 * Example usage:
 * <CharacterLetter char="H" index={0} totalChars={5} isHovered={true} size={0.75} textColor="#ffffff" />
 */
function CharacterLetter({ char, index, totalChars, isHovered, size, textColor }) {
	const ref = useRef();

	// 초기 랜덤 위치와 회전 (size에 따라 범위 조정)
	const randomPosition = useMemo(
		() => [
			(Math.random() - 0.5) * 10 * size,
			(Math.random() - 0.5) * 10 * size,
			(Math.random() - 0.5) * 5 * size,
		],
		[size]
	);

	const randomRotation = useMemo(
		() => [
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
		],
		[]
	);

	// 원래 위치 (가로로 배열, size에 따라 간격 조정 - 자간 좁힘)
	const originalPosition = useMemo(() => {
		const baseWidth = 0.85; // 기본 글자 너비 줄임 (자간 좁히기)
		const spaceWidth = 0.4; // 공백 너비 줄임
		const width = char === " " ? spaceWidth * size : baseWidth * size;
		return [
			(index - totalChars / 2) * width + width / 2,
			0,
			0,
		];
	}, [index, totalChars, char, size]);

	// 애니메이션 시간 요소
	const time = useRef(0);
	const floatSpeed = useMemo(() => Math.random() * 0.5 + 0.5, []);

	// 마우스 호버에 따른 애니메이션
	useFrame((state, delta) => {
		if (!ref.current) return;

		time.current += delta;

		// 호버 상태에 따라 정렬 정도 결정 (0: 완전 랜덤, 1: 완전 정렬)
		const targetAlign = isHovered ? 1 : 0;
		ref.current.userData.alignFactor = THREE.MathUtils.lerp(
			ref.current.userData.alignFactor || 0,
			targetAlign,
			0.05
		);
		
		const alignFactor = ref.current.userData.alignFactor;

		// 부유 효과 (size에 따라 범위 조정)
		const floatOffsetX =
			Math.sin(time.current * floatSpeed) * (1 - alignFactor) * 0.3 * size;
		const floatOffsetY =
			Math.cos(time.current * floatSpeed * 1.3) * (1 - alignFactor) * 0.3 * size;
		const floatOffsetZ =
			Math.sin(time.current * floatSpeed * 0.7) * (1 - alignFactor) * 0.3 * size;

		// 위치 보간
		ref.current.position.x = THREE.MathUtils.lerp(
			randomPosition[0] + floatOffsetX,
			originalPosition[0],
			alignFactor
		);
		ref.current.position.y = THREE.MathUtils.lerp(
			randomPosition[1] + floatOffsetY,
			originalPosition[1],
			alignFactor
		);
		ref.current.position.z = THREE.MathUtils.lerp(
			randomPosition[2] + floatOffsetZ,
			originalPosition[2],
			alignFactor
		);

		// 회전 보간
		ref.current.rotation.x = THREE.MathUtils.lerp(
			randomRotation[0] + time.current * 0.2 * (1 - alignFactor),
			0,
			alignFactor
		);
		ref.current.rotation.y = THREE.MathUtils.lerp(
			randomRotation[1] + time.current * 0.1 * (1 - alignFactor),
			0,
			alignFactor
		);
		ref.current.rotation.z = THREE.MathUtils.lerp(
			randomRotation[2] + time.current * 0.15 * (1 - alignFactor),
			0,
			alignFactor
		);
	});

	// 공백 문자인 경우 렌더링하지 않음
	if (char === " ") {
		return null;
	}

	return (
		<Text3D
			ref={ref}
			font={AprilFatfaceFont}
			size={size}
			height={size * 0.25}
			curveSegments={12}
			bevelEnabled
			bevelThickness={size * 0.025}
			bevelSize={size * 0.025}
			bevelOffset={0}
			bevelSegments={5}
		>
			{char}
			<meshStandardMaterial color={textColor} />
		</Text3D>
	);
}

/**
 * 텍스트를 3D 공간에 표시하는 컴포넌트
 * 
 * Props:
 * @param {string} text - 표시할 텍스트 [Optional, 기본값: 'Hello Designers']
 * @param {boolean} isHovered - 호버 여부 [Required]
 * @param {number} size - 문자 크기 [Required]
 * @param {string} textColor - 텍스트 색상 [Required]
 *
 * Example usage:
 * <FloatingText text="Hello" isHovered={true} size={0.8} textColor="#ffffff" />
 */
function FloatingText({ text = "Hello Designers", isHovered, size, textColor }) {
	const chars = useMemo(() => text.split(""), [text]);
	const groupRef = useRef();

	return (
		<group ref={groupRef}>
			{chars.map((char, i) => (
				<CharacterLetter
					key={i}
					char={char}
					index={i}
					totalChars={chars.length}
					isHovered={isHovered}
					size={size}
					textColor={textColor}
				/>
			))}
		</group>
	);
}

/**
 * 3D 회전 텍스트 컴포넌트
 * 
 * Props:
 * @param {number} size - 텍스트 크기 [Optional, 기본값: 0.75]
 * @param {string} textColor - 텍스트 색상 [Optional, 기본값: '#ffffff']
 *
 * Example usage:
 * <RotatingText3D size={0.8} textColor="#ff0000" />
 */
function RotatingText3D({ size = 0.75, textColor = '#ffffff', text = "Hello Designers" }) {
	const [isHovered, setIsHovered] = useState(false);

	// size에 따라 카메라 z 위치와 fov 조정 (기본값 변경에 따라 기준값 조정)
	const cameraZ = useMemo(() => 8 + (size - 0.75) * 5, [size]);
	const cameraFov = useMemo(() => 50 + (size - 0.75) * 15, [size]);

	return (
		<Box
			sx={{
				width: "100%",
				height: "700px",
				borderRadius: 1,
				cursor: "pointer"
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Canvas camera={{ position: [0, 0, cameraZ], fov: cameraFov }}>
				<ambientLight intensity={0.6} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<pointLight position={[-10, -10, -10]} intensity={0.5} />

				<FloatingText text={text} isHovered={isHovered} size={size} textColor={textColor} />
			</Canvas>
		</Box>
	);
}

export default RotatingText3D;
