import { useContext, useEffect } from "react";
import { Fragment } from "react/jsx-runtime";
import { TimelineContext } from "../../Context/TimeLineContext";
import { cn } from "../Utils/func";
import TimeGap from "./TimeGap";

type TimeLineProps = {
  arrayYear: number[];
  scrollTo: (item: number) => void;
};

const TimeLine = ({ arrayYear, scrollTo }: TimeLineProps) => {
  const { activeYear, setActiveYear } = useContext(TimelineContext);

  arrayYear = arrayYear.filter((year) => year >= 1949);
  const endingYear = arrayYear[arrayYear.length - 1];

  const handleClick = (year: number) => {
    setActiveYear(year);
    scrollTo(year);
  };

  useEffect(() => {
    setActiveYear(arrayYear[0]);
  }, [arrayYear[0]]);

  return arrayYear?.length > 1 ? (
    <div className="sticky h-fit top-[10vh] right-full -translate-x-14 lg:-translate-x-20 w-fit flex-col z-50 hidden sm:flex">
      <div className="relative ">
        <hr className="h-full absolute w-1 dark:bg-white/50 bg-black/50 rounded-full z-10  mix-blend-overlay" />
        <div className="relative min-h-[87.5vh] -translate-y-[5px] h-full left-0.5 flex flex-col justify-between items-end">
          {arrayYear.map((year, index) => {
            const gapToNextYear =
              index + 1 < arrayYear.length &&
              arrayYear[index] - arrayYear[index + 1];
            return (
              <Fragment key={index}>
                <p
                  className={cn(
                    "relative left-3 leading-5 text-[12px] flex  hover:cursor-pointer",
                    {
                      " text-red-600 dark:text-green-500  left-[14px] font-bold":
                        activeYear === year,
                    }
                  )}
                  onClick={() => {
                    handleClick(year);
                  }}
                >
                  {year}
                </p>
                {gapToNextYear > 1 && <TimeGap timeGap={gapToNextYear - 1} />}
                {index === arrayYear.length - 1 && year > endingYear && (
                  <TimeGap timeGap={year - endingYear} />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;
};

export default TimeLine;
