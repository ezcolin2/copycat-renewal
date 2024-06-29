import useSwr from 'swr';
import axios from 'axios';

/**
 * 
 * @returns 
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