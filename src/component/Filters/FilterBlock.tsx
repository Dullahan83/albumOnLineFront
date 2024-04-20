import React from "react";
import { ActiveList, Filter } from "../../pages/Album";
import FilterGroup from "./FilterGroup";

type FilterState = {
  year: number[];
  keyword: string[];
};
type FilterBlocProps = {
  activeList: ActiveList | "";
  setActiveList: React.Dispatch<React.SetStateAction<ActiveList | "">>;
  updatedYearList: number[];
  updatedKeywordList: string[];
  filterState: FilterState;
  addFilter: (filterCategory: ActiveList, filter: Filter) => void;
  resetFilters: () => void;
};

const FilterBlock = ({
  activeList,
  setActiveList,
  updatedYearList,
  updatedKeywordList,
  filterState,
  addFilter,
  resetFilters,
}: FilterBlocProps) => {
  const handleAddFilter = (filter: Filter) => {
    if (activeList === "year" && !filterState.year.includes(filter as number)) {
      addFilter("year", filter);
    } else if (
      activeList === "keyword" &&
      !filterState.keyword.includes(filter as string)
    ) {
      addFilter("keyword", filter);
    }
  };

  return (
    <div className="  w-full lg:max-w-[1350px] h-14 flex flex-wrap gap-y-2 items-center relative z-0 mb-10 lg:mb-4">
      Filtrer par:
      <div className="relative w-full lg:flex-1 z-0  h-10 flex justify-between lg:ml-[10cqw]">
        <FilterGroup
          activeList={activeList}
          setActive={setActiveList}
          placeholder="Année"
          filterType="year"
          id="inputYear"
          filterList={updatedYearList}
          setFilter={(filter: Filter) => handleAddFilter(filter)}
          className="bg-primary dark:bg-primary-dark rounded-lg"
        />
        <FilterGroup
          activeList={activeList}
          setActive={setActiveList}
          placeholder="Mot clé"
          filterType="keyword"
          id="inputKeyword"
          filterList={updatedKeywordList?.sort((a, b) => a.localeCompare(b))}
          setFilter={(filter: Filter) => handleAddFilter(filter)}
          className="bg-secondary dark:bg-secondary-dark rounded-lg"
        />
        <button
          className="text-black px-4 py-1 border h-full self-center rounded-lg bg-background uppercase border-black "
          onClick={resetFilters}
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default FilterBlock;
