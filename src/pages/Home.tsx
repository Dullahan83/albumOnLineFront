import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../Context/AuthContext";
import CustomPicture from "../component/CustomPicture";
import Layout from "../component/Layout/Layout";
import { cn } from "../component/Utils/func";
const Home = () => {
  const { data, mockupData, authState, albumList, currentAlbum } =
    useContext(AuthContext);
  const currAlbum = albumList.filter((album) => album.albumId === currentAlbum);

  return (
    <>
      <Layout>
        <div
          className={cn(
            "flex flex-col items-center gap-y-[8vh] sm:gap-y-[5vh] sm:justify-normal xl:gap-y-[6vh] h-full w-full flex-[1_1_100%] min-h-[calc(100vh-73px)]",
            {
              " sm:gap-y-0 sm:justify-between": !authState.user,
            }
          )}
        >
          <h1 className="text-3xl mt-10">
            {authState?.user?.authorized[currentAlbum]
              ? currAlbum[0]?.name
              : "Votre Album en ligne"}
          </h1>

          {authState.user && data ? (
            <div>
              <img
                src={`${import.meta.env.VITE_BACKEND_IMAGES}/${
                  currAlbum[0]?.homeUrl
                }`}
                alt="choosen home picture"
                className="max-w-[70vw] max-h-[70vh]"
              ></img>
            </div>
          ) : (
            <>
              <div className="w-11/12 sm:w-4/5 lg:w-8/12 xl:w-2/5 aspect-video xxl:w-2/6">
                <CustomPicture
                  pictureData={mockupData[0]}
                  className="blurred-img relative"
                  onEdit={() => null}
                  handleOpen={() => null}
                />
              </div>
              <>
                <p className="text-base w-11/12 md:text-xl  whitespace-pre-line">
                  Immortalisez vos souvenirs et partagez vos moments préférés
                  avec votre famille et vos amis. <br />
                  Commencez par créer votre album photo en ligne dès maintenant
                  !
                </p>
                <Link
                  to={`/creation`}
                  className="text-base md:text-xl px-6 py-4 mb-10 rounded-btn hover:bg-[#84b896] hover:text-white dark:hover:text-white dark:text-[#282a36] dark:hover:bg-[#77d9f5] shadow-lg transition-all bg-secondary dark:bg-primary-dark  tracking-wider"
                >
                  Créer un nouvel album
                </Link>
              </>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;
