import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  name: string;
  active?: boolean;
}

export default function NavLink(props: NavLinkProps) {
  return (
    <li className={`h-[3.625rem] sm:h-16 flex items-center relative ${props.active ? `font-medium after:absolute after:content-[""] after:w-full after:h-[3px] after:bg-button-base after:rounded-[3px_3px_0_0] after:left-0 after:bottom-[1px] after:opacity-100 after:animate-grow` : ""}`}>

      <Link to={props.to}>
        {props.name}
      </Link>

    </li>
  )
}