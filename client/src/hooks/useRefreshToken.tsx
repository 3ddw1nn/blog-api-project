import api from "../util/axios";
import useAuth from "./useAuth";
// import { AuthContextType, UserType } from "../context/AuthProvider";

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await api.get("/refresh", {
      withCredentials: true,
    });
    console.log(auth);

    const newAccessToken = response.data.accessToken;
    console.log(newAccessToken);

    const updatedUser = {
      username: auth?.username,
      roles: auth?.roles,
      accessToken: newAccessToken,
    };

    setAuth(updatedUser);

    return response.data.accessToken;
  };
  return refresh;
};
