import { createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

export const primaryColor = "#ffffff";
export const secondaryColor = "#ffffff";

// 공통 설정 (색상 관련 제외)
const commonSettings = {
	typography: {
		fontFamily:
			'"Pretendard Variable", "Roboto", "Helvetica", "Arial", sans-serif',
		wordBreak: "keep-all",
		wordWrap: "break-word",

		h1: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		h2: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		h3: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		h4: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		h5: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		h6: {
			fontFamily: 'Outfit, "Pretendard Variable", sans-serif',
			fontWeight: 700,
		},
		body1: {
			fontSize: "1.2rem",
			fontWeight: 600,
			lineHeight: 1.7,
			letterSpacing: "0.00938em",
		},
		body2: {
			fontSize: "1rem",
			fontWeight: 400,
			lineHeight: 1.43,
			letterSpacing: "0.01071em",
		},
		caption: {
			fontSize: "0.8rem",
			fontWeight: 400,
			lineHeight: 1.66,
			letterSpacing: "0.03333em",
		},
	},
	shape: {
		// borderRadius: 0, // 모든 컴포넌트의 기본 borderRadius는 0 (필요시 활성화)
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"*": {
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "transparent",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						borderRadius: "4px",
						"&:hover": {
							backgroundColor: "rgba(0, 0, 0, 0.3)",
						},
					},
					"&::-webkit-scrollbar-corner": {
						backgroundColor: "transparent",
					},
				},
				// Firefox 스크롤바 스타일
				"html": {
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
				},
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					wordBreak: "keep-all",
					overflowWrap: "break-word",
					whiteSpace: "pre-line",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: ({ theme }) => theme.spacing(6),
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: "1rem",
					height: "auto",
					padding: "0.25rem 0.25rem",
					borderRadius: "2rem",
				},
				sizeSmall: {
					fontSize: "0.85rem",
					height: "auto",
					padding: ({ theme }) => theme.spacing(0.3, 0),
				},
				label: {
					padding: ({ theme }) => theme.spacing(0.8, 0.2),
					fontWeight: 500,
				},
				labelSmall: {
					padding: ({ theme }) => theme.spacing(0.5, 0.2),
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiFilledInput: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		// MuiPaper는 다크 테마에만 특화된 스타일이 있으므로, 여기서는 제외하고 다크 테마에 직접 정의
	},
	shadows: (() => {
		const shadowColor = "rgba(0,0,0,";
		const shadowOpacity = {
			light: "0.1)",
			medium: "0.07)",
			dark: "0.06)",
		};

		const generateShadow = (offset, blur, spread, opacity) =>
			`0px 0px ${offset}px ${spread}px ${shadowColor}${opacity}`;

		return [
			"none",
			...[...Array(24)].map((_, index) => {
				const level = index + 1;
				const baseOffset = Math.min(5 + Math.floor(level / 3), 15);
				const baseBlur = Math.min(8 + Math.floor(level / 2), 38);
				const baseSpread = Math.min(3 + Math.floor(level / 4), 12);

				return [
					generateShadow(
						baseOffset,
						baseBlur,
						-baseSpread,
						shadowOpacity.light
					),
					generateShadow(baseBlur, baseBlur * 1.2, 0, shadowOpacity.medium),
					generateShadow(
						baseBlur * 1.5,
						baseBlur * 2,
						baseSpread,
						shadowOpacity.dark
					),
				].join(",");
			}),
		];
	})(),
};

// 라이트 테마 정의
const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: primaryColor, // 
		},
		secondary: {
			main: secondaryColor, // Secondary color: blueGrey의 가장 어두운 색
		},
		paper: {
			main: `${blueGrey[50]}5A`,
		},
		background: {
			default: "#ffffff",
			paper: "#fafafa",
		},
		text: {
			primary: "rgba(0, 0, 0, 0.87)",
			secondary: "rgba(0, 0, 0, 0.6)",
		},
	},
	...commonSettings, // 공통 설정 병합
	// 라이트 테마에만 특화된 components 설정이 있다면 여기에 추가
});

// 다크 테마 정의
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: primaryColor,
		},
		secondary: {
			main: secondaryColor,
		},
		paper: {
			main: `${blueGrey[900]}`,
		},
		background: {
			default: "#060A0D",
			// paper: '#1F2224',
		},
		text: {
			primary: "rgba(255, 255, 255, 0.87)",
			secondary: "rgba(255, 255, 255, 0.6)",
			contrastText: "rgba(0, 0, 0, 0.87)",
		},
	},
	...commonSettings, // 공통 설정 병합
	components: {
		...commonSettings.components, // 공통 컴포넌트 설정을 가져오고
		MuiCssBaseline: {
			styleOverrides: {
				"*": {
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "transparent",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "rgba(255, 255, 255, 0.2)",
						borderRadius: "4px",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.3)",
						},
					},
					"&::-webkit-scrollbar-corner": {
						backgroundColor: "transparent",
					},
				},
				// Firefox 스크롤바 스타일
				"html": {
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
				},
			},
		},
		MuiPaper: {
			// 다크 테마에 특화된 MuiPaper 설정 추가 또는 재정의
			styleOverrides: {
				root: {
					backgroundImage: "none",
					borderRadius: ({ theme }) => theme.spacing(1),
				},
			},
		},
	},
	// 다크모드에 맞는 그림자 설정 (commonSettings.shadows를 사용하지 않고, 다크 테마 고유 값 유지)
	// 만약 commonSettings.shadows (라이트 테마 기준)를 사용하려면 아래 shadows 부분을 주석 처리하거나 삭제
	shadows: (() => {
		const shadowColor = "rgba(255,255,255,";
		const shadowOpacity = {
			light: "0.1)",
			medium: "0.07)",
			dark: "0.06)",
		};

		const generateShadow = (offset, blur, spread, opacity) =>
			`0px 0px ${offset}px ${spread}px ${shadowColor}${opacity}`;

		return [
			"none",
			...[...Array(24)].map((_, index) => {
				const level = index + 1;
				const baseOffset = Math.min(5 + Math.floor(level / 3), 15);
				const baseBlur = Math.min(8 + Math.floor(level / 2), 38);
				const baseSpread = Math.min(3 + Math.floor(level / 4), 12);

				return [
					generateShadow(
						baseOffset,
						baseBlur,
						-baseSpread,
						shadowOpacity.light
					),
					generateShadow(baseBlur, baseBlur * 1.2, 0, shadowOpacity.medium),
					generateShadow(
						baseBlur * 1.5,
						baseBlur * 2,
						baseSpread,
						shadowOpacity.dark
					),
				].join(",");
			}),
		];
	})(),
});

export { lightTheme, darkTheme };
export default lightTheme;
