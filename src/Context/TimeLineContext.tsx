import { createContext, useState } from "react";

type TimelineContextType = {
  activeYear: number;
  setActiveYear: (year: number) => void;
};

export const TimelineContext = createContext<TimelineContextType>({
  activeYear: new Date().getFullYear(),
  setActiveYear: () => {},
});

export const TimelineProvider = ({ children }) => {
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const handleYearScroll = (year: number) => {
    setActiveYear(year);
  };

  return (
    <TimelineContext.Provider
      value={{
        activeYear,
        setActiveYear: handleYearScroll,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
