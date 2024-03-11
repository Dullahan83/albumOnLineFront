import { ComponentPropsWithoutRef } from "react";
import Masonry from "react-masonry-css";
import { Image } from "../Context/AuthContext";
import CustomPicture from "./CustomPicture";
import { getMonth } from "./Utils/func";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

type MonthContainerProps = {
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
  originalList: Image[];
} & ComponentPropsWithoutRef<"div">;

const MonthContainer = ({
  handleClick,
  handleOpen,
  handleSelectPicture,
  data,
  onEdit,
  index,
  originalList,
  ...props
}: MonthContainerProps) => {
  const month = getMonth(new Date(data[0].date.date));

  return (
    <div className="w-full flex flex-col ">
      <h3 className=" capitalize text-3xl self-start  w-fit mb-3">{month}</h3>
      <Masonry
        className="my-masonry-grid "
        columnClassName="my-masonry-grid_column"
        breakpointCols={breakpointColumnsObj}
      >
        {data.map((item, i) => {
          return (
            <CustomPicture
              {...props}
              key={i}
              handleOpen={handleOpen}
              pictureData={item}
              className="h-full relative"
              onEdit={() => onEdit(index + i)}
              handleSelectPicture={() => {
                console.log(item);

                const pictureIndex = originalList.findIndex(
                  (picture) => picture.id === item.id
                );
                // console.log(originalList[pictureIndex]);
                handleSelectPicture(pictureIndex);
              }}
              handleClick={handleClick}
              inAlbum
            />
          );
        })}
      </Masonry>
      <hr className="w-5/6 h-1 bg-black/10 backdrop-blur-lg my-10 mx-auto rounded-full " />
    </div>
  );
};

export default MonthContainer;
