import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * GridImage 컴포넌트
 * 그리드 갤러리의 개별 이미지 아이템
 * 
 * Props:
 * @param {string} src - 이미지 URL [Required]
 * @param {function} onClick - 클릭 이벤트 핸들러 [Required]
 * @param {number} index - 이미지 인덱스 [Required]
 * @param {object} style - 추가 스타일 객체 [Optional]
 * 
 * Example usage:
 * <GridImage 
 *   src="/images/example.jpg"
 *   onClick={handleImageClick}
 *   index={0}
 * />
 */
const GridImage = ({ src, style, onClick, index }) => {
  return (
    <Box
      component={motion.div}
      layoutId={`grid-image-${index}`}
      onClick={() => onClick(index)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 1,
        cursor: 'pointer',
        background: '#f0f0f0',
        ...style
      }}
    >
      <Box
        component={motion.img}
        layoutId={`grid-image-content-${index}`}
        src={src}
        alt={`Gallery image ${index + 1}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

/**
 * OverlayContent 컴포넌트
 * 확대된 이미지 위에 표시되는 오버레이 콘텐츠
 * 
 * Props:
 * @param {ReactNode} children - 오버레이에 표시할 콘텐츠 [Required]
 * @param {string} position - 오버레이 위치 (center, bottom) [Optional, 기본값: 'bottom']
 * 
 * Example usage:
 * <OverlayContent position="center">
 *   <h3>이미지 제목</h3>
 *   <p>이미지 설명 텍스트</p>
 * </OverlayContent>
 */
const OverlayContent = ({ children, position = 'bottom' }) => {
  // 위치에 따른 스타일 조정
  const positionStyles = {
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    bottom: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'column',
      bottom: 0,
      left: 0,
      width: '100%',
      padding: '2rem',
    },
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
      sx={{
        position: 'absolute',
        display: 'flex',
        zIndex: 10,
        color: 'white',
        background: position === 'bottom' ? 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))' : 'transparent',
        ...positionStyles[position],
      }}
    >
      {children}
    </Box>
  );
};

/**
 * ZoomedOverlay 컴포넌트
 * 전체화면으로 확대된 이미지 컨테이너
 * 
 * Props:
 * @param {object} image - 표시할 이미지 객체 [Required]
 * @param {number} index - 이미지 인덱스 [Required]
 * @param {function} onClose - 닫기 버튼 클릭 시 실행할 함수 [Required]
 * 
 * Example usage:
 * <ZoomedOverlay
 *   image={{ src: '/images/example.jpg', content: <div>Content</div> }}
 *   index={0}
 *   onClose={handleClose}
 * />
 */
const ZoomedOverlay = ({ image, index, onClose }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'auto',
      }}
      onClick={onClose}
    >
      {/* 배경 이미지 블러 및 필터 적용 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: `url(${image.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.4)',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          zIndex: -1,
        }}
      />

      <Box
        component={motion.div}
        layoutId={`grid-image-${index}`}
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          component={motion.img}
          layoutId={`grid-image-content-${index}`}
          src={image.src}
          alt={`Enlarged view ${index + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        
        {image.content && (
          <OverlayContent position={image.contentPosition || 'bottom'}>
            {image.content}
          </OverlayContent>
        )}
        
        <IconButton
          component={motion.button}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: '1.5rem',
            left: '1.5rem',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            color: 'black',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: 2,
            zIndex: 1200,
            p: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

/**
 * GridGallery 컴포넌트
 * 전체 그리드 뷰 컴포넌트
 * 
 * Props:
 * @param {Array} images - 표시할 이미지 객체 배열 [Required]
 *   - src: 이미지 URL [Required]
 *   - content: 확대 시 표시할 콘텐츠 [Optional]
 *   - contentPosition: 콘텐츠 위치 (center 또는 bottom) [Optional]
 * @param {number} columns - 그리드 열 수 [Optional, 기본값: 3]
 * @param {number|string} gap - 그리드 간격 [Optional, 기본값: '1rem']
 * @param {string} aspectRatio - 이미지 비율 [Optional, 기본값: '4 / 3']
 * 
 * Example usage:
 * <GridGallery 
 *   images={[
 *     { 
 *       src: '/images/example1.jpg',
 *       content: <div><h3>제목</h3><p>설명...</p></div>
 *     },
 *     // ... 더 많은 이미지
 *   ]}
 *   columns={3}
 *   gap="1rem"
 *   aspectRatio="4 / 3"
 * />
 */
const GridGallery = ({ 
  images = [], 
  columns = 3, 
  gap = '1rem', 
  aspectRatio = '4 / 3'
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // 이미지 클릭 핸들러
  const handleImageClick = (index) => {
    setActiveIndex(index);
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  };

  // 확대 이미지 닫기 핸들러
  const handleClose = () => {
    setActiveIndex(null);
    document.body.style.overflow = ''; // 스크롤 복원
  };

  // 이미지 비율을 백분율로 변환
  const calculatePaddingTop = () => {
    if (typeof aspectRatio === 'string') {
      // "4 / 3" 형식 처리
      const [width, height] = aspectRatio.split('/').map(num => parseFloat(num.trim()));
      return `${(height / width) * 100}%`;
    } else if (typeof aspectRatio === 'number') {
      // 숫자 형식 처리 (예: 1.33)
      return `${(1 / aspectRatio) * 100}%`;
    }
    return '75%'; // 기본값 4:3
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap,
          width: '100%',
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              paddingTop: calculatePaddingTop(),
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <GridImage
                src={image.src}
                onClick={handleImageClick}
                index={index}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <AnimatePresence>
        {activeIndex !== null && (
          <ZoomedOverlay
            image={images[activeIndex]}
            index={activeIndex}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </Box>
  );
};

GridGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      content: PropTypes.node,
      contentPosition: PropTypes.oneOf(['center', 'bottom']),
    })
  ).isRequired,
  columns: PropTypes.number,
  gap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aspectRatio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GridGallery; 