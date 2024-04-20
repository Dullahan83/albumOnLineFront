import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import { IToast } from "../../Hooks/useToast";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type IToastProps = {
  toast: IToast;
  removeToast: (val: number) => void;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" exit />;
}

export default function Toast({ toast, removeToast }: IToastProps) {
  const [open, setOpen] = React.useState(toast.open);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
    id?: number
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    removeToast(id!);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ position: "relative", width: "fit-content" }}
      TransitionComponent={SlideTransition}
      TransitionProps={{
        onExited: () => removeToast(toast.id),
      }}
    >
      <Alert
        onClose={handleClose}
        severity={toast.type}
        sx={{ width: "100%" }}
        className="whitespace-pre-line"
      >
        {toast.content}
      </Alert>
    </Snackbar>
  );
}
