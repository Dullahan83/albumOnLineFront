import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ComponentPropsWithoutRef, forwardRef, useContext } from "react";
import AuthContext, { Image } from "../../Context/AuthContext";
import { deletePicture } from "../Utils/func";

interface ConfirmationModalProps extends ComponentPropsWithoutRef<"dialog"> {
  onClose: () => void;
  pictureData: Image;
  setSelected: (val: number) => void;
  index: number;
  imgArray: Image[];
}
const ConfirmationModal = forwardRef<HTMLDialogElement, ConfirmationModalProps>(
  ({ onClose, pictureData, setSelected, index, imgArray }, ref) => {
    const { currentAlbum } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const modalBody = React.useRef<HTMLDivElement>(null);
    const deletePictureMutation = useMutation({
      mutationFn: deletePicture,
      onSuccess: () => {
        if (imgArray.length === 0) onClose();
        if (index === imgArray.length - 1) setSelected(imgArray.length - 2);
        queryClient.invalidateQueries({ queryKey: ["album"] });
      },
    });
    const handleClick = (
      e: React.MouseEvent<HTMLDialogElement, MouseEvent>
    ) => {
      const target = e.target as Node;

      if (modalBody.current && !modalBody.current.contains(target)) {
        onClose();
      }
    };
    const handleDeletePicture = () => {
      deletePictureMutation.mutate({
        id: pictureData.id,
        albumId: currentAlbum,
      });
      onClose();
      setSelected(index);
    };

    // console.log(pictureData)
    return (
      <dialog
        onClick={handleClick}
        ref={ref}
        id="pictureDeletionModal"
        className={
          "min-w-full fixed top-0 min-h-screen bg-black/50 text-black dark:text-white open:flex open:flex-col items-center justify-center"
        }
      >
        <div
          ref={modalBody}
          className="p-6 bg-background rounded-lg text-black"
        >
          <p>Cette opération est irréversible, êtes vous sûr(e) ?</p>
          <div className="flex justify-between mt-4">
            <Button onClick={onClose} variant="contained">
              Annuler
            </Button>
            <Button onClick={handleDeletePicture} variant="contained">
              Valider
            </Button>
          </div>
        </div>
      </dialog>
    );
  }
);

ConfirmationModal.displayName = "Confirmation Modal";

export default ConfirmationModal;
