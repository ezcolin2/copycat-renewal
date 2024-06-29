import useSwr from 'swr';
import axios from 'axios';

/**
 * @typedef {Object} UserData
 * @property {any} myInfo 사용자 정보 데이터.
 * @property {boolean} isError 오류 발생 여부.
 * @property {boolean} isLoading 데이터 로딩 상태.
 */

/**
 * @returns {UserData} 사용자 정보와 로딩 상태.
 */
const useUser = ()=>{
    const fetcher = (url) => axios.get(url).then(res=>res.data);
    const {data, error, isLoading} = useSwr(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/myself`, fetcher);
    console.log(data, error, isLoading);
    return{
        myInfo: data,
        isError: error,
        isLoading
    }
}

export default useUser;