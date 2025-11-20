import { Skeleton } from "../ui/Skeleton/Skeleton";

function CategoryCardLoader({ className, showLabelSkeleton = true, gridClass }) {
  return (
    <div className={`w-full ${className}`}>
      {showLabelSkeleton && (
        <Skeleton className="w-[200px] h-[20px] rounded-lg max-[478px]:w-[150px] max-[320px]:w-[120px]" />
      )}
      <div className={`grid ${gridClass || "grid-cols-6 max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3"} gap-x-3 gap-y-8 mt-6 max-[478px]:gap-x-2 max-[478px]:gap-y-6`}>
        {[...Array(24)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col transition-transform duration-300 ease-in-out"
            style={{ height: "fit-content" }}
          >
            <div className="w-full relative">
              {/* Card Skeleton with rounded-2xl like UI asli */}
              <Skeleton className="w-full pb-[140%] rounded-2xl max-[478px]:rounded-xl" />
              
              {/* Info Badges - Always Visible like UI asli */}
              <div className="absolute bottom-0 left-0 right-0 p-3 max-[478px]:p-2 z-10">
                <div className="flex items-center justify-start w-full gap-2 max-[478px]:gap-1 flex-wrap">
                  {/* Badge skeletons with rounded-full and proper sizing */}
                  <Skeleton className="h-5 w-[40px] rounded-full max-[478px]:h-4 max-[478px]:w-[35px]" />
                  <Skeleton className="h-5 w-[40px] rounded-full max-[478px]:h-4 max-[478px]:w-[35px]" />
                  <Skeleton className="h-5 w-[45px] rounded-full max-[478px]:hidden" />
                </div>
              </div>
            </div>
            
            {/* Title Outside Card */}
            <Skeleton className="mt-4 w-[90%] h-[20px] rounded-lg max-[478px]:mt-3 max-[478px]:h-[16px] max-[478px]:w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryCardLoader;


