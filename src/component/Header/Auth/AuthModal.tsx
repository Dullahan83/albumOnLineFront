import React, { ComponentPropsWithoutRef, useState, useRef } from "react";
import {
  TextField,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { TransitionProps } from "@mui/material/transitions";
import { cn } from "../../Utils/func";
import {useMutation} from "@tanstack/react-query"
import { useAuth } from "../../../Hooks/useAuth";

interface AuthModalProps extends ComponentPropsWithoutRef<"dialog"> {
  open: boolean;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [connection, setConnection] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const {login, signup} = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const loginMutation = useMutation({mutationFn: login, onSuccess: () =>{
    handleClose()
    formRef.current?.reset()
  }})

  const signupMutation = useMutation({mutationFn: signup, onSuccess: () =>{
    handleClose()
    formRef.current?.reset()
    setPasswordError(false)
  }})

  const handleClose = () => {
    onClose();
  };

  const handleKeydown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      if(connection){
        handleConnectionSubmit()
      }
      else handleInscriptionSubmit()
    }
  }
  

  const handleInscriptionSubmit = () => {
    if(formRef.current){
      const { username, email, password, passwordConfirm } = formRef.current;
      if(passwordConfirm.value !== password.value){
        setPasswordError(true)
        return;
      }
      signupMutation.mutate({
        name: username.value,
        email: email.value,
        password: password.value
      });
    }
  }
  const handleInscription = () => {
    setConnection(false)
    formRef.current?.reset()
  }
  const handleConnection = () => {
    setConnection(true)
    formRef.current?.reset()
    setPasswordError(false)
  }
  
  const handleConnectionSubmit = () => {
    loginMutation.mutate({email: formRef.current?.email.value, password: formRef.current?.password.value})
  }
  
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="login modal"
      className=""
    >
      <DialogTitle className="flex self-center gap-x-8">
        <button
          className={cn("text-blue-500", {
            "text-textColor": !connection,
          })}
          onClick={handleConnection}
        >
          Connexion
        </button>
        <button
          className={cn({ "text-blue-500": !connection })}
          onClick={handleInscription}
        >
          Inscription
        </button>
      </DialogTitle>
      {!connection ? (
        <DialogContent>
          <form ref={formRef} className="flex flex-col gap-y-4 min-w-[350px] min-h-[292px] ">
            <TextField
              type="text"
              id="username"
              name="username"
              variant="standard"
              label="Votre Nom d'utilisateur"
              required
              onKeyDown={(e) => e.key === "Enter" &&  formRef.current.email.focus()}
            />
            <TextField
              id="email"
              type="email"
              name="email"
              variant="standard"
              label="Votre Email"
              required
              autoComplete="false"
              onKeyDown={(e) => e.key === "Enter" &&formRef.current.password.focus()}

            />
            <TextField
              id="password"
              type="password"
              name="password"
              variant="standard"
              label="Votre mot de passe"
              required
              onKeyDown={(e) => e.key === "Enter" &&formRef.current.passwordConfirm.focus()}

            />
            <TextField
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              variant="standard"
              label="Confirmation du mot de passe"
              required
              error={passwordError}
              helperText={passwordError ? "Les mots de passe doivent correspondre." : ""}
              onKeyDown={handleKeydown}
            />
            <Button sx={{fontSize: "18px"}} className="w-fit self-center" onClick={handleInscriptionSubmit}>{signupMutation.isPending ? <CircularProgress size={25} color="inherit"/> :"S'inscire"}</Button>
          </form>
        </DialogContent>
      ) : (
        <DialogContent>
          <form ref={formRef} className="flex flex-col justify-between pt-10 min-w-[350px] min-h-[292px]">
            <TextField
              id="email"
              type="email"
              name="email"
              variant="standard"
              label="Votre Email"
              required
              onKeyDown={(e) => e.key === "Enter" && formRef.current.password.focus()}
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
            <Button sx={{fontSize: "18px"}} className="w-fit self-center" onClick={handleConnectionSubmit}>{loginMutation.isPending ? <CircularProgress size={25} color="inherit"/> :"Se Connecter"}</Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
export default AuthModal;
