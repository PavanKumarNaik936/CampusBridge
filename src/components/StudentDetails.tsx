// components/StudentDetails.tsx
import { User } from "@/generated/prisma";

export default function StudentDetails({ user }: { user: User }) {
  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-2">
      <h2 className="text-xl font-semibold text-[#14326E] mb-2">Academic Details</h2>
      <p><strong>Roll Number:</strong> {user.rollNumber ?? "N/A"}</p>
      <p><strong>Branch:</strong> {user.branch ?? "N/A"}</p>
      <p><strong>Year:</strong> {user.year ?? "N/A"}</p>
      <p><strong>CGPA:</strong> {user.cgpa ?? "N/A"}</p>
      <p><strong>Skills:</strong> {user.skills?.join(", ") || "N/A"}</p>
      <p>
        <strong>Portfolio:</strong>{" "}
        <a
        href={user.portfolioUrl ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600"
        >
        {user.portfolioUrl ?? "N/A"}
        </a>

      </p>
      <p>
        <strong>Resume:</strong>{" "}
        <a
        href={user.resumeUrl ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600"
        >
        {user.resumeUrl ? "Download" : "N/A"}
        </a>

      </p>
      <div>
        <strong>Achievements:</strong>
        <ul className="list-disc list-inside">
          {user.achievements.length ? (
            user.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)
          ) : (
            <li>N/A</li>
          )}
        </ul>
      </div>
    </section>
  );
}
