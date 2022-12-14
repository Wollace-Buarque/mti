import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useState } from "react";

interface SearcherProps extends React.HTMLAttributes<HTMLDivElement> {
  onChangeHandler: (value: string) => void;
  onSearchClicker?: () => void;
}

export default function Searcher(props: SearcherProps) {
  const { className, onChangeHandler, ...rest } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    onChangeHandler(value);
  }, [value]);

  return (
    <div
      className={`flex items-center ${className}`} {...rest}>

      <div className="flex items-center group w-full">

        <input
          className="p-2 pl-5 w-full bg-transparent border border-line outline-none rounded-l-full group-hover:border-button-base focus:border-button-base"
          value={value}
          placeholder="Pesquisar"
          onChange={event => setValue(event.target.value)} />
      </div>

      <MagnifyingGlass
        className="box-content py-2 px-3 bg-[#222222] border border-l-0 border-line rounded-r-full cursor-pointer"
        onClick={props.onSearchClicker}
        size={24} />
    </div>
  )
}