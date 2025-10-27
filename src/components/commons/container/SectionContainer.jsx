import React from 'react';
import { Stack } from '@mui/material';
import PropTypes from 'prop-types';
import ContentContainer from './ContentContainer';

/**
 * 섹션 컨테이너 컴포넌트 - 상하 여백이 있는 페이지 섹션을 감싸는 컨테이너
 * 
 * Props:
 * @param {React.ReactNode} children - 컨테이너에 들어갈 콘텐츠 [Required]
 * @param {number | Object} py - 상하 패딩 값 [Optional, 기본값: 8]
 * @param {number | Object} pt - 상단 패딩 값 [Optional]
 * @param {number | Object} pb - 하단 패딩 값 [Optional]
 * @param {string} bgcolor - 배경색 [Optional]
 * @param {Object} sx - 추가 스타일 [Optional]
 * @param {boolean} fullWidth - 전체 너비 사용 여부 (true일 경우 ContentContainer를 사용하지 않음) [Optional, 기본값: false]
 *
 * Example usage:
 * <SectionContainer py={10}>
 *   <Typography>섹션 내용</Typography>
 * </SectionContainer>
 */
function SectionContainer({ 
  children, 
  py = 8, 
  pt,
  pb,
  bgcolor,
  sx = {},
  fullWidth = false
}) {
  const boxStyles = {
    width: '100%',
    py,
    pt,
    pb,
    bgcolor,
    mb: 16,
    ...sx
  };

  return (
    <Stack sx={boxStyles}>
      {fullWidth ? (
        children
      ) : (
        <ContentContainer>
          {children}
        </ContentContainer>
      )}
    </Stack>
  );
}

SectionContainer.propTypes = {
  children: PropTypes.node.isRequired,
  py: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  pt: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  pb: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  bgcolor: PropTypes.string,
  sx: PropTypes.object,
  fullWidth: PropTypes.bool
};

export default SectionContainer; 