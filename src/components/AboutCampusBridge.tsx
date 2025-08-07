// src/components/AboutCampusBridge.tsx
'use client';
import { motion } from 'framer-motion';

const features = [
  { icon: '🔐', title: 'Authentication & Roles', description: 'Secure login for Admins, Recruiters, and Students with social login via Google/GitHub.' },
  { icon: '💼', title: 'Jobs & Internships', description: 'Filtered browsing, bookmarking, and application management for all users.' },
  { icon: '📚', title: 'Resources', description: 'Searchable and categorized learning content with admin upload capabilities.' },
  { icon: '🎉', title: 'Events', description: 'Workshops, seminars, webinars, and hackathons with bookmark support.' },
  { icon: '📊', title: 'Placement Stats', description: 'Data on placements by company, branch, trends, and top performers.' },
  { icon: '👤', title: 'User Profiles', description: 'Editable profiles with easy bookmark management across modules.' },
  { icon: '🧑‍💼', title: 'Admin Dashboard', description: 'Real-time insights, application tracking, and user management tools.' },
  { icon: '📬', title: 'Contact & Support', description: 'Reach out via a beautiful gradient UI for help or collaboration.' },
];

export default function AboutCampusBridge() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto text-center">
      <motion.h2
        initial={{ y: -40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-3xl md:text-4xl font-bold text-[#14326E] mb-6"
      >
        About CampusBridge
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[#4B5563] mb-12 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
      >
        CampusBridge is a centralized platform that streamlines placements,
        internships, events, and resource sharing for students, faculty,
        recruiters, and administrators. It serves as a unified interface to
        connect opportunity providers and seekers, enriched with intuitive
        design, smart filtering, and actionable analytics.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-left">
        {features.map(({ icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-[#1F2937] mb-1">{title}</h3>
            <p className="text-sm text-[#6B7280] leading-snug">{description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-[#14326E] mb-4">Upcoming Features</h3>
        <ul className="text-[#4B5563] text-sm sm:text-base space-y-2 max-w-2xl mx-auto">
 
          <li>🎟️ Attendance tracking via QR and profile check-ins</li>
          <li>📄 Resume & placement report generation</li>
          <li>🎓 Alumni profiles and networking tools</li>
          <li>🤖 AI tools: Resume analyzer, mock test/resource generator, poster designer</li>
        </ul>
      </div>

    </section>
  );
}
