import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";

function ContactLoader() {
  return (
    <div className="max-w-6xl mx-auto pt-16 pb-12 px-4">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#141414] rounded-2xl p-8 md:p-12 border border-white/5 shadow-2xl mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-1.5 h-12 rounded-full" />
          <Skeleton className="w-64 h-12 rounded-xl" />
        </div>
        <Skeleton className="w-full h-6 mb-3 rounded-xl" />
        <Skeleton className="w-full h-6 mb-3 rounded-xl" />
        <Skeleton className="w-3/4 h-6 mb-6 rounded-xl" />
        <Skeleton className="w-full h-5 mb-2 rounded-xl" />
        <Skeleton className="w-full h-5 mb-2 rounded-xl" />
        <Skeleton className="w-2/3 h-5 rounded-xl" />
      </div>

      {/* Features Grid Skeleton */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-1 h-8 rounded-full" />
          <Skeleton className="w-80 h-9 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl p-6 border border-white/5"
            >
              <Skeleton className="w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="w-32 h-6 mb-2 rounded-xl" />
              <Skeleton className="w-full h-4 mb-2 rounded-xl" />
              <Skeleton className="w-3/4 h-4 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section Skeleton */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-1 h-8 rounded-full" />
          <Skeleton className="w-96 h-9 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#141414] to-[#0f0f0f] rounded-xl border border-white/5 overflow-hidden"
            >
              <div className="px-6 py-4">
                <Skeleton className="w-full h-6 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#141414] rounded-2xl p-8 border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-1 h-8 rounded-full" />
          <Skeleton className="w-48 h-9 rounded-xl" />
        </div>
        <Skeleton className="w-full h-5 mb-2 rounded-xl" />
        <Skeleton className="w-3/4 h-5 mb-6 rounded-xl" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="w-64 h-12 rounded-xl" />
          <Skeleton className="w-40 h-12 rounded-xl" />
          <Skeleton className="w-32 h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default ContactLoader;
