import { ImageModal } from "./ImageModal";

interface ReportSummaryProps {
  updatedAt: Date;
  reportUrl: string;
}

export function ReportSummary({ updatedAt, reportUrl }: ReportSummaryProps) {
  return (
    <>
      <h2 className="text-3xl text-title">Relatório médico</h2>

      <p className="text-sm text-[#AAA]">
        Última vez atualizado em{" "}
        {updatedAt.toLocaleString("pt-BR", {
          dateStyle: "long",
        })}
      </p>

      <ImageModal
        src={reportUrl}
        className="mt-4 size-full rounded object-cover shadow-elevation"
        draggable={false}
      />
    </>
  );
}
