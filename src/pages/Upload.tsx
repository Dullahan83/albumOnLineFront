import Layout from "../component/Layout/Layout";
import Multiple from "../component/UploadForms/Multiple";
import Single from "../component/UploadForms/Single";

const Upload = () => {
  return (
    <>
      <Layout>
        <section className="flex flex-col items-center gap-y-10 pb-20 ">
          <h1 className="text-3xl mt-10">Uploadez vos photos</h1>
          <Single />
          <Multiple />
        </section>
      </Layout>
    </>
  );
};

export default Upload;
