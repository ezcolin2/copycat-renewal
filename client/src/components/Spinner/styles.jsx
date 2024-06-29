import styled from "styled-components";

/**
 * 로딩 바의 위치를 지정한다.
 * 무조건 정중앙에 배치한다.
 * z-index가 가장 크게 설정되어 있어야 한다.
 */
export const SpinnerWrapper = styled.div`
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
