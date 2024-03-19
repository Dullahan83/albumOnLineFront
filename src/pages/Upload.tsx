import Layout from "../component/Layout/Layout";
import Multiple from "../component/UploadForms/Multiple";

const Upload = () => {
  return (
    <>
      <Layout>
        <section className="flex flex-col items-center gap-y-10 pb-20 ">
          <h1 className="text-3xl mt-10">Uploadez vos photos</h1>
          <Multiple />
        </section>
      </Layout>
    </>
  );
};

export default Upload;
