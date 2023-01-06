import { useState, useEffect } from "react";
import api from "../util/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function JoinAdmin() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");
  const [admin_code, setAdmin_code] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, []);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      admin_code,
    };

    api
      .post("/user/join-admin", body, { withCredentials: true })
      .then((res) => {
        console.log(res);
        setAdmin_code("");
        setAuth({
          username: auth?.username,
          accessToken: auth?.accessToken,
          roles: res?.data?.roles,
        });
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        if (!err?.response) {
          setErrMsg("Err: No Server Response");
        } else if (!body.admin_code) {
          setErrMsg("Err: Missing Admin Code");
        } else if (err.response?.status === 401) {
          setErrMsg("Err: Invalid Admin Code");
        } else {
          setErrMsg("Err: Admin Verification Failed");
        }
      });
  };

  return (
    <div>
      <div className=" mt-10 text-white text-3xl flex justify-center font-bold">
        <h3>Join Admin</h3>
      </div>
      <div className="flex justify-center">
        <div className="py-6 px-8 w-1/4 h-fit mt-20 bg-slate-600 rounded shadow-xl">
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
                htmlFor="admin_code"
              >
                Enter Admin Code:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                type="text"
                name="admin_code"
                id="admin_code"
                placeholder="Enter Admin Code"
                onChange={(e) => {
                  setAdmin_code(e.target.value);
                }}
              />
            </div>
            <button
              className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
              type="submit"
            >
              Join Admin
            </button>
          </form>
        </div>
      </div>
      <div className="mb-6 flex justify-center"></div>
    </div>
  );
}

export default JoinAdmin;
