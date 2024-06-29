// LoadingContext.js
import React, { createContext, useState, useContext } from 'react';

// 전역 loading context 생성
const LoadingContext = createContext();

// 외부에서 context 내부 값에 접근하기 위한 함수
export const useLoading = () => useContext(LoadingContext);
/**
 * @typedef {Object} LoadingProviderProps
 * @property {React.ReactNode} children 자식 컴포넌트
 */
/**
 * 
 * @param {LoadingProviderProps} 
 * @returns {JSX.Element} children을 Provider로 묶어서 하위 컴포넌트에서 로딩 여부를 알 수 있도록 한다
 * 로딩 여부를 전역적으로 관리한다.
 * Spinner component에서 이 loading 값을 사용하며 전역 적으로 로딩 바를 관리할 수 있다.
 */
export const LoadingProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false); // 로딩 여부
  const startLoading = () => setIsLoading(true); // 로딩 바를 보여주는 함수 
  const stopLoading = () => setIsLoading(false); // 로딩 바를 없애는 함수

  return (


    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

