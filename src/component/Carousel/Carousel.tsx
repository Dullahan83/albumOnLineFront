import React, { Suspense, useContext, useState } from "react";
import AuthContext, { Image } from "../../Context/AuthContext";
import ArrowIconLeft from "../Shared/ArrowIconLeft";
import ArrowIconRight from "../Shared/ArrowIconRight";
import TrashIcon from "../Shared/TrashIcon";
import PictureSqueleton from "../SuspenseComponent/PictureSqueleton";
import { cn } from "../Utils/func";

type CarouselProps = {
  imgArray: Image[];
  index: number;
  setIndex: (val: number) => void;
  onClose: () => void;
};

const LazyCarouselPicture = React.lazy(() => import("./CarouselPicture"));

const Carousel = ({ imgArray, index, setIndex }: CarouselProps) => {
  const { authState } = useContext(AuthContext);
  const [startPos, setStartPos] = useState(0);

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
    const modal = document.getElementById("pictureDeletionModal");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
    // if (confirm("Êtes vous sûr(e)") === true) {
    //   deletePictureMutation.mutate({
    //     id: imgArray[index].id,
    //     albumId: currentAlbum,
    //   });
    // }
  };

  return (
    <div className="w-full h-full flex self-center justify-center text-white overflow-hidden relative  group/parent ">
      {imgArray && authState.user?.userId === imgArray[index]?.user?.id && (
        <TrashIcon
          className="absolute top-4 left-4 z-50"
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
      <div className="w-[98%] sm:w-11/12 h-[90%] overflow-hidden self-center">
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
                <Suspense
                  fallback={<PictureSqueleton className=" sm:h-full" />}
                >
                  <LazyCarouselPicture
                    className="w-auto max-h-full sm:h-full "
                    pictureData={img}
                    loading="lazy"
                  />
                </Suspense>
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
