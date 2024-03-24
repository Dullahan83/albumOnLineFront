import { Button, CircularProgress, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useOptionalParams from "../Hooks/useOptionalParams";
import useToast from "../Hooks/useToast";
import { cn, resetPassword } from "../component/Utils/func";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState(false);
  const { getParams } = useOptionalParams();
  const { Toast, handleToast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const token = getParams("rstk");
  const decodedToken = jwtDecode(token);

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      handleToast(
        "success",
        `Mot de passe changé avec succès
        Redirection vers la page d'accueil
        `
      );
      const timer = setTimeout(() => {
        navigate("/?connection=true");
      }, 1000);
      return () => clearTimeout(timer);
    },
    onError: () => {
      if (decodedToken.exp * 1000 < Date.now())
        handleToast(
          "error",
          `Trop de temps s'est passé depuis
      votre demande de réinitialisation
      Token expiré
      `
        );
      else handleToast("error", `Une erreur s'est produite`);
    },
  });

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (formRef.current) {
      const { password, passwordConfirm } = formRef.current;
      if (password.value.length < 5) {
        handleToast(
          "warning",
          `Merci d'utiliser un mot de passe d'au moins
          5 caractères
        `
        );
        return;
      }
      if (passwordConfirm.value !== password.value) {
        setPasswordError(true);
        return;
      }
      resetMutation.mutate({ token, password: password.value });
    }
  };

  return (
    <div className="flex bg-background-dark dark:bg-background-dark h-screen justify-center items-center text-white relative">
      <form
        ref={formRef}
        className={cn(
          "flex flex-col fixed justify-between  gap-y-10 min-w-[450px] bg-background px-10 py-10 rounded-xl"
        )}
      >
        <>
          <TextField
            id="password"
            type="password"
            name="password"
            variant="standard"
            label="Votre nouveau mot de passe"
            placeholder="********"
            required
            onKeyDown={(e) =>
              e.key === "Enter" && formRef.current.passwordConfirm.focus()
            }
          />
          <TextField
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
            variant="standard"
            label="Confirmation du nouveau mot de passe"
            placeholder="********"
            required
            error={passwordError}
            helperText={
              passwordError ? "Les mots de passe doivent correspondre." : ""
            }
            onKeyDown={handleKeydown}
          />
          <Button
            sx={{ fontSize: "18px" }}
            className="w-fit self-center"
            onClick={handleSubmit}
          >
            {resetMutation.isPending ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "Valider"
            )}
          </Button>
        </>
      </form>
      {Toast}
    </div>
  );
};

export default ResetPassword;
