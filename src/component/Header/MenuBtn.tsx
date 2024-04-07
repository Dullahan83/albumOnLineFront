import { cn } from "../Utils/func";

const MenuBtn = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <>
      <span
        className={cn(
          "inline-block w-full h-0.5 bg-black dark:bg-background transition-[transform_opacity] duration-200",
          {
            "translate-y-[calc(50%+9px)] opacity-0": isOpen,
          }
        )}
      ></span>
      <span
        className={cn(
          "inline-block w-full h-0.5 relative bg-black before:absolute before:content-[''] before:w-full before:h-full before:origin-center before:left-0 before:bg-inherit after:absolute after:content-[''] after:w-full after:h-full after:origin-center after:left-0 before:transition-transform after:transition-transform after:rotate-0  before:rotate-0 dark:bg-background  ",
          {
            "bg-transparent dark:bg-transparent dark:after:bg-background after:bg-black before:bg-black before:-rotate-45 after:rotate-45 dark:before:bg-background before:delay-200 after:delay-200":
              isOpen,
          }
        )}
      ></span>
      <span
        className={cn(
          "inline-block w-full h-0.5 bg-black dark:bg-background transition-[transform_opacity] duration-200",
          {
            "-translate-y-[calc(50%+9px)] opacity-0": isOpen,
          }
        )}
      ></span>
    </>
  );
};

export default MenuBtn;
