import { ComponentPropsWithoutRef, useState } from "react";
import { Image } from "../Context/AuthContext";
import CustomPicture from "./CustomPicture";

type PictureFolderProps = {
  data: Image[];
  loading?: "lazy" | "eager";
  mock?: boolean;
  index?: number;
  selected?: number;
  onMouseEnter?: () => void;
  handleClick?: () => void;
  handleSelectPicture?: (val: number) => void;
  onEdit: (val) => void;
  handleOpen: () => void;
} & ComponentPropsWithoutRef<"div">;

const PictureFolder = ({
  handleClick,
  handleOpen,
  handleSelectPicture,
  data,
  onEdit,
  index,
  ...props
}: PictureFolderProps) => {
  const [openFolder, setOpenFolder] = useState(false);
  return (
    <div className="w-full">
      {data && !openFolder ? (
        <div
          className="w-full h-[40cqh] p-5 bg-red-500"
          onClick={() => setOpenFolder((prev) => !prev)}
        >
          <CustomPicture
            {...props}
            pictureData={data[0]}
            className="h-full"
            onEdit={() => onEdit(index)}
            handleClick={() => null}
            handleOpen={() => null}
          />
        </div>
      ) : (
        data.map((item, i) => {
          return (
            <CustomPicture
              {...props}
              key={i}
              handleOpen={handleOpen}
              pictureData={item}
              className="h-full relative"
              onEdit={() => onEdit(index + i)}
              handleSelectPicture={() => handleSelectPicture(index + i)}
              handleClick={handleClick}
              inAlbum
            />
          );
        })
      )}
    </div>
  );
};

export default PictureFolder;
