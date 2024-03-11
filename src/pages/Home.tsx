import { useContext } from "react";
import AuthContext from "../Context/AuthContext";
import CustomPicture from "../component/CustomPicture";
import Layout from "../component/Layout/Layout";

const Home = () => {
  const { data, mockupData, authState } = useContext(AuthContext);
  return (
    <>
      <Layout>
        <div className="flex flex-col items-center h-full w-full">
          <h1 className="text-3xl mt-10">
            {authState.user ? "Les Estubés" : "Votre Album en ligne"}
          </h1>

          {data ? (
            <div className="h-[500px] aspect-[0.764]   mt-10 xxl:w-2/5">
              <CustomPicture
                pictureData={data[0]}
                className="blurred-img h-full relative w-full"
                onEdit={() => null}
                handleOpen={() => null}
              />
            </div>
          ) : (
            <div className="w-3/5 aspect-video mt-10 xxl:w-2/5">
              <CustomPicture
                pictureData={mockupData[0]}
                className="blurred-img relative"
                onEdit={() => null}
                handleOpen={() => null}
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;
