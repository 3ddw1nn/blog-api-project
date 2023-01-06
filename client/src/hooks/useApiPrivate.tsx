import { apiPrivate } from "../util/axios";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import useAuth from "./useAuth";

const useApiPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = apiPrivate.interceptors.request.use(
      // * do something before request is sent
      (config) => {
        if (config.headers && !config.headers["authorization"]) {
          config.headers["authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiPrivate.interceptors.response.use(
      // * do this if response status is 2XX
      (response) => response,
      // * do this if response status is NOT 2XX
      async (error) => {
        console.log(error);
        const prevRequest = error?.config;
        console.log(prevRequest);
        console.log(error?.response?.status);

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log(" received 403 and no prev request sent");
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["authorization"] = `Bearer ${newAccessToken}`;
          console.log(prevRequest);
          return apiPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiPrivate.interceptors.request.eject(requestIntercept);
      apiPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return apiPrivate;
};

export default useApiPrivate;
