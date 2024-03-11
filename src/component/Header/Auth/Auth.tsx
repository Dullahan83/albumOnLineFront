import React, { useContext } from "react";
import AuthModal from "./AuthModal";
import AuthContext from "../../../Context/AuthContext";
import { useAuth } from "../../../Hooks/useAuth";

const Auth = () => {
  const [isModalopen, setIsModalOpen] = React.useState(false);
  const {authState} = useContext(AuthContext)
  const {logout} = useAuth()
  const handleModalOpening = () => {
    setIsModalOpen(true);
  };
  const handleModalClosing = () => {
    setIsModalOpen(false);
  };
  const handleLogOut = () => {
    logout()
  }
  
  return (
    <>
      {!authState.user ? <button className="" onClick={handleModalOpening}>
        Connexion
      </button> : <button onClick={handleLogOut}>Déconnexion</button>}
      <AuthModal open={isModalopen} onClose={handleModalClosing} />
    </>
  );
};

export default Auth;
