import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import ExampleContainer from './ExampleContainer';

/**
 * 여러 예제를 세로 목록 형태로 표시하는 컨테이너 컴포넌트
 *
 * Props:
 * @param {Array<object>} examples - 표시할 예제 배열 [Required]
 *   - 각 객체는 { title: string, description?: string, component: React.ReactNode } 형태
 * @param {number} spacing - 예제 간 간격 [Optional, 기본값: 4]
 *
 * Example usage:
 * const myExamples = [
 *   { title: '기본 사용법', component: <MyComponent /> },
 *   { title: '고급 옵션', component: <MyComponent option="advanced" /> },
 * ];
 * <ExampleListContainer examples={myExamples} />
 */
function ExampleListContainer({ examples, spacing = 4 }) {
  return (
    <Stack spacing={spacing}>
      {examples.map((example, index) => (
        <ExampleContainer
          key={index} // Use index as key if titles are not unique, otherwise use example.title
          title={example.title}
          description={example.description || ''} // Optional description
        >
          {example.component}
        </ExampleContainer>
      ))}
    </Stack>
  );
}

ExampleListContainer.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      component: PropTypes.node.isRequired,
    })
  ).isRequired,
  spacing: PropTypes.number,
};

export default ExampleListContainer; 