import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context/AuthContext";
import useOptionalParams from "../../Hooks/useOptionalParams";
import { useWindowSize } from "../../Hooks/useWindowSize";
import AlbumChoiceModal from "../Modals.tsx/AlbumChoiceModal";
const AlbumChoice = () => {
  const { albumList } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const { getParams } = useOptionalParams();
  const { width } = useWindowSize();

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
        <button
          title="Select the album you want to see"
          onClick={handleOpen}
          aria-label="Select the album you want to see"
        >
          {width >= 640 ? <FolderSpecialIcon /> : <span>Vos Albums</span>}
        </button>
      ) : null}
      <AlbumChoiceModal open={open} onOpen={handleOpen} onClose={handleClose} />
    </>
  );
};

export default AlbumChoice;
