import React from "react";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
  const navigate = useNavigate();
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/forgot-password-submission");
  };
  return (
    <div>
      <div className=" mt-10 text-white text-3xl flex justify-center font-bold">
        <h3>Forgot Password?</h3>
      </div>
      <div className="mt-6 text-white text-l flex flex-col font-bold">
        <p className="flex justify-center">
          To reset your password, please enter your email address
        </p>
        <p className="flex justify-center">
          We will send the password reset instructions to the email address for
          this account
        </p>
      </div>
      <div className="m-8">
        <div className="mb-10 flex justify-center">
          <form className="flex flex-col w-3/6" onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="text-white" htmlFor="email">
                Email Address:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <button
              className="cursor-pointer py-2 px-4 block bg-indigo-500 text-white font-bold w-full text-center rounded"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
