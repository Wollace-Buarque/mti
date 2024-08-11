import { X } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { server } from "../../services/server";
import { showToast } from "../../utilities/toast";
import { Button } from "../Button";
import { CropImageModal } from "../CropImage/CropImageModal";
import { blobToImageFile } from "../CropImage/crop-image";

export function Profile() {
  const { user, setUser } = useContext(AuthenticateContext);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [croppedImage, setCroppedImage] = useState<unknown | undefined>(
    undefined,
  );

  const [isOpenCropModal, setIsOpenCropModal] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    const file = acceptedFiles[0];

    setFile(file);

    if (file != null) {
      setIsOpenCropModal(true);
    }
  }, [acceptedFiles]);

  function handleExit() {
    showToast({
      message: "Você foi desconectado!",
      type: "info",
      duration: 1000,
    });

    setUser(null);
    localStorage.removeItem("token");

    navigate("/login");
  }

  async function uploadAvatar() {
    if (!user) {
      showToast({
        message: "Você precisa estar conectado para fazer isso.",
        type: "warning",
      });
      return;
    }

    if (!croppedImage || !file) {
      showToast({
        message: "Selecione uma imagem.",
        type: "warning",
        duration: 500,
      });
      return;
    }

    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("email", user.email);
    uploadData.append("type", "avatar");
    uploadData.append(
      "file",
      await blobToImageFile(croppedImage as string, file.name).then(
        (file) => file,
      ),
    );

    toast.promise(
      server.post("/avatar", uploadData).then((response) => {
        setUser({
          ...user,
          avatarUrl: response.data.avatarUrl,
        });
      }),
      {
        loading: "Sua foto de perfil está sendo encaminhada... 🚚",
        success: "Sua linda foto de perfil foi atualizada.",
        error: "Algo deu errado ao enviar sua foto de perfil.",
        finally: () => {
          acceptedFiles.pop();
          setIsUploading(false);
          setFile(null);
        },
      },
    );
  }

  function onAvatarError(event: any) {
    (event.target as HTMLImageElement).src = userSVG;
  }

  function handleCancel() {
    setFile(null);
    setCroppedImage(undefined);
    acceptedFiles.pop();
  }

  return (
    <>
      {isOpenCropModal && file && (
        <CropImageModal
          open={isOpenCropModal}
          setOpen={setIsOpenCropModal}
          image={URL.createObjectURL(file)}
          onCropComplete={setCroppedImage}
          handleCancel={handleCancel}
        />
      )}

      <div className="flex justify-center sm:justify-start h-fit relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-fit mx-auto">
            <input {...getInputProps()} />

            <img
              {...getRootProps()}
              onError={onAvatarError}
              className="size-40 rounded-full shadow-image cursor-pointer hover:opacity-75 transition-opacity duration-300"
              src={
                croppedImage
                  ? (croppedImage as string)
                  : (user?.avatarUrl ?? userSVG)
              }
              draggable={false}
            />
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-2xl text-title text-semibold">{user?.name}</h3>

            <span className="text-sm text-description block mt-1.5 truncate">
              {user?.email}
            </span>

            <span className="text-sm text-description">
              Desde{" "}
              {user?.createdAt.toLocaleString("pt-BR", { dateStyle: "long" })}
            </span>

            <Button
              onClick={uploadAvatar}
              isLoading={isUploading}
              className={`${file ? "block" : "hidden"} w-full mt-2`}
            >
              {user?.avatarUrl ? "Atualizar foto" : "Enviar foto"}
            </Button>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="uppercase font-semibold h-fit absolute top-2 right-2 sm:top-8 sm:right-8"
          title="Sair da conta"
          type="button"
        >
          <X
            size={20}
            color="#EBA417"
            className="hover:animate-spin-one-time"
          />
        </button>
      </div>
    </>
  );
}
