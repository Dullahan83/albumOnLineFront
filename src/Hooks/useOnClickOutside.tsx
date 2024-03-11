import { MutableRefObject, useEffect } from "react";

const useOnClickOutside = (ref: MutableRefObject<HTMLDivElement>, handler) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!ref.current || !target.contains(ref.current)) return;

      handler();

      return;
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

export default useOnClickOutside;
