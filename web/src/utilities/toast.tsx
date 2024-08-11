import { toast } from "sonner";

export function showToast(message: string, duration: number = 1000) {
  toast(message, {
    duration,
  });
}
