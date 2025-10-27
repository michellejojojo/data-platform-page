import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid"; // MUI v7 Grid import
import FadeInContainer from "./FadeInContainer";

/**
 * FadeInGrid 컴포넌트
 * MUI Grid 컴포넌트의 각 아이템에 순차적인 FadeIn 애니메이션 효과를 적용합니다.
 * 두 가지 방식으로 사용 가능합니다:
 * 1. components prop으로 이미 렌더링된 컴포넌트 배열을 전달하는 방식
 * 2. 기존 방식대로 Grid 아이템을 children으로 직접 전달하는 방식
 *
 * Props:
 * @param {React.ReactNode} children - Grid 아이템 요소들 [Optional] (components prop과 함께 사용 시 무시됨)
 * @param {Array} components - 렌더링할 컴포넌트 배열 [Optional]
 * @param {Object} itemSize - 각 Grid 아이템의 반응형 사이즈 설정 (ex: { xs: 12, sm: 6, md: 4 }) [Optional]
 * @param {boolean} container - Grid 컨테이너 여부 [Optional, MUI Grid prop]
 * @param {number} spacing - 아이템 간 간격 [Optional, MUI Grid prop]
 * @param {string} direction - 애니메이션 시작 방향 [Optional, FadeInContainer prop, 기본값: 'bottom']
 * @param {number} offset - 시작 오프셋 거리(px) [Optional, FadeInContainer prop, 기본값: 50]
 * @param {number} duration - 개별 아이템 애니메이션 시간(초) [Optional, FadeInContainer prop, 기본값: 0.5]
 * @param {number} delay - 아이템별 애니메이션 시작 지연 시간(초) [Optional, FadeInContainer prop, 기본값: 0.1] (이 값에 index가 곱해짐)
 * @param {boolean} once - 애니메이션 한 번만 실행 여부 [Optional, FadeInContainer prop, 기본값: true]
 * @param {number} amount - 트리거 요소 노출 비율 [Optional, FadeInContainer prop, 기본값: 0.3]
 * @param {object} sx - Grid 컨테이너에 적용할 추가 스타일 [Optional]
 * @param {object} itemSx - 각 Grid 아이템(FadeInContainer)에 적용할 추가 스타일 [Optional]
 * // ... 기타 MUI Grid props (justifyContent, alignItems 등)
 *
 * Example usage:
 * 1. 컴포넌트 배열 사용:
 * <FadeInGrid
 *   components={[<YourComponent1 />, <YourComponent2 />, <YourComponent3 />]}
 *   itemSize={{ xs: 12, sm: 6, md: 4 }}
 *   container
 *   spacing={2}
 *   delay={0.15}
 * />
 *
 * 2. 기존 방식 (children):
 * <FadeInGrid container spacing={2} delay={0.15}>
 *   <Grid size={{ xs: 12, sm: 6 }}> <YourItem /> </Grid>
 *   <Grid size={{ xs: 12, sm: 6 }}> <YourItem /> </Grid>
 * </FadeInGrid>
 */
function FadeInGrid({
	components,
	itemSize,
	container,
	spacing,
	// FadeInContainer Props
	direction = "bottom",
	offset = 50,
	duration = 0.5,
	delay = 0.1, // 기본 아이템별 지연 시간
	once = true,
	amount = 0.3,
	sx,
	itemSx,
	...rest // 나머지 Grid props
}) {
	// MUI v7에서 Grid 컨테이너 props 구성
	const gridContainerProps = {
		container,
		spacing,
		sx,
		...rest,
	};

	return (
		<Grid {...gridContainerProps}>
			{components.map((component, index) => (
				<Grid key={index} size={itemSize}>
					<FadeInContainer
						direction={direction}
						offset={offset}
						duration={duration}
						delay={index * delay}
						once={once}
						amount={amount}
						sx={itemSx}
					>
						{component}
					</FadeInContainer>
				</Grid>
			))}
		</Grid>
	);
}

FadeInGrid.propTypes = {
	children: PropTypes.node,
	components: PropTypes.array,
	itemSize: PropTypes.object,
	// MUI Grid Props (일부)
	container: PropTypes.bool,
	spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
	// FadeInContainer Props
	direction: PropTypes.oneOf(["left", "right", "top", "bottom", "none"]),
	offset: PropTypes.number,
	duration: PropTypes.number,
	delay: PropTypes.number,
	once: PropTypes.bool,
	amount: PropTypes.number,
	sx: PropTypes.object,
	itemSx: PropTypes.object,
};

export default FadeInGrid;
