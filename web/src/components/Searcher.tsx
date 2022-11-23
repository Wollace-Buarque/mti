import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";

interface SearcherProps extends React.HTMLAttributes<HTMLDivElement> {
  onChangeHandler: (value: string) => void;
}

export default function Searcher(props: SearcherProps) {
  const { className, onChangeHandler, ...rest } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    onChangeHandler(value);
  }, [value]);

  return (
    <div
      className={`flex items-center group ${className}`} {...rest}>

      <MagnifyingGlass
        className="box-content py-2 pl-3 border border-r-0 border-line rounded-l-full group-hover:border-button-base"
        size={24} />

      <input
        className="p-2 w-full bg-transparent border border-l-0 border-line rounded-r-full outline-none group-hover:border-button-base"
        value={value}
        placeholder="Pesquisar"
        onChange={event => setValue(event.target.value)} />
    </div>
  )
}