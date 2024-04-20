import { Button, Dialog, DialogContent, Slide, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import React, {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AuthContext, { Image } from "../../Context/AuthContext";
import useToast from "../../Hooks/useToast";
import KeywordThumbnail from "../Shared/KeywordThumbnail";
import Datepicker from "../UploadForms/Datepicker";
import { updatePicture } from "../Utils/func";

interface UpdateModalProps extends ComponentPropsWithoutRef<"dialog"> {
  open: boolean;
  onClose: () => void;
  pictureData: Image;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateModal = ({ open, onClose, pictureData }: UpdateModalProps) => {
  const { currentAlbum } = useContext(AuthContext);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [legende, setLegende] = useState("");

  const { handleToast, Toast } = useToast();
  const updateMutation = useMutation({
    mutationFn: updatePicture,
    onSuccess: () => {
      handleToast("success", "Modifiée avec succès");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["album"] });
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleAddKeyword = () => {
    if (formRef.current) {
      const value = formRef.current.keywords.value;
      if (value.length < 2) {
        return;
      }
      const newList = new Set([...keywordList, value.toLowerCase().trim()]);
      setKeywordList(Array.from(newList));
      formRef.current.keywords.value = "";
      formRef.current.keywords.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const indexInList = keywordList.findIndex(
      (word) => word === keyword.toLowerCase()
    );
    setKeywordList((prev) => prev.filter((_, i) => i !== indexInList));
  };

  const handleSubmit = () => {
    if (!date) {
      handleToast("warning", "Vous avez oublié de remplir la date");
      return;
    }
    if (!keywordList.length) {
      handleToast("warning", "Il faut ajouter au moins un mot clé");
      return;
    }
    const dateString = date?.format("YYYY-MM-DD");
    const imageId = pictureData.id;

    const body = {
      imageId,
      keywords: JSON.stringify(keywordList),
      legend: legende,
      date: dateString,
    };
    handleToast("info", "Envoi des modifications en cours");
    updateMutation.mutate({ albumId: currentAlbum, body });
  };

  useEffect(() => {
    if (pictureData) {
      const initialKeywordList = pictureData?.keyword?.map(
        (keyword) => keyword.word
      );
      setKeywordList(initialKeywordList);
      setLegende(pictureData.legend);
      const dateString = new Date(pictureData.date.date).toISOString();
      const dayjsDate = dayjs(dateString);
      setDate(dayjsDate);
    }
  }, [pictureData]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="update modal"
      fullWidth
      sx={{ maxWidth: "none" }}
    >
      <DialogContent className="flex items-center gap-4">
        <div className="h-full aspect-square">
          <img
            src={`${import.meta.env.VITE_BACKEND_IMAGES}/${pictureData?.url}`}
            loading="lazy"
          />
        </div>
        <form
          ref={formRef}
          className="flex flex-col gap-y-4 p-2 min-w-[350px] min-h-[400px] "
        >
          <div className="flex  gap-10 flex-col ">
            <Datepicker id="updateDate" date={date} setDate={setDate} />
            <div className="flex w-full relative">
              <TextField
                type="text"
                id="keywordsSingle"
                name="keywords"
                variant="outlined"
                label="Mot(s) clé(s)"
                fullWidth
                onKeyDown={handleKeyDown}
                onBlur={handleAddKeyword}
              />
              <Button
                onClick={handleAddKeyword}
                variant="contained"
                color="secondary"
                sx={{
                  fontSize: "12px",
                  position: "absolute",
                  right: 1,
                  height: "99%",
                }}
              >
                Ajouter
              </Button>
            </div>
          </div>
          <div className="w-full flex flex-wrap gap-2 my-2">
            {keywordList.length
              ? keywordList?.map((keyword, index) => {
                  return (
                    <KeywordThumbnail
                      filter={keyword}
                      onRemove={() => handleRemoveKeyword(keyword)}
                      key={index}
                    />
                  );
                })
              : null}
          </div>
          <TextField
            type="text"
            id="legendeSingle"
            name="legende"
            variant="outlined"
            value={legende}
            onChange={(e) => setLegende(e.target.value)}
            label="Ajoutez (ou non) une légende à la photo"
            fullWidth
          />
          <Button
            sx={{ fontSize: "18px" }}
            className="w-fit self-center"
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
          >
            {updateMutation.isPending ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </form>
      </DialogContent>
      {Toast}
    </Dialog>
  );
};
export default UpdateModal;
