import { MutableRefObject, useEffect } from "react";

const useOnClickOutside = (
  ref: MutableRefObject<HTMLElement>,
  handler: () => void,
  exceptionRef?: MutableRefObject<HTMLElement>
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        exceptionRef &&
        exceptionRef.current &&
        exceptionRef.current.contains(target)
      ) {
        return;
      }
      if (!ref.current || ref.current.contains(target)) return;

      handler();

      return;
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, exceptionRef]);
};

export default useOnClickOutside;
