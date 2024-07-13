import LogInAndJoinLayout from "../../layouts/LogInAndJoin";
import { BigLogo } from "./styles";
const LogInAndJoin = () => {
  // useOnlyNotAuthenticated('/rooms');
  // const navigate = useNavigate()
  // const { myInfo, isError, isLoading } = useUser();
  // useEffect(() => {
  //   if (!isLoading && !isError ) {
  //     console.log(myInfo);
  //     toast.success("로그인이 되어있습니다.");
  //     navigate("/rooms");
  //   }

  // }, [isLoading, isError]);
  return (
    <div>
      <BigLogo src="copycat.png"></BigLogo>
      <LogInAndJoinLayout></LogInAndJoinLayout>
    </div>
  );
};

export default LogInAndJoin;
