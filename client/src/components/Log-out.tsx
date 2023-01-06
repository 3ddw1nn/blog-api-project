import api from "../util/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function LogOut() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");
  useEffect(() => {
    api
      .get("/log-out", { withCredentials: true })
      .then((res) => {
        setAuth(null);

        navigate("/");
        console.log("navigate worked");
      })
      .catch((err) => {
        console.error(err);
        setErrMessage("Could not Log out");
      });
  });

  return <div> {errMessage}</div>;
}

export default LogOut;
