import { Skeleton } from "../ui/Skeleton/Skeleton";
import CategoryCardLoader from "./CategoryCard.loader";

const SkeletonItems = ({ count, className }) => (
  [...Array(count)].map((_, index) => <Skeleton key={index} className={className} />)
);

function AtoZLoader() {
  const gridClass = "grid-cols-8 max-[1600px]:grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3 max-[478px]:gap-x-2";

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px] px-4 max-md:px-3">
      <div className="flex flex-col gap-y-5 max-md:gap-y-4 mt-6 max-md:mt-4">
        <Skeleton className="w-[200px] h-8 rounded-lg max-md:w-[160px] max-md:h-7" />
        <div className="flex gap-x-[7px] flex-wrap justify-start gap-y-2 max-md:gap-x-[5px]">
          {[...Array(38)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-[34px] w-[40px] rounded-md max-md:h-[30px] max-md:w-[36px]"
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-y-8 max-md:gap-y-6">
        <div>
          <CategoryCardLoader 
            showLabelSkeleton={false}
            className="mt-8 max-md:mt-6"
            gridClass={gridClass}
          />
          <div className="flex justify-center items-center gap-2 mt-8 max-md:mt-6 flex-wrap">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-10 h-10 rounded-lg max-md:w-9 max-md:h-9"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtoZLoader;
