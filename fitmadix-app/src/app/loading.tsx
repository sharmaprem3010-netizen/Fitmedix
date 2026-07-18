export default function Loading() {
  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center min-h-screen"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-teal-600 animate-spin"></div>
        <div className="mt-4 text-sm font-medium text-gray-500 tracking-wide uppercase">
          Loading...
        </div>
      </div>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
}
