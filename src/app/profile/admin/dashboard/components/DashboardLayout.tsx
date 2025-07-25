export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-neutral-900 dark:text-white">
      <header
        className="p-5 text-white text-2xl font-extrabold shadow-md text-center"
        style={{
          background: "linear-gradient(90deg, #37D5D6, #36096D)",// #F907FC,
        }}
      >
        CampusBridge Admin Panel
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
