import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

/**
 * 숫자를 애니메이션으로 카운팅하는 Typography 컴포넌트
 * 
 * Props:
 * @param {number} start - 시작 값 [Optional, 기본값: 0]
 * @param {number} end - 종료 값 [Required]
 * @param {string} unit - 숫자 뒤에 표시할 단위 텍스트 [Optional, 기본값: '']
 * @param {string} unitPosition - 단위 위치 ('prefix' 또는 'suffix') [Optional, 기본값: 'suffix']
 * @param {string} unitVariant - 단위 텍스트에 적용할 Typography variant [Optional, 기본값: 'body1']
 * @param {number} duration - 애니메이션 지속 시간(초) [Optional, 기본값: 2]
 * @param {number} decimals - 소수점 자릿수 [Optional, 기본값: 0]
 * @param {string} decimal - 소수점 구분자 [Optional, 기본값: '.']
 * @param {string} separator - 천 단위 구분자 [Optional, 기본값: ',']
 * @param {boolean} useEasing - 이징 효과 사용 여부 [Optional, 기본값: true]
 * @param {string} variant - Typography 변형 [Optional, 기본값: 'h4']
 * @param {object} sx - 추가 스타일 객체 [Optional]
 * @param {boolean} enableScrollSpy - 스크롤 시 애니메이션 시작 여부 [Optional, 기본값: false]
 * 
 * Example usage:
 * <CounterTypography end={1000} unit="원" unitPosition="suffix" unitVariant="body1" />
 */
function CounterTypography({
  start = 0,
  end,
  unit = '',
  unitPosition = 'suffix',
  unitVariant = 'body1',
  duration = 2,
  decimals = 0,
  decimal = '.',
  separator = ',',
  useEasing = true,
  variant = 'h4',
  sx = {},
  enableScrollSpy = false,
  scrollSpyDelay = 0,
  scrollSpyOnce = true,
  ...props
}) {
  const theme = useTheme();

  // 최대 자릿수를 계산하여 고정 너비 결정
  const digitWidth = useMemo(() => {
    // end 값의 자릿수 계산
    const absEnd = Math.abs(end);
    const integerDigits = Math.max(
      Math.floor(Math.log10(Math.max(absEnd, 1))) + 1,
      Math.floor(Math.log10(Math.max(Math.abs(start), 1))) + 1
    );
    
    // 천 단위 구분자 계산
    const separatorCount = Math.floor((integerDigits - 1) / 3);
    
    // 소수점 자릿수 추가 (소수점 있는 경우)
    const decimalWidth = decimals > 0 ? decimals + 1 : 0; // 소수점 자체 1자리 추가
    
    // 총 자릿수 (정수 부분 + 구분자 + 소수점 부분)
    return integerDigits + separatorCount + decimalWidth;
  }, [end, start, decimals]);

  return (
    <Box sx={{ 
      display: 'inline-flex', 
      alignItems: 'baseline',
      ...sx
    }} {...props}>
      {unitPosition === 'prefix' && unit && (
        <Typography 
          variant={unitVariant} 
          component="span"
          sx={{ 
            verticalAlign: 'baseline',
            mr: 0.5
          }}
        >
          {unit}
        </Typography>
      )}
      
      <Box 
        sx={{ 
          display: 'inline-block',
          minWidth: `${digitWidth}ch`,
          textAlign: unitPosition === 'prefix' ? 'left' : 'right',
          fontSize: theme.typography[variant].fontSize,
          fontFamily: theme.typography.fontFamily
        }}
      >
        <Typography variant={variant} component="span">
          <CountUp
            start={start}
            end={end}
            duration={duration}
            decimals={decimals}
            decimal={decimal}
            separator={separator}
            useEasing={useEasing}
            enableScrollSpy={enableScrollSpy}
            scrollSpyDelay={scrollSpyDelay}
            scrollSpyOnce={scrollSpyOnce}
            redraw={false}
          />
        </Typography>
      </Box>
      
      {unitPosition === 'suffix' && unit && (
        <Typography 
          variant={unitVariant} 
          component="span"
          sx={{ 
            verticalAlign: 'baseline',
            ml: 0.5
          }}
        >
          {unit}
        </Typography>
      )}
    </Box>
  );
}

CounterTypography.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number.isRequired,
  unit: PropTypes.string,
  unitPosition: PropTypes.oneOf(['prefix', 'suffix']),
  unitVariant: PropTypes.string,
  duration: PropTypes.number,
  decimals: PropTypes.number,
  decimal: PropTypes.string,
  separator: PropTypes.string,
  useEasing: PropTypes.bool,
  variant: PropTypes.string,
  sx: PropTypes.object,
  enableScrollSpy: PropTypes.bool,
  scrollSpyDelay: PropTypes.number,
  scrollSpyOnce: PropTypes.bool
};

export default CounterTypography; 