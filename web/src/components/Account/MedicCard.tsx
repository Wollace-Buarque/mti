import * as HoverCard from "@radix-ui/react-hover-card";

import userSVG from "../../assets/user.svg";
import { User } from "../../context/AuthenticateContext";

export default function MedicCard(props: { medic: User }) {

  return (
    <HoverCard.Portal>
      <HoverCard.Content className="mt-1">

        <img
          src={props.medic?.avatarUrl ?? userSVG}
          draggable={false}
          className="bg-body w-36 max-w-[9rem] h-36 max-h-36 shadow-image rounded-full" />

        <HoverCard.Arrow className="fill-button-base" />
      </HoverCard.Content>

    </HoverCard.Portal>
  )
}