import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import {toast} from "react-toastify"
import axios from "axios";
export const ProtectedRoute = ({ children, redirectUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`)
    .then(()=>{
      setIsLoading(false);
    })
    .catch((error)=>{
      console.log(error)
      toast.error(error.response.data.message)
      navigate('/');
    })
    // if (!isLoading && isError) {
    //   toast.error('접근 권한 x')
    //   navigate(redirectUrl);
    // }
  }, []);

  // if (!myInfo) {
  //   return null; // 또는 다른 UI를 표시할 수 있습니다.
  // }
  if (!isLoading){
    return children;

  }
};
