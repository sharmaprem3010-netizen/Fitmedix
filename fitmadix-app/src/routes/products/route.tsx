import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export const Route = createFileRoute("/products")({
  component: ProductLayout,
});

function ProductLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
      <PublicNavbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
