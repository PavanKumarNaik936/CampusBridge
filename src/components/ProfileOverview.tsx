// components/ProfileOverview.tsx
import { User } from "@/generated/prisma";
export default function ProfileOverview({ user }: { user: User }) {
  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-2">
      <h2 className="text-xl font-semibold text-[#14326E] mb-2">Profile Overview</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone ?? "N/A"}</p>
      <p>
        <strong>LinkedIn:</strong>{" "}
        <a href={user.linkedIn ?? undefined} target="_blank" className="text-blue-600">
          {user.linkedIn ?? "N/A"}
        </a>

      </p>
    </section>
  );
}
