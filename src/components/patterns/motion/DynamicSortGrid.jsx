import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";
import { AnimatePresence, motion as Motion } from "framer-motion";

/**
 * DynamicSortGrid 컴포넌트
 * 정렬 옵션에 따라 실시간으로 Grid 아이템들이 애니메이션과 함께 재정렬되는 컴포넌트
 * 컴포넌트가 미리 바인딩된 객체 배열을 받아 처리합니다.
 * 
 * Props:
 * @param {array} componentItems - 컴포넌트와 정렬 데이터를 포함한 객체 배열 [Required]
 *   각 객체는 다음 구조를 가져야 합니다:
 *   {
 *     [keyField]: 고유 식별자,
 *     component: React 컴포넌트,
 *     ...정렬에 사용할 데이터 필드들
 *   }
 * @param {string} keyField - 각 아이템의 고유 키로 사용할 필드명 [Required]
 * @param {string} sortField - 정렬 기준 필드 [Optional, 기본값: null]
 * @param {string} sortDirection - 정렬 방향 ('asc' | 'desc') [Optional, 기본값: 'asc']
 * @param {function} filterFn - 아이템 필터링 함수 (componentItem) => boolean [Optional]
 * @param {object} gridProps - MUI Grid container에 전달할 props [Optional]
 * @param {number} animationDuration - 애니메이션 지속 시간(ms) [Optional, 기본값: 500]
 * @param {number} maxRandomDelay - 최대 랜덤 딜레이(ms) [Optional, 기본값: 200]
 * @param {object} exitStyle - 아이템 퇴장 스타일 [Optional]
 * @param {object} enterStyle - 아이템 진입 스타일 [Optional]
 * @param {number} columns - 그리드 열 수 [Optional, 기본값: 12]
 * @param {object} sx - 추가 스타일 [Optional]
 * 
 * Example usage:
 * const componentItems = products.map(product => ({
 *   id: product.id,
 *   component: <ProductCard key={product.id} product={product} />,
 *   name: product.name,
 *   price: product.price,
 *   rating: product.rating,
 *   category: product.category
 * }));
 * 
 * <DynamicSortGrid
 *   componentItems={componentItems}
 *   keyField="id"
 *   sortField="price"
 *   sortDirection="asc"
 *   columns={4}
 * />
 */
