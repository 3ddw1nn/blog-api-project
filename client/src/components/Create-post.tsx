import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiPrivate from "../hooks/useApiPrivate";
import useAuth from "../hooks/useAuth";

const CreatePost = () => {
  const apiPrivate = useApiPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [post_title, setPost_title] = useState("");
  const [text, setText] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrMsg("");

    const body = {
      post_title,
      text,
    };

    console.log(body);

    apiPrivate
      .post("/user/create-post", body, {
        headers: { authorization: `Bearer ${auth?.accessToken}` },
      })
      .then((res) => {
        console.log(res);
        setPost_title("");
        navigate("/");
      })
      .catch((err) => {
        if (!err?.response) {
          setErrMsg("Err: No Server Response");
        } else if (!body.post_title || !body.text) {
          setErrMsg("Err: Missing Post Title or Text");
        } else if (err.response?.status === 401) {
          setErrMsg("Err: Unknown Error");
        } else if (err.response?.status === 403) {
          setErrMsg("Err: Failed to verify Access Token");
        } else {
          setErrMsg("Err: Submission Error");
        }
      });
  };

  return (
    <div>
      <div className="m-8">
        <section className="text-red-500 flex justify-center">
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {" "}
            {errMsg}
          </p>
        </section>
        <div className="mb-10 flex justify-center">
          <form className="flex flex-col w-3/6" onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="text-white" htmlFor="post_title">
                Post Title:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                type="post_title"
                name="post_title"
                id="post_title"
                onChange={(e) => {
                  setPost_title(e.target.value);
                }}
                placeholder="Enter a post title"
              />
            </div>
            <div className="mb-6">
              <label className="text-white" htmlFor="text">
                Text:
              </label>
              <textarea
                className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                id="text"
                placeholder="Enter your blog post text"
                name="text"
                rows={5}
                cols={40}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              ></textarea>
            </div>
            <button
              className="cursor-pointer py-2 px-4 block bg-indigo-500 text-white font-bold w-full text-center rounded"
              type="submit"
            >
              Post
            </button>
          </form>
        </div>
      </div>
      <div className="mb-6 flex justify-center"></div>
    </div>
  );
};

export default CreatePost;
