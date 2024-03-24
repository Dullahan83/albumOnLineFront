import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
interface ISnackBar {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: string;
  type?: "success" | "error" | "warning" | "info";
}
export default function Toast({
  open,
  setOpen,
  content,
  type = "success",
}: ISnackBar) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          sx={{ width: "100%" }}
          className=" whitespace-pre-line"
        >
          {content}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
