import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const ProtectedRoutes = () => {
  const { authState, isLoadings } = useContext(AuthContext);
  const { user } = authState;

  return (
    <>
      {!user?.authorized && !isLoadings ? (
        <Navigate to="/unauthorized" />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ProtectedRoutes;
