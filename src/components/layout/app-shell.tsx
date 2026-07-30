import { AppSidebar } from "./app-sidebar";
import { TopNavbar } from "./top-navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden shrink-0 lg:block">
        <AppSidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="bg-page flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
