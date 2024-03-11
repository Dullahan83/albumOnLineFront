import React from "react";
import PictureSqueleton from "./PictureSqueleton";

const PictureContainer = () => {
  return (
    <div className="w-full sm:w-5/6 min-h-screen flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-2 relative -z-10">
        {new Array(12).fill(0).map((_,i) => {
            return <PictureSqueleton key={i}/>
        })}

    </div>
  );
};

export default PictureContainer;
