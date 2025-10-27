import React from "react";
import { Box, Typography, Paper, Stack, useTheme, alpha } from "@mui/material";
import FadeInContainer from "../../patterns/motion/FadeInContainer";
import colosoLogo from "../../../assets/colosoLogo.svg";

/**
 * 강의 배너 컴포넌트
 *
 * Props:
 * @param {number} delay - 애니메이션 딜레 이 [Optional, 기본값: 0]
 *
 * Example usage:
 * <CourseBanner delay={0.5} />
 */
function CourseBanner({ delay = 0 }) {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";

	const handleClick = () => {
		window.open("https://bit.ly/4jLda0g", "_blank", "noopener,noreferrer");
	};

	return (
		<FadeInContainer
			direction="bottom"
			duration={0.6}
			offset={0}
			delay={delay}
			once={true}
		>
			<Stack spacing={{ xs: 2, md: 3 }} sx={{ width: "100%" }}>
				{/* 관련 강의 타이틀 */}
				<Typography
					variant={{ xs: "h6", md: "h5" }}
					sx={{
						fontWeight: 600,
						color: "text.primary",
						textAlign: "left",
					}}
				>
					관련 강의
				</Typography>

				{/* 배너 */}
				<Paper
					onClick={handleClick}
					elevation={0}
					sx={{
						p: { xs: 2.5, sm: 3, md: 4 },
						borderRadius: 3,
						cursor: "pointer",
						width: "100%",
						background: isDarkMode
							? `linear-gradient(135deg, ${alpha(
									theme.palette.primary.main,
									0.02
							  )} 0%, ${alpha(theme.palette.primary.main, 0.025)} 50%)`
							: `linear-gradient(135deg, ${alpha(
									theme.palette.primary.main,
									0.05
							  )} 0%, ${alpha(theme.palette.secondary.dark, 0.03)} 100%)`,
						border: `none`,
						transition: "all 0.3s ease",
						"&:hover": {
							transform: "translateY(-2px)",
						},
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							gap: 3,
							alignItems: { xs: "flex-start", sm: "center" },
							width: "100%",
						}}
					>
						{/* 썸네일 */}
						<Box
							component="img"
							src="https://cdn.day1company.io/prod/uploads/202504/151930-879/coursecard-programming-ddd.webp"
							alt="강의 썸네일"
							sx={{
								width: { xs: 80, sm: 100, md: 124 },
								height: { xs: 80, sm: 100, md: 124 },
								borderRadius: 2,
								objectFit: "cover",
								flexShrink: 0,
								alignSelf: "flex-start",
								order: { xs: 2, sm: 1 },
							}}
						/>

						{/* 강의 정보 */}
						<Stack
							spacing={1}
							sx={{
								flex: 1,
								width: "100%",
								order: { xs: 1, sm: 2 },
								alignItems: "flex-start",
							}}
						>
							<Box
								component="img"
								src={colosoLogo}
								alt="Coloso"
								sx={{
									height: { xs: 12, md: 12 },
									width: "auto",
									mb: 1,
								}}
							/>
							<Typography
								variant={{ xs: "subtitle1", md: "h6" }}
								sx={{
									fontWeight: 600,
									color: "text.primary",
									lineHeight: 1.3,
								}}
							>
								Cursor AI로 인터랙티브 웹 제작하기
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: "text.main",
									lineHeight: 1.5,
									display: { xs: "none", sm: "block" },
								}}
							>
								강의에서는 자세한 구현 방식, 프롬프트, 소스 원본 코드를
								공개합니다.
							</Typography>
						</Stack>
					</Box>
				</Paper>
			</Stack>
		</FadeInContainer>
	);
}

export default CourseBanner;
