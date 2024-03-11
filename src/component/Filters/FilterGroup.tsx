import React, { useEffect, useRef, useState } from "react";
import useOnClickOutside from "../../Hooks/useOnClickOutside";
import ChevronIcon from "../Shared/ChevronIcon";
import { cn } from "../Utils/func";
type Filter = number | string;

interface FilterProps {
  filterList: Filter[] | null;
  setFilter: (filter: Filter) => void;
  filterType: "year" | "keyword";
  placeholder: string;
  id: string;
  className: string;
  activeList: "year" | "keyword" | "";
  setActive: React.Dispatch<React.SetStateAction<"year" | "keyword" | "">>;
}

const FilterGroup: React.FC<FilterProps> = ({
  filterList,
  setFilter,
  filterType,
  placeholder,
  id,
  className,
  activeList,
  setActive,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOpenState = () => {
    setIsOpen(!isOpen);
    setActive(filterType);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActive("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(filterType);
    setInputValue(e.target.value);
    if (e.target.value.length >= 1) {
      setIsTyping(true);
      setIsOpen(true);
    } else {
      setIsTyping(false);
      setIsOpen(false);
    }
  };

  const handleAddFilter = (filter: Filter) => {
    setFilter(filter);
    setIsOpen(false);
    setActive(filterType);
  };

  useOnClickOutside(ref, handleClose);

  useEffect(() => {
    setIsOpen(activeList === filterType);
  }, [activeList, filterType]);

  return (
    <div
      ref={ref}
      className={cn(
        `${className} z-0 relative w-2/6 h-full transition-all duration-150 lg:max-w-[400px] border-[2px] border-b-0 border-transparent`,
        {
          "sm:w-5/12 lg:max-w-[400px] rounded-b-none border-[#c7c7c7b5]":
            isOpen,
        }
      )}
    >
      <div className="w-full h-full flex">
        <input
          name={id}
          placeholder={placeholder}
          className="w-full h-full bg-inherit text-black placeholder:text-black px-2 outline-none"
          value={inputValue}
          onChange={handleChange}
        />
        <ChevronIcon
          className="h-full p-2"
          isOpen={isOpen}
          onClick={handleOpenState}
        />
      </div>
      {isOpen && (
        <ul
          className={cn(
            " w-full hidden absolute z-50 bg-inherit p-2 pt-4 -mt-1 gap-y-2 max-h-[250px] overflow-y-scroll rounded-b-lg  ",
            {
              "grid-cols-1 grid": isTyping,
              " gap-x-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  grid shadow-[0_4px_3px_0_#808080]":
                isOpen,
            }
          )}
        >
          {filterList &&
            filterList
              .filter((filter) =>
                filter
                  .toString()
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              )
              .sort()
              .map((filter, index) => (
                <li
                  key={index}
                  className="text-sm text-black capitalize flex text-start row-span-1 w-full max-h-6 overflow-hidden  whitespace-break-spaces break-all overflow-ellipsis hover:cursor-pointer"
                  onClick={() => {
                    handleAddFilter(filter);
                  }}
                >
                  {filter}
                </li>
              ))}
          {filterList &&
          !filterList.filter((filter) =>
            filter.toString().toLowerCase().includes(inputValue.toLowerCase())
          ).length ? (
            <div className=" col-span-3 text-black">Aucun résultat</div>
          ) : null}
        </ul>
      )}
    </div>
  );
};

export default FilterGroup;
