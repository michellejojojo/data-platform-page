import MainTitle from '../components/sections/MainTitle';
import ShuttleSection from '../components/sections/ShuttleSection';
import ReservationSection from '../components/sections/ReservationSection';
import { spacecraftData } from './spacecraftData';

/**
 * 페이지 섹션 데이터 구조
 * 각 섹션의 컴포넌트, props, 배경 설정을 포함합니다.
 */
export const sectionsData = [
  {
    id: 'hero',
    type: 'MainTitle',
    component: MainTitle,
    props: {},
    backgroundColor: "#000011", // 깊은 우주 블루
    particleColor: "#3A5A7A", // 채도 낮춘 블루
    movementSpeed: 0.001,
  },
  {
    id: 'lunar-voyager',
    type: 'ShuttleSection',
    component: ShuttleSection,
    props: { spacecraftData: spacecraftData[0] },
    backgroundColor: "#0F0F1A", // 달빛을 연상시키는 다크 블루
    particleColor: "#7A8A9A", // 채도 낮춘 연한 블루
    movementSpeed: 0.002,
  },
  {
    id: 'martian-pioneer',
    type: 'ShuttleSection',
    component: ShuttleSection,
    props: { spacecraftData: spacecraftData[1] },
    backgroundColor: "#1A0F0F", // 화성을 연상시키는 다크 레드
    particleColor: "#AA5A47", // 채도 낮춘 오렌지/레드
    movementSpeed: 0.0015,
  },
  {
    id: 'stellar-explorer',
    type: 'ShuttleSection',
    component: ShuttleSection,
    props: { spacecraftData: spacecraftData[2] },
    backgroundColor: "#0A0A15", // 심우주 다크 퍼플
    particleColor: "#6A5A8A", // 채도 낮춘 퍼플
    movementSpeed: 0.003,
  },
  {
    id: 'reservation',
    type: 'ReservationSection',
    component: ReservationSection,
    props: {},
    backgroundColor: "#000011", // 깊은 우주 블루로 통일
    particleColor: "#FFFFFF", // 화이트 파티클
    movementSpeed: 0.0008,
  },
];

/**
 * ParticleBackground용 섹션 설정 추출
 * 배경색과 파티클 정보만 포함합니다.
 */
export const getParticleSections = () => {
  return sectionsData.map(section => ({
    backgroundColor: section.backgroundColor,
    particleColor: section.particleColor,
    movementSpeed: section.movementSpeed,
  }));
}; 