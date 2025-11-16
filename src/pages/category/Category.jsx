import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import getCategoryInfo from "@/src/utils/getCategoryInfo.utils";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import CategoryCardLoader from "@/src/components/Loader/CategoryCard.loader";
import { useNavigate } from "react-router-dom";
import PageSlider from "@/src/components/pageslider/PageSlider";

function Category({ path, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const page = parseInt(searchParams.get("page")) || 1;
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      setLoading(true);
      try {
        const data = await getCategoryInfo(path, page);
        setCategoryInfo(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err);
        console.error("Error fetching category info:", err);
        setLoading(false);
      }
    };
    fetchCategoryInfo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const categoryGridClass = "grid-cols-8 max-[1600px]:grid-cols-6 max-[1200px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3 max-[478px]:gap-x-2";

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col mt-[64px] max-md:mt-[50px]">
      <div className="w-full flex flex-col gap-y-8 mt-6">
        {loading ? (
          <CategoryCardLoader className={"max-[478px]:mt-2"} gridClass={categoryGridClass} />
        ) : page > totalPages ? (
          <div className="flex flex-col gap-y-6 bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-8 border border-white/5 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full"></span>
              <h1 className="font-bold text-3xl text-white max-[478px]:text-xl">
                {label.split("/").pop()}
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e91e63]/20 to-[#00bcd4]/20 flex items-center justify-center border border-white/10">
                <span className="text-4xl">🚀</span>
              </div>
              <p className="text-white/70 text-lg text-center max-[478px]:text-base max-[300px]:leading-6">
                You came a long way, go back <br className="max-[300px]:hidden" />
                nothing is here
              </p>
            </div>
          </div>
        ) : categoryInfo && categoryInfo.length > 0 ? (
          <div className="flex flex-col gap-y-6 max-[478px]:gap-y-4">
            <div className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-6 border border-white/5 shadow-xl max-[478px]:p-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full max-[478px]:h-6"></span>
                <h1 className="font-bold text-3xl text-white max-[478px]:text-xl">
                  {label.split("/").pop()}
                </h1>
              </div>
              <div className="mt-2 flex items-center gap-2 text-white/50 text-sm">
                <span>Page {page} of {totalPages}</span>
                <span>•</span>
                <span>{categoryInfo.length} results</span>
              </div>
            </div>
            <CategoryCard
              data={categoryInfo}
              showViewMore={false}
              className="mt-0"
              gridClass={categoryGridClass}
              categoryPage={true}
              path={path}
            />
            <div className="flex justify-center w-full mt-4">
              <PageSlider
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-y-6 bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-8 border border-white/5 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full"></span>
              <h1 className="font-bold text-3xl text-white max-[478px]:text-xl">
                {label.split("/").pop()}
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/20">
                <span className="text-4xl">⚠️</span>
              </div>
              <p className="text-white/70 text-lg text-center max-[478px]:text-base">
                Couldn't get {label.split("/").pop()} results, please try again
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-6 bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-8 border border-white/5 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-[#e91e63] to-[#00bcd4] rounded-full"></span>
              <h1 className="font-bold text-3xl text-white max-[478px]:text-xl">
                {label.split("/").pop()}
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e91e63]/20 to-[#00bcd4]/20 flex items-center justify-center border border-white/10">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-white/70 text-lg text-center max-[478px]:text-base">
                No results found for: {label.split("/").pop()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
