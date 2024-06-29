import { BeatLoader } from "react-spinners";
import { SpinnerWrapper } from "./styles";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * @returns {JSX.Element} 로딩 여부에 따라서 로딩 바를 UI에 띄운다.
 * 
 * 로딩 바를 전역적으로 관리하고 싶을 때 사용한다.
 * react-spinners 라이브러리를 사용하여 로딩 바를 구성한다
 * 전역 컨텍스트에서 로딩 여부를 가져온 다음 그에 따라 로딩 바를 띄운다
 * 주의 사항 !!! LoadingContext로 감싸진 컴포넌트 하위에서 사용할 수 있다.
 */
export const Spinner = () => {
  const { isLoading } = useLoading();
  return (
    <SpinnerWrapper>
      {isLoading && <BeatLoader color="#36d7b7"></BeatLoader>}
    </SpinnerWrapper>
  );
};
