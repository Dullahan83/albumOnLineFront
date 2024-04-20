import React, { ComponentPropsWithoutRef, Suspense } from "react";
import { Image } from "../Context/AuthContext";
import PictureSqueleton from "./SuspenseComponent/PictureSqueleton";
import { getMonth } from "./Utils/func";

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

const LazyCustomPicture = React.lazy(() => import("./CustomPicture"));

const MonthContainer = ({
  handleClick,
  handleOpen,
  handleSelectPicture,
  loading,
  data,
  onEdit,
  originalList,
  ...props
}: MonthContainerProps) => {
  const month = getMonth(new Date(data[0].date.date));

  return (
    <div className="w-full flex flex-col ">
      <h3 className=" capitalize text-3xl self-start  w-fit my-4">{month}</h3>
      <div className="flex flex-wrap gap-2">
        {data.map((item, i) => {
          return (
            <Suspense
              fallback={
                <PictureSqueleton className="flex-[0_1_48%] sm:flex-[0_1_32.2%] lg:flex-[0_1_24.2%] xl:flex-[0_1_16.1%] xxl:flex-[0_1_12%]  aspect-square" />
              }
              key={i}
            >
              <LazyCustomPicture
                {...props}
                handleOpen={handleOpen}
                pictureData={item}
                className="flex-[0_1_48%] sm:flex-[0_1_32.2%] lg:flex-[0_1_24.2%] xl:flex-[0_1_16.1%] xxl:flex-[0_1_12%] aspect-square relative"
                onEdit={() => {
                  const pictureIndex = originalList.findIndex(
                    (picture) => picture.id === item.id
                  );
                  onEdit(pictureIndex);
                }}
                handleSelectPicture={() => {
                  const pictureIndex = originalList.findIndex(
                    (picture) => picture.id === item.id
                  );
                  handleSelectPicture(pictureIndex);
                }}
                handleClick={handleClick}
                inAlbum
                loading={loading}
              />
            </Suspense>
          );
        })}
      </div>
      <hr className="w-5/6 h-1 bg-black/10 backdrop-blur-lg my-20 mx-auto rounded-full " />
    </div>
  );
};

export default MonthContainer;
