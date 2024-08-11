import { toast } from "sonner";

export function showToast(
  message: string,
  duration: number = 1000,
  type: "success" | "error" | "info" | "warning" = "success",
) {
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
