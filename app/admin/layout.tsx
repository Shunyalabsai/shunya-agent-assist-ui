import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, type AppSidebarType } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarType: AppSidebarType = "admin";

  return (
    <SidebarProvider>
      <AppSidebar type={sidebarType} />
      <SidebarInset className="h-svh bg-sidebar flex flex-col pt-4 overflow-hidden">
        <Header className="sticky top-0 z-20 rounded-t-xl shadow-sm" />
        <main className="flex-1 bg-background rounded-b-xl h-[calc(100vh-theme(spacing.4)-64px)] overflow-y-auto">
          <div className="p-6 max-w-7xl w-full mx-auto ">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
