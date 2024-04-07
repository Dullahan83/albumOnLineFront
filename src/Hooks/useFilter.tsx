import { useReducer } from "react";
import { ActiveList, Filter } from "../pages/Album";

const filterReducer = (
  state: FilterStateProps,
  action: FilterAction
): FilterStateProps => {
  switch (action.type) {
    case "ADD_FILTER":
      return {
        ...state,
        [action.filterCategory]: [
          ...state[action.filterCategory],
          action.payload,
        ],
      };
    case "REMOVE_FILTER":
      return {
        ...state,
        [action.filterCategory]: state[action.filterCategory].filter(
          (item) => item !== action.payload
        ),
      };
    case "RESET_FILTERS":
      return initialFilterState;
    default:
      return state;
  }
};

type FilterAction =
  | { type: "ADD_FILTER"; filterCategory: ActiveList; payload: Filter }
  | { type: "REMOVE_FILTER"; filterCategory: ActiveList; payload: Filter }
  | { type: "RESET_FILTERS" };

export type FilterStateProps = {
  year: number[];
  keyword: string[];
};

const initialFilterState: FilterStateProps = {
  year: [],
  keyword: [],
};

export const useFilter = () => {
  const [filterState, dispatchFilter] = useReducer(
    filterReducer,
    initialFilterState
  );

  const addFilter = (filterCategory: ActiveList, filter: Filter) => {
    dispatchFilter({ type: "ADD_FILTER", filterCategory, payload: filter });
  };

  const removeFilter = (filterCategory: ActiveList, filter: Filter) => {
    dispatchFilter({ type: "REMOVE_FILTER", filterCategory, payload: filter });
  };

  const resetFilters = () => {
    dispatchFilter({ type: "RESET_FILTERS" });
  };

  return { filterState, addFilter, removeFilter, resetFilters };
};
