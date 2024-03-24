import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import AuthContext, { Image } from "../../Context/AuthContext";
import ArrowIconLeft from "../Shared/ArrowIconLeft";
import ArrowIconRight from "../Shared/ArrowIconRight";
import TrashIcon from "../Shared/TrashIcon";
import { cn, deletePicture } from "../Utils/func";
import CarouselPicture from "./CarouselPicture";

type CarouselProps = {
  imgArray: Image[];
  index: number;
  setIndex: (val: number) => void;
  onClose: () => void;
};

const Carousel = ({ imgArray, index, setIndex }: CarouselProps) => {
  const { authState, currentAlbum } = useContext(AuthContext);
  const [startPos, setStartPos] = useState(0);
  const queryClient = useQueryClient();

  const deletePictureMutation = useMutation({
    mutationFn: deletePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
    },
  });

  const images = imgArray;

  const handleNextImage = () => {
    index < images?.length - 1 && setIndex(index + 1);
  };

  const handlePreviousImage = () => {
    index > 0 && setIndex(index - 1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartPos(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const diff = startPos - e.changedTouches[0].clientX;
    if (diff < -50) {
      handlePreviousImage();
    }
    if (diff > 50) {
      handleNextImage();
    }
  };

  const handleDeletePicture = () => {
    if (confirm("Êtes vous sûr(e)") === true) {
      deletePictureMutation.mutate({
        id: imgArray[index].id,
        albumId: currentAlbum,
      });
    } else console.log("pas ok");
  };

  return (
    <div className="w-full h-full flex self-center justify-center text-white overflow-hidden relative  group/parent ">
      {imgArray && authState.user?.userId === imgArray[index]?.user?.id && (
        <TrashIcon
          className="absolute top-4 left-4"
          size="40px"
          onClick={handleDeletePicture}
        />
      )}

      {images?.length > 0 && index > 0 ? (
        <ArrowIconLeft
          onClick={handlePreviousImage}
          className={cn(
            "hidden absolute top-1/2 z-10 left-4 -translate-y-1/2 hover:animate-navArrow bg-neutral-900 bg-opacity-40 rounded-full  group opacity-0 group-hover/parent:opacity-100 transition-opacity duration-500 lg:flex",
            { hidden: index === 0 || images?.length <= 1 }
          )}
          size="40px"
          color="#fff"
        />
      ) : null}
      <div className="w-11/12 h-[90%] overflow-hidden self-center">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${-100 * index}%)` }}
        >
          {images?.map((img, i: number) => {
            return (
              <div
                key={i}
                className=" w-full min-w-full flex items-center justify-center relative"
              >
                <CarouselPicture
                  className="h-full "
                  pictureData={img}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>
      {images?.length > 0 && index < images?.length - 1 ? (
        <ArrowIconRight
          onClick={handleNextImage}
          className={cn(
            "hidden absolute top-1/2 z-10 right-4 opacity-0 hover:animate-navArrow bg-neutral-900 bg-opacity-40 rounded-full group-hover/parent:opacity-100 transition-opacity duration-500 -translate-y-1/2 group lg:flex",
            {
              hidden: index === images?.length - 1 || images?.length <= 1,
            }
          )}
          size="40px"
          color="#fff"
        />
      ) : null}
    </div>
  );
};

export default Carousel;
