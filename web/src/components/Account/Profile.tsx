import { X } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import userSVG from "../../assets/user.svg";
import { AuthenticateContext } from "../../context/AuthenticateContext";
import { server } from "../../services/server";
import showToast from "../../utilities/toast";
import Button from "../Button";
import { blobToImageFile } from "../CropImage/crop-image";
import { CropImageModal } from "../CropImage/CropImageModal";

export default function Profile() {
  const { user, setUser } = useContext(AuthenticateContext);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<unknown | undefined>(
    undefined,
  );

  const [isOpenCropModal, setIsOpenCropModal] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".png", /*".gif",*/ ".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    setFile(acceptedFiles[0]);
    setIsOpenCropModal(true);
  }, [acceptedFiles]);

  function handleExit() {
    showToast("Desconectado.", 500);

    setUser(null);
    localStorage.removeItem("token");

    navigate("/login");
  }

  async function uploadAvatar() {
    if (!user) {
      showToast("Você precisa estar conectado para fazer isso.", 500);
      return;
    }

    if (!croppedImage || !file) {
      showToast("Selecione uma imagem.", 500);
      return;
    }

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
        loading: "Enviando...",
        success: "Foto de perfil atualizada.",
        error: "Ocorreu um erro ao atualizar a foto de perfil.",
      },
      {
        icon: null,
        className: "toast",
      },
    );

    setFile(null);
  }

  function onAvatarError(event: any) {
    (event.target as HTMLImageElement).src = userSVG;
  }

  return (
    <>
      {isOpenCropModal && file && (
        <CropImageModal
          open={isOpenCropModal}
          setOpen={setIsOpenCropModal}
          image={URL.createObjectURL(file)}
          onCropComplete={setCroppedImage}
        />
      )}

      <div className="flex justify-center sm:justify-start h-fit relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-fit mx-auto">
            <input {...getInputProps()} />

            <img
              {...getRootProps()}
              onError={onAvatarError}
              className="size-40 max-w-40 max-h-40 rounded-full shadow-image cursor-pointer hover:opacity-75 transition-opacity duration-300"
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
              className={`${file ? "block" : "hidden"} w-full`}
              onClick={uploadAvatar}
              title="Enviar"
            />
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
