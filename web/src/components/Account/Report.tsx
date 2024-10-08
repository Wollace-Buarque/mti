import { UploadSimple } from "@phosphor-icons/react";
import cx from "classnames";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { AuthenticateContext, User } from "../../context/AuthenticateContext";
import { api } from "../../services/api";
import { showToast } from "../../utilities/toast";
import { Button } from "../Button";
import { ImageModal } from "../ImageModal";

interface ReportProps {
  user: User;
}

export function Report({ user }: ReportProps) {
  const { setUser } = useContext(AuthenticateContext);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    setFile(acceptedFiles[0]);
  }, [acceptedFiles]);

  if (!user) return null;

  async function uploadReport() {
    if (!user) {
      showToast({
        message:
          "Não foi possível validar sua conta, tente fazer login novamente.",
        type: "error",
      });
      return;
    }

    if (!file) {
      showToast({
        message: "Você precisa adicionar um arquivo",
        type: "warning",
      });
      return;
    }

    const uploadData = new FormData();
    uploadData.append("type", "report");
    uploadData.append("file", file);

    setIsUploading(true);

    toast.promise(api.post("/report", uploadData), {
      loading: "Seu relatório está sendo encaminhado... 🚚",
      success: (response) => {
        setUser({
          ...user,
          report: response.data.report,
        });

        return "Seu relatório foi atualizado.";
      },
      error: "Algo deu errado o seu relatório.",
      finally: () => {
        acceptedFiles.pop();
        setIsUploading(false);
        setFile(null);
      },
    });
  }

  return (
    <div className="mt-6">
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
        <h2 className="group flex items-center gap-2 text-3xl text-title">
          {user.report ? "Seu" : "Adicionar"} laudo médico
          <em {...getRootProps()}>
            <span className="sr-only">Adicionar imagem de relatório</span>

            <UploadSimple
              color="#EBA417"
              className="cursor-pointer transition-transform group-hover:scale-110"
            />
          </em>
        </h2>

        <Button
          onClick={uploadReport}
          isLoading={isUploading}
          className={cx("flex sm:w-28", { hidden: !file })}
        >
          {user.report ? "Atualizar" : "Enviar"}
        </Button>
      </div>

      <ImageModal
        src={file ? URL.createObjectURL(file) : user.report?.reportUrl}
        className="mt-4 rounded shadow-elevation"
        draggable={false}
      />
    </div>
  );
}
