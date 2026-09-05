import type { MissingChildCase } from '../types/missingChild'

// All values are fictional layout fixtures. Never use a real face for samples.
export const sampleCases: MissingChildCase[] = [
  {
    id: 'sample-a',
    name: '홍길동',
    ageAtMissing: 10,
    sex: '남',
    missingDate: '2026-08-14',
    missingArea: '서울 ○○구 ○○공원 인근',
    height: '약 140cm',
    physicalFeatures: '짧은 검은 머리 · 왼쪽 볼에 작은 점',
    clothing: '파란 반팔 티셔츠 · 검은 반바지 · 흰 운동화',
    sourceLabel: '개발용 가상 데이터',
    status: 'sample',
  },
  {
    id: 'sample-b',
    name: '남궁하늘빛',
    ageAtMissing: 12,
    sex: '여',
    missingDate: '2026-07-21',
    missingArea: '경기도 ○○시 ○○구 ○○로 어린이공원 북쪽 출입구 인근 버스정류장',
    height: '약 150cm',
    physicalFeatures: '어깨까지 오는 검은 머리 · 둥근 테 안경',
    clothing:
      '흰색 줄무늬가 있는 남색 반팔 티셔츠 · 회색 긴바지 · 노란색 끈 운동화 · 작은 초록색 가방',
    sourceLabel: '개발용 가상 데이터',
    status: 'sample',
  },
  {
    id: 'sample-c',
    name: '김민수',
    ageAtMissing: 9,
    sex: '남',
    missingDate: '2026-06-05',
    missingArea: '부산 ○○구 ○○시장 동쪽 입구',
    height: '약 132cm',
    physicalFeatures:
      '짧은 검은 머리이며 앞머리가 이마를 덮음. 오른쪽 눈썹 위 작은 점, 왼쪽 팔꿈치 바깥쪽에 옅은 흉터가 있음. 검은색 둥근 테 안경을 착용함.',
    clothing:
      '가슴에 작은 흰색 무늬가 있는 초록색 반팔 티셔츠와 양옆에 주머니가 달린 베이지색 긴바지. 흰색 밑창의 검은 운동화, 회색 양말. 파란색 작은 어깨 가방을 메고 있었음.',
    sourceLabel: '개발용 가상 데이터',
    status: 'sample',
  },
  {
    id: 'sample-d',
    name: '이하늘',
    ageAtMissing: 7,
    sex: '여',
    missingDate: '2026-08-02',
    missingArea: '대전 ○○구 ○○동',
    physicalFeatures: '단발머리',
    sourceLabel: '개발용 가상 데이터',
    status: 'sample',
  },
  {
    id: 'sample-e',
    name: '박지우',
    ageAtMissing: 5,
    currentAge: 35,
    sex: '남',
    missingDate: '1996-05-04',
    missingArea: '광주 ○○구 ○○터미널 대합실',
    height: '당시 약 105cm',
    physicalFeatures: '당시 짧은 머리 · 오른쪽 손등에 작은 점',
    clothing: '빨간색 긴팔 상의 · 청바지 · 흰 운동화',
    sourceLabel: '개발용 가상 데이터',
    status: 'sample',
  },
]

export const sampleOptions = [
  { id: 'sample-a', label: '일반형 · 홍길동' },
  { id: 'sample-b', label: '긴 이름과 지역 · 남궁하늘빛' },
  { id: 'sample-c', label: '긴 특징과 착의 · 김민수' },
  { id: 'sample-d', label: '일부 정보 없음 · 이하늘' },
  { id: 'sample-e', label: '장기실종 · 박지우' },
]
