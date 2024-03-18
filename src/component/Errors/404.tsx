import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <Layout withoutHeader>
      <div className=" flex flex-col min-h-screen w-full items-center justify-end">
        <button
          className="w-fit bg-white/30 backdrop-blur-lg border border-border-dark rounded p-2 hover:bg-white/40 shadow-lg transition-all text-2xl mb-[15vh]"
          onClick={() => navigate(-1)}
        >
          Revenir en arrière
        </button>
      </div>
    </Layout>
  );
};

export default Page404;
