import { Image } from "../../Context/AuthContext";
import MonthContainer from "../MonthContainer";
import { getMonth } from "../Utils/func";

type SectionDisplayPicturesProps = {
  datas: Image[];
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
}: SectionDisplayPicturesProps) => {
  const groupPhotos = (datas) => {
    const groupMap = new Map();

    datas.forEach((photo) => {
      const month = getMonth(new Date(photo.date.date));
      const yearKey = photo.date.year; // suppose que date est une chaîne ISO
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
  // console.log(groupPhotos(datas));

  return datas.length > 0 ? (
    <section
      id={String(periodStart)}
      className="w-full self-center flex flex-col last:mb-10 year-section "
    >
      <h2 className=" underline underline-offset-4 mb-8 text-4xl w-fit self-center">
        {ancient ? "Avant 1950" : `Année ${periodStart} `}
      </h2>
      {datas &&
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
              loading={"lazy"}
              handleOpen={handleOpen}
              handleSelectPicture={handleSelectPicture}
            />
          );
        })}
    </section>
  ) : null;
};

export default SectionDisplayPictures;
