const TimeGap = ({ timeGap }: { timeGap: number }) => {
  const array = new Array(timeGap);

  return (
    <>
      {array.fill(0).map((_, index) => {
        return (
          <div
            key={index}
            className=" h-1 w-1  border dark:border-white/50 border-black/50 min-h-1 min-w-1 my-[5%]  bg-black/50 dark:bg-white/50 rounded-full  "
          ></div>
        );
      })}
    </>
  );
};

export default TimeGap;
