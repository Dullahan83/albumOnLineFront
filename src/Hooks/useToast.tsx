import { useState } from "react";
import Toast from "../component/Toasts/Toast";

export type ToastType = "error" | "warning" | "info" | "success";

const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("success");

  const handleToast = (type: ToastType, content: string) => {
    setShowToast(true);
    setToastMessage(content);
    setToastType(type);
  };
  const ToastElement = (
    <Toast
      open={showToast}
      setOpen={setShowToast}
      content={toastMessage}
      type={toastType}
    />
  );

  return { handleToast, Toast: ToastElement };
};

export default useToast;
