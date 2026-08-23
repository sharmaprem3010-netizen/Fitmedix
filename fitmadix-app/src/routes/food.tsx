import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getFoods } from "@/services/api";

export const Route = createFileRoute("/food")({
  component: FoodPage,
});

function FoodPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  return (
    <div className="min-h-dvh bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-foreground">Food Encyclopedia</h1>
        {isLoading && <p className="text-center text-muted-foreground mt-12">Loading knowledge base...</p>}
        {error && (
          <div className="flex flex-col items-center justify-center mt-12 gap-4 p-8 border border-red-500/20 bg-red-500/5 rounded-3xl">
            <p className="text-center text-destructive font-semibold">Failed to load encyclopedia data.</p>
            <button 
              type="button" 
              onClick={() => refetch()} 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:-translate-y-0.5 transition-transform"
            >
              Retry
            </button>
          </div>
        )}
        
        {!isLoading && !error && data?.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <span className="text-4xl mb-4 block">🍎</span>
            <p className="text-lg font-medium text-foreground">No foods found</p>
            <p className="text-sm">We couldn't find any items matching your query.</p>
          </div>
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-card text-card-foreground rounded-2xl shadow-soft p-6 border border-border hover:shadow-elegant transition-all hover:-translate-y-1"
              >
                <h2 className="text-2xl font-semibold mb-3">{item.name}</h2>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {item.description?.slice(0, 120)}…
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
