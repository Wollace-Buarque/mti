import { toast } from "sonner";

interface ToastProps {
  message: string;
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
}

export function showToast({
  message,
  duration = 3000,
  type = "success",
}: ToastProps) {
  switch (type) {
    case "success":
      toast.success(message, { duration });
      break;
    case "error":
      toast.error(message, { duration });
      break;
    case "info":
      toast.info(message, { duration });
      break;
    case "warning":
      toast.warning(message, { duration });
      break;
  }
}
