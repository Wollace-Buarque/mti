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
    <div className={`my-7 first:mt-4 ${props.showActivities ? "opacity-100 visible max-h-96" : "opacity-0 invisible max-h-0"} transition-all duration-500`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line">

        <div className="flex items-center gap-1">
          <h3 className="text-2xl">
            {props.activity.name}
          </h3>

          <span className="text-button-base text-2xl">
            –
          </span>

          <span className="text-sm text-[#AAA]">
            {secondsFormatter(props.activity.duration)} de duração
          </span>
        </div>

        <HoverCard.Root>
          <MedicCard medic={props.activity.author} />

          <span className="text-sm text-[#AAA]">
            Indicada por <HoverCard.Trigger className="underline cursor-pointer">{props.activity.author.name}</HoverCard.Trigger>
          </span>
        </HoverCard.Root>

      </div>

      <p className="mt-3 ml-1 pr-1 text-description max-h-72 overflow-y-auto break-words">
        {props.activity.description}
      </p>
    </div>
  )
}