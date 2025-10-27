import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import CardContainer from "./CardContainer";

/**
 * 패턴 카드 컴포넌트
 *
 * Props:
 * @param {string} title - 카드 제목 [Required]
 * @param {string} description - 카드 설명 [Required]
 * @param {string} path - 링크 경로 [Required]
 * @param {string} imageSrc - 이미지 URL [Optional] (없으면 placeholder 사용)
 * @param {number} aspectRatio - 이미지 영역 비율 [Optional, 기본값: 4/3]
 * @param {string} hoverEffect - 호버 효과 타입 [Optional, 기본값: 'scale']
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 * @param {string} imageColor - 이미지 플레이스홀더 배경색 [Optional, 기본값: '#f0f0f0']
 * @param {string} iconColor - 이미지 플레이스홀더 아이콘 색상 [Optional, 기본값: '#bdbdbd']
 * @param {boolean} isActive - 카드 활성화 여부 [Optional, 기본값: true]
 * @param {string} tagImage - 카드 우상단에 표시할 태그 이미지 URL [Optional]
 *
 * Example usage:
 * <CardPattern
 *   title="타이핑 효과"
 *   description="텍스트가 타이핑되는 것처럼 한 글자씩 나타났다가 지워지는 효과"
 *   path="/typography/typing-effect"
 *   isActive={false} // 비활성화 상태
 *   tagImage="/path/to/tag-image.svg" // 태그 이미지
 * />
 */
function CardPattern({
	title,
	path,
	imageSrc,
	aspectRatio = 1 / 1,
	hoverEffect = "scale",
	sx = {},
	imageColor = "#121212",
	iconColor = "#232323",
	isActive = true,
	tagImage,
}) {
	return (
		<CardContainer
			linkTo={isActive ? path : undefined} // 비활성화 시 링크 제거
			imageSrc={imageSrc}
			aspectRatio={aspectRatio}
			hoverEffect={isActive ? hoverEffect : "none"} // 비활성화 시 호버 효과 제거
			placeholderBgColor={imageColor}
			placeholderIconColor={iconColor}
			sx={{
				...sx,
				opacity: isActive ? 1 : 0.6, // 비활성화 시 투명도 감소
				cursor: isActive ? "pointer" : "default",
				position: "relative",
			}}
		>
			{/* 태그 이미지가 있을 경우 우상단에 표시 */}
			{tagImage && (
				<Box
					sx={{
						position: "absolute",
						top: 16,
						right: 16,
						zIndex: 2,
						width: { xs: 40, sm: 50, md: 60 },
						height: { xs: 40, sm: 50, md: 60 },
						borderRadius: "50%",
						overflow: "hidden",
						boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
						backgroundColor: "background.paper",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img
						src={tagImage}
						alt="태그"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							padding: "8px",
						}}
					/>
				</Box>
			)}

			{!isActive && (
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 2,
						backgroundColor: "rgba(0,0,0,0.5)",
					}}
				>
					<Chip
						label="업데이트 예정"
						color="primary"
						variant="filled"
						sx={{
							fontWeight: "bold",
							fontSize: "1rem",
							py: 0.5,
							px: 1,
							backgroundColor: "black",
							color: "white",
						}}
					/>
				</Box>
			)}

			<Box
				sx={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					p: { xs: 2, sm: 3, md: 4 },
					background:
						"linear-gradient(to top, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 100%)",
					zIndex: 1,
				}}
			>
				<Typography
					variant="h3"
					gutterBottom
					sx={{ 
						color: "white",
						fontSize: {
							xs: "1.2rem",  // h5 크기
							sm: "1.3rem",   // h4 크기
							md: "1.5rem"   // h3 크기
						}
					}}
				>
					{title}
				</Typography>
			</Box>
		</CardContainer>
	);
}

export default CardPattern;
