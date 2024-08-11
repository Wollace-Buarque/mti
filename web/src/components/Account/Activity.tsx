import * as HoverCard from "@radix-ui/react-hover-card";

import { Activity as IActivity } from "../../context/AuthenticateContext";
import { secondsFormatter } from "../../utilities/secondsFormatter";
import MedicCard from "./MedicCard";

interface ActivityProps {
  activity: IActivity;
  showActivities: boolean;
}

export default function Activity(props: ActivityProps) {
  return (
    <div
      className={`my-7 first:mt-4 ${props.showActivities ? "visible max-h-96 opacity-100" : "invisible max-h-0 opacity-0"} transition-all duration-500`}
    >
      <div className="flex flex-col justify-between border-b border-line sm:flex-row sm:items-end">
        <div className="flex items-center gap-1">
          <h3 className="text-2xl">{props.activity.name}</h3>

          <span className="text-2xl text-button-base">–</span>

          <span className="text-sm text-[#AAA]">
            {secondsFormatter(props.activity.duration)} de duração
          </span>
        </div>

        <HoverCard.Root>
          <MedicCard medic={props.activity.author} />

          <span className="text-sm text-[#AAA]">
            Indicada por{" "}
            <HoverCard.Trigger className="cursor-pointer underline">
              {props.activity.author.name}
            </HoverCard.Trigger>
          </span>
        </HoverCard.Root>
      </div>

      <p className="ml-1 mt-3 max-h-72 overflow-y-auto break-words pr-1 text-description">
        {props.activity.description}
      </p>
    </div>
  );
}
