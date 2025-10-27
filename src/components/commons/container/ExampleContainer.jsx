import React, { useState } from "react";
import { Stack, Typography, useTheme, IconButton, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";

/**
 * 예제 컨테이너 컴포넌트
 *
 * Props:
 * @param {string} title - 예제 제목 [Required]
 * @param {string} description - 예제 설명 [Required]
 * @param {React.ReactNode} children - 예제 컴포넌트 [Required]
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 *
 * Example usage:
 * <ExampleContainer
 *   title="스크램블 텍스트 효과"
 *   description="텍스트가 무작위 문자로 변경되었다가 원래 텍스트로 되돌아오는 효과입니다."
 * >
 *   <ScrambleTextDemo />
 * </ExampleContainer>
 */
function ExampleContainer({ title, children, sx = {} }) {
  const theme = useTheme();
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleRerender = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  // 전체보기 모드일 때의 스타일
  const fullscreenStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1300, // Modal의 기본 z-index와 동일
    backgroundColor: theme.palette.background.default,
    overflow: "auto",
    width: "100vw",
    height: "100vh",
  };

  // 일반 모드일 때의 스타일
  const normalStyles = {
    width: "100%",
  };

  return (
    <Stack spacing={2} sx={isFullscreen ? fullscreenStyles : normalStyles}>
      {/* 제목 섹션 - 전체보기에서는 고정 헤더로 */}
      {isFullscreen ? (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title} - 전체보기
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={handleRerender}
              sx={{
                width: 36,
                height: 36,
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleCloseFullscreen}
              sx={{
                width: 36,
                height: 36,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* 컨텐츠 영역 */}
      <Stack
        sx={{
          p: 4,
          mb: isFullscreen ? 0 : 6,
          borderRadius: isFullscreen ? 0 : 6,
          border: isFullscreen ? "none" : `1px solid ${theme.palette.divider}`,
          position: "relative",
          maxHeight: isFullscreen ? "none" : "none",
          overflow: "auto",
          alignItems: "center",
          flex: isFullscreen ? 1 : "none",
          minHeight: isFullscreen ? "calc(100vh - 64px)" : "auto", // 헤더 높이 제외
          ...sx,
        }}
      >
        {/* 컨트롤 버튼들 - 일반모드에서만 표시 */}
        {!isFullscreen && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              alignSelf: "flex-end",
              mb: 2,
            }}
          >
            <IconButton
              onClick={handleFullscreen}
              sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: 1,
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleRerender}
              sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: 1,
                width: 36,
                height: 36,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        {/* 예제 컴포넌트 */}
        <Stack key={key} alignItems="center" sx={{ width: "100%" }}>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ExampleContainer;
