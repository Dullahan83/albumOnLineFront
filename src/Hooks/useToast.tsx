import Stack from "@mui/material/Stack";
import { useState } from "react";
import Toast from "../component/Toasts/Toast";

export interface IToast {
  type?: "success" | "error" | "warning" | "info";
  content: string;
  id: number;
  open: boolean;
}

export default function useToast() {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const handleToast = (
    type: "success" | "error" | "warning" | "info",
    content: string
  ) => {
    const id = Date.now();

    setToasts((prevToasts) => [
      ...prevToasts,
      { type, content, id, open: true },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const ToastElement = (
    <Stack
      spacing={1.5}
      direction={"column"}
      sx={{
        width: "fit-content",
        position: "fixed",
        top: 0,
        right: 0,
        display: "flex",
        alignItems: "end",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </Stack>
  );
  return {
    handleToast,
    removeToast,
    Toast: ToastElement,
  };
}
