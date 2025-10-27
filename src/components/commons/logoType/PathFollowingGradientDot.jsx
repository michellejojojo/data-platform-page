import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';

export const PathFollowingGradientDot = ({
  pathData,
  width = 144, // 이 값은 UnitSetFollowingGradientDot에서 각 유닛별로 고정될 예정
  height = 144, // 이 값은 UnitSetFollowingGradientDot에서 각 유닛별로 고정될 예정 (보통 width와 동일하게 설정)
  scale = 1, // 외부에서 받아 스케일 조정
  strokeWidth = 40, // 배경 경로선의 두께와 원의 지름으로 사용됨
  pathColor = 'rgba(255, 255, 255, 0.3)', // color1 for path
  dotColor1 = 'rgba(255, 0, 0, 1)', // color1 for dot gradient start/end
  dotColor2 = 'rgba(255, 255, 0, 1)', // color2 for dot gradient middle
  duration = 3000, // Animation duration for one loop
  startDelay = 0,
  isTrigger = true,
  loop = true,
  svgClassName = '',
  // New props for path drawing animation
  pathDrawDuration = 600,
  pathDrawEase = d3.easeCubicOut,
  pathDrawIsReverse = false,
  pathDrawStartWithReserve = true,
}) => {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const gradientRef = useRef(null); // 그라데이션 참조 추가
  const gradientId = useMemo(() => `dotLinearGradient-${Math.random().toString(36).substr(2, 9)}`, []); // ID 변경
  const maskId = useMemo(() => `mask-${Math.random().toString(36).substr(2, 9)}`, []); // maskId로 변경
  const animationFrameId = useRef(null);
  const initialDelayTimeoutId = useRef(null);
  const pathAnimationTimeoutId = useRef(null); // For path drawing animation

  // 원의 반지름은 strokeWidth (지름)의 절반
  const actualDotRadius = strokeWidth / 2;
  // 배경 경로의 두께는 strokeWidth prop 사용
  const actualPathStrokeWidth = strokeWidth;

  useEffect(() => {
    if (!svgRef.current || !pathData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // height는 일반적으로 width와 동일하게 설정되거나, pathData의 실제 비율에 맞게 조정될 수 있음
    // 여기서는 props로 받은 height를 그대로 사용
    svg.attr('width', width * scale)
       .attr('height', height * scale) 
       .attr('class', svgClassName)
       .style('overflow', 'hidden');

    const defs = svg.append('defs');
    
    // LinearGradient로 변경
    gradientRef.current = defs.append('radialGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('y1', '0%') // 그라데이션 벡터 시작
      .attr('x2', '100%').attr('y2', '0%'); // 그라데이션 벡터 끝 (수평)

    gradientRef.current.append('stop').attr('offset', '0%').style('stop-color', dotColor2);
    gradientRef.current.append('stop').attr('offset', '100%').style('stop-color', dotColor1);
  
    // Mask 정의로 변경
    const mask = defs.append('mask')
      .attr('id', maskId);

    mask.append('path')
      .attr('d', pathData)
      .attr('fill', 'black')       // 마스크의 채우기 부분은 투명하게 (대상 안보임)
      .attr('stroke', 'white')      // 마스크의 선 부분은 불투명하게 (대상 보임)
      .attr('stroke-width', actualPathStrokeWidth); // 배경 경로와 동일한 두께

    const g = svg.append('g').attr('transform', `scale(${scale})`);

    pathRef.current = g.append('path')
      .attr('d', pathData)
      .attr('fill', 'none')
      .attr('stroke', pathColor)
      .attr('stroke-width', actualPathStrokeWidth)
      .node();

    dotRef.current = g.append('circle')
      .attr('r', actualDotRadius)
      .style('fill', `url(#${gradientId})`)
      .attr('mask', `url(#${maskId})`) // mask 속성으로 변경 및 적용
      .style('opacity', 0) // Initially hidden until path drawing starts or is done
      .node();
      
    // Path Drawing Animation Logic
    if (pathRef.current && dotRef.current) {
      const pathNode = pathRef.current;
      const pathLength = pathNode.getTotalLength();

      let initialDashoffset = pathDrawIsReverse ? (pathDrawStartWithReserve ? 0 : -pathLength) : pathLength;
      let targetDashoffset = pathDrawIsReverse ? (pathDrawStartWithReserve ? -pathLength : 0) : 0;
      if (pathDrawIsReverse && !pathDrawStartWithReserve) { // reverse, 빈 상태 시작 -> 채워진 상태 끝
        targetDashoffset = 0; // 최종은 0
        initialDashoffset = pathLength; // 시작은 pathLength
      }
      if (pathDrawIsReverse && pathDrawStartWithReserve) { // reverse, 채워진 상태 시작 -> 빈 상태 끝
        targetDashoffset = pathLength;
        initialDashoffset = 0;
      }

      const pathD3 = d3.select(pathNode);
      pathD3.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
            .attr('stroke-dashoffset', initialDashoffset);

      if (isTrigger) {
        if (pathAnimationTimeoutId.current) clearTimeout(pathAnimationTimeoutId.current);
        pathAnimationTimeoutId.current = setTimeout(() => {
          pathD3.transition()
            .duration(pathDrawDuration)
            .ease(pathDrawEase)
            .attr('stroke-dashoffset', targetDashoffset)
            .on('end', () => {
              // Optionally show dot after path drawing is complete
              // d3.select(dotRef.current).style('opacity', 1);
            });
          // Show dot when path animation starts (or a bit after)
          // For now, let the dot animation useEffect handle its own startDelay for opacity/visibility
          d3.select(dotRef.current).style('opacity', 1); // Make dot visible when path drawing starts
        }, startDelay);
      } else {
         pathD3.attr('stroke-dashoffset', initialDashoffset); // Reset if not triggered
         d3.select(dotRef.current).style('opacity', 0); // Hide dot if not triggered
      }
    }

    // Initial position for the dot (can be set even if opacity is 0)
    if (pathRef.current && dotRef.current) {
        const pathNode = pathRef.current;
        const pathLen = pathNode.getTotalLength();
        if (pathLen > 0) {
            const initialPoint = pathNode.getPointAtLength(0);
            d3.select(dotRef.current).attr('cx', initialPoint.x).attr('cy', initialPoint.y);
        }
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (initialDelayTimeoutId.current) clearTimeout(initialDelayTimeoutId.current);
      if (pathAnimationTimeoutId.current) clearTimeout(pathAnimationTimeoutId.current);
      if (svgRef.current) d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [
    pathData, width, height, scale, 
    pathColor, 
    dotColor1, dotColor2, gradientId, svgClassName,
    strokeWidth,
    maskId, // maskId 의존성 추가 (clipPathId 대신)
    isTrigger, startDelay, // For path animation trigger
    pathDrawDuration, pathDrawEase, pathDrawIsReverse, pathDrawStartWithReserve // New path animation props
  ]);

  useEffect(() => {
    if (!isTrigger || !pathRef.current || !dotRef.current || !gradientRef.current) {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (isTrigger && dotRef.current) d3.select(dotRef.current).style('opacity',0); // Hide if cannot animate
      return;
    }

    // Ensure dot is visible if trigger is true and it's time to animate
    // This might conflict with the opacity set in path drawing useEffect. 
    // Let's make it visible here just before animation starts.
    // d3.select(dotRef.current).style('opacity', 1);

    const pathNode = pathRef.current;
    const dotNode = dotRef.current;
    const gradientElement = gradientRef.current;
    const pathLength = pathNode.getTotalLength();

    if (pathLength === 0) {
      if (dotRef.current) d3.select(dotRef.current).style('opacity',0); // Hide if no path
      return;
    }
    
    // Make dot visible just before its animation loop starts, after its own startDelay
    // This will be controlled by the setTimeout for the dot's animation frame request

    let startTime = null;
    // const delta = 1; // For gradient rotation (currently commented out)

    const animate = (timestamp) => {
      if (!pathNode || !dotNode || !gradientElement) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        return;
      }
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      let progress = (elapsed / duration); // duration is for dot animation

      if (!loop && progress >= 1) {
        progress = 1;
      } else {
        progress = progress % 1;
      }

      const currentPosition = pathLength * progress;
      const point = pathNode.getPointAtLength(currentPosition);
      
      // 각도 계산 (임시 주석 처리)
      /*
      let angle = 0;
      if (pathLength > delta) { 
        const pointPrev = pathNode.getPointAtLength(Math.max(0, currentPosition - delta));
        const pointNext = pathNode.getPointAtLength(Math.min(pathLength, currentPosition + delta));
        angle = Math.atan2(pointNext.y - pointPrev.y, pointNext.x - pointPrev.x) * 180 / Math.PI;
      }
      */

      d3.select(dotNode).attr('cx', point.x).attr('cy', point.y);
      // 그라데이션 회전 적용 (임시 주석 처리)
      // if (gradientElement) { 
      //   d3.select(gradientElement).attr('gradientTransform', `rotate(${angle})`);
      // }

      if (loop || progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
    };

    if (initialDelayTimeoutId.current) clearTimeout(initialDelayTimeoutId.current);
    animationFrameId.current = null;
    startTime = null;

    initialDelayTimeoutId.current = setTimeout(() => {
      if (pathNode && dotNode && gradientElement) {
         d3.select(dotNode).style('opacity', 1); // Make dot visible right before animation starts
         animationFrameId.current = requestAnimationFrame(animate);
      }
    }, startDelay); // Dot animation also respects the common startDelay

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (initialDelayTimeoutId.current) clearTimeout(initialDelayTimeoutId.current);
      // Do not hide dot on cleanup here if isTrigger is still true, path drawing effect handles initial opacity
    };
  }, [isTrigger, pathData, duration, loop, startDelay, pathRef, dotRef, strokeWidth, gradientId, scale]); // scale 의존성 추가

  return <svg ref={svgRef} />;
}; 