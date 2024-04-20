import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import AuthContext, { Image } from "../Context/AuthContext";
import { useFilter } from "../Hooks/useFilter";
import FilterBlock from "../component/Filters/FilterBlock";
import FilterThumbnail from "../component/Filters/FilterThumbnail";
import Layout from "../component/Layout/Layout";
import SectionDisplayPictures from "../component/Layout/SectionDisplayPictures";
import TimeLine from "../component/Layout/TimeLine";
import CarouselModal from "../component/Modals.tsx/CarouselModal";
import ConfirmationModal from "../component/Modals.tsx/ConfirmationModal";
import UpdateModal from "../component/Modals.tsx/UpdateImageModal";
import ReturnTopIcon from "../component/Shared/ReturnTopIcon";
import PictureContainer from "../component/SuspenseComponent/PictureContainer";
export type Filter = string | number;
export type ActiveList = "year" | "keyword";

const Album = () => {
  const { data, isLoading } = useContext(AuthContext);
  const { filterState, addFilter, removeFilter, resetFilters } = useFilter();

  const [selected, setSelected] = useState<number>(-1);
  const [activeList, setActiveList] = useState<ActiveList | "">("");
  const [showButtonScroll, setShowButtonScroll] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // List of available filters
  const [updatedYearList, setUpdatedYearList] = useState<number[] | null>(null);
  const [updatedKeywordList, setUpdatedKeywordList] = useState<string[] | null>(
    null
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>();

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

  const groupByYear = (images: Image[]): Record<number, Image[]> => {
    return images?.reduce((acc, image) => {
      let year = image?.date.year;
      if (year < 1950) {
        year = 1949; // Grouper toutes les années inférieures à 1950 sous l'année 1949
      }
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(image);
      return acc;
    }, {});
  };

  const formattedDataForVirtualizedRendering = useMemo(() => {
    const groupedByYear = groupByYear(filteredData);
    if (!groupedByYear) return;
    return Object.entries(groupedByYear)
      .map(([year, images]) => ({
        year: parseInt(year),
        images: images.sort((a, b) => b.date.date.localeCompare(a.date.date)),
      }))
      .sort((a, b) => b.year - a.year); // Trier par année décroissante
  }, [filteredData]);

  const scrollToIndex = (item: number) => {
    const index = formattedDataForVirtualizedRendering.findIndex(
      (obj) => obj.year === item
    );

    if (index === -1 || !virtuosoRef.current) return;
    virtuosoRef.current?.scrollToIndex(index);
  };

  const displayContent = (index: number) => {
    const { year, images } = formattedDataForVirtualizedRendering[index];
    return (
      <SectionDisplayPictures
        year={year}
        datas={images}
        ancient={year <= 1950}
        onEdit={handleOpenUpdate}
        handleOpen={handleOpenConfirmModal}
        handleSelectPicture={handleSelectPicture}
        handleClick={handleOpenModal}
        selected={selected}
        originalList={filteredData}
      />
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
    setShowCarousel(true);
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
      if (index < filteredData.length) setSelected(index);
      else setSelected(-1);
    } else setSelected(index);
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
    // Check if there is difference in arrays to avoid too many rerenders
    if (!arraysEqual(newYearList, updatedYearList)) {
      setUpdatedYearList(newYearList);
    }
    if (!arraysEqual(newKeywordList, updatedKeywordList)) {
      setUpdatedKeywordList(newKeywordList);
    }
  }, [filteredData, updatedKeywordList, updatedYearList]);

  // Handle scrollTopButton logic
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
            "flex flex-col items-center relative z-0 min-h-[calc(100vh-73px)]  flex-grow px-6 sm:px-16 lg:px-28 sm:pb-4"
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
                className="flex w-full relative -z-10 flex-grow "
                ref={scrollContainerRef}
              >
                {updatedYearList?.length > 2 && (
                  <TimeLine
                    scrollTo={scrollToIndex}
                    arrayYear={updatedYearList.sort((a, b) => b - a)}
                  />
                )}

                <div className="w-full h-fit">
                  {!isLoading &&
                    formattedDataForVirtualizedRendering?.length > 0 && (
                      <Virtuoso
                        ref={virtuosoRef}
                        useWindowScroll
                        itemContent={(index) => displayContent(index)}
                        data={formattedDataForVirtualizedRendering}
                      />
                    )}
                </div>
              </div>
            </>
          )}
          {showButtonScroll && (
            <ReturnTopIcon
              size="40px"
              color="#fff"
              className="fixed bottom-5 right-5 dark:bg-white/25 bg-black/25 backdrop-blur-lg p-4 rounded-xl flex items-center hover:animate-scale"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          )}
        </div>

        <CarouselModal
          imgArray={filteredData?.sort((a, b) =>
            b.date.date.localeCompare(a.date.date)
          )}
          index={selected}
          onClose={handleCloseModal}
          setIndex={handleSelectPicture}
          show={showCarousel}
          ref={dialogRef}
        />
        {isUpdating && filteredData ? (
          <UpdateModal
            open={isUpdating}
            onClose={handleCloseUpdate}
            pictureData={
              selected !== -1 ? filteredData[selected] : filteredData[0]
            }
          />
        ) : null}
        {filteredData && (
          <ConfirmationModal
            imgArray={filteredData}
            index={selected}
            setSelected={handleSelectPicture}
            key={
              selected !== -1 && !filterState.year.length
                ? filteredData.length && filteredData[selected]?.id
                : data[0]?.id
            }
            pictureData={
              selected !== -1
                ? filteredData[selected]
                : filteredData.length
                ? filteredData[0]
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

// On dit souvent que se sont nos proches, nos connaissances qui peuvent nous lancer sur la voix d'un premier projets en dehors de ceux rencontrer lors des différentes formations.
// Et c'est effectivement mon cas, un simple partage de photos de famille, de la création d'un album, au partage de ce dernier, un challenge toujours sympathique permettant de revoir des bases et de nouvelles technos !
