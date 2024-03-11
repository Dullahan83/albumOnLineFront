import React from "react"
import { Filter } from "../../pages/Album";
import { cn } from "../Utils/func";
import DeleteIcon from "./DeleteIcon";

type KeywordThumbnailProps = {
    filter: Filter;
    onRemove: () => void;
  };
  
  const KeywordThumbnail = ({ filter, onRemove }: KeywordThumbnailProps) => {
    const handleRemove = () => {
        onRemove()
    }
    return (
      <div className={cn("px-4 py-2 w-fit rounded-lg uppercase text-white bg-[#9c27b0] relative flex")}>
        {filter}
          <DeleteIcon onClick={handleRemove} size="24px" className="ml-2" color="#fff"/>
      </div>
    );
  };
  
  export default KeywordThumbnail