interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  type?: "button" | "submit";
}

export default function Button(props: ButtonProps) {
  const { title = "submit", type, className, ...rest } = props;

  return (
    <button
      className={`text-button-text bg-button-base text-center rounded w-full py-3 mt-4 font-semibold hover:brightness-90 transition-[filter] duration-300 ${className}`}
      type={type}
      {...rest}>
      {title}
    </button>
  );
}