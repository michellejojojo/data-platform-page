import React from 'react';
import { Stack } from '@mui/material';

/**
 * TextLineRenderer 컴포넌트
 * 
 * 여러 글자 유닛(Unit) 컴포넌트들을 가로로 배열하고, 각 유닛에 애니메이션 지연(delay)을 순차적으로 적용하여
 * 텍스트 라인 애니메이션을 생성합니다.
 * React.memo를 사용하여 props가 변경되지 않으면 불필요한 리렌더링을 방지합니다.
 *
 * Props:
 * @param {Array<Object>} units - 렌더링할 유닛들의 설정 배열.
 *   각 객체는 { UnitComponent: React.Component, customProps?: Object } 형태를 가집니다.
 *   - UnitComponent: 실제 렌더링될 글자 유닛 컴포넌트 (예: V_Animated, D_GradientDot).
 *   - customProps: 해당 유닛에만 특별히 전달할 추가 props (옵션).
 * @param {Object} baseProps - 배열 내 모든 유닛 컴포넌트에 공통적으로 전달될 props 객체.
 * @param {number} initialDelay - 첫 번째 유닛의 애니메이션 시작 전 기본 지연 시간 (ms). [Optional, 기본값: 0]
 * @param {number} letterDelay - 각 유닛 사이의 순차적 애니메이션 지연 시간 (ms). [Optional, 기본값: 100]
 * @param {number} letterSpacing - 글자 유닛들 사이의 간격 (MUI Stack의 spacing 단위). [Optional, 기본값: 0.5]
 * @param {number} scale - 현재 라인 전체에 적용될 스케일 값. 글자 간격에도 영향을 줍니다. [Optional, 기본값: 1]
 * @param {Object} commonStackProps - 유닛들을 감싸는 MUI <Stack> 컴포넌트에 전달될 추가 props. [Optional, 기본값: {}]
 *
 * Example usage:
 * const textUnits = [
 *   { UnitComponent: MyLetterA, customProps: { color: 'red' } },
 *   { UnitComponent: MyLetterB },
 * ];
 * const commonUnitProps = { isAnimated: true, size: 'large' };
 * <TextLineRenderer 
 *   units={textUnits} 
 *   baseProps={commonUnitProps} 
 *   initialDelay={500} 
 *   letterDelay={200} 
 * />
 */
const TextLineRenderer = React.memo(({
  units = [], // 기본값을 빈 배열로 설정하여 오류 방지
  baseProps = {},
  initialDelay = 0,
  letterDelay = 100,
  letterSpacing = 0.5, 
  scale = 1, 
  commonStackProps = {},
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={letterSpacing * scale} // MUI Stack의 spacing은 theme.spacing() 단위이며, scale에 따라 조정
      {...commonStackProps}
    >
      {units.map((unitItem, index) => {
        // units 배열의 각 항목에서 UnitComponent와 customProps를 추출
        const { UnitComponent, customProps = {} } = unitItem;
        
        // 각 유닛의 최종 애니메이션 시작 지연 시간 계산
        // 첫 유닛은 initialDelay를 갖고, 이후 유닛들은 이전 유닛보다 letterDelay만큼 늦게 시작
        const finalDelay = initialDelay + letterDelay * index;
        
        if (!UnitComponent) {
          // UnitComponent가 없는 경우 렌더링하지 않거나 경고를 표시할 수 있음
          console.warn(`UnitComponent at index ${index} is undefined.`);
          return null; 
        }

        return (
          <UnitComponent
            key={index} // React 리스트 렌더링 시 고유한 key prop 필수
            {...baseProps} // 모든 유닛에 공통으로 적용될 기본 props
            {...customProps} // 해당 유닛에만 적용될 커스텀 props
            startDelay={finalDelay} // 계산된 최종 시작 지연 시간
          />
        );
      })}
    </Stack>
  );
});

export default TextLineRenderer; 