import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useAuth } from "../Hooks/useAuth";
import useOptionalParams from "../Hooks/useOptionalParams";
import useToast from "../Hooks/useToast";
import Layout from "../component/Layout/Layout";
import { VisuallyHiddenInput } from "../component/UploadForms/Multiple";
import { createAlbum } from "../component/Utils/func";
const Creation = () => {
  const { getParams } = useOptionalParams();
  const navigate = useNavigate();
  const { Toast, handleToast } = useToast();
  const { login } = useAuth();
  const auth = getParams("auth");
  const [passwordError, setPasswordError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const singleRef = useRef<HTMLInputElement>(null);

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
    if (creationPasswordConfirm.value !== creationPassword.value) {
      setPasswordError(true);
      return;
    }
    if (singleRef.current?.files?.length === 0) {
      handleToast("warning", "Il faut ajouter une photo");
      return;
    }
    if (singleRef.current?.files) {
      if (formRef.current) {
        const albumId = uuid();
        formData.append("albumName", albumName.value);
        formData.append("albumId", albumId);
        formData.append("username", username.value);
        formData.append("email", creationEmail.value);
        formData.append("password", creationPassword.value);

        formData.append("images", singleRef.current?.files[0]);

        handleToast("info", "Album en cours de création");
        albumCreationMutation.mutate(formData);
      }
    }
  };

  useEffect(() => {
    if (!auth || auth !== import.meta.env.VITE_CREATION_AUTH) {
      navigate("/unauthorized");
    }
  }, [auth]);

  if (!auth || auth !== import.meta.env.VITE_CREATION_AUTH) return;

  return (
    <>
      <Layout>
        <div className="flex flex-col items-center justify-center h-full w-full min-h-[calc(100vh-73px)] ">
          <form
            ref={formRef}
            className="flex flex-col gap-y-4 p-10 dark:bg-[#f8f8f8]  bg-[#f8fafc] shadow-md"
            onSubmit={handleSubmit}
          >
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
