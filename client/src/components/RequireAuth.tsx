import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;

// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// const RequireAuth = ({ allowedRoles }: any) => {
//   const { auth } = useAuth();
//   const location = useLocation();

//   return auth?.roles.find((role) => allowedRoles?.includes(role)) ? (
//     <Outlet />
//   ) : auth ? (
//     <Navigate to="/unauthorized" state={{ from: location }} replace />
//   ) : (
//     <Navigate to="/log-in" state={{ from: location }} replace />
//   );
// };

// export default RequireAuth;
