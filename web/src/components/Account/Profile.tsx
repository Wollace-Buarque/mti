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
  const [croppedImage, setCroppedImage] = useState<unknown | undefined>(undefined)

  const [isOpenCropModal, setIsOpenCropModal] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".png", /*".gif",*/ ".jpeg", ".jpg"]
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
    uploadData.append("file", await blobToImageFile(croppedImage as string, file.name).then(file => file));

    toast.promise(
      server.post("/avatar", uploadData).then(response => {
        setUser({
          ...user,
          avatarUrl: response.data.avatarUrl
        });
      }),
      {
        loading: "Enviando...",
        success: "Foto de perfil atualizada.",
        error: "Ocorreu um erro ao atualizar a foto de perfil."
      },
      {
        icon: null,
        className: "toast",
      }
    )

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
          onCropComplete={setCroppedImage} />
      )}

      <div className="flex justify-between h-fit">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col gap-2 relative">
            <input {...getInputProps()} />

            <img
              {...getRootProps()}
              onError={onAvatarError}
              className="w-40 h-40 max-w-[10rem] max-h-40 rounded-full shadow-image cursor-pointer hover:opacity-75 transition-opacity duration-300"
              // src={file ? URL.createObjectURL(file) : (user?.avatarUrl ?? userSVG)}
              src={croppedImage ? (croppedImage as string) : (user?.avatarUrl ?? userSVG)}
              width={160} height={160} draggable={false} />

            <Button
              className={`${file ? "opacity-100 visible" : "opacity-0 invisible"} absolute top-24 left-56 sm:left-[11.5rem] transition-all duration-500 w-1/2 sm:w-full`}
              onClick={uploadAvatar}
              title="Enviar" />
          </div>

          <div>
            <h3 className="text-2xl text-title text-semibold">
              {user?.name}
            </h3>

            <span className="text-sm text-description">
              Desde {user?.createdAt.toLocaleString("pt-BR", { dateStyle: "long" })}
            </span>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="uppercase font-semibold h-fit"
          title="Sair da conta"
          type="button">
          <X
            size={20}
            color="#EBA417"
            className="hover:animate-spin-one-time mt-8 sm:mt-0" />
        </button>
      </div>
    </>
  );
}