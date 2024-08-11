interface FormGroupProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  title: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
}

export default function FormGroup(props: FormGroupProps) {
  const { name, title, placeholder, type, textarea, ...rest } = props;

  return (
    <div
      {...rest}
      className={`flex flex-col text-sm font-semibold uppercase ${props.className}`}
    >
      <label htmlFor={name}>{title}</label>

      {textarea ? (
        <textarea
          className="resize-none rounded-sm bg-[#252222] p-2 font-normal text-text placeholder-text placeholder:text-sm focus:outline focus:outline-1 focus:outline-button-base"
          rows={6}
          id={name}
          name={name}
          placeholder={placeholder}
          style={{ paddingBlockEnd: "0.5rem" }}
        />
      ) : (
        <input
          className="rounded-sm bg-[#252222] p-2 font-normal text-text placeholder-text placeholder:text-sm focus:outline focus:outline-1 focus:outline-button-base"
          id={name}
          name={name}
          type={type ?? "text"}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