function DynamicSortGrid({
  componentItems = [],
  keyField,
  sortField = null,
  sortDirection = "asc",
  filterFn = null,
  gridProps = {},
  animationDuration = 500,
  maxRandomDelay = 200,
  exitStyle = { opacity: 0, scale: 0.8, y: 50 },
  enterStyle = { opacity: 0, scale: 0.8, y: 50 },
  columns = 12,
  sx = {}
}) {
  const [renderedItems, setRenderedItems] = useState([]);
  const [containerHeight, setContainerHeight] = useState("auto");
  const containerRef = useRef(null);

  // 🎯 STEP 1: 아이템 순서 결정 - 정렬/필터링으로 새로운 배열 순서 생성
  useEffect(() => {
    // 원본 데이터를 복사하여 불변성 유지
    let processed = [...componentItems];

    // 🔍 필터링: 보여질 아이템들만 선별 (위치에서 제외될 아이템 결정)
    if (filterFn) {
      processed = processed.filter(filterFn);
      // 필터링된 아이템은 DOM에서 제거되며 exit 애니메이션 실행
    }

    // 📊 정렬: 남은 아이템들의 새로운 순서 결정 (Grid 내 위치 순서 결정)
    if (sortField) {
      processed.sort((a, b) => {
        let comparison = 0;
        const valueA = a[sortField];
        const valueB = b[sortField];

        // 데이터 타입에 따른 비교 로직
        if (typeof valueA === "string") {
          comparison = valueA.localeCompare(valueB); // 한글/영문 자연 정렬
        } else {
          comparison = valueA - valueB; // 숫자 정렬
        }

        // 정렬 방향 적용: asc(오름차순) vs desc(내림차순)
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    // ✅ 새로운 순서를 상태에 저장 → React 리렌더링 트리거
    // 이때 각 아이템의 배열 인덱스가 변경되어 Grid 내 위치가 바뀜
    setRenderedItems(processed);
  }, [componentItems, filterFn, sortField, sortDirection]);

  // 🎯 STEP 2: 컨테이너 높이 동적 계산 - 재정렬된 아이템들의 실제 화면 위치 추적
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;

      // 📐 모든 그리드 아이템의 실제 DOM 위치 측정
      const itemElements = containerRef.current.querySelectorAll(".grid-item");
      if (itemElements.length === 0) {
        setContainerHeight("auto");
        return;
      }

      // 🔍 각 아이템의 화면 상 최하단 위치 찾기
      let maxBottom = 0;
      itemElements.forEach((el) => {
        // getBoundingClientRect(): 실제 화면 좌표 (x, y, width, height) 반환
        const rect = el.getBoundingClientRect();
        // 아이템의 최하단 Y 좌표 계산 (상단 Y + 높이)
        const bottom = rect.top + rect.height;
        if (bottom > maxBottom) {
          maxBottom = bottom; // 가장 아래 있는 아이템의 하단 위치 저장
        }
      });

      // 📏 컨테이너 기준 상대적 높이 계산
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeHeight = maxBottom - containerRect.top;
      
      // 동적으로 컨테이너 높이 설정 (애니메이션 중 레이아웃 깨짐 방지)
      setContainerHeight(`${relativeHeight}px`);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [renderedItems]); // renderedItems 변경 시마다 높이 재계산

  // 🎯 STEP 3: 개별 아이템의 Grid 크기 계산 - 화면 내 차지할 공간 결정
  const calculateGridSize = () => {
    // MUI Grid는 12열 시스템 사용
    // columns prop에 따라 각 아이템이 차지할 열 수 계산
    const size = { 
      xs: 12 / (columns <= 1 ? 1 : columns) 
    };
    // 예: columns=4 → xs=3 (12/4) → 한 행에 4개 아이템
    // 예: columns=6 → xs=2 (12/6) → 한 행에 6개 아이템
    
    return size;
  };

  // 🎯 STEP 4: 애니메이션 지연 시간 계산 - 자연스러운 순차 움직임 생성
  const getRandomDelay = () => {
    // 0~maxRandomDelay 사이 랜덤 값 반환
    // 모든 아이템이 동시에 움직이지 않고 물결 효과 생성
    return Math.random() * maxRandomDelay;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        height: containerHeight, // 동적으로 계산된 높이 적용
        width: "100%",
        ...sx
      }}
    >
      <Grid 
        container 
        {...gridProps} 
        sx={{ position: "relative" }}
      >
        {/* 🎭 애니메이션 생명주기 관리: 진입/퇴장/이동 모두 처리 */}
        <AnimatePresence mode="popLayout">
          {/* 🎯 STEP 5: 실제 위치 결정 및 렌더링 - 새로운 순서대로 아이템 배치 */}
          {renderedItems.map((componentItem) => (
            <Grid
              item
              // 📱 반응형 크기 설정: 화면 크기별 다른 열 수 적용
              size={{ xs: 6, sm: 6, md: 4, lg: 3 }}
              // 🔑 React 키: Framer Motion이 동일 요소 추적하는 핵심
              key={componentItem[keyField]}
              // 📐 동적 계산된 그리드 크기 적용
              {...calculateGridSize()}
              sx={{ position: "relative" }}
              className="grid-item" // ResizeObserver에서 선택하기 위한 클래스
            >
              {/* 🎬 Framer Motion: 실제 애니메이션 처리 */}
              <Motion.div
                // 🎯 layout: FLIP 기법 활성화 (이전 위치 → 새 위치 자동 계산)
                layout
                // 🎭 초기 상태: 새로 나타나는 아이템의 시작 모습
                initial={enterStyle}
                // 🎭 활성 상태: 정상적으로 보여지는 모습
                animate={{ opacity: 1, scale: 1, y: 0 }}
                // 🎭 퇴장 상태: 사라지는 아이템의 마지막 모습
                exit={exitStyle}
                transition={{
                  type: "spring", // 물리학 기반 자연스러운 움직임
                  stiffness: 300, // 용수철 강성 (빠르기)
                  damping: 30,    // 감쇠 (바운스 정도)
                  duration: animationDuration / 1000, // 기본 지속 시간
                  delay: getRandomDelay() / 1000 // 🌊 랜덤 딜레이로 물결 효과
                }}
                style={{ width: "100%", height: "100%" }}
              >
                {/* 실제 렌더링될 컴포넌트 */}
                {componentItem.component}
              </Motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
}

DynamicSortGrid.propTypes = {
  componentItems: PropTypes.array.isRequired,
  keyField: PropTypes.string.isRequired,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(["asc", "desc"]),
  filterFn: PropTypes.func,
  gridProps: PropTypes.object,
  animationDuration: PropTypes.number,
  maxRandomDelay: PropTypes.number,
  exitStyle: PropTypes.object,
  enterStyle: PropTypes.object,
  columns: PropTypes.number,
  sx: PropTypes.object
};

export default DynamicSortGrid; 