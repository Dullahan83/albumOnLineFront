import { ComponentPropsWithoutRef, useRef, useState } from "react";
import { Image } from "../../Context/AuthContext";
import { cn } from "../Utils/func";

// Define the type for the CarouselPictureProps, which includes properties for the classDiv, classImg, pictureData, loading, index, selected, onMouseEnter, and handleClick
type CarouselPictureProps = {
  classDiv?: string;
  classImg?: string;
  pictureData: Image;
  loading?: "lazy" | "eager";
  index?: number;
  selected?: number;
  onMouseEnter?: () => void;
  handleClick?: (val: number) => void;
} & ComponentPropsWithoutRef<"div">;

// Define the CarouselPicture component, which takes in the CarouselPictureProps as its props
const CarouselPicture = ({
  pictureData,
  loading = "lazy",
  className,
  ...props
}: CarouselPictureProps) => {
  // Destructure the url, legend, and keyword properties from the pictureData object
  const { url, legend, keyword } = pictureData;

  // Create a ref for the img element
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Create a state variable called loaded, which is initially set to false
  const [loaded, setLoaded] = useState(false);

  const handleLoading = () => {
    setLoaded(true);
  };
  return (
    <>
      <div
        {...props}
        className={cn(
          `${className} relative  flex justify-center group overflow-hidden`
        )}
      >
        <img
          onLoad={handleLoading}
          ref={imgRef}
          src={`${import.meta.env.VITE_BACKEND_IMAGES}/${url}`}
          className={cn(
            `backdrop-blur-xl object-contain h-full min-w-[350px]`,
            {
              "backdrop-blur-none": loaded,
            }
          )}
          alt={`picture of ${pictureData?.keyword?.map(
            (keyword) => keyword?.word
          )}`}
          loading={loading}
        ></img>

        <div
          className={cn(
            "absolute bottom-0 w-full translate-y-full text-white max-h-[70px] flex flex-col justify-center items-center  bg-black/40 p-2 backdrop-blur-lg overflow-hidden group-hover:translate-y-0 transition-transform duration-100"
          )}
        >
          {legend}
          <span className={cn({ "mt-1": pictureData?.legend })}>
            {new Date(pictureData.date.date).toLocaleDateString()}
          </span>
        </div>

        <div
          className={cn(
            "absolute top-0 w-full text-white max-h-[70px] -translate-y-full flex justify-center items-center  bg-black/40 p-2 backdrop-blur-lg overflow-hidden group-hover:translate-y-0 transition-transform duration-100"
          )}
        >
          {`Photo ajoutée par ${pictureData.user?.name}`}
        </div>
        <title>
          {keyword.map((word: { word: string }) => word.word).join(", ")}
        </title>
      </div>
    </>
  );
};

export default CarouselPicture;
