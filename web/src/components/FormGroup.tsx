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
      className={`flex flex-col uppercase text-sm font-semibold ${props.className}`}
    >
      <label htmlFor={name}>{title}</label>

      {textarea ? (
        <textarea
          className="bg-[#252222] p-2 rounded-sm text-text font-normal placeholder-text placeholder:text-sm focus:outline-1 focus:outline-button-base focus:outline resize-none"
          rows={6}
          id={name}
          name={name}
          placeholder={placeholder}
          style={{ paddingBlockEnd: "0.5rem" }}
        />
      ) : (
        <input
          className="bg-[#252222] p-2 rounded-sm text-text font-normal placeholder-text placeholder:text-sm focus:outline-1 focus:outline-button-base focus:outline"
          id={name}
          name={name}
          type={type ?? "text"}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
