import { Skeleton } from "./ui/skeleton";

const SkeletonView = () => {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mt-6">
      <div className="flex flex-col items-center gap-8 w-full max-w-3xl mt-6">
        {/* Skeleton for the Vinyl */}
        <div className="flex justify-center">
          <Skeleton className="w-64 h-64 rounded-full" />
        </div>

        {/* Song cards placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonView;
