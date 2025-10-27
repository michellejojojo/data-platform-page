import React, { useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  Chip,
  Grid,
} from "@mui/material";

/**
 * 레시피 스텝 컴포넌트 - 반복되는 스텝 컨텐츠를 모듈화
 *
 * @param {string} title - 스텝 제목
 * @param {React.ReactNode} children - 스텝 내용
 */
const RecipeStep = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

/**
 * 디자인 레시피 컴포넌트
 *
 * Props:
 * @param {object} recipe - 레시피 정보 객체 [Required]
 * @param {string} recipe.basicIdea - 기본 아이디어 [Required]
 * @param {Array<string>} recipe.detailedProcess - 아이디어 구체화 과정 (배열 형태) [Required]
 * @param {string} recipe.expectedPrompt - 예상 프롬프트 [Required]
 * @param {object} recipe.advancedLearning - 심화 학습 정보 객체 [Required]
 * @param {Array} recipe.advancedLearning.propsList - 컴포넌트 속성 목록 [Required]
 * @param {Array} recipe.advancedLearning.requiredKnowledge - 필요한 CSS/JS 지식 목록 [Required]
 * @param {object} sx - 추가 스타일 객체 [Optional, 기본값: {}]
 *
 * Example usage:
 * <Recipe recipe={recipesData.scrambleText} />
 */
function Recipe({ recipe, sx = {} }) {
  const theme = useTheme();
  const [advancedTab, setAdvancedTab] = useState("props"); // 'knowledge' 또는 'props', 기본값을 'props'로 변경

  if (!recipe) return null;

  // 데이터 가용성 확인 (이전 버전 호환성)
  const hasAdvancedLearning =
    recipe.advancedLearning &&
    (recipe.advancedLearning.requiredKnowledge ||
      recipe.advancedLearning.propsList);

  // 데이터 접근 (이전 버전 호환성)
  const requiredKnowledge = hasAdvancedLearning
    ? recipe.advancedLearning.requiredKnowledge
    : recipe.requiredKnowledge || [];

  const propsList = hasAdvancedLearning
    ? recipe.advancedLearning.propsList || []
    : [];

  // 레시피 스텝 정의
  const steps = [
    {
      label: "아이디어 구체화",
      content: (
        <Box
          component="ul"
          sx={{ pl: 2.5, listStyleType: "decimal", paddingLeft: "20px" }}
        >
          {Array.isArray(recipe.detailedProcess) ? (
            recipe.detailedProcess.map((step, index) => (
              <Typography
                component="li"
                variant="body1"
                key={index}
                sx={{ mb: 1, "&::marker": { fontWeight: "bold" } }}
              >
                {step.replace(/^\d+\.?\s*/, "")}
              </Typography>
            ))
          ) : (
            <Typography variant="body1">{recipe.detailedProcess}</Typography>
          )}
        </Box>
      ),
    },
    {
      label: "기본 프롬프트",
      content: (
        <Box>
          {recipe.expectedPrompt ? (
            <Typography
              variant="body1"
              sx={{
                fontStyle: "italic",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: "0 4px 4px 0",
              }}
            >
              {recipe.expectedPrompt}
            </Typography>
          ) : (
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", opacity: 0.7 }}
            >
              아직 예상 프롬프트가 준비되지 않았습니다.
            </Typography>
          )}
        </Box>
      ),
    },
    {
      label: "심화 학습",
      content: (
        <>
          {propsList.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-start"
                sx={{ mb: 3 }}
              >
                <Chip
                  label="Props 목록"
                  color={advancedTab === "props" ? "primary" : "default"}
                  onClick={() => setAdvancedTab("props")}
                  sx={{
                    fontWeight: advancedTab === "props" ? "bold" : "normal",
                  }}
                />
                <Chip
                  label="필요 지식"
                  color={advancedTab === "knowledge" ? "primary" : "default"}
                  onClick={() => setAdvancedTab("knowledge")}
                  sx={{
                    fontWeight: advancedTab === "knowledge" ? "bold" : "normal",
                  }}
                />
              </Stack>
            </Box>
          )}

          {advancedTab === "props" && propsList.length > 0 && (
            <TableContainer
              sx={{
                backgroundColor: "transparent",
                "& .MuiTable-root": {
                  backgroundColor: "transparent",
                },
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "400px",
                width: "100%",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <Table size="medium" sx={{ minWidth: 550 }}>
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      속성명
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      타입
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      설명
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propsList.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        <Chip
                          label={item.name}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        <Chip
                          label={item.type}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        {item.description}
                        {!item.required &&
                          item.default &&
                          ` (기본값: ${item.default})`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {advancedTab === "knowledge" && (
            <TableContainer
              sx={{
                backgroundColor: "transparent",
                "& .MuiTable-root": {
                  backgroundColor: "transparent",
                },
                overflowX: "auto",
                width: "100%",
              }}
            >
              <Table size="medium" sx={{ minWidth: 450 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      문법
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      역할
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      구분
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requiredKnowledge.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        <Chip
                          label={item.name}
                          size="small"
                          sx={{
                            fontSize: "0.8rem",
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            color: "white",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        {item.role}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.9rem",
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          color: "white",
                          opacity: 1,
                        }}
                      >
                        <Chip
                          label={item.type}
                          size="small"
                          sx={{
                            fontSize: "0.8rem",
                            backgroundColor: "rgba(255, 255, 255, 0.12)",
                            color: "white",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ),
    },
    // {
    //   label: "심화 프롬프트",
    //   content: (
    //     <Box>
    //       {recipe.advancedPrompt ? (
    //         <Typography
    //           variant="body1"
    //           sx={{
    //             fontStyle: "italic",
    //             backgroundColor: "rgba(0, 0, 0, 0.05)",
    //             borderRadius: "0 4px 4px 0",
    //             filter: "blur(4px)",
    //           }}
    //         >
    //           {recipe.advancedPrompt.split("").map((char, index) => {
    //             // 랜덤하게 문자를 섞기 위한 배열 생성
    //             const chars = recipe.advancedPrompt.split("");
    //             const shuffledChars = [...chars].sort(
    //               () => Math.random() - 0.5
    //             );

    //             return <span key={index}>{shuffledChars[index]}</span>;
    //           })}
    //         </Typography>
    //       ) : (
    //         <Typography
    //           variant="body1"
    //           sx={{ fontStyle: "italic", opacity: 0.7 }}
    //         >
    //           아직 심화 프롬프트가 준비되지 않았습니다.
    //         </Typography>
    //       )}
    //     </Box>
    //   ),
    // },
  ];

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
        바이브 레시피
      </Typography>
      <Paper
        elevation={0}
        color={"#fff"}
        sx={{
          p: 3,
          borderRadius: 6,
          backgroundColor: "#00000000 !important",
          boxShadow: "none",
          border: `1px solid ${theme.palette.divider}`,
          ...sx,
        }}
      >
        <Stack spacing={4}>
          <Stepper color="secondary" orientation="vertical" activeStep={-1}>
            {steps.map((step, index) => (
              <Step key={index} active={true} completed={false}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight="700">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <RecipeStep title="">{step.content}</RecipeStep>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default Recipe;
