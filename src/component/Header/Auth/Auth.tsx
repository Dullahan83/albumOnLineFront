import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useContext, useEffect } from "react";
import AuthContext from "../../../Context/AuthContext";
import { useAuth } from "../../../Hooks/useAuth";
import useOptionalParams from "../../../Hooks/useOptionalParams";
import { useWindowSize } from "../../../Hooks/useWindowSize";
import AuthModal from "./AuthModal";

const Auth = () => {
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const { authState } = useContext(AuthContext);
  const { logout } = useAuth();
  const { getParams } = useOptionalParams();
  const { width } = useWindowSize();

  const inscription = getParams("inscription") === "true" ? true : false;

  const connection = getParams("connection") === "true" ? true : false;

  const handleModalOpening = () => {
    setIsModalOpen(true);
  };
  const handleModalClosing = () => {
    setIsModalOpen(false);
  };
  const handleLogOut = () => {
    logout();
  };

  useEffect(() => {
    if ((inscription && inscription === true) || connection) {
      setIsModalOpen(true);
    }
  }, [inscription, connection]);
  return (
    <>
      {!authState.user ? (
        <button onClick={handleModalOpening} aria-label="Log-in" title="Log-in">
          {width >= 640 ? (
            <LoginIcon />
          ) : (
            <span className=" flex sm:hidden">Connexion</span>
          )}
        </button>
      ) : (
        <button onClick={handleLogOut} aria-label="Log-out" title="Log-out">
          {width >= 640 ? (
            <LogoutIcon className="hidden sm:flex" />
          ) : (
            <span className="flex sm:hidden">Deconnexion</span>
          )}
        </button>
      )}
      <AuthModal
        open={isModalopen}
        inscription={inscription}
        onClose={handleModalClosing}
      />
    </>
  );
};

export default Auth;
