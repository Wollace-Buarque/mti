import { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  title: string;
}

export default function Button({ title, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`text-button-text bg-button-base text-center rounded w-full py-3 mt-4 font-semibold enabled:hover:brightness-90 transition-[filter] duration-300 ${className}`}
      {...rest}>
      {title}
    </button>
  );
}