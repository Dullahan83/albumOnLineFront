import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import DatePicker from "./Datepicker";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import AuthContext from "../../Context/AuthContext";
import useToast from "../../Hooks/useToast";
import KeywordThumbnail from "../Shared/KeywordThumbnail";
import { uploadMultiple } from "../Utils/func";

export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

type Preview = string | ArrayBuffer | null | undefined;

const Multiple = () => {
  const { currentAlbum } = useContext(AuthContext);

  const { handleToast, Toast } = useToast();
  const queryClient = useQueryClient();

  const [images, setImages] = useState<Preview[]>([]);
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const multipleFormRef = React.useRef<HTMLFormElement>(null);
  const singleRef = React.useRef<HTMLInputElement>(null);

  const uploadFileMutation = useMutation({
    mutationFn: uploadMultiple,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      setImages([]);
      setDate(dayjs(new Date()));
      multipleFormRef.current?.reset();
      handleToast("success", "Photo ajoutée avec succès");
      setKeywordList([]);
    },
    onError: () => {
      handleToast(
        "error",
        "Oups! Il y a eu une erreur lors de l'ajout en base de donnée"
      );
    },
  });
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [...prev, e.target?.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    multipleFormRef.current.scrollIntoView();

    const formData = new FormData();
    if (!date) {
      handleToast("warning", "Vous avez oublié de remplir la date");
      return;
    }
    if (!keywordList.length) {
      handleToast("warning", "Il faut ajouter au moins un mot clé");
      return;
    }
    const dateString = date?.format("YYYY-MM-DD");
    if (singleRef.current?.files?.length === 0) {
      handleToast("warning", "Il faut ajouter une photo");
      return;
    }
    if (singleRef.current?.files) {
      if (multipleFormRef.current) {
        const { legende } = multipleFormRef.current;
        formData.append("keywords", JSON.stringify(keywordList));
        formData.append("legend", legende.value);
        formData.append("date", dateString as string);
        formData.append("albumId", currentAlbum);
        Array.from(singleRef.current.files).forEach((img) => {
          formData.append("images", img);
        });
        uploadFileMutation.mutate({ formData, param: currentAlbum });
        handleToast("info", "Envoi des photos en cours");
      }
    }
  };

  const handleAddKeyword = () => {
    if (multipleFormRef.current) {
      const value = multipleFormRef.current.keywords.value;
      if (value.length < 2) {
        return;
      }
      const newList = new Set([...keywordList, value.toLowerCase().trim()]);
      setKeywordList(Array.from(newList));
      multipleFormRef.current.keywords.value = "";
      multipleFormRef.current.keywords.focus();
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
  return (
    <div className="w-full md:w-5/6 xl:w-3/6 rounded-lg bg-primary dark:bg-primary-dark/60 backdrop-blur-lg border border-border-dark p-2 shadow-lg transition-all">
      <form
        ref={multipleFormRef}
        className="w-full h-full p-4 md:p-10  gap-8 flex flex-col"
      >
        <div className="flex">
          <Button
            className="self-center"
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            color="secondary"
            sx={{ letterSpacing: "0.08em" }}
          >
            Chargez vos photos
            <VisuallyHiddenInput
              ref={singleRef}
              type="file"
              multiple
              onChange={onImageChange}
              accept="image/*"
            />
          </Button>
        </div>
        <div className="flex  gap-10 flex-col md:flex-row md:items-end">
          <DatePicker id="multipleDate" date={date} setDate={setDate} />
          <div className="flex items-center w-full">
            <div className="flex w-full relative">
              <TextField
                type="text"
                id="keywords"
                name="keywords"
                variant="outlined"
                label="Mot(s) clé(s)"
                fullWidth
                onKeyDown={handleKeydown}
                onBlur={handleAddKeyword}
                spellCheck="true"
                autoComplete="true"
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
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">
                    <b>Pour un bon référencement:</b>
                  </Typography>
                  <em>
                    {"Noter les noms des"}
                    <b>{" personnes"}</b> présentes sur la photo,le
                    <b>{" lieu"}</b>, ou bien encore l' <b>{" évènement"}</b> où
                    celle ci a été prise.
                    <br />
                    <b>Cliquer sur ajouter entre chaque mot clé </b>
                  </em>
                </React.Fragment>
              }
              placement="bottom"
            >
              <span className="border border-black dark:border-white text-textColor dark:text-textColor-dark transition-colors duration-150 rounded-full w-8 aspect-square ml-4 flex items-center justify-center">
                ?
              </span>
            </HtmlTooltip>
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-2">
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
          id="legende"
          name="legende"
          variant="outlined"
          label="Ajoutez (ou non) une légende qui sera la même pour toutes les photos"
          fullWidth
        />
        {images.length > 0 ? (
          <button
            onClick={() => setShowPreview((prev) => !prev)}
            type="button"
            className="px-4 py-2 rounded-lg bg-background w-fit self-center dark:text-black"
          >
            Afficher la prévisualisation
          </button>
        ) : null}
        {showPreview && images.length > 0 ? (
          <ImageList cols={3}>
            {images.map((item, i) => (
              <ImageListItem key={i} className="">
                <img src={`${item}`} alt={""} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        ) : null}
        <Button
          className="w-fit self-center"
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={uploadFileMutation.isPending}
        >
          {uploadFileMutation.isPending ? (
            <CircularProgress size={25} color="inherit" />
          ) : (
            "Envoyer"
          )}
        </Button>
      </form>
      {Toast}
    </div>
  );
};

export default Multiple;
