import { MagnifyingGlass } from "@phosphor-icons/react";
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
    <div className={`flex items-center ${className}`} {...rest}>
      <div className="group flex w-full items-center">
        <input
          className="w-full rounded-l-full border border-line bg-transparent p-2 pl-5 outline-none focus:border-button-base group-hover:border-button-base"
          value={value}
          placeholder="Pesquisar"
          onChange={(event) => setValue(event.target.value)}
        />
      </div>

      <MagnifyingGlass
        className="box-content cursor-pointer rounded-r-full border border-l-0 border-line bg-[#222222] px-3 py-2"
        onClick={props.onSearchClicker}
        size={24}
      />
    </div>
  );
}
