import { useEffect, useMemo, useState } from "react";
import { Image } from "../Context/AuthContext";

type usePaginationProps = {
  filteredData: Image[];
  scrollContainerRef: React.MutableRefObject<HTMLDivElement>;
};

const usePagination = ({
  filteredData,
  scrollContainerRef,
}: usePaginationProps) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadNextBatch, setLoadNextBatch] = useState(false);

  const paginatedData = useMemo(() => {
    return filteredData
      ?.sort((a, b) => b.date.date.localeCompare(a.date.date))
      .slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  const handleLoadNextBatch = () => {
    setLoadNextBatch(true);
    const timer = setTimeout(() => {
      setLoadNextBatch(false);
      setVisibleCount((prev) => prev + 12);
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    setLoadNextBatch(false);
    const target = scrollContainerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (filteredData?.length > 0 && filteredData.length > visibleCount) {
            handleLoadNextBatch();
          }
        }
      },
      { threshold: 0.8 }
    );
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [scrollContainerRef, visibleCount, filteredData?.length]);

  return { loadNextBatch, paginatedData };
};

export default usePagination;
