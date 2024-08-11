import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

import { Spinner } from "./spinner";

interface ButtonProps extends ComponentProps<"button"> {
  title?: string;
  isLoading?: boolean;
}

export function Button({
  title,
  isLoading,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        "text-button-text bg-button-base text-center rounded-lg w-full py-3 font-semibold enabled:hover:brightness-90 transition-[filter] duration-300",
        className,
      )}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <Spinner color="black" size={24} />
      ) : (
        <>
          {title}
          {children}
        </>
      )}
    </button>
  );
}
