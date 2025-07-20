// components/RecruiterDetails.tsx
import { User } from "@/generated/prisma";

export default function RecruiterDetails({ user }: { user: User }) {
  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-2">
      <h2 className="text-xl font-semibold text-[#14326E] mb-2">Recruiter Info</h2>
      <p><strong>Company:</strong> {user.company ?? "N/A"}</p>
      {user.companyLogo && <img src={user.companyLogo} alt="Company Logo" className="h-10" />}
      <p>
        <strong>Portfolio:</strong>{" "}
        <a
        href={user.linkedIn ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600"
        >
        {user.linkedIn ?? "N/A"}
        </a>

      </p>
    </section>
  );
}
