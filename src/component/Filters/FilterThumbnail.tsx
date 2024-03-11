import React from "react"
import { Filter } from "../../pages/Album";
import { cn } from "../Utils/func";
import DeleteIcon from "../Shared/DeleteIcon";

type FilterThumbnailProps = {
    filter: Filter;
    filterCategory: "year" | "keyword";
    onRemove: (filter: Filter, filterCategory: "year" | "keyword") => void;
  };
  
  const FilterThumbnail = React.memo(({ filter, filterCategory, onRemove }: FilterThumbnailProps) => {
    const handleRemove = () => {
        onRemove(filter, filterCategory)
    }
    return (
      <div className={cn("px-4 py-2 rounded-lg uppercase text-black bg-primary dark:bg-primary-dark relative flex",{"bg-secondary dark:bg-secondary-dark": filterCategory === "keyword"})}>
        {filter}
       
          <DeleteIcon onClick={handleRemove} size="24px" className="ml-2"/>
      </div>
    );
  })
  
  export default FilterThumbnail