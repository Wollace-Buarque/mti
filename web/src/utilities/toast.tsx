import toast from "react-hot-toast";

export default function showToast(message: string, duration: number = 1000) {
  toast.custom(() => (
    <div className="bg-button-base text-button-text p-2 rounded-md">
      {message}
    </div>
  ), {
    duration,
  });
}