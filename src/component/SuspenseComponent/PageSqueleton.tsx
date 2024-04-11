import SectionSqueleton from "./SectionSqueleton";

const PageSqueleton = ({ page }: { page?: string }) => {
  return (
    <div className="w-screen h-screen relative bg-background dark:bg-background-dark flex flex-col items-center ">
      <div className="w-full h-[73px]  absolute top-0 left-0 bg-black/5 dark:bg-white/5 bg-opacity-5"></div>
      {page === "Album" ? (
        <>
          <div className="my-10 mt-[113px] w-24 h-9 bg-black/5 dark:bg-white/5"></div>
          <div className="bg-black/5 dark:bg-white/5 w-10/12 h-10 mb-[72px]"></div>
          <div className="px-[112px] w-full">
            <SectionSqueleton />
          </div>
        </>
      ) : (
        <p className="text-3xl text-black dark:text-white my-auto">{`Chargement de la page ${page} en cours ...`}</p>
      )}
    </div>
  );
};

export default PageSqueleton;
