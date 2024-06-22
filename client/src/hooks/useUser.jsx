import useSwr from 'swr';
import axios from 'axios';
const useUser = ()=>{
    const fetcher = (url) => axios.get(url).then(res=>res.data);
    const {data, error, isLoading} = useSwr('http://localhost:3001/api/v1/users/myself', fetcher);
    console.log(data, error, isLoading);
    return{
        myInfo: data,
        isError: error,
        isLoading
    }
}

export default useUser;