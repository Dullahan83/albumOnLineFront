import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import Layout from "../component/Layout/Layout";

const AlbumChoice = () => {
  const { albumList, setCurrentAlbum } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(albumList);
  const handleClick = (albumId: string) => {
    setCurrentAlbum(albumId);
    navigate("/");
  };

  return (
    <Layout>
      {albumList?.map((album, index) => {
        return (
          <button
            onClick={() => handleClick(album.albumId)}
            key={index}
            className="mx-4"
          >
            {album.name}
          </button>
        );
      })}
    </Layout>
  );
};

export default AlbumChoice;
