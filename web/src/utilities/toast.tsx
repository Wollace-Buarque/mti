import toast from "react-hot-toast";

export default function showToast(message: string, duration: number = 1000) {
  toast.custom(() => (
    <div className="toast">
      {message}
    </div>
  ), {
    duration,
  });
}