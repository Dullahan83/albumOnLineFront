import { ComponentPropsWithoutRef } from "react";

export const PictureSqueleton = ({
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <div className={`${props.className}  bg-white bg-opacity-25 animate-pulse`} />
);

export default PictureSqueleton;
