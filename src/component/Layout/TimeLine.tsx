import { Fragment, useState } from "react";
import { cn } from "../Utils/func";
import TimeGap from "./TimeGap";

type TimeLineProps = {
  arrayYear: number[];
};

const TimeLine = ({ arrayYear }: TimeLineProps) => {
  const year = window.location.href.split("#")[1];
  const currentYear = year ? Number(year) : arrayYear[0];
  const [activeYear, setActiveYear] = useState<number>(currentYear);
  const startingYear = new Date().getFullYear();
  const endingYear = 1950;

  return arrayYear?.length ? (
    <div className="sticky h-[87.5vh] top-[10vh] right-full -translate-x-14 lg:-translate-x-20 w-fit flex-col z-50 hidden sm:flex">
      <div className="relative h-full">
        <hr className="h-full w-1 dark:bg-white/50 bg-black/50 rounded-full z-10 relative mix-blend-overlay" />
        <div className="absolute top-0.5 -translate-y-[10px] h-full left-0.5 flex flex-col justify-between  items-end">
          {arrayYear?.map((year, index) => {
            const gapToNextYear =
              index + 1 < arrayYear.length &&
              arrayYear[index] - arrayYear[index + 1];
            return (
              <Fragment key={index}>
                {arrayYear[0] < startingYear && index === 0 && (
                  <TimeGap timeGap={startingYear - year} />
                )}
                <a
                  className={cn(
                    "relative left-3 leading-5 text-sm flex  hover:cursor-pointer",
                    {
                      " text-red-600 dark:text-green-500  left-[14px] font-bold":
                        activeYear === year,
                    }
                  )}
                  href={`#${year}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </a>
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
