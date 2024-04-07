import { createContext, useState } from "react";

type TimelineContextType = {
  activeYear: number;
  setActiveYear: (year: number) => void;
  // isScrolling: boolean;
  // handleTimeGapClick: (year: number) => void;
};

export const TimelineContext = createContext<TimelineContextType>({
  activeYear: new Date().getFullYear(),
  setActiveYear: () => {},
  // isScrolling: false,
  // handleTimeGapClick: () => {},
});

export const TimelineProvider = ({ children }) => {
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  // const [isScrolling, setIsScrolling] = useState(false);
  const handleYearScroll = (year: number) => {
    setActiveYear(year);
  };

  // const handleTimeGapClick = (year: number) => {
  //   setIsScrolling(true);
  //   setActiveYear(year);
  //   const timer = setTimeout(() => setIsScrolling(false), 1000);
  //   return () => clearTimeout(timer);
  // };

  // useEffect(() => {
  //   const containers =
  //     document.documentElement.querySelectorAll(".year-section");

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       let closestIdToMiddle = null;
  //       let minDistanceToMiddle = Infinity;
  //       const middleOfScreen = window.innerHeight / 2;

  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           // Calculez la distance entre le haut de l'entrée et le milieu de l'écran
  //           const distanceToMiddle = Math.abs(
  //             middleOfScreen - entry.intersectionRect.top
  //           );
  //           console.log(
  //             entry.boundingClientRect.top,
  //             entry.intersectionRect.top,
  //             entry.target.id,
  //             "test diff"
  //           );

  //           // Nous voulons le dernier élément qui est juste au-dessus du milieu
  //           // donc nous vérifions si la distance est supérieure à 0 et inférieure à la distance minimale trouvée jusqu'à présent

  //           if (
  //             distanceToMiddle > 0 &&
  //             distanceToMiddle < minDistanceToMiddle
  //           ) {
  //             minDistanceToMiddle = distanceToMiddle;
  //             closestIdToMiddle = entry.target.id;
  //           }
  //           console.log(distanceToMiddle, minDistanceToMiddle, entry.target.id);
  //         }
  //       });

  //       if (closestIdToMiddle !== null) {
  //         const year = parseInt(closestIdToMiddle, 10);
  //         setActiveYear(year);
  //       }
  //     },
  //     {
  //       threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  //       rootMargin: "103px 0px 0px 0px ",
  //     }
  //   );

  //   // Attache chaque élément à observer
  //   containers?.forEach((el) => {
  //     if (el) observer.observe(el);
  //   });

  //   // Nettoyage
  //   return () => {
  //     if (containers) {
  //       containers?.forEach((el) => {
  //         if (el) observer.unobserve(el);
  //       });
  //     }
  //   };
  // }, [isScrolling]);

  return (
    <TimelineContext.Provider
      value={{
        activeYear,
        setActiveYear: handleYearScroll,
        // isScrolling,
        // handleTimeGapClick,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
