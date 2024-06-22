import {useState} from 'react';
import LogIn from './login';
import Join from './join';

function LogInAndJoin() {
  const [isLogin, setIsLogin] = useState(false);
  const goToLogin = ()=>{setIsLogin(true)}
  const goToJoin = ()=>{setIsLogin(false)};
  return <>
    {isLogin && <LogIn goToJoin = {goToJoin} />}
    {!isLogin && <Join goToLogin = {goToLogin} />}
  </>;
}

export default LogInAndJoin;
