import React, { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Stack, 
  ButtonBase,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ScrambleText from "../../patterns/typoraphy/ScrambleText";

/**
 * 네비게이션 헤더 컴포넌트
 * 상단 고정 헤더로 브랜드 로고와 네비게이션 메뉴 제공
 *
 * Props:
 * @param {function} onMenuClick - 메뉴 클릭 시 실행할 함수 [Optional]
 * @param {object} scrollState - 스크롤 상태 객체 [Optional]
 *
 * Example usage:
 * <NavigationHeader onMenuClick={handleMenuClick} scrollState={scrollState} />
 */
function NavigationHeader({ onMenuClick, scrollState }) {
  // scrollState가 제공되면 해당 값 사용, 아니면 로컬 상태 사용
  const isScrolled = scrollState?.isScrolled ?? false;
  
  // Drawer 상태 관리
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 메뉴 항목 데이터
  const menuItems = [
    { label: "Explore", sectionId: "hero" },
    { label: "LEAD Platform", sectionId: "lunar-voyager" },
    { label: "CID", sectionId: "martian-pioneer" },
    { label: "Stellar", sectionId: "stellar-explorer" },
    { label: "Booking", sectionId: "reservation" },
  ];

  // 메뉴 클릭 핸들러
  const handleMenuItemClick = (sectionId) => {
    // 부모 컴포넌트의 콜백 실행
    onMenuClick?.(sectionId);

    // 해당 섹션으로 스크롤 이동
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    
    // drawer 닫기 (모바일에서)
    setDrawerOpen(false);
  };

  // Drawer 토글 핸들러
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isScrolled ? "rgba(0, 0, 17, 0.8)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
          boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar 
          sx={{ 
            px: { xs: 2, sm: 2, md: 4, lg: 6 }, 
            py: { xs: 0.5, sm: 1 },
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            minHeight: { xs: "56px", sm: "64px" },
          }}
        >
          {/* 중앙 정렬된 로고와 메뉴 컨테이너 */}
          <Stack 
            direction="row"
            spacing={{ xs: 2, sm: 3, md: 4, lg: 6 }}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {/* 브랜드 로고 */}
            <ButtonBase
              onClick={() => handleMenuItemClick("hero")}
              sx={{
                p: { xs: 0.5, sm: 1 },
                m: 0,
                border: "none",
                background: "none",
                outline: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "baseline",
                minHeight: "auto",
                height: "auto",
                lineHeight: 1,
                borderRadius: 1,
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:active": {
                  transform: "none",
                },
              }}
            >
              <ScrambleText
                text="REACH THE STARS"
                variant="body1"
                color="white"
                startDelay={0}
                useViewportTrigger={false}
                autoHeight={true}
                sx={{
                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.95rem",
                    md: "1.05rem",
                    lg: "1.1rem",
                  },
                  fontWeight: 600,
                  letterSpacing: { xs: "0.08em", sm: "0.1em" },
                  textShadow: "0 0 10px rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    textShadow: "0 0 15px rgba(255,255,255,0.5)",
                  },
                }}
              />
            </ButtonBase>

            {/* 네비게이션 메뉴 */}
            <Stack 
              direction="row"
              spacing={{ xs: 0.5, sm: 1, md: 1.5 }}
              alignItems="center"
              justifyContent="center"
              sx={{ 
                display: { xs: "none", md: "flex" },
                overflow: "hidden",
                flexWrap: "nowrap",
                maxWidth: "100%",
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.sectionId}
                  onClick={() => handleMenuItemClick(item.sectionId)}
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    fontWeight: 500,
                    textTransform: "none",
                    letterSpacing: "0.05em",
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 2,
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: { xs: "auto", md: "80px" },
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* 모바일 메뉴(햄버거) 버튼 */}
            <Box
              sx={{ 
                display: { xs: "flex", md: "none" },
                flexShrink: 0,
                ml: "auto",
              }}
            >
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: "white",
                  p: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 모바일 Drawer 메뉴 */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "rgba(0, 0, 17, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            width: 280,
            pt: 2,
            pb: 1,
          }}
          role="presentation"
        >
          {/* Drawer 헤더 */}
          <Box sx={{ px: 3, pb: 2 }}>
            <ScrambleText
              text="REACH THE STARS"
              variant="h6"
              color="white"
              startDelay={0}
              useViewportTrigger={false}
              autoHeight={true}
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textShadow: "0 0 10px rgba(255,255,255,0.3)",
              }}
            />
          </Box>
          
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
          
          {/* 메뉴 리스트 */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.sectionId} disablePadding>
                <ListItemButton
                  onClick={() => handleMenuItemClick(item.sectionId)}
                  sx={{
                    px: 3,
                    py: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "1rem",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default NavigationHeader;
