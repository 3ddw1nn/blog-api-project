import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { auth } = useAuth();

  return auth?.roles?.includes("2001") ? (
    auth?.roles?.includes("5051") ? (
      // * ADMIN
      <nav className="bg-slate-800">
        <div className="flex justify-between h-16 px-10 shadow items-center">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl text-white lg:text-2xl font-bold cursor-pointer"
            >
              SendMoods
            </Link>
            {/* <div className="hidden md:flex justify-around space-x-4">
      <Link className="hover:text-white text-gray-500" to="/">
        Posts
      </Link>
    </div> */}
          </div>
          <div className="flex space-x-4 items-center">
            <Link
              className="text-gray-500 hover:text-white text-md"
              to="/log-out"
            >
              Log Out
            </Link>
            <div className="text-white font-bold"> {auth?.username} </div>
            <div className="text-white font-bold">: </div>
            <div className="text-orange-500 font-bold">ADMIN </div>
          </div>
        </div>
      </nav>
    ) : (
      // * USER NOT ADMIN
      <nav className="bg-slate-800">
        <div className="flex justify-between h-16 px-10 shadow items-center">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl text-white lg:text-2xl font-bold cursor-pointer"
            >
              SendMoods
            </Link>
            {/* <div className="hidden md:flex justify-around space-x-4">
    <Link className="hover:text-white text-gray-500" to="/">
      Posts
    </Link>
  </div> */}
          </div>
          <div className="flex space-x-4 items-center">
            <div className="flex space-x-2 ">
              <Link
                className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500 text-sm"
                to="/join-admin"
              >
                Join Admin
              </Link>
            </div>
            <Link
              className="text-gray-500 hover:text-white text-md"
              to="/log-out"
            >
              Log Out
            </Link>
            <div className="text-white font-bold"> {auth?.username} </div>
            <div className="text-white font-bold">: </div>
            <div className="text-indigo-600 font-bold">USER </div>
          </div>
        </div>
      </nav>
    )
  ) : (
    // * NOT USER NOT ADMIN
    <nav className="bg-slate-800">
      <div className="flex justify-between h-16 px-10 shadow items-center">
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-xl text-white lg:text-2xl font-bold cursor-pointer"
          >
            SendMoods
          </Link>
          {/* <div className="hidden md:flex justify-around space-x-4">
            <Link className="hover:text-white text-gray-500" to="/">
              Posts
            </Link>
          </div> */}
        </div>
        <div className="flex space-x-4 items-center">
          <div className="flex space-x-2 ">
            <div className="text-white font-bold">You are not logged in </div>
          </div>
          <Link className="text-gray-500 text-md" to="/log-in">
            Log In
          </Link>
          <Link
            className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-500 text-sm"
            to="/sign-up"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
