import React, { useState } from "react";
import api from "../util/axios";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | Blob>();
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [job_title, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_Confirmation] = useState("");
  // const [errors, setErrors] = useState("");
  // useEffect(() => {
  //   api.get("/sign-up").then((res) => {
  //     setErrors(res.data.errors);
  //     // setUser(res.data.user);
  //   });
  // }, []);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image as Blob);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("job_title", job_title);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);

    api
      .post(
        "/sign-up",
        //body
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        navigate("/log-in");
      })
      .catch((err) => {
        if (err) {
          console.error(err);
        }
      });
  };

  return (
    <div>
      <div className=" mt-10 text-white text-3xl flex justify-center font-bold">
        Sign Up
      </div>
      <div className="flex justify-center">
        <div className="py-6 px-8 w-96 h-fit mt-20 bg-slate-600 rounded shadow-xl">
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold mb-2"
                htmlFor="image"
              >
                Upload Profile Picture:
              </label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.files) return;
                  setImage(e.target.files[0]);
                  // if (e.target.name === "image") {
                  //   setImage( e.target.file[0]);
                  // } else {
                  //   setImage({ [e.target.name]: e.target.value });
                  // }
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="first_name"
              >
                First Name:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="first_name"
                type="text"
                name="first_name"
                placeholder="first name"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="last_name"
              >
                Last Name:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="last_name"
                type="text"
                name="last_name"
                placeholder="last name"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="job_title"
              >
                Job Title:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="job_title"
                type="text"
                name="job_title"
                placeholder="job title"
                onChange={(e) => {
                  setJobTitle(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 font-bold" htmlFor="email">
                Email:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="email"
                type="email"
                name="email"
                placeholder="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="username"
              >
                Username:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="username"
                type="text"
                name="username"
                placeholder="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="password"
                type="password"
                name="password"
                placeholder="create a password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 font-bold"
                htmlFor="password_confirmation"
              >
                Confirm Password:
              </label>
              <input
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                placeholder="confirm password"
                onChange={(e) => {
                  setPassword_Confirmation(e.target.value);
                }}
              />
            </div>
            <button
              className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
