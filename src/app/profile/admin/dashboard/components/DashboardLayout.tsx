// components/admin/DashboardLayout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-blue-700 text-white p-4 text-2xl font-bold">CampusBridge Admin Panel</header>
        <main className="p-6">{children}</main>
      </div>
    );
  }
  