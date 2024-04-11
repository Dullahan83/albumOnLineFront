import { CircularProgress } from "@mui/material";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AuthContext, { Image } from "../Context/AuthContext";
import { useFilter } from "../Hooks/useFilter";
import usePagination from "../Hooks/usePagination";
import FilterBlock from "../component/Filters/FilterBlock";
import FilterThumbnail from "../component/Filters/FilterThumbnail";
import Layout from "../component/Layout/Layout";
import TimeLine from "../component/Layout/TimeLine";
import ConfirmationModal from "../component/Modals.tsx/ConfirmationModal";
import UpdateModal from "../component/Modals.tsx/UpdateImageModal";
import ReturnTopIcon from "../component/Shared/ReturnTopIcon";
import PictureContainer from "../component/SuspenseComponent/PictureContainer";
import SectionSqueleton from "../component/SuspenseComponent/SectionSqueleton";

export type Filter = string | number;
export type ActiveList = "year" | "keyword";

const LazySectionDisplayPicture = React.lazy(
  () => import("../component/Layout/SectionDisplayPictures")
);

const LazyCarouselModal = React.lazy(
  () => import("../component/Modals.tsx/CarouselModal")
);

const Album = () => {
  const { data, isLoading } = useContext(AuthContext);
  const { filterState, addFilter, removeFilter, resetFilters } = useFilter();
  const [selected, setSelected] = useState<number>(-1);
  const [activeList, setActiveList] = useState<ActiveList | "">("");
  const [showButtonScroll, setShowButtonScroll] = useState(false);
  const periodInterval = 1;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmationRef = useRef<HTMLDialogElement>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  // List of available filters
  const [updatedYearList, setUpdatedYearList] = useState<number[] | null>(null);
  const [updatedKeywordList, setUpdatedKeywordList] = useState<string[] | null>(
    null
  );

  const filterData = useCallback(() => {
    return data?.filter((item) => {
      const matchesYear =
        filterState.year.length === 0 ||
        filterState.year.includes(item.date.year);
      const matchesKeywords =
        filterState.keyword.length === 0 ||
        filterState.keyword.every((keyword) =>
          item.keyword.some((k) => k.word === keyword)
        );
      return matchesYear && matchesKeywords;
    });
  }, [data, filterState]);

  const filteredData = useMemo(() => filterData(), [filterData]);

  const { loadNextBatch, paginatedData } = usePagination({
    filteredData,
    scrollContainerRef,
  });

  const createIntervalsPicturesDisplay = (
    datas: Image[],
    periodStart: number
  ) => {
    // console.log(datas, periodStart)
    const sortedDatas = datas?.sort((a, b) =>
      b.date.date.localeCompare(a.date.date)
    );
    const isAncient = sortedDatas && sortedDatas[0]?.date?.year < 1950;
    const nextPeriodStart = periodStart - periodInterval;

    const arr = sortedDatas?.filter((Item) => {
      if (Item.date.year < 1950) {
        // console.log("on devrait en avoir")
        return Item;
      }
      if (Item.date.year <= periodStart && Item.date.year > nextPeriodStart) {
        return Item;
      }
    });
    if (isAncient) {
      return (
        <Suspense fallback={<div>chargement en cours ...</div>}>
          <LazySectionDisplayPicture
            ancient={isAncient}
            datas={arr}
            onEdit={handleOpenUpdate}
            handleOpen={handleOpenConfirmModal}
            handleSelectPicture={handleSelectPicture}
            handleClick={handleOpenModal}
            selected={selected}
            originalList={filteredData}
          ></LazySectionDisplayPicture>
        </Suspense>
      );
    }

    const restArray = sortedDatas.filter(
      (item) => item.date.year <= nextPeriodStart
    );
    if (!arr.length && !restArray.length) return null; // Arrêt si aucune image ne correspond

    return (
      <>
        <Suspense fallback={<SectionSqueleton />}>
          <LazySectionDisplayPicture
            datas={arr}
            periodStart={periodStart}
            periodEnd={periodStart - periodInterval}
            onEdit={handleOpenUpdate}
            handleOpen={handleOpenConfirmModal}
            handleSelectPicture={handleSelectPicture}
            handleClick={handleOpenModal}
            selected={selected}
            originalList={filteredData}
          ></LazySectionDisplayPicture>
        </Suspense>
        {createIntervalsPicturesDisplay(restArray, nextPeriodStart)}
      </>
    );
  };

  const handleRemoveFilter = (
    filter: Filter,
    filterCategory: "year" | "keyword"
  ) => {
    removeFilter(filterCategory, filter);
  };

  const handleOpenUpdate = (val: number) => {
    setSelected(val);
    setIsUpdating(true);
  };

  const handleCloseUpdate = () => {
    setIsUpdating(false);
  };

  //Carousel state management logic
  const handleOpenModal = () => {
    dialogRef.current?.showModal();
  };

  const handleCloseModal = () => {
    if (dialogRef.current) {
      dialogRef.current.classList.add("close");
      setTimeout(() => {
        dialogRef.current?.close();
        dialogRef.current?.classList.remove("close");
      }, 500); // matching css animation timing
    }
  };
  const handleOpenConfirmModal = () => {
    confirmationRef.current?.showModal();
  };

  const handleCloseConfirmModal = () => {
    if (confirmationRef.current) {
      confirmationRef.current.classList.add("close");
      setTimeout(() => {
        confirmationRef.current?.close();
        confirmationRef.current?.classList.remove("close");
      }, 500); // matching css animation timing
    }
  };
  // Save the selected picture in state
  const handleSelectPicture = (index: number) => {
    if (filterState.year.length) {
      if (index < paginatedData.length) setSelected(index);
      else setSelected(-1);
    } else setSelected(index);
  };
  const handleSelectPicture2 = (index: number) => {
    setSelected(index);
  };
  function arraysEqual(arr1: Filter[], arr2: Filter[]) {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  useEffect(() => {
    let newYearList = Array.from(
      new Set(filteredData?.map((item) => item.date.year))
    );
    let newKeywordList = Array.from(
      new Set(
        filteredData?.flatMap((item) =>
          item.keyword.map((keyword) => keyword.word)
        )
      )
    );
    newYearList = newYearList.filter(
      (year) => !filterState.year.includes(year)
    );
    newKeywordList = newKeywordList.filter(
      (keyword) => !filterState.keyword.includes(keyword)
    );
    // Vérifiez si les nouvelles listes sont différentes des listes actuelles avant de mettre à jour les états
    if (!arraysEqual(newYearList, updatedYearList)) {
      setUpdatedYearList(newYearList);
    }
    if (!arraysEqual(newKeywordList, updatedKeywordList)) {
      setUpdatedKeywordList(newKeywordList);
    }
  }, [filteredData, updatedKeywordList, updatedYearList]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowButtonScroll(true);
      } else setShowButtonScroll(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Layout>
        <div
          className={
            "flex flex-col items-center relative z-0 h-full  flex-grow px-6 sm:px-16 lg:px-28"
          }
        >
          <h1 className="text-3xl my-10 font-bold">Album</h1>
          <FilterBlock
            activeList={activeList}
            filterState={filterState}
            setActiveList={setActiveList}
            updatedYearList={updatedYearList}
            updatedKeywordList={updatedKeywordList}
            addFilter={addFilter}
            resetFilters={resetFilters}
          />

          <div className="w-full  flex flex-wrap relative -z-10 items-center justify-center gap-4 sm:w-5/6 mb-14">
            {filterState.year.map((filter: Filter) => (
              <FilterThumbnail
                key={filter}
                filter={filter}
                filterCategory="year"
                onRemove={handleRemoveFilter}
              />
            ))}
            {filterState.keyword.map((filter: Filter) => (
              <FilterThumbnail
                key={filter}
                filter={filter}
                filterCategory="keyword"
                onRemove={handleRemoveFilter}
              />
            ))}
          </div>
          {isLoading ? (
            <PictureContainer />
          ) : (
            <>
              <div
                className="flex w-full relative -z-10 "
                ref={scrollContainerRef}
              >
                {updatedYearList && (
                  <TimeLine
                    // filterState={filterState}
                    arrayYear={updatedYearList.sort((a, b) => b - a)}
                  />
                )}
                <div className="relative flex flex-col w-full ">
                  {filteredData &&
                    createIntervalsPicturesDisplay(
                      filteredData,
                      new Date().getFullYear()
                    )}
                </div>
              </div>
            </>
          )}
          {loadNextBatch ? (
            <CircularProgress size={40} className="mt-4" />
          ) : null}
          {showButtonScroll && (
            <ReturnTopIcon
              size="40px"
              color="#fff"
              className="fixed bottom-5 right-5 dark:bg-white/25 bg-black/25 backdrop-blur-lg p-4 rounded-xl flex items-center hover:animate-scale"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          )}
        </div>
        <Suspense
          fallback={<div className="fixed w-full h-full bg-black/20"></div>}
        >
          <LazyCarouselModal
            imgArray={!filterState.year.length ? filteredData : paginatedData}
            index={selected}
            onClose={handleCloseModal}
            setIndex={handleSelectPicture2}
            ref={dialogRef}
          />
        </Suspense>
        {isUpdating && paginatedData ? (
          <UpdateModal
            open={isUpdating}
            onClose={handleCloseUpdate}
            pictureData={
              selected !== -1 ? paginatedData[selected] : paginatedData[0]
            }
          />
        ) : null}
        {paginatedData && (
          <ConfirmationModal
            imgArray={filteredData}
            index={selected}
            setSelected={handleSelectPicture}
            key={
              selected !== -1 && !filterState.year.length
                ? paginatedData.length && paginatedData[selected]?.id
                : data[0]?.id
            }
            pictureData={
              selected !== -1
                ? paginatedData[selected]
                : paginatedData.length
                ? paginatedData[0]
                : data[0]
            }
            ref={confirmationRef}
            onClose={handleCloseConfirmModal}
          />
        )}
      </Layout>
    </>
  );
};

export default Album;
