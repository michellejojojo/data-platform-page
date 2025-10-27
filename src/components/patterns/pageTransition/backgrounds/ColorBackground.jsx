import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * 단색 배경 컴포넌트
 * 
 * Props:
 * @param {string} color - 배경 색상 [Optional, 기본값: '#0000ff']
 *
 * Example usage:
 * <ColorBackground color="#f5f5f5" />
 */
function ColorBackground({ color = '#0000ff' }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color,
      }}
    />
  );
}

ColorBackground.propTypes = {
  color: PropTypes.string
};

export default ColorBackground; 