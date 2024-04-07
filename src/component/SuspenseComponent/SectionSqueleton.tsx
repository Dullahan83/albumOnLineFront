import PictureSqueleton from "./PictureSqueleton";

const SectionSqueleton = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-10 w-48 bg-black bg-opacity-10 animate-pulse self-center mb-10"></div>
      <div className="w-full h-full">
        <div className=" h-9 w-36 bg-black bg-opacity-10 mb-3 "></div>
        <div className="w-full h-full flex flex-wrap gap-2">
          {new Array(9).fill(0).map((_, index) => {
            return (
              <PictureSqueleton
                className="flex-[0_1_48%] sm:flex-[0_1_32.2%] lg:flex-[0_1_24.2%] xl:flex-[0_1_16.1%] xxl:flex-[0_1_12%]  aspect-square"
                key={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionSqueleton;
