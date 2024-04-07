import { ComponentPropsWithoutRef, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

const Navbar = ({ ...props }: ComponentPropsWithoutRef<"nav">) => {
  const { authState, currentAlbum } = useContext(AuthContext);
  const { user } = authState;
  const isAuthorized = user?.authorized[currentAlbum]?.validated;
  return (
    <ul className={` ${props.className}  `}>
      <li>
        <Link to="/">Accueil</Link>
      </li>
      {isAuthorized && (
        <>
          <li>
            <Link to={`/album/${currentAlbum}`}>Album</Link>
          </li>
          <li>
            <Link to="/upload">Télécharger</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
