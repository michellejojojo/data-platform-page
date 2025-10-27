import React from 'react';
import { Grid } from '@mui/material';

/**
 * 그리드 컨테이너 컴포넌트
 * 
 * Props:
 * @param {Array} items - 그리드에 표시할 데이터 아이템 배열 [Optional]
 * @param {Function} renderItem - 각 아이템을 렌더링할 컴포넌트 함수 [Optional]
 * @param {React.ReactNode} children - 그리드 내부 아이템들 (items와 renderItem 대신 직접 자식으로 넣을 경우) [Optional]
 * @param {number|object} spacing - 그리드 아이템 간 간격 [Optional, 기본값: 2]
 * @param {object} sx - 추가 스타일 속성 [Optional]
 * @param {object} itemSizes - 그리드 아이템의 기본 크기 설정 [Optional, 기본값: { xs: 12, sm: 6, md: 4, lg: 3 }]
 *
 * Example usage:
 * // 방법 1: items와 renderItem 사용
 * <GridContainer 
 *   items={cardData} 
 *   renderItem={(item, index) => (
 *     <CardPattern title={item.title} description={item.description} path={item.path} />
 *   )}
 *   spacing={2} 
 *   itemSizes={{ xs: 12, sm: 6, md: 4 }}
 * />
 *
 * // 방법 2: 자식 컴포넌트로 사용
 * <GridContainer spacing={2}>
 *   {items.map(item => (
 *     <GridContainer.Item key={item.id}>
 *       <YourComponent />
 *     </GridContainer.Item>
 *   ))}
 * </GridContainer>
 */
function GridContainer({ 
  items, 
  renderItem, 
  children, 
  spacing = 2, 
  sx = {}, 
  itemSizes = { xs: 12, sm: 6, md: 4, lg: 3 } 
}) {
  // items와 renderItem이 제공된 경우 자동으로 그리드 아이템 생성
  if (items && renderItem) {
    return (
      <Grid container spacing={spacing} sx={sx}>
        {items.map((item, index) => (
          <Grid key={index} size={itemSizes} sx={{}}>
            {renderItem(item, index)}
          </Grid>
        ))}
      </Grid>
    );
  }

  // children을 사용하는 경우 (기존 방식)
  const childrenWithSizes = React.Children.map(children, child => {
    if (child && child.type === Item) {
      return React.cloneElement(child, { defaultSize: itemSizes });
    }
    return child;
  });

  return (
    <Grid container spacing={spacing} sx={sx}>
      {childrenWithSizes}
    </Grid>
  );
}

/**
 * 그리드 아이템 컴포넌트
 * 
 * Props:
 * @param {React.ReactNode} children - 아이템 내부 콘텐츠 [Required]
 * @param {object} size - 그리드 아이템 크기 [Optional]
 * @param {object} defaultSize - 기본 그리드 아이템 크기 (부모 GridContainer에서 자동 전달) [Optional]
 * @param {object} sx - 추가 스타일 속성 [Optional]
 *
 * Example usage:
 * <GridContainer.Item size={{ xs: 12, md: 6 }}>
 *   <YourComponent />
 * </GridContainer.Item>
 */
function Item({ children, size, defaultSize = { xs: 12, sm: 6, md: 4, lg: 3 }, sx = {} }) {
  return (
    <Grid size={size || defaultSize} sx={sx}>
      {children}
    </Grid>
  );
}

// Item 컴포넌트를 GridContainer의 속성으로 추가
GridContainer.Item = Item;

export default GridContainer; 