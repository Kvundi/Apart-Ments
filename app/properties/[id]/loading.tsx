export default function LoadingProperty() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 border-b border-[#e6e2d8]" />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-4 w-64 rounded bg-[#f7f5ef] animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 md:h-[460px] rounded-3xl bg-[#f7f5ef] animate-pulse" />
            <div className="h-8 w-2/3 rounded bg-[#f7f5ef] animate-pulse" />
            <div className="h-24 rounded-2xl bg-[#f7f5ef] animate-pulse" />
            <div className="h-40 rounded-2xl bg-[#f7f5ef] animate-pulse" />
          </div>
          <div className="h-80 rounded-3xl bg-[#f7f5ef] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
