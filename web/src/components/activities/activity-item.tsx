import { Trash } from "@phosphor-icons/react";
import * as HoverCard from "@radix-ui/react-hover-card";

import { Activity } from "../../context/AuthenticateContext";
import { secondsFormatter } from "../../utilities/secondsFormatter";
import MedicCard from "../Account/MedicCard";

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
      <div className="flex flex-col justify-between border-b border-line sm:flex-row sm:items-end">
        <div className="flex items-center gap-1">
          <h3 className="text-2xl">{name}</h3>

          <span className="text-2xl text-button-base">–</span>

          <span className="text-sm text-[#AAA]">
            {secondsFormatter(duration)} de duração
          </span>
        </div>

        <div className="flex items-end gap-2">
          <HoverCard.Root>
            <MedicCard medic={author} />

            <span className="text-sm text-[#AAA]">
              Indicada por{" "}
              <HoverCard.Trigger className="cursor-pointer underline">
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

      <p className="ml-1 mt-3 max-h-72 overflow-y-auto break-words pr-1 text-description">
        {description}
      </p>
    </div>
  );
}
