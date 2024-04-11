import { useCallback, useMemo, useState } from "react";
import { Image } from "../Context/AuthContext";

type usePaginationProps = {
  imgArray: Image[];
  index: number;
};

const useCarouselPagination = ({ imgArray, index }: usePaginationProps) => {
  const [visibleRange, setVisibleRange] = useState(() => {
    const start = Math.max(index - 3, 0);
    const end = Math.min(start + 6, imgArray?.length);
    return { start, end };
  });

  const loadNextBatch = useCallback(() => {
    setVisibleRange(({ start, end }) => {
      const newEnd = Math.min(end + 6, imgArray?.length);
      return { start: start, end: newEnd };
    });
  }, [imgArray?.length]);

  const loadPreviousBatch = useCallback(() => {
    setVisibleRange(({ start, end }) => {
      const newStart = Math.min(0, start - 6);
      return { start: newStart, end: end };
    });
  }, []);

  const paginatedData = useMemo(() => {
    return imgArray?.slice(visibleRange.start, visibleRange.end);
  }, [imgArray, visibleRange]);

  return { paginatedData, loadNextBatch, loadPreviousBatch };
};

export default useCarouselPagination;
