import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUser from './useUser';

/**
 * 인증되지 않은 유저라면 리다이렉트
 * @param {string} redirectUrl 만약 유저 정보를 가져올 수 없을 때 이동할 url
 */
export const useOnlyAuthenticated = (redirectUrl) => {
  const { myInfo, isError, isLoading } = useUser(); // 유저 정보를 가져오는 swr 커스텀 훅.

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isLoading && isError){
      navigate(redirectUrl);
    }
  }, [isLoading, isError]);
};


/**
 * 인증된 유저라면 리다이렉트
 * @param {string} redirectUrl 만약 유저 정보를 가져올 수 없을 때 이동할 url
 */
export const useOnlyNotAuthenticated = (redirectUrl) => {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`)
      .then(() => {
        navigate(redirectUrl);
      })
      .catch(()=>{

      });
  }, [navigate]);
};
