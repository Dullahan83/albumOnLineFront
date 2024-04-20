// Import necessary dependencies
import React, { Suspense, useContext, useState } from "react";

// Import AuthContext and Image type from AuthContext
import AuthContext, { Image } from "../../Context/AuthContext";

// Import ArrowIconLeft, ArrowIconRight, TrashIcon, PictureSqueleton, and cn function
import ArrowIconLeft from "../Shared/ArrowIconLeft";
import ArrowIconRight from "../Shared/ArrowIconRight";
import TrashIcon from "../Shared/TrashIcon";
import PictureSqueleton from "../SuspenseComponent/PictureSqueleton";
import { cn } from "../Utils/func";

// Define type for CarouselProps
type CarouselProps = {
  imgArray: Image[];
  index: number;
  setIndex: (val: number) => void;
  onClose: () => void;
};

// Lazy load CarouselPicture component
const LazyCarouselPicture = React.lazy(() => import("./CarouselPicture"));

// Define Carousel component
const Carousel = ({ imgArray, index, setIndex }: CarouselProps) => {
  // Use useContext hook to access AuthContext
  const { authState } = useContext(AuthContext);

  // Use useState hook to manage startPos state
  const [startPos, setStartPos] = useState(0);

  // Destructure imgArray and user id from authState
  const images = imgArray;
  const userId = authState.user?.userId;

  // Define handleNextImage function to increment index
  const handleNextImage = () => {
    index < imgArray?.length - 1 && setIndex(index + 1);
  };

  // Define handlePreviousImage function to decrement index
  const handlePreviousImage = () => {
    index > 0 && setIndex(index - 1);
  };

  // Define handleTouchStart function to set startPos on touch start event
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartPos(e.touches[0].clientX);
  };

  // Define handleTouchEnd function to handle swipe gestures
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const diff = startPos - e.changedTouches[0].clientX;
    if (diff < -50) {
      handlePreviousImage();
    }
    if (diff > 50) {
      handleNextImage();
    }
  };

  // Define handleDeletePicture function to show picture deletion modal
  const handleDeletePicture = () => {
    const modal = document.getElementById("pictureDeletionModal");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  // Return JSX with conditional rendering based on imgArray length and index
  return (
    <div className="w-full h-full flex self-center justify-center text-white overflow-hidden relative  group/parent ">
      {imgArray && userId === imgArray[index]?.user?.id && (
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
                    loading={"eager"}
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
            "hidden absolute top-1/2 z-10 right-4 opacity-0 hover:animate-navArrow-translate-y-1/2 bg-neutral-900 bg-opacity-40 rounded-full  group  group-hover/parent:opacity-100 transition-opacity duration-500 lg:flex",
            { hidden: index === images?.length - 1 || images?.length <= 1 }
          )}
          size="40px"
          color="#fff"
        />
      ) : null}
    </div>
  );
};

export default Carousel;
