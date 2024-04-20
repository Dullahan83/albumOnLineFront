import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAuth } from "../Hooks/useAuth";
import useToast from "../Hooks/useToast";
import { regex } from "../component/Header/Auth/AuthModal";
import Layout from "../component/Layout/Layout";
import { VisuallyHiddenInput } from "../component/UploadForms/Multiple";
import { cn, createAlbum } from "../component/Utils/func";
const Creation = () => {
  const { Toast, handleToast } = useToast();
  const { login } = useAuth();
  const [passwordError, setPasswordError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const singleRef = useRef<HTMLInputElement>(null);
  const [isAffiliated, setIsAffiliated] = useState(false);

  const albumCreationMutation = useMutation({
    mutationFn: createAlbum,
    onSuccess: () => {
      const body = {
        email: formRef.current?.creationEmail.value,
        password: formRef.current?.creationPassword.value,
      };

      handleToast("success", "New Album Successfully Created");
      login(body);
      setPasswordError(false);
      formRef.current?.reset();
    },
    onError: () => {
      handleToast("error", "Something Went Wrong While Creating Album");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const {
      albumName,
      username,
      creationEmail,
      creationPassword,
      creationPasswordConfirm,
    } = formRef.current;

    if (albumName.value.length < 5) {
      handleToast(
        "warning",
        `Un album sans nom, vraiment ?
      Et si vous corrigiez ça ?`
      );
      return;
    }

    if (!regex.email.test(creationEmail.value)) {
      handleToast("warning", "Merci de renseigner une addresse email correcte");
    }
    if (!regex.password.test(creationPassword.value)) {
      handleToast(
        "warning",
        `Merci d'utiliser un mot de passe d'au moins
          6 caractères
        `
      );
      return;
    }
    if (!isAffiliated && !regex.username.test(username.value)) {
      handleToast(
        "warning",
        "N'oubliez pas de renseigner un nom d'utilisateur"
      );
      return;
    }
    if (
      !isAffiliated &&
      creationPasswordConfirm.value !== creationPassword.value
    ) {
      setPasswordError(true);
      return;
    }
    if (singleRef.current?.files?.length === 0) {
      handleToast("warning", "Il faut ajouter une photo");
      return;
    }
    if (formRef.current) {
      const albumId = uuid();
      formData.append("albumName", albumName.value);
      formData.append("albumId", albumId);
      !isAffiliated && formData.append("username", username.value);
      formData.append("email", creationEmail.value);
      formData.append("password", creationPassword.value);

      formData.append("images", singleRef.current?.files[0]);

      handleToast("info", "Album en cours de création");
      albumCreationMutation.mutate(formData);
    }
  };

  return (
    <>
      <Layout>
        <div className="flex flex-col items-center justify-center h-full w-full min-h-[calc(100vh-73px)] ">
          <form
            ref={formRef}
            className={cn(
              "flex flex-col gap-y-4 px-8 py-4 text-black dark:bg-[#f8f8f8]  bg-[#f8fafc] overflow-hidden shadow-md rounded-2xl h-[540px] transition-[height] ",
              {
                "h-[410px]": isAffiliated,
              }
            )}
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl text-blue-500">Creez votre album</h1>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isAffiliated}
                  onChange={() => setIsAffiliated((prev) => !prev)}
                />
              }
              label="Je suis déjà affilié à un autre album"
              labelPlacement="start"
              className="self-start underline underline-offset-4"
              sx={{ margin: 0, marginBottom: -2 }}
            />
            <TextField
              type="text"
              id="albumName"
              name="albumName"
              variant="standard"
              label="Titre de votre album"
              required
              onKeyDown={(e) =>
                e.key === "Enter" && formRef.current.file.focus()
              }
            />
            <div className="flex">
              <Button
                className="self-center "
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                color="secondary"
                sx={{ letterSpacing: "0.08em" }}
              >
                Charger votre image d'accueil
                <VisuallyHiddenInput
                  ref={singleRef}
                  type="file"
                  accept="image/*"
                  name="file"
                  onBlur={() => formRef.current.username.focus()}
                  required
                />
              </Button>
            </div>
            {!isAffiliated && (
              <TextField
                type="text"
                id="username"
                name="username"
                variant="standard"
                label="Votre Nom d'utilisateur"
                required
                onKeyDown={(e) =>
                  e.key === "Enter" && formRef.current.creationEmail.focus()
                }
              />
            )}
            <TextField
              id="creationEmail"
              type="email"
              name="creationEmail"
              variant="standard"
              label="Votre Email"
              required
              autoComplete="false"
              onKeyDown={(e) =>
                e.key === "Enter" && formRef.current.creationPassword.focus()
              }
            />
            <TextField
              id="creationPassword"
              type="password"
              name="creationPassword"
              variant="standard"
              label="Votre mot de passe"
              required
              onKeyDown={(e) =>
                e.key === "Enter" &&
                formRef.current.creationPasswordConfirm.focus()
              }
            />
            {!isAffiliated && (
              <TextField
                id="creationPasswordConfirm"
                type="password"
                name="creationPasswordConfirm"
                variant="standard"
                label="Confirmation du mot de passe"
                error={passwordError}
                helperText={
                  passwordError ? "Les mots de passe doivent correspondre." : ""
                }
                required
              />
            )}
            <Button
              sx={{ fontSize: "18px" }}
              className="w-fit self-center"
              type="submit"
            >
              {albumCreationMutation.isPending ? (
                <CircularProgress size={25} color="inherit" />
              ) : (
                "Valider"
              )}
            </Button>
          </form>
        </div>
        {Toast}
      </Layout>
    </>
  );
};

export default Creation;
