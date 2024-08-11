import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  name: string;
  active?: boolean;
}

export default function NavLink(props: NavLinkProps) {
  return (
    <li
      className={`relative flex h-[3.625rem] items-center sm:h-16 ${props.active ? `font-medium after:absolute after:bottom-[1px] after:left-0 after:h-[3px] after:w-full after:animate-grow after:rounded-[3px_3px_0_0] after:bg-button-base after:opacity-100 after:content-[""]` : ""}`}
    >
      <Link to={props.to}>{props.name}</Link>
    </li>
  );
}
