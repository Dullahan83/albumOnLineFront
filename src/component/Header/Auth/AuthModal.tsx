import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Slide,
  TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation } from "@tanstack/react-query";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../../Hooks/useAuth";
import useOptionalParams from "../../../Hooks/useOptionalParams";
import useToast from "../../../Hooks/useToast";
import { cn, resetPasswordDemand } from "../../Utils/func";
interface AuthModalProps extends ComponentPropsWithoutRef<"dialog"> {
  open: boolean;
  onClose: () => void;
  inscription?: boolean;
}
type ModalStatus = "connection" | "inscription" | "reset";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const regex = {
  username: new RegExp(/(\s?\w?\d?){3,16}/),
  email: new RegExp(
    /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,4}$/
  ),
  password: new RegExp(/^[^\s]{6,}$/),
};

const AuthModal = ({ open, onClose, inscription }: AuthModalProps) => {
  // const [connection, setConnection] = useState(inscription ? false : true);
  const [passwordError, setPasswordError] = useState(false);
  const [modalStatus, setModalStatus] = useState<ModalStatus>(
    inscription ? "inscription" : "connection"
  );
  const [isAffiliated, setIsAffiliated] = useState(false);
  const { login, signup } = useAuth();
  const { getParams } = useOptionalParams();
  const { Toast, handleToast } = useToast();
  const albumId = getParams("album");

  const formRef = useRef<HTMLFormElement>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      handleClose();
      formRef.current?.reset();
    },
    onError: (error) => {
      console.log(error);

      handleToast(
        "error",
        `Il semblerait qu'une erreur se soit produite
      Veuillez vérifier vos identifiants de connexion
      `
      );
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      handleClose();
      formRef.current?.reset();
      setPasswordError(false);
      handleToast("success", `Inscription réussie`);
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetPasswordDemand,
    onSuccess: () => {
      formRef.current.reset();
      handleToast(
        "success",
        `Votre demande a bien été prise en compte 
      Vous recevrez bientôt un mail de réinitialisation
      `
      );
    },
    onError: (error) => {
      handleToast(
        "error",
        error.message === "Error: Email not found"
          ? "Adresse email non reconnue"
          : "Une erreur s'est produite"
      );
    },
  });
  // Closing modal function
  const handleClose = () => {
    onClose();
    setIsAffiliated(false);
    setModalStatus("connection");
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (modalStatus === "connection") {
        handleConnectionSubmit();
      } else handleInscriptionSubmit();
    }
  };

  const handleConnectionSubmit = () => {
    const { email, password } = formRef.current;
    if (!regex.email.test(email.value)) {
      handleToast("warning", `Merci de renseigner une addresse email correcte`);
      return;
    }
    if (!password.value.length) {
      handleToast("warning", "Aucun mot de passe fourni");
      return;
    }
    loginMutation.mutate({
      email: formRef.current?.email.value,
      password: formRef.current?.password.value,
    });
  };

  const handleInscriptionSubmit = () => {
    if (formRef.current) {
      const { username, email, password, passwordConfirm } = formRef.current;
      if (!regex.password.test(password.value)) {
        handleToast(
          "warning",
          `Merci d'utiliser un mot de passe d'au moins
          6 caractères
        `
        );
        return;
      }
      if (!isAffiliated && passwordConfirm.value !== password.value) {
        setPasswordError(true);
        return;
      }
      if (!email.value.length) {
        handleToast(
          "warning",
          `Attention, l'Email est obligatoire
        `
        );
        return;
      }
      if (!regex.email.test(email.value)) {
        handleToast(
          "warning",
          `
          Ce doit être un Email valide
        `
        );
        return;
      }
      if (!isAffiliated && !regex.username.test(username.value)) {
        handleToast(
          "warning",
          `Veuillez renseigner votre nom
        `
        );
        return;
      }
      if (!albumId) {
        const demoAlbumId = "b5d5c8eb-706b-4a83-bb3b-ce70d639f6e4";
        signupMutation.mutate({
          albumId: demoAlbumId,
          name: !isAffiliated ? username.value : "",
          email: email.value,
          password: password.value,
        });
        return;
      }

      signupMutation.mutate({
        albumId: albumId,
        name: !isAffiliated ? username.value : "",
        email: email.value,
        password: password.value,
      });
    }
  };

  const handleSubmitReset = () => {
    if (formRef.current) {
      const { email } = formRef.current;
      resetMutation.mutate(email.value);
    }
  };

  // Toggle modal between Inscription/Connection and reset state
  const handleInscription = () => {
    // setConnection(false);
    setModalStatus("inscription");
    formRef.current?.reset();
  };
  const handleConnection = () => {
    // setConnection(true);
    setModalStatus("connection");
    formRef.current?.reset();
    setPasswordError(false);
  };
  const handleReset = () => {
    setModalStatus("reset");
    formRef.current?.reset();
  };

  useEffect(() => {
    formRef?.current?.reset();
  }, [open]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="login modal"
      className=""
      PaperProps={{
        sx: {
          padding: "36px",
          paddingTop: "18px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle className="flex self-center gap-x-8">
        <button
          className={cn("text-textColor", {
            "text-blue-500": modalStatus === "connection",
          })}
          onClick={handleConnection}
        >
          Connexion
        </button>
        <button
          className={cn("text-textColor", {
            "text-blue-500": modalStatus === "inscription",
          })}
          onClick={handleInscription}
        >
          Inscription
        </button>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
          transition: "height ease-out 100ms",
          height:
            modalStatus === "reset"
              ? "235px"
              : modalStatus === "connection"
              ? "225px"
              : isAffiliated
              ? "245px"
              : "382px",
          overflow: "hidden",
        }}
      >
        <form
          ref={formRef}
          className={cn(
            "flex flex-col justify-between pt-4 gap-y-6 md:min-w-[350px]",
            {
              " pt-8 ": modalStatus === "connection",
              " pt-0 max-w-[350px]  ": modalStatus === "reset",
            }
          )}
        >
          {modalStatus === "connection" && (
            <>
              <TextField
                id="email"
                type="email"
                name="email"
                variant="standard"
                label="Votre Email"
                required
                onKeyDown={(e) =>
                  e.key === "Enter" && formRef.current.password.focus()
                }
              />
              <TextField
                id="password"
                type="password"
                name="password"
                variant="standard"
                label="Votre mot de passe"
                required
                onKeyDown={handleKeydown}
              />
              <Button
                sx={{ fontSize: "18px" }}
                className="w-fit self-center"
                onClick={handleConnectionSubmit}
              >
                {loginMutation.isPending ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  "Se Connecter"
                )}
              </Button>
            </>
          )}
          {modalStatus === "inscription" && (
            <>
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

              {!isAffiliated && (
                <TextField
                  type="text"
                  id="username"
                  name="username"
                  variant="standard"
                  label="Votre Nom d'utilisateur"
                  required
                  onKeyDown={(e) =>
                    e.key === "Enter" && formRef.current.email.focus()
                  }
                />
              )}
              <TextField
                id="email"
                type="email"
                name="email"
                variant="standard"
                label="Votre Email"
                required
                autoComplete="false"
                onKeyDown={(e) =>
                  e.key === "Enter" && formRef.current.password.focus()
                }
              />
              <TextField
                id="password"
                type="password"
                name="password"
                variant="standard"
                label="Votre mot de passe"
                required
                onKeyDown={(e) =>
                  e.key === "Enter" && formRef.current.passwordConfirm.focus()
                }
              />
              {!isAffiliated && (
                <TextField
                  id="passwordConfirm"
                  type="password"
                  name="passwordConfirm"
                  variant="standard"
                  label="Confirmation du mot de passe"
                  required
                  error={passwordError}
                  helperText={
                    passwordError
                      ? "Les mots de passe doivent correspondre."
                      : ""
                  }
                  onKeyDown={handleKeydown}
                />
              )}
              <Button
                sx={{ fontSize: "18px" }}
                className="w-fit self-center"
                onClick={handleInscriptionSubmit}
              >
                {signupMutation.isPending ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </>
          )}
          {modalStatus === "reset" && (
            <>
              <h1 className="text-base lg:text-2xl text-blue-500">
                Réinitialisez votre mot de passe
              </h1>
              <h2 className="text-sm italic -mt-2 break-words whitespace-pre-wrap flex">
                Entrez votre adresse email pour recevoir un lien de
                réinitialisation de mot de passe.
              </h2>
              <TextField
                id="email"
                type="email"
                name="email"
                variant="standard"
                label="Votre Email"
                required
                autoComplete="false"
              />

              <Button
                sx={{ fontSize: "18px" }}
                className="w-fit self-center lg:text-lg"
                onClick={handleSubmitReset}
              >
                {resetMutation.isPending ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  "Envoyer la demande"
                )}
              </Button>
            </>
          )}
        </form>
      </DialogContent>
      <button
        className={cn("text-blue-500 hidden text-xs self-end mt-2", {
          flex: modalStatus === "connection",
        })}
        onClick={handleReset}
      >
        Mot de passe oublié ?
      </button>
      {Toast}
    </Dialog>
  );
};
export default AuthModal;
