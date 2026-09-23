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
        <main className="bg-page min-w-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable]">
          <div className="mx-auto w-full min-w-0 max-w-[1320px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
