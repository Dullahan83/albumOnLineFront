import { useRef, useState } from "react";
import useOnClickOutside from "../../Hooks/useOnClickOutside";
import { useWindowSize } from "../../Hooks/useWindowSize";
import { cn } from "../Utils/func";
import AlbumChoice from "./AlbumChoice";
import Auth from "./Auth/Auth";
import MenuBtn from "./MenuBtn";
import Nav from "./Nav";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  const [isOpen, setIsopen] = useState(false);
  const { width } = useWindowSize();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuBtn = useRef<HTMLButtonElement | null>(null);
  const handleClose = () => {
    setIsopen(false);
  };
  const handleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsopen((prev) => !prev);
  };
  useOnClickOutside(menuRef, handleClose, menuBtn);

  return (
    <>
      <header
        className={cn(
          ` flex items-center justify-between px-8 py-4 shadow-sm shadow-black/20 transition-shadow duration-0  dark:shadow-white/20 border-b border-b-border dark:border-b-border-dark sticky top-0 left-0 bg-inherit z-[100]`,
          {
            " shadow-none": isOpen,
            "delay-200": !isOpen,
          }
        )}
      >
        <ThemeSwitcher />
        {width >= 640 ? (
          <>
            <Nav className="hidden sm:flex gap-10 justify-self-center translate-x-1/4" />
            <div className="hidden sm:flex gap-x-4">
              <AlbumChoice />
              <Auth />
            </div>
          </>
        ) : (
          <button
            ref={menuBtn}
            onClick={handleOpen}
            className={cn(
              "flex flex-col justify-between w-8 gap-y-2 items-center ",
              { "justify-center": isOpen }
            )}
          >
            <MenuBtn isOpen={isOpen} />
          </button>
        )}
      </header>
      {width < 640 ? (
        <div
          ref={menuRef}
          className={cn(
            "flex sm:hidden fixed rounded-b-lg border-b border-b-black/15 z-50 dark:border-b-white/15  py-4 top-[72px] w-full items-center justify-center transition-transform duration-200 bg-inherit",
            {
              "translate-y-0 shadow-2xl shadow-black/30 dark:shadow-white/10 ":
                isOpen,
              "-translate-y-full": !isOpen,
            }
          )}
        >
          <ul className="flex flex-col items-center justify-center  w-full bg-inherit gap-y-4 ">
            <Nav className="flex flex-col items-center justify-center gap-y-4  " />
            <AlbumChoice />
            <Auth />
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Header;
