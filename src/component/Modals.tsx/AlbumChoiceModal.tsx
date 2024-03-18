import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { ComponentPropsWithoutRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

interface AlbumChoiceModalProps extends ComponentPropsWithoutRef<"dialog"> {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AlbumChoiceModal = ({ open, onClose }: AlbumChoiceModalProps) => {
  const { albumList, setCurrentAlbum } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };
  const handleAlbumChoice = (albumId: string) => {
    setCurrentAlbum(albumId);
    onClose();
    navigate("/");
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="album choice modal"
      PaperProps={{
        sx: {
          padding: "24px 16px", // Applique un padding autour du contenu du Dialog
        },
      }}
    >
      <DialogTitle className="flex self-center gap-x-8">
        Choisissez votre album
      </DialogTitle>

      <DialogContent className="flex flex-col items-center">
        <DialogContentText className="text-center">
          Il semblerait que vous soyez affilié à plusieurs albums en même temps
        </DialogContentText>
        <DialogContentText>
          A quel album souhaitez vous accéder ?
        </DialogContentText>
      </DialogContent>
      <DialogActions className="flex flex-col">
        {albumList.map((album, index) => {
          return (
            <Button
              key={index}
              onClick={() => handleAlbumChoice(album.albumId)}
            >
              {album.name}
            </Button>
          );
        })}
      </DialogActions>
    </Dialog>
  );
};
export default AlbumChoiceModal;
