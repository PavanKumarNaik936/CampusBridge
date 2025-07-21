import StudentApplications from "@/components/applications/StudentApplications";

export default function ApplicationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <StudentApplications />
    </div>
  );
}
