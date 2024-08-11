import * as HoverCard from "@radix-ui/react-hover-card";

import { secondsFormatter } from "../../utilities/secondsFormatter";
import { Trash } from "@phosphor-icons/react";

import MedicCard from "../Account/MedicCard";
import { Activity } from "../../context/AuthenticateContext";

interface ActivityItemProps {
  activity: Activity;
  removeAction: (id: number) => void;
}

export function ActivityItem({
  activity: { id, name, duration, author, description },
  removeAction,
}: ActivityItemProps) {
  return (
    <div className="my-7 first:mt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line">
        <div className="flex items-center gap-1">
          <h3 className="text-2xl">{name}</h3>

          <span className="text-button-base text-2xl">–</span>

          <span className="text-sm text-[#AAA]">
            {secondsFormatter(duration)} de duração
          </span>
        </div>

        <div className="flex gap-2 items-end">
          <HoverCard.Root>
            <MedicCard medic={author} />

            <span className="text-sm text-[#AAA]">
              Indicada por{" "}
              <HoverCard.Trigger className="underline cursor-pointer">
                {author.name}
              </HoverCard.Trigger>
            </span>
          </HoverCard.Root>

          <button
            title={`Deletar atividade ${name} do médico ${author.name}`}
            className="absolute ml-60"
            onClick={() => removeAction(id)}
          >
            <Trash className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      <p className="mt-3 ml-1 pr-1 text-description max-h-72 overflow-y-auto break-words">
        {description}
      </p>
    </div>
  );
}
