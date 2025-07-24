// components/ProfileOverview.tsx
import { User } from "@/generated/prisma";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";

export default function ProfileOverview({ user }: { user: User }) {
  return (
    <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-5">
      <h2 className="text-2xl font-bold text-[#14326E] mb-3">Profile Overview</h2>

      <div className="space-y-4 text-gray-800 text-sm">
        <DetailItem
          icon={<FaEnvelope className="text-blue-600 w-5 h-5" />}
          label="Email"
          value={user.email}
        />

        <DetailItem
          icon={<FaPhone className="text-blue-600 w-5 h-5" />}
          label="Phone"
          value={user.phone || "N/A"}
        />

        <DetailItem
          icon={<FaLinkedin className="text-blue-600 w-5 h-5" />}
          label="LinkedIn"
          value={
            user.linkedIn ? (
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
            )
          }
        />
      </div>
    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-gray-500 font-medium">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
