import Navbar from "@/components/landing/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between">

     
      {/* Heo Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#14326E] text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">CampusBridge</h1>
        <p className="text-xl md:text-2xl mb-8 text-[#00A8E8]">Bridging Talent with Opportunity</p>
        <div className="flex gap-4 justify-center">
          <a href="/auth/login" className="px-6 py-3 rounded-lg bg-[#00A8E8] text-[#14326E] font-semibold hover:bg-[#10B981] transition">Get Started</a>
          <a href="/jobs" className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-[#14326E] transition">Explore Jobs</a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#14326E] mb-4">About CampusBridge</h2>
        <p className="text-[#6B7280] mb-8">CampusBridge connects students, admins, and recruiters for seamless career development. Discover jobs, register for events, upload resumes, and manage opportunities—all in one place.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">💼</span>
            <span className="text-[#1F2937] font-medium">Jobs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🎉</span>
            <span className="text-[#1F2937] font-medium">Events</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">📄</span>
            <span className="text-[#1F2937] font-medium">Resume</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">📊</span>
            <span className="text-[#1F2937] font-medium">Analytics</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-[#14326E] text-center mb-10">Features</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow flex flex-col items-start">
            <h3 className="text-xl font-semibold text-[#14326E] mb-2">Job Listings with Filters</h3>
            <p className="text-[#6B7280]">Browse and filter job opportunities tailored for students and recruiters.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow flex flex-col items-start">
            <h3 className="text-xl font-semibold text-[#14326E] mb-2">Event Registrations</h3>
            <p className="text-[#6B7280]">Register for campus events, workshops, and placement drives easily.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow flex flex-col items-start">
            <h3 className="text-xl font-semibold text-[#14326E] mb-2">Resume Upload & Scoring</h3>
            <p className="text-[#6B7280]">Upload your resume and get AI-powered feedback (coming soon!).</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow flex flex-col items-start">
            <h3 className="text-xl font-semibold text-[#14326E] mb-2">Admin & Recruiter Dashboards</h3>
            <p className="text-[#6B7280]">Powerful dashboards for managing users, jobs, events, and analytics.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Optional Placeholder) */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#14326E] mb-6">What People Say</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow w-full md:w-1/2">
            <p className="text-[#1F2937] italic mb-2">“CampusBridge made it so easy to find my dream job!”</p>
            <span className="text-[#6B7280]">– Student</span>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-6 shadow w-full md:w-1/2">
            <p className="text-[#1F2937] italic mb-2">“Managing campus hiring events has never been simpler.”</p>
            <span className="text-[#6B7280]">– Recruiter</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14326E] text-white py-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">CampusBridge</span> <span className="text-[#00A8E8]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="/about" className="hover:text-[#00A8E8] transition">About</a>
            <a href="/contact" className="hover:text-[#00A8E8] transition">Contact</a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00A8E8] transition">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
// ... existing code ... 