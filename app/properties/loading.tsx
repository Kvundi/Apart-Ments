export default function LoadingProperties() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 border-b border-[#e6e2d8]" />
      <div className="bg-[#f7f5ef] border-b border-[#e6e2d8] py-4 px-6">
        <div className="max-w-7xl mx-auto h-14 rounded-2xl bg-white border border-[#e6e2d8]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 h-96 rounded-3xl bg-[#f7f5ef] animate-pulse" />
        <div className="flex-1">
          <div className="h-8 w-56 rounded-lg bg-[#f7f5ef] animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-[#e6e2d8] overflow-hidden">
                <div className="h-48 bg-[#f7f5ef] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-6 w-1/2 rounded bg-[#f7f5ef] animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-[#f7f5ef] animate-pulse" />
                  <div className="h-4 w-1/3 rounded bg-[#f7f5ef] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
