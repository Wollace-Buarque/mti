import { Medic } from "../pages/Main";

interface MedicsProps {
  medics: Medic[] | undefined;
}

export default function Medics(props: MedicsProps) {
  return (
    <>
      {props.medics && props.medics.length >= 3 && (
        <div className="mb-11 flex flex-col items-center">
          <div className="relative flex justify-center gap-28">
            <img
              className="absolute z-10 h-[300px] w-[285px] rounded-lg shadow-image transition-transform duration-500 hover:scale-[1.03]"
              draggable={false}
              src={props.medics[0].avatarUrl}
            />

            <img
              className="h-[300px] w-[285px] rounded-lg opacity-50 shadow-image transition-transform duration-500 hover:scale-x-[1.03]"
              draggable={false}
              src={props.medics[1].avatarUrl}
            />

            <img
              className="h-[300px] w-[285px] rounded-lg opacity-50 shadow-image transition-transform duration-500 hover:scale-x-[1.03]"
              draggable={false}
              src={props.medics[2].avatarUrl}
            />
          </div>

          <span className="mt-2 text-[#D9D9D9]">Alguns dos nossos médicos</span>
        </div>
      )}
    </>
  );
}
