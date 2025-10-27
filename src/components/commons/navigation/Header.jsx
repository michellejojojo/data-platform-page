import React, { useState, useEffect } from "react";
import {
	Toolbar,
	Typography,
	useTheme,
	useMediaQuery,
	Box,
	Button,
	Stack,
	Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { V, I, B, E } from "../../commons/logoType/UnitSet";
import { Sling as Hamburger } from "hamburger-react";

// 로고 컴포넌트 생성
const VibeLogo = ({ scale = 0.3, color, isTrigger = true }) => {
	return (
		<Box sx={{ display: "flex", alignItems: "center", height: 40 }}>
			<V scale={scale} color={color} duration={800} isTrigger={true} />
			<I scale={scale} color={color} duration={800} isTrigger={isTrigger} />
			<B scale={scale} color={color} duration={800} isTrigger={isTrigger} />
			<E scale={scale} color={color} duration={800} isTrigger={isTrigger} />
		</Box>
	);
};

/**
 * 애플리케이션 헤더 컴포넌트
 *
 * Props:
 * @param {function} onMenuToggle - 메뉴 토글 핸들러 함수 [Required]
 * @param {boolean} menuOpen - 사이드 메뉴 열림 상태 [Required]
 *
 * Example usage:
 * <Header onMenuToggle={handleToggleMenu} menuOpen={isMenuOpen} />
 */
function Header({ onMenuToggle, menuOpen }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
	const [scrolled, setScrolled] = useState(false);

	// 스크롤 이벤트 감지
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		// 초기 상태 설정
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// 메뉴 항목
	const menuItems = [
		{ label: "Patterns", path: "/patterns" },
		// { label: "Community", path: "/community" },
		{ label: "Course", path: "/course" },
		// { label: "About", path: "/about" },
	];

	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			sx={{
				position: "static",
				backgroundColor: scrolled ? "rgba(8, 10, 13, 0.6)" : "transparent",
				backdropFilter: scrolled ? "blur(32px)" : "none",
				boxShadow: "none",
				transition: "all 0.3s ease-in-out",
				border: "solid rgba(255, 255, 255, 0.2)",
				borderWidth: scrolled ? "0.5px" : "0px",
				borderRadius: scrolled ? "32px" : "0",
				width: scrolled
					? {
							xs: "94%",
							sm: "90%",
							md: "85%",
							lg: "calc(100% - 100px)",
					  }
					: "100%",
				maxWidth: "100%",
				margin: "0 auto",
				height: "100%",
				overflow: "hidden",
				px: {
					xs: 2,
					sm: 3,
					md: 4,
				},
			}}
		>
			<Stack width={'100%'}>
				<Stack
					direction="row"
					height="100%"
					alignItems="center"
					justifyContent="space-between"
					disableGutters
				>
					{/* 로고 */}
					<Stack
						component={RouterLink}
						to="/"
						sx={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<VibeLogo
							scale={isMobile ? 0.12 : isTablet ? 0.13 : 0.15}
							color="white"
							isTrigger={scrolled}
						/>
					</Stack>

					{/* 데스크탑 메뉴 */}
					{!isMobile && (
						<Stack
							direction="row"
							spacing={2}
							sx={{
								mx: { sm: 2, md: 3, lg: 3 },
							}}
						>
							{menuItems.map((item) => (
								<Button
									key={item.label}
									component={RouterLink}
									to={item.path}
									color="inherit"
									sx={{
										fontWeight: 800,
										textTransform: "none",
										letterSpacing: "0.02rem",
										fontSize: "1rem",
										opacity: scrolled ? 1 : 1,
										"&:hover": {
											opacity: 1,
											backgroundColor: "transparent",
										},
										px: { sm: 1, md: 1.5 },
									}}
								>
									{item.label}
								</Button>
							))}
						</Stack>
					)}

					{/* ThemeToggle과 모바일 햄버거 메뉴를 함께 배치 */}
					{isMobile && (
						<Box
							sx={{ display: "flex", alignItems: "center", marginRight: -1 }}
						>
							{/* ThemeToggle을 사용하려면 AppShell에서 mode와 toggleMode를 받고, 
							Header를 통해 전달받거나, 혹은 ThemeToggle을 AppShell에 직접 배치해야 합니다. 
							현재 Header는 ThemeToggle을 직접 렌더링하지 않습니다. */}

							<Hamburger
								toggled={menuOpen}
								toggle={onMenuToggle}
								size={20}
								color={theme.palette.common.white}
							/>
						</Box>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Header;
