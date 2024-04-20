import React, { Suspense } from "react";
import { Image } from "../../Context/AuthContext";
import MonthContainer from "../MonthContainer";
import PictureSqueleton from "../SuspenseComponent/PictureSqueleton";
import { getMonth } from "../Utils/func";

type SectionDisplayPicturesProps = {
  datas: Image[];
  year: number;
  originalList: Image[];
  ancient?: boolean;
  periodStart?: number;
  periodEnd?: number;
  selected?: number;
  onMouseEnter?: () => void;
  handleClick?: () => void;
  handleSelectPicture?: (val: number) => void;
  onEdit: (val) => void;
  handleOpen: () => void;
};

const LazyCustomPicture = React.lazy(() => import("../CustomPicture"));

const SectionDisplayPictures = ({
  datas,
  ancient = false,
  periodStart,
  handleClick,
  selected,
  onEdit,
  handleOpen,
  handleSelectPicture,
  originalList,
  year,
}: SectionDisplayPicturesProps) => {
  const groupPhotos = (datas: Image[]) => {
    const groupMap = new Map();

    datas.forEach((photo) => {
      const month = getMonth(new Date(photo.date.date));
      const yearKey = photo.date.year > 1949 ? photo.date.year : 1949; // suppose que date est une chaîne ISO
      const mapKey = `${yearKey}-${month}`;

      if (!groupMap.has(mapKey)) {
        groupMap.set(mapKey, [photo]);
      } else {
        groupMap.get(mapKey).push(photo);
      }
    });

    // Maintenant, nous avons un Map avec des clés uniques pour chaque combinaison année-mois
    // et les valeurs sont des tableaux de photos. Convertissons-le en tableau de tableaux de photos.
    return Array.from(groupMap.values());
  };

  return datas.length > 0 ? (
    <section
      id={String(year)}
      className="w-full self-center flex flex-col last:pb-10 year-section "
    >
      <h2 className=" underline underline-offset-4 mb-8 text-4xl w-fit self-center">
        {ancient ? "Avant 1950" : `Année ${year} `}
      </h2>
      {datas &&
        year > 1949 &&
        groupPhotos(datas)?.map((item, index) => {
          return (
            <MonthContainer
              handleClick={handleClick}
              index={index}
              data={item}
              key={index}
              originalList={originalList}
              className="blurred-img relative w-full mb-2 sm:mb-0"
              selected={selected}
              onEdit={onEdit}
              loading={
                periodStart === Number(originalList[0]?.date.year)
                  ? "eager"
                  : "lazy"
              }
              handleOpen={handleOpen}
              handleSelectPicture={handleSelectPicture}
            />
          );
        })}
      {year <= 1949 && (
        <div className="w-full flex flex-wrap gap-2">
          {datas &&
            datas.map((item, index) => {
              return (
                <Suspense
                  fallback={
                    <PictureSqueleton className="flex-[0_1_48%] sm:flex-[0_1_32.2%] lg:flex-[0_1_24.2%] xl:flex-[0_1_16.1%] xxl:flex-[0_1_12%]  aspect-square" />
                  }
                  key={index}
                >
                  <LazyCustomPicture
                    index={index}
                    handleOpen={handleOpen}
                    pictureData={item}
                    className="flex-[0_1_48%] sm:flex-[0_1_32.2%] lg:flex-[0_1_24.2%] xl:flex-[0_1_16.1%] xxl:flex-[0_1_12%] aspect-square relative"
                    onEdit={() => {
                      const pictureIndex = originalList.findIndex(
                        (picture) => picture.id === item.id
                      );
                      onEdit(pictureIndex);
                    }}
                    handleSelectPicture={() => {
                      const pictureIndex = originalList.findIndex(
                        (picture) => picture.id === item.id
                      );
                      handleSelectPicture(pictureIndex);
                    }}
                    handleClick={handleClick}
                    inAlbum
                    loading={"lazy"}
                  />
                </Suspense>
              );
            })}
        </div>
      )}
    </section>
  ) : null;
};

export default SectionDisplayPictures;
