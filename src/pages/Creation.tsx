import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useOptionalParams from "../Hooks/useOptionalParams";
import Layout from "../component/Layout/Layout";
import { VisuallyHiddenInput } from "../component/UploadForms/Single";
const Creation = () => {
  const { getParams } = useOptionalParams();
  const navigate = useNavigate();

  const auth = getParams("auth");

  const formRef = useRef<HTMLFormElement>(null);
  const singleRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
              //   required
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
                  //   required
                />
              </Button>
            </div>
            <TextField
              type="text"
              id="username"
              name="username"
              variant="standard"
              label="Votre Nom d'utilisateur"
              //   required
              onKeyDown={(e) =>
                e.key === "Enter" && formRef.current.email.focus()
              }
            />
            <TextField
              id="creationEmail"
              type="email"
              name="creationEmail"
              variant="standard"
              label="Votre Email"
              //   required
              autoComplete="false"
              onKeyDown={(e) =>
                e.key === "Enter" && formRef.current.password.focus()
              }
            />
            <TextField
              id="creationPassword"
              type="password"
              name="creationPassword"
              variant="standard"
              label="Votre mot de passe"
              //   required
              onKeyDown={(e) =>
                e.key === "Enter" && formRef.current.passwordConfirm.focus()
              }
            />
            <TextField
              id="creationPasswordConfirm"
              type="password"
              name="creationPasswordConfirm"
              variant="standard"
              label="Confirmation du mot de passe"
              //   required
            />
            <Button
              sx={{ fontSize: "18px" }}
              className="w-fit self-center"
              type="submit"
            >
              Valider
            </Button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Creation;
