// components/RecruiterDetails.tsx
import { User } from "@/generated/prisma";
import { FaBuilding, FaLinkedin } from "react-icons/fa";

type ExtendedUser = User & {
  company?: {
    name: string;
    logo?: string; // Assuming the logo is stored here
  };
};

export default function RecruiterDetails({ user }: { user: ExtendedUser }) {
  const company = user.company;

  return (
    <section className="bg-white shadow-md rounded-2xl p-6 space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-[#14326E] mb-3">Recruiter Info</h2>

      <div className="flex items-center gap-4">
        <FaBuilding className="text-blue-600 w-5 h-5" />
        <p className="text-gray-700">
          <strong>Company:</strong> {company?.name || "N/A"}
        </p>
      </div>

      {company?.logo && (
        <div className="mt-2">
          <img
            src={company.logo}
            alt="Company Logo"
            className="h-12 rounded-md border"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <FaLinkedin className="text-blue-600 w-5 h-5" />
        <p className="text-gray-700">
          <strong>LinkedIn:</strong>{" "}
          {user.linkedIn ? (
            <a
              href={user.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {user.linkedIn}
            </a>
          ) : (
            "N/A"
          )}
        </p>
      </div>
    </section>
  );
}
