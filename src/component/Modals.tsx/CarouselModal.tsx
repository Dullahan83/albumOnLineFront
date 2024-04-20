import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Image } from "../../Context/AuthContext";
import Carousel from "../Carousel/Carousel";
import CloseCrossIcon from "../Shared/CloseIcon";

interface CarouselProps extends ComponentPropsWithoutRef<"dialog"> {
  imgArray: Image[];
  index: number;
  onClose: () => void;
  setIndex: (val: number) => void;
  show: boolean;
}

const CarouselModal = forwardRef<HTMLDialogElement, CarouselProps>(
  ({ onClose, show, ...props }, ref) => {
    return (
      <dialog
        ref={ref}
        className="bg-transparent min-w-full min-h-screen top-0 left-0 fixed h-full m-0"
      >
        <div className="bg-neutral-900 w-full h-full relative flex justify-center">
          <CloseCrossIcon
            onClick={onClose}
            className="absolute top-4 right-4 z-50 group"
            color="#fff"
            size="40px"
          />
          {show ? <Carousel {...props} onClose={onClose} /> : null}
        </div>
      </dialog>
    );
  }
);
CarouselModal.displayName = "CarouselModal";
export default CarouselModal;
