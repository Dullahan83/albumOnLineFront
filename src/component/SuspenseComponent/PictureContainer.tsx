import PictureSqueleton from "./PictureSqueleton";

const PictureContainer = () => {
  return (
    <div className="w-full  min-h-screen flex flex-col gap-2  flex-wrap relative -z-10">
      {new Array(12).fill(0).map((_, i) => {
        return <PictureSqueleton key={i} />;
      })}
    </div>
  );
};

export default PictureContainer;
