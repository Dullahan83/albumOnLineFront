import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

const Navbar = () => {
  const { authState, currentAlbum } = useContext(AuthContext);
  const { user } = authState;
  const isAuthorized = user?.authorized[currentAlbum]?.validated;
  return (
    <ul className="flex gap-10 justify-self-center translate-x-1/4">
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
