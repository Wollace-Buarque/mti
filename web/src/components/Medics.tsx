import { Medic } from "../pages/Main";

interface MedicsProps {
  medics: Medic[] | undefined;
}

export default function Medics(props: MedicsProps) {
  return (
    <>
      {props.medics && props.medics.length >= 3 && (
        <div className="flex flex-col items-center mb-11">

          <div className="flex justify-center gap-28 relative">

            <img
              className="absolute w-[285px] h-[300px] rounded-lg z-10 shadow-image hover:scale-[1.03] transition-transform duration-500"
              draggable={false}
              src={props.medics[0].avatarUrl} />

            <img
              className="opacity-50 w-[285px] h-[300px] rounded-lg shadow-image hover:scale-x-[1.03] transition-transform duration-500"
              draggable={false}
              src={props.medics[1].avatarUrl} />

            <img
              className="opacity-50 w-[285px] h-[300px] rounded-lg shadow-image hover:scale-x-[1.03] transition-transform duration-500"
              draggable={false}
              src={props.medics[2].avatarUrl} />

          </div>

          <span className="mt-2 text-[#D9D9D9]">
            Alguns dos nossos médicos
          </span>
        </div>)}
    </>
  )
}