import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * 인증되지 않은 유저라면 리다이렉트
 * @param {string} redirectUrl 만약 유저 정보를 가져올 수 없을 때 이동할 url
 */
export const useOnlyAuthenticated = (redirectUrl) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`)
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate(redirectUrl);
        }
      });
  }, [navigate]);
};


/**
 * 인증된 유저라면 리다이렉트
 * @param {string} redirectUrl 만약 유저 정보를 가져올 수 없을 때 이동할 url
 */
export const useOnlyNotAuthenticated = (redirectUrl) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`)
      .then(() => {
        navigate(redirectUrl);
      })
      .catch(()=>{

      });
  }, [navigate]);
};
