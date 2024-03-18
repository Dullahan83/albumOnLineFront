import React, { useContext, useEffect } from "react";
import AuthContext from "../../../Context/AuthContext";
import { useAuth } from "../../../Hooks/useAuth";
import useOptionalParams from "../../../Hooks/useOptionalParams";
import AuthModal from "./AuthModal";

const Auth = () => {
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const { authState } = useContext(AuthContext);
  const { logout } = useAuth();
  const { getParams } = useOptionalParams();
  const inscription = getParams("inscription") === "true" ? true : false;

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
    if (inscription && inscription === true) {
      setIsModalOpen(true);
    }
  }, [inscription]);
  return (
    <>
      {!authState.user ? (
        <button className="" onClick={handleModalOpening}>
          Connexion
        </button>
      ) : (
        <button onClick={handleLogOut}>Déconnexion</button>
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
