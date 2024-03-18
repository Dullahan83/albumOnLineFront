import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/AuthContext";
import useOptionalParams from "../../Hooks/useOptionalParams";
import AlbumChoiceModal from "../Modals.tsx/AlbumChoiceModal";
const AlbumChoice = () => {
  const [open, setOpen] = useState(false);
  const { albumList } = useContext(AuthContext);
  const { getParams } = useOptionalParams();
  const choice = getParams("albumChoice") === "true" ? true : false;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (choice && choice === true) {
      handleOpen();
    }
  }, [choice]);
  return (
    <>
      {albumList.length > 1 ? (
        <button onClick={handleOpen}>
          <FolderSpecialIcon />
        </button>
      ) : null}
      <AlbumChoiceModal open={open} onOpen={handleOpen} onClose={handleClose} />
    </>
  );
};

export default AlbumChoice;
