import { ImageModal } from "./ImageModal";

interface ReportSummaryProps {
  updatedAt: Date;
  reportUrl: string;
}

export function ReportSummary({ updatedAt, reportUrl }: ReportSummaryProps) {
  return (
    <>
      <h2 className="text-title text-3xl">Relatório médico</h2>

      <p className="text-sm text-[#AAA]">
        Última vez atualizado em{" "}
        {updatedAt.toLocaleString("pt-BR", {
          dateStyle: "long",
        })}
      </p>

      <ImageModal
        src={reportUrl}
        className="size-full object-cover shadow-elevation rounded mt-4"
        draggable={false}
      />
    </>
  );
}
