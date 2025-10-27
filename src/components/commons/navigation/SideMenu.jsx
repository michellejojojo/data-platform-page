import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Typography,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { patternsData } from "../../../data/recipesData";

// 아이콘 추가
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School"; // 코스 아이콘

/**
 * 사이드 메뉴 컴포넌트 (트리 구조)
 *
 * Props:
 * @param {boolean} open - 메뉴 열림 상태 [Required]
 * @param {function} onClose - 메뉴 닫기 핸들러 [Required]
 * @param {function} onSideMenuToggle - 사이드메뉴 토글 핸들러 함수 [Optional]
 * @param {boolean} sideMenuVisible - 사이드메뉴 표시 상태 [Optional]
 *
 * Example usage:
 * <SideMenu open={menuOpen} onClose={handleCloseMenu} onSideMenuToggle={handleSideMenuToggle} sideMenuVisible={true} />
 */
function SideMenu({ open, onClose, onSideMenuToggle, sideMenuVisible = true }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 각 패턴 카테고리 펼침 상태 관리
  const [expandedPatterns, setExpandedPatterns] = useState({});

  // 현재 경로에서 해당하는 패턴을 찾는 함수
  const findPatternFromPath = (pathname) => {
    return Object.entries(patternsData).find(([, pattern]) => {
      // 1. 패턴의 기본 경로와 매칭
      if (pathname === pattern.path) {
        return true;
      }

      // 2. 패턴의 componentList에서 매칭되는 컴포넌트 경로 찾기
      return pattern.componentList?.some(
        (component) => pathname === component.path
      );
    });
  };

  // 현재 경로에 따라 관련 패턴을 자동으로 펼침
  useEffect(() => {
    const currentPattern = findPatternFromPath(location.pathname);

    if (currentPattern) {
      const [key] = currentPattern;
      setExpandedPatterns((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
  }, [location.pathname]);

  // 패턴 카테고리 펼치기/접기 토글
  const handleTogglePattern = (patternKey, isActive) => {
    // 비활성화된 패턴은 토글하지 않음
    if (!isActive) return;

    setExpandedPatterns((prev) => ({
      ...prev,
      [patternKey]: !prev[patternKey],
    }));
  };

  // 현재 경로가 특정 패턴의 경로와 일치하는지 확인 (패턴 또는 패턴 내 컴포넌트)
  const isPatternActive = (pattern) => {
    // 패턴의 기본 경로와 매칭
    if (location.pathname === pattern.path) {
      return true;
    }

    // 패턴의 componentList에서 매칭되는 컴포넌트 경로 찾기
    return (
      pattern.componentList?.some(
        (component) => location.pathname === component.path
      ) || false
    );
  };

  // 현재 경로가 특정 컴포넌트의 경로와 일치하는지 확인
  const isComponentActive = (componentPath) => {
    return location.pathname === componentPath;
  };

  // 각 패턴의 활성화 여부 정의
  const activePatterns = {
    typography: true,
    motion: true,
    scroll: true,
    pageTransition: true,
    color: true,
    visualHook: false,
    customCursor: false,
  };

  // 비활성화 메뉴 툴팁 텍스트
  const disabledTooltipText = "업데이트 예정입니다";

  // 메인 메뉴 페이지 항목
  const mainMenuItems = [
    {
      title: "Patterns",
      path: "/patterns",
    },
    {
      title: "Course",
      path: "/course",
    },
    // {
    // 	title: "Community",
    // 	path: "/community",
    // 	icon: <PeopleIcon fontSize="small" />,
    // },
  ];

  // 사이드 메뉴 내용
  const menuContent = (
    <>
      {/* 사이드메뉴 토글 버튼 - 데스크탑에서만 표시 */}
      {!isMobile && onSideMenuToggle && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: theme.palette.background.default,
            px: 2,
            py: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Navigation
            </Typography>
            <Tooltip
              title={sideMenuVisible ? "사이드메뉴 숨기기" : "사이드메뉴 표시"}
            >
              <IconButton
                onClick={onSideMenuToggle}
                size="small"
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <MenuOpenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      <List sx={{ px: 2, pt: { xs: 8, sm: 10, md: 2 }, pb: 4, width: "100%" }}>
        {/* 메인 메뉴 항목 */}
        {mainMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                py: 1,
                "&.Mui-selected": {
                  backgroundColor: "rgba(0, 183, 255, 0.1)",
                  "& .MuiTypography-root": {
                    fontWeight: 700,
                    color: "rgba(0, 183, 255, 0.9)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 183, 255, 0.05)",
                },
              }}
            >
              <Box
                sx={{
                  mr: 2,
                  color:
                    location.pathname === item.path
                      ? "rgba(0, 183, 255, 0.9)"
                      : "inherit",
                }}
              >
                {item.icon}
              </Box>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    fontWeight={location.pathname === item.path ? 700 : 500}
                  >
                    {item.title}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* 패턴 카테고리 목록 */}
        {Object.entries(patternsData).map(([key, pattern]) => {
          const isActive = activePatterns[key] || false;
          const isPatterActive = isPatternActive(pattern);

          return (
            <React.Fragment key={key}>
              {/* 패턴 카테고리 항목 */}
              <ListItem disablePadding>
                <Tooltip
                  title={!isActive ? disabledTooltipText : ""}
                  placement="right"
                >
                  <div style={{ width: "100%" }}>
                    {" "}
                    {/* div 래퍼 추가 (disabled 컴포넌트에 Tooltip 사용 시 필요) */}
                    <ListItemButton
                      component={isActive ? RouterLink : "div"}
                      to={isActive ? pattern.path : undefined}
                      onClick={() => {
                        handleTogglePattern(key, isActive);
                        if (isMobile && isActive) onClose();
                      }}
                      selected={isPatterActive && isActive}
                      disabled={!isActive}
                      sx={{
                        borderRadius: 1,
                        fontFamily: "Outfit",
                        mb: 0,
                        opacity: !isActive ? 0.5 : isPatterActive ? 1 : 0.75,
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                          "& .MuiTypography-root": {
                            fontWeight: 700,
                          },
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.5,
                          color: "text.secondary",
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {pattern.title}
                          </Typography>
                        }
                      />
                      {isActive &&
                        (expandedPatterns[key] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        ))}
                    </ListItemButton>
                  </div>
                </Tooltip>
              </ListItem>

              {/* 컴포넌트 하위 목록 (활성화된 패턴만) */}
              {isActive && (
                <Collapse
                  in={expandedPatterns[key]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {pattern.componentList.map((component) => {
                      const isCompActive = isComponentActive(component.path);

                      return (
                        <ListItem key={component.path} disablePadding>
                          <ListItemButton
                            component={RouterLink}
                            to={component.path}
                            onClick={isMobile ? onClose : undefined}
                            selected={isCompActive}
                            sx={{
                              pl: 5,
                              py: 1,
                              borderRadius: 1,
                              my: 0,
                              opacity: isCompActive ? 1 : 0.75,
                              "&.Mui-selected": {
                                backgroundColor: "transparent",
                                "& .MuiTypography-root": {
                                  fontWeight: 600,
                                },
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            <ListItemText
                              primary={component.title}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 600,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}

        {/* Playground 링크 - 제일 하단 */}
        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={RouterLink}
            to="/playground"
            onClick={isMobile ? onClose : undefined}
            selected={location.pathname === "/playground"}
            sx={{
              borderRadius: 1,
              py: 1.5,
              border: '1px solid',
              borderColor: location.pathname === "/playground" ? 'primary.main' : 'divider',
              "&.Mui-selected": {
                backgroundColor: "transparent",
                "& .MuiTypography-root": {
                  fontWeight: 700,
                },
              },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  fontWeight={location.pathname === "/playground" ? 700 : 600}
                >
                  Playground
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  // 모바일용 임시 드로어
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {menuContent}
      </Drawer>
    );
  }

  // 데스크톱용 메뉴 (단순히 내용만 반환)
  return menuContent;
}

export default SideMenu;
