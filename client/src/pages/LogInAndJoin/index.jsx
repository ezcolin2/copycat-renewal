import {useState} from 'react';
import LogInAndJoinLayout from '../../layouts/LogInAndJoin';
import {BigLogo} from './styles';
function LogInAndJoin() {
  return <>
    <BigLogo src="copycat.png"></BigLogo>
    <LogInAndJoinLayout></LogInAndJoinLayout>
  </>
}

export default LogInAndJoin;
