import { useContext, useEffect, useState } from "react";

import { UploadSimple } from "@phosphor-icons/react";
import { useDropzone } from "react-dropzone";

import { AuthenticateContext, User } from "../../context/AuthenticateContext";
import { server } from "../../services/server";

import showToast from "../../utilities/toast";

import Button from "../Button";
import { ImageModal } from "../ImageModal";

interface ReportProps {
  user: User;
}

export default function Report(props: ReportProps) {
  const { setUser } = useContext(AuthenticateContext);
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": [".png", /*".gif",*/ ".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    setFile(acceptedFiles[0]);
  }, [acceptedFiles]);

  if (!props.user) {
    return null;
  }

  async function uploadReport() {
    if (!props.user) {
      showToast("Você precisa estar conectado para fazer isso.", 500);
      return;
    }

    if (!file) {
      showToast("Selecione uma imagem.", 500);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("email", props.user.email);
    uploadData.append("type", "report");
    uploadData.append("file", file);

    const { data } = await server.post("/report", uploadData);

    if (data.message !== "Report changed.") {
      setFile(null);
      showToast("Ocorreu um erro ao enviar o laudo médico.", 500);
      return;
    }

    setUser({
      ...props.user,
      report: data.report,
    });

    showToast("Laudo médico atualizado.", 500);
    setFile(null);
  }

  return (
    <div className="mt-6">
      <input {...getInputProps()} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-title text-3xl">
          {props.user.report ? "Seu" : "Adicionar"} laudo médico
          <em {...getRootProps()}>
            <UploadSimple color="#EBA417" className="cursor-pointer" />
          </em>
        </h2>

        <Button
          className={`${file ? "block" : "hidden"} h-14 sm:w-28 mt-0`}
          onClick={uploadReport}
          title="Enviar"
        />
      </div>

      <ImageModal
        src={file ? URL.createObjectURL(file) : props.user.report?.reportUrl}
        className="shadow-elevation rounded mt-4"
        draggable={false}
      />
    </div>
  );
}
