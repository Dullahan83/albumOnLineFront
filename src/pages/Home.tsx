import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import useOptionalParams from "../Hooks/useOptionalParams";
import CustomPicture from "../component/CustomPicture";
import Layout from "../component/Layout/Layout";
import { cn } from "../component/Utils/func";
const Home = () => {
  const { data, mockupData, authState, albumList, currentAlbum } =
    useContext(AuthContext);
  const { getParams } = useOptionalParams();
  const currAlbum = albumList.filter((album) => album.albumId === currentAlbum);
  const auth = getParams("auth");

  return (
    <>
      <Layout>
        <div
          className={cn(
            "flex flex-col items-center gap-y-20 h-full w-full flex-[1_1_100%] min-h-[calc(100vh-73px)]",
            {
              "py-20   pb-16": !authState.user,
              "py-0 gap-y-0 justify-evenly":
                auth === import.meta.env.VITE_CREATION_AUTH,
            }
          )}
        >
          <h1 className="text-3xl mt-10">
            {authState?.user?.authorized[currentAlbum]
              ? currAlbum[0]?.name
              : "Votre Album en ligne"}
          </h1>

          {authState.user && data ? (
            <div className="h-[500px] aspect-[0.764]   mt-10 xxl:w-2/5">
              <img
                src={`${import.meta.env.VITE_BACKEND_IMAGES}/${
                  currAlbum[0].homeUrl
                }`}
                alt="choosen home picture"
                className="w-full"
              ></img>
            </div>
          ) : (
            <>
              <div className="sm:w-4/5 lg:w-6/12 xl:w-2/5 aspect-video xxl:w-2/5">
                <CustomPicture
                  pictureData={mockupData[0]}
                  className="blurred-img relative"
                  onEdit={() => null}
                  handleOpen={() => null}
                />
              </div>
              {auth === import.meta.env.VITE_CREATION_AUTH ? (
                <>
                  <p className="text-base w-11/12 md:text-xl  whitespace-pre-line">
                    Immortalisez vos souvenirs et partagez vos moments préférés
                    avec vos amis et votre famille. <br />
                    Commencez par créer un album photo personnalisé dès
                    maintenant !
                  </p>
                  <Link
                    to={`/creation?auth=${auth}`}
                    className="text-base md:text-xl px-6 py-4 rounded-btn hover:bg-[#84b896] hover:text-white dark:hover:text-white dark:text-[#282a36] dark:hover:bg-[#77d9f5] shadow-lg transition-all bg-secondary dark:bg-primary-dark  tracking-wider"
                  >
                    Créer un nouvel album
                  </Link>
                </>
              ) : null}
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;
