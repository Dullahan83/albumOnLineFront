import { Skeleton } from "@mui/material";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { Image } from "../../Context/AuthContext";
import { cn } from "../Utils/func";

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

// type Orientation = "portrait" | "landscape";

const CarouselPicture = ({
  pictureData,
  loading = "lazy",
  className,
  ...props
}: CarouselPictureProps) => {
  const { url, legend, keyword } = pictureData;
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const bgUrl = url?.split("/").join("/mini/");
  // const [orientation, setOrientation] = useState<Orientation>("landscape");
  const flatKeys = keyword.map((word: { word: string }) => word.word);
  const [loaded, setLoaded] = useState(false);
  const thumbUrl = pictureData?.url?.split("/").join("/thumb/");

  const handleLoading = () => {
    if (imgRef.current) {
      // const img = imgRef.current;
      // const imgOrientation =
      //   img.naturalHeight > img.naturalWidth ? "portrait" : "landscape";
      // setOrientation(imgOrientation);
      imgRef.current?.parentElement?.classList.add("loaded");
      setLoaded(true);
    }
  };

  useEffect(() => {
    imgRef.current?.parentElement?.classList.add("loaded");
    setLoaded(true);
  }, [imgRef.current?.complete]);

  imgRef.current?.complete &&
    imgRef.current?.parentElement?.classList.add("loaded");
  return (
    <>
      {!loaded ? (
        <Skeleton variant="rectangular" height={"100%"} />
      ) : (
        <div
          {...props}
          className={cn(
            `${className} relative border border-transparent flex justify-center   group hover:shadow-xxl shadow-red-600  overflow-hidden`,
            {
              // "row-span-2": orientation === "portrait",
            }
          )}
          style={{
            backgroundImage: `url(${
              import.meta.env.VITE_BACKEND_IMAGES
            }/${thumbUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            // backgroundSize:'100%' ,
          }}
        >
          {/* {!url.includes("mockImage")&&<div className="w-full h-full bg-black/40 backdrop-blur-lg absolute top-0 left-0 z-10"></div>} */}
          <img
            onLoad={handleLoading}
            ref={imgRef}
            src={`${
              !url.includes("mockImage")
                ? import.meta.env.VITE_BACKEND_IMAGES
                : ""
            }/${url}`}
            className={cn(`backdrop-blur-xl object-contain`, {})}
            alt={""}
            loading={loading}
            style={{ minWidth: 350 }}
          ></img>

          <div
            className={cn(
              "absolute bottom-0 w-full translate-y-full text-white max-h-[70px] flex flex-col justify-center items-center  bg-black/40 p-2 backdrop-blur-lg overflow-hidden group-hover:translate-y-0 transition-transform duration-100"
            )}
          >
            {legend && legend}
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
          <title>{flatKeys.join(", ")}</title>
        </div>
      )}
    </>
  );
};

export default CarouselPicture;
