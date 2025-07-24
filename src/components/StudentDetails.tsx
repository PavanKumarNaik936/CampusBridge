// components/StudentDetails.tsx
import { User } from "@/generated/prisma";
import { useMemo } from "react";
import { GraduationCap, BookOpenText, Link, FileText } from "lucide-react";

export default function StudentDetails({ user }: { user: User }) {
  const calculatedYear = useMemo(() => {
    if (!user.admissionYear) return "N/A";

    const now = new Date();
    const currentYear = now.getFullYear();
    const yearOfStudy = currentYear - user.admissionYear + 1-2;

    return yearOfStudy >= 1 && yearOfStudy <= 4 ? `Year ${yearOfStudy}` : "Graduated";
  }, [user.admissionYear]);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-5">
      <h2 className="text-2xl font-bold text-[#14326E] flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-blue-500" />
        Academic Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <Detail label="Roll Number" value={user.rollNumber} />
        <Detail label="Branch" value={user.branch} />
        <Detail label="Year" value={calculatedYear} />
        <Detail label="Admission Year" value={user.admissionYear} />
        <Detail label="Graduation Year" value={user.graduationYear} />
        <Detail label="CGPA" value={user.cgpa} />
        <Detail
          label="Skills"
          value={user.skills?.length ? user.skills.join(", ") : "N/A"}
        />
        <Detail
          label="Portfolio"
          value={
            user.portfolioUrl ? (
              <a
                href={user.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Link className="w-4 h-4" /> {user.portfolioUrl}
              </a>
            ) : (
              "N/A"
            )
          }
        />
        <Detail
          label="Resume"
          value={
            user.resumeUrl ? (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <FileText className="w-4 h-4" /> Download
              </a>
            ) : (
              "N/A"
            )
          }
        />
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-1">Achievements</h3>
        {user.achievements?.length ? (
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {user.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">N/A</p>
        )}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-500 font-medium">{label}</p>
      <p className="text-gray-800">{value ?? "N/A"}</p>
    </div>
  );
}
