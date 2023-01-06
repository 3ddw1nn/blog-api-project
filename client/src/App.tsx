import Navbar from "./components/Navbar";

import { Routes, Route } from "react-router-dom";

import LogIn from "./components/Log-in";
import SignUp from "./components/Sign-up";
import Post from "./components/Post";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import CreatePost from "./components/Create-post";
import JoinAdmin from "./components/Join-admin";
import ForgotPassword from "./components/Forgot-password";
import ForgotPasswordSubmission from "./components/Forgot-password-submission";
import LogOut from "./components/Log-out";
// import { UserDocument } from "../../src/models/user";

function App() {
  return (
    <div className=" bg-slate-900">
      <header>
        <Navbar />
      </header>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/" element={<Home />} />
          <Route path="posts/:id" element={<Post />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="log-in" element={<LogIn />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="forgot-password-submission"
            element={<ForgotPasswordSubmission />}
          />
          <Route path="log-out" element={<LogOut />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="create-post" element={<CreatePost />} />
            <Route path="join-admin" element={<JoinAdmin />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
