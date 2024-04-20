import { ComponentPropsWithoutRef, useContext, useRef } from "react";
import AuthContext, { Image } from "../Context/AuthContext";
import EditIcon from "./Shared/EditIcon";
import TrashIcon from "./Shared/TrashIcon";
import { cn, getMonth } from "./Utils/func";

type CustomPictureProps = {
  classDiv?: string;
  classImg?: string;
  pictureData: Image;
  loading?: "lazy" | "eager";
  inAlbum?: boolean;
  mock?: boolean;
  index?: number;
  selected?: number;
  onMouseEnter?: () => void;
  handleClick?: () => void;
  handleSelectPicture?: (val: number) => void;
  onEdit: (val) => void;
  handleOpen: () => void;
} & ComponentPropsWithoutRef<"div">;

const CustomPicture = ({
  pictureData,
  classImg = "w-full h-full",
  loading = "lazy",
  inAlbum = false,
  className,
  index = 0,
  handleClick,
  handleOpen,
  onEdit,
  handleSelectPicture,
  ...props
}: CustomPictureProps) => {
  const { authState } = useContext(AuthContext);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const thumbUrlArray = pictureData?.url?.split("/");
  thumbUrlArray?.splice(2, 0, "thumb");
  const thumbUrl = inAlbum ? thumbUrlArray?.join("/") : pictureData?.url;

  const flatKeys = pictureData?.keyword?.map((word) => word.word);

  const handleLoading = () => {
    if (imgRef.current && imgRef.current.complete) {
      imgRef.current?.parentElement?.classList.add("loaded");
    }
  };

  imgRef.current?.complete &&
    imgRef.current?.parentElement?.classList.add("loaded");

  const handleShowPicture = () => {
    handleClick();
    handleSelectPicture(index);
  };
  const handleDeletePicture = () => {
    handleSelectPicture(index);
    const timer = setTimeout(handleOpen, 100);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <div
        {...props}
        className={cn(
          `${className} relative border border-transparent group  overflow-hidden`,
          {
            "h-auto sm:max-h-[500px]": inAlbum,
          }
        )}
      >
        <img
          onLoad={handleLoading}
          ref={imgRef}
          src={`${import.meta.env.VITE_BACKEND_IMAGES}/${thumbUrl}`}
          className={cn(
            `${classImg} backdrop-blur-xl hover:cursor-zoom-in object-cover `,
            {
              "w-full aspect-video hover:cursor-default": !inAlbum,
            }
          )}
          alt={`picture of ${pictureData?.keyword?.map(
            (keyword) => keyword.word
          )}`}
          loading={loading}
          onClick={() => (inAlbum ? handleClick && handleShowPicture() : null)}
        ></img>

        <div
          className={cn(
            "absolute top-0 w-full z-0 text-white max-h-[70px] -translate-y-full flex justify-center items-center  bg-black/40 p-2 backdrop-blur-lg overflow-hidden group-hover:translate-y-0 transition-transform duration-100",
            {
              " text-[10px] sm:text-xs h-[7%] min-h-[30px]": inAlbum,
              "justify-between":
                authState.user?.userId === pictureData?.user?.id,
              hidden: !inAlbum,
            }
          )}
        >
          {authState.user?.userId === pictureData?.user?.id ? (
            <TrashIcon onClick={handleDeletePicture} />
          ) : null}
          {`Ajoutée par ${
            pictureData?.user?.name
              ? pictureData?.user?.name
              : "Utilisateur Supprimé"
          }`}
          {authState.user?.userId === pictureData?.user?.id ? (
            <EditIcon onClick={onEdit} />
          ) : null}
        </div>

        <div
          className={cn(
            "absolute bottom-0 w-full translate-y-full text-white max-h-[70px] flex flex-col justify-center items-center  bg-black/40 p-2 backdrop-blur-lg overflow-hidden group-hover:translate-y-0 transition-transform duration-100",
            {
              " text-[10px] sm:text-xs min-h-[30px]": inAlbum,
              hidden: !inAlbum,
            }
          )}
        >
          {pictureData?.legend && pictureData?.legend}
          <span
            className={cn("first-letter:uppercase", {
              "mt-1 ": pictureData?.legend,
            })}
          >
            {`${getMonth(new Date(pictureData?.date?.date))} ${new Date(
              pictureData.date.date
            ).getFullYear()}`}
          </span>
        </div>

        <title>{flatKeys?.join(", ")}</title>
      </div>
    </>
  );
};

export default CustomPicture;
