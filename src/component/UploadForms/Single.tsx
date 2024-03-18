import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import KeywordThumbnail from "../Shared/KeywordThumbnail";
import Toast from "../Toasts/Toast";
import { uploadSingle } from "../Utils/func";
import DatePicker from "./Datepicker";

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

export type ToastType = "error" | "warning" | "info" | "success";

const Single = () => {
  const queryClient = useQueryClient();

  const [img, setImg] = useState<Preview>();
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("success");
  const singleRef = React.useRef<HTMLInputElement>(null);
  const singleFormRef = React.useRef<HTMLFormElement>(null);

  const uploadFileMutation = useMutation({
    mutationFn: uploadSingle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["album"] });
      setImg(null);
      setDate(null);
      setKeywordList([]);
      singleFormRef.current?.reset();
      handletoast("success", "Photo ajoutée avec succès");
    },
    onError: () => {
      handletoast(
        "error",
        "Oups! Il y a eu une erreur lors de l'ajout en base de donnée"
      );
    },
  });

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImg(e.target?.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handletoast = (type: ToastType, content: string) => {
    setShowToast(true);
    setToastMessage(content);
    setToastType(type);
  };
  const handleSubmit = () => {
    singleFormRef.current.scrollIntoView();
    const formData = new FormData();
    if (!date) {
      handletoast("warning", "Vous avez oublié de remplir la date");
      return;
    }
    if (!keywordList.length) {
      handletoast("warning", "Il faut ajouter au moins un mot clé");
      return;
    }
    const dateString = date.format("YYYY-MM-DD");
    if (singleRef.current?.files?.length === 0) {
      handletoast("warning", "Il faut ajouter une photo");
      return;
    }
    if (singleRef.current?.files) {
      if (singleFormRef.current) {
        console.log(dateString);
        const { legende } = singleFormRef.current;
        formData.append("keywords", JSON.stringify(keywordList));
        formData.append("legend", legende.value);
        formData.append("date", dateString as string);
        Array.from(singleRef.current.files).forEach((img) => {
          formData.append("images", img);
        });
        uploadFileMutation.mutate(formData);
        handletoast("info", "Envoi de la photo en cours");
      }
    }
  };

  const handleAddKeyword = () => {
    if (singleFormRef.current) {
      const value = singleFormRef.current.keywords.value;
      if (value.length < 2) {
        return;
      }
      const newList = new Set([...keywordList, value.toLowerCase().trim()]);
      setKeywordList(Array.from(newList));
      singleFormRef.current.keywords.value = "";
      singleFormRef.current.keywords.focus();
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
        ref={singleFormRef}
        className="w-full h-full p-4 md:p-10  gap-8 flex flex-col"
      >
        <div className="flex">
          <Button
            className="self-center "
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            color="secondary"
            sx={{ letterSpacing: "0.08em" }}
          >
            Charger une seule photo
            <VisuallyHiddenInput
              ref={singleRef}
              type="file"
              onChange={onImageChange}
              accept="image/*"
            />
          </Button>
        </div>
        <div className="flex  gap-10 flex-col md:flex-row md:items-end">
          <DatePicker id="singleDate" date={date} setDate={setDate} />
          <div className="flex items-center w-full">
            <div className="flex w-full relative">
              <TextField
                type="text"
                id="keywordsSingle"
                name="keywords"
                variant="outlined"
                label="Mot(s) clé(s)"
                fullWidth
                onKeyDown={handleKeydown}
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
                    <b>{" personne"}</b> présentes sur la photo,le
                    <b>{" lieu"}</b>, ou bien encore l' <b>{" évènement"}</b> ou
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
          id="legendeSingle"
          name="legende"
          variant="outlined"
          label="Ajoutez (ou non) une légende à la photo"
          fullWidth
        />
        {img ? (
          <img
            className=" object-cover self-center max-h-[300px]"
            src={img as string}
            alt=""
          />
        ) : null}
        <Button
          className="w-fit self-center"
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          sx={{ minWidth: 103 }}
          disabled={uploadFileMutation.isPending}
        >
          {uploadFileMutation.isPending ? (
            <CircularProgress size={25} color="inherit" />
          ) : (
            "Envoyer"
          )}
        </Button>
      </form>
      <Toast
        open={showToast}
        setOpen={setShowToast}
        content={toastMessage}
        type={toastType}
      />
    </div>
  );
};

export default Single;
