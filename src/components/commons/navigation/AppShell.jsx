import React, { useState, useEffect } from "react";
import { Box, CssBaseline, AppBar, IconButton, Tooltip, Fab, useTheme, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Header from "./Header";
import SideMenu from "./SideMenu";

/**
 * 애플리케이션 레이아웃 쉘 컴포넌트
 *
 * Props:
 * @param {React.ReactNode} children - 내부 콘텐츠 [Required]
 *
 * Example usage:
 * <AppShell>
 *   <YourContent />
 * </AppShell>
 */
function AppShell({ children }) {
	// 사이드메뉴 크기 상수 (반응형 레이아웃을 위한 중앙 관리)
	const SIDEBAR_WIDTH = 280;
	const APPBAR_HEIGHT = 64;

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [menuOpen, setMenuOpen] = useState(false);
	const [sideMenuVisible, setSideMenuVisible] = useState(true); // 사이드메뉴 표시/숨김 상태
	const location = useLocation();
	
	// 루트 페이지(랜딩 페이지)인지 확인
	const isRootPage = location.pathname === '/' || location.pathname === '/patterns' || location.pathname === '/course';
	
	// 플레이그라운드 페이지인지 확인 (헤더와 사이드바 모두 숨김)
	const isPlaygroundPage = location.pathname === '/playground';

	// 모바일 메뉴가 열렸을 때 스크롤 방지
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [menuOpen]);

	const handleMenuToggle = () => {
		setMenuOpen(!menuOpen);
	};

	const handleMenuClose = () => {
		setMenuOpen(false);
	};

	// 사이드메뉴 토글 핸들러
	const handleSideMenuToggle = () => {
		setSideMenuVisible(!sideMenuVisible);
		
		// 🔥 사이드메뉴 토글 후 메인 영역 크기 변화를 알리기 위해 resize 이벤트 발생
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 350); // transition 시간(300ms)보다 약간 늦게 실행
	};

	return (
		<Box sx={{ display: "flex", minHeight: "100vh", overflow: "visible" }}>
			<CssBaseline />

			{/* 헤더 영역 컨테이너 - 플레이그라운드 페이지에서는 숨김 */}
			{!isPlaygroundPage && (
				<AppBar
					position="fixed"
					color="transparent"
					elevation={0}
					sx={{
						top: 16,
						height: APPBAR_HEIGHT + "px",
						textAlign: "center",
						zIndex: (theme) => theme.zIndex.drawer + 1, // 사이드 메뉴보다 위에 표시
						backgroundColor: "transparent",
						boxShadow: "none"
					}}
				>
					<Header 
						onMenuToggle={handleMenuToggle} 
						menuOpen={menuOpen} 
					/>
				</AppBar>
			)}

			{/* 사이드메뉴 영역 컨테이너 - 데스크탑에서는 루트 페이지가 아니고 sideMenuVisible이 true일 때, 모바일에서는 메뉴가 열렸을 때 표시, 플레이그라운드 페이지에서는 숨김 */}
			{!isPlaygroundPage && (
				<Box
					component="nav"
					sx={{
						position: 'fixed',
						top: APPBAR_HEIGHT,
						width: SIDEBAR_WIDTH,
						height: `calc(100vh - ${APPBAR_HEIGHT}px)`, // 헤더 높이를 제외한 높이
						display: { 
							xs: menuOpen ? 'block' : 'none', // 모바일: 메뉴 열림 상태에 따라 표시
							md: (!isRootPage && sideMenuVisible) ? 'block' : 'none' // 데스크탑: 루트 페이지가 아니고 사이드메뉴가 visible일 때만 표시
						},
						zIndex: (theme) => theme.zIndex.drawer,
						overflowY: 'auto',
						'&::-webkit-scrollbar': { display: 'none' },
						scrollbarWidth: 'none',
						msOverflowStyle: 'none',
					}}
				>
				{/* 스크롤 내용물 컨테이너 */}
				<SideMenu
					open={menuOpen}
					onClose={handleMenuClose}
					onSideMenuToggle={handleSideMenuToggle}
					sideMenuVisible={sideMenuVisible}
				/>
				
				{/* 상단 페이드 마스크 - 스크롤에 영향받지 않도록 별도 요소로 분리 */}
				<Box
					sx={{
						position: 'fixed',
						top: APPBAR_HEIGHT,
						left: 0,
						width: SIDEBAR_WIDTH,
						height: 20, // 높이를 줄여서 스크롤 방해 최소화
						background: (theme) => `linear-gradient(to bottom, ${theme.palette.background.default} 0%, rgba(255,255,255,0) 100%)`,
						pointerEvents: 'none',
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				/>
				
				{/* 하단 페이드 마스크 - 스크롤에 영향받지 않도록 별도 요소로 분리 */}
				<Box
					sx={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						width: SIDEBAR_WIDTH,
						height: 20, // 높이를 줄여서 스크롤 방해 최소화
						background: (theme) => `linear-gradient(to top, ${theme.palette.background.default} 0%, rgba(255,255,255,0) 100%)`,
						pointerEvents: 'none',
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
				/>
			</Box>
			)}

			{/* 모바일 오버레이 - 메뉴 열린 경우 배경 어둡게 처리, 플레이그라운드 페이지에서는 숨김 */}
			{!isPlaygroundPage && menuOpen && (
				<Box
					onClick={handleMenuClose}
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: (theme) => theme.zIndex.drawer - 1,
						display: { md: 'none' }
					}}
				/>
			)}

			{/* 메인 콘텐츠 영역 - 사이드메뉴 상태에 따라 너비 동적 조정, 플레이그라운드 페이지에서는 전체 화면 사용 */}
			<Box
				component="main"
				sx={{
					ml: { 
						xs: 0, 
						md: (isRootPage || !sideMenuVisible || isPlaygroundPage) ? 0 : `${SIDEBAR_WIDTH}px` 
					},
					width: { 
						xs: "100%", 
						md: (isRootPage || !sideMenuVisible || isPlaygroundPage) ? "100%" : `calc(100% - ${SIDEBAR_WIDTH}px)` 
					},
					minHeight: "100vh",
					boxSizing: "border-box",
					overflow: "visible",
					position: "relative",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // 부드러운 전환 효과 개선
					flexGrow: 1, // 남은 공간을 모두 채우도록 설정
				}}
			>
				{/* 사이드메뉴가 숨겨진 경우 다시 열기 위한 플로팅 버튼 - 데스크탑에서만 표시, 플레이그라운드 페이지에서는 숨김 */}
				{!isMobile && !isRootPage && !sideMenuVisible && !isPlaygroundPage && (
					<Tooltip title="사이드메뉴 열기" placement="right">
						<Fab
							size="small"
							onClick={handleSideMenuToggle}
							sx={{
								position: 'fixed',
								top: APPBAR_HEIGHT + 20,
								left: 16,
								zIndex: (theme) => theme.zIndex.drawer - 1,
								backgroundColor: 'background.paper',
								color: 'text.primary',
								boxShadow: 2,
								'&:hover': {
									backgroundColor: 'action.hover',
									boxShadow: 4,
								},
								transition: 'all 0.2s ease-in-out',
							}}
						>
							<MenuIcon fontSize="small" />
						</Fab>
					</Tooltip>
				)}

				{children}
			</Box>
		</Box>
	);
}

export default AppShell;
