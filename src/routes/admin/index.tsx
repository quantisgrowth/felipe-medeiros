import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin-dashboard";

export const Route = createFileRoute("/admin/")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ title: "Admin | Felipe Medeiros" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboard,
});
