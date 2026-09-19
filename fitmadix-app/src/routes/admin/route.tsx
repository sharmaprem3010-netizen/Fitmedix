import { createFileRoute, Outlet } from "@tanstack/react-router";

// In a real app, you would add an admin check here
export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-dvh flex bg-surface">
      <aside className="w-64 bg-card border-r border-border p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Fitmadix Admin</h2>
        <nav className="space-y-2">
          <a href="/admin/encyclopedia" className="flex items-center px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl">
            Encyclopedia CMS
          </a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
