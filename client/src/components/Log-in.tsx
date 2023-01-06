import React, { useState } from "react";
// import axios from "axios";
import api from "../util/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

// import { Link } from "react-router-dom";

function LogIn() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [roles, setRoles] = useState<object>();
  // const userRef = useRef<HTMLInputElement>(null);
  // const errRef = useRef<HTMLDivElement>(null);

  const [errMsg, setErrMsg] = useState("");
  // const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      username,
      password,
    };
    // api.get("/");

    console.log(body);

    api
      .post("/log-in", body, { withCredentials: true })
      .then((res) => {
        console.log(res);
        // const roles = Object.values(res?.data?.user?.roles);
        const accessToken = res?.data?.accessToken;
        const roles = res?.data?.roles;
        console.log(accessToken);

        // setRoles(Object.values(res?.data?.user?.roles));
        setAuth({ username, roles, accessToken });
        setUsername("");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        if (!err?.response) {
          setErrMsg("Err: No Server Response");
        } else if (!body.username || !body.password) {
          setErrMsg("Err: Missing Username or Password");
        } else if (err.response?.status === 401) {
          setErrMsg("Err: Invalid Username or Password");
        } else {
          setErrMsg("Err: Login Failed");
        }
      });
  };

  return (
    <div>
      <div className=" mt-10 text-white text-3xl flex justify-center font-bold">
        <h3>Log In</h3>
      </div>
      <div className="flex justify-center">
        <div className="py-6 px-8 h-fit mt-20 bg-slate-600 rounded shadow-xl">
          <section className="text-red-500 flex justify-center">
            <p
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {" "}
              {errMsg}
            </p>
          </section>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="username"
              >
                Username:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                type="text"
                name="username"
                // ref={userRef}
                id="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="username"
              />
            </div>
            <div>
              <label
                className="block text-gray-300 font-bold"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                type="password"
                name="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="password"
              />
              <a
                className="text-sm font-thin text-gray-300 hover:underline mt-2 inline-block hover:text-indigo-300"
                href="/forgot-password"
              >
                Forgot Password?
              </a>
            </div>
            <button
              className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
