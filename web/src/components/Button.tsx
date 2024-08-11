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
        "flex w-full items-center justify-center rounded-lg bg-button-base py-3 text-center font-semibold text-button-text transition-[filter] duration-300 enabled:hover:brightness-90",
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
