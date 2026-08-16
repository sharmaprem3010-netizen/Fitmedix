import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFoods } from "@/services/api";

export const Route = createFileRoute("/food")({
  component: FoodPage,
});

function FoodPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Food Encyclopedia</h1>
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Failed to load data.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {(data ?? []).map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{item.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{item.description?.slice(0, 120)}…</p>
          </div>
        ))}
      </div>
    </div>
  );
}
