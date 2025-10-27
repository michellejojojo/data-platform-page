import React from 'react';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';

/**
 * ProductCard 컴포넌트
 * 제품 정보를 표시하는 카드 UI
 * 
 * Props:
 * @param {object} product - 제품 정보 객체 [Required]
 * @param {object} category - 카테고리 정보 객체 [Required]
 * @param {object} commonStyle - 공통 스타일 객체 [Required]
 * 
 * Example usage:
 * <ProductCard 
 *   product={product} 
 *   category={categories[product.categoryId]}
 *   commonStyle={commonCategoryStyle}
 * />
 */
function ProductCard({ product, category, commonStyle }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          bgcolor: isDarkMode
            ? alpha(theme.palette.background.paper, 0.6)
            : theme.palette.background.paper,
          border: "1px solid",
          borderColor: isDarkMode
            ? alpha(theme.palette.divider, 0.3)
            : theme.palette.divider,
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            boxShadow: theme.shadows[4],
            borderColor: alpha(commonStyle.accent, 0.4),
          },
        }}
      >
        {/* 컨텐츠 영역 */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 1.5,
          }}
        >
          {/* 카테고리와 평점 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: commonStyle.accent,
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            >
              {category?.icon} {category?.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              ★ {product.rating}
            </Typography>
          </Box>

          {/* 제품명 */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {product.name}
          </Typography>

          {/* 가격 */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              fontSize: "0.85rem",
            }}
          >
            ₩{product.price.toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProductCard; 