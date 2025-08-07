// import Navbar from "@/components/landing/Navbar";
// 'use client';
// import { motion } from 'framer-motion'; 
import WhyCampusBridgeTitle from "@/components/WhyCampusBridgeTitle";
import ModernCarousel from "@/components/ModernCarousel";
import AboutCampusBridge from "@/components/AboutCampusBridge";
import PreviewExperience from "@/components/PreviewExperience";
import TestimonialsSection from "@/components/TestimonialsSection";
import AnimatedCounter from "@/components/AnimatedCounter";
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col relative">
      {/* Floating Navbar */}
      

      {/* Spacing for floating navbar */}
      {/* <div className="-pt-2" /> */}

      {/* Hero Section */}
      {/* Hero Section with Background Image */}
{/* Hero Section with Full Image (Uncropped) and Overlapping Navbar */}
<section className="relative h-screen w-full overflow-hidden -mt-[320px]  sm:-mt-[50px] -pb-[100px] sm:pb-12">
  {/* Full image, uncropped */}
  <img
    src="/contact_bg.jpg"
    alt="Campus background"
    className="absolute inset-0 w-full h-full  object-contain sm:object-cover"
  />

  {/* Optional: light overlay if needed */}
  <div className="absolute inset-0 bg-[#14326E]/20" />

  {/* Content on top of image */}
 
    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4 -mt-8">
    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg mb-1">
      CampusBridge
    </h1>
    <p className="text-md md:text-base text-[#14326E] font-medium mb-6">
    Bridging Talent with Opportunity
  </p>


    <div className="flex gap-4 justify-center flex-wrap">
    <a
  href="/auth/login"
  className="px-6 py-3 rounded-full bg-[#10B981] text-white font-semibold shadow-md hover:bg-[#059669] transition duration-300 ease-in-out"
>
  Get Started
</a>

      <a
        href="/jobs"
        className="px-6 py-3 rounded-full border-2 border-white text-white font-semibold shadow-md hover:bg-white hover:text-[#14326E] transition duration-300 ease-in-out"
      >
        Explore Jobs
      </a>
    </div>
  </div>

</section>
{/* Mobile View Only */}
<div className="px-4 sm:px-0">
<section className="block sm:hidden -mt-[250px] mb-[30px] py-6 px-5 text-left max-w-md mx-auto bg-white/60 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200">
    <WhyCampusBridgeTitle/>
  <p className="text-[#1F2937] text-[15px] leading-relaxed text-center">
    <span className="text-[#14326E] font-semibold">CampusBridge</span> unifies 
    <span className="font-medium text-[#14326E]"> placements</span>,
    <span className="font-medium text-[#14326E]"> internships</span>,
    <span className="font-medium text-[#14326E]"> resources</span>, and
    <span className="font-medium text-[#14326E]"> events</span> into one
    streamlined platform for students, faculty, and recruiters.
  </p>
</section>
</div>




{/* Tablet and Desktop View Only */}
<div className="px-8 py-4">
<section className="hidden sm:block py-10 px-5  bg-gradient-to-br from-white via-[#F9FAFB] to-white rounded-3xl shadow-2xl transition duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
  <h1 className="text-4xl font-extrabold text-[#14326E] text-center mb-8">
    Why CampusBridge?
  </h1>
  
  <p className="text-[#4B5563] text-lg text-center max-w-3xl mx-auto mb-6 leading-relaxed">
    <span className="font-semibold text-[#1D4ED8]">CampusBridge</span> is your smart, unified campus solution. It connects <span className="text-[#10B981] font-semibold">students</span>, <span className="text-[#F59E0B] font-semibold">faculty</span>, and <span className="text-[#3B82F6] font-semibold">recruiters</span> in one seamless digital space.
  </p>
  
  <p className="text-[#4B5563] text-lg text-center max-w-4xl mx-auto mb-6 leading-relaxed">
    From discovering internships and jobs to managing events, tracking applications, and sharing resources—CampusBridge streamlines it all with intuitive tools and real-time insights.
  </p>

  <p className="text-[#4B5563] text-lg text-center max-w-4xl mx-auto leading-relaxed">
    Enjoy a modern interface, smart dashboards, and tailored experiences designed for every stakeholder in the placement ecosystem.
  </p>
</section>
</div>




      <ModernCarousel/>
      {/* About Section */}
     <AboutCampusBridge/>
    <PreviewExperience/>

    <section className="bg-[#14326E] text-white py-20 text-center">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
    <div>
    <AnimatedCounter  from ={0} to={100} />
      <p className="mt-2">Students Placed</p>
    </div>
    <div>
      <AnimatedCounter from= {0} to={50} />
      <p className="mt-2">Companies Onboard</p>
    </div>
    <div>
      <AnimatedCounter from={0} to={120} />
      <p className="mt-2">Internships Offered</p>
    </div>
    <div>
      <AnimatedCounter from={0} to={40} />
      <p className="mt-2">Workshops & Events</p>
    </div>
  </div>
    </section>

<section className="py-16 px-6 max-w-7xl mx-auto text-center bg-gradient-to-b from-white via-[#F0F4F8] to-white rounded-3xl shadow-xl">
  <h2 className="text-4xl font-extrabold text-[#14326E] mb-16 leading-snug">
    Who Is It For?
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    {[
      {
        icon: "🎓",
        title: "Students",
        description: "Apply to jobs, join events, and bookmark resources to boost your career.",
        color: "bg-[#E0F2FE]",
      },
      {
        icon: "🧑‍🏫",
        title: "Faculty",
        description: "Share placement opportunities and manage academic resources efficiently.",
        color: "bg-[#FEF9C3]",
      },
      {
        icon: "🏢",
        title: "Recruiters",
        description: "Post job/internship listings and review student applications with ease.",
        color: "bg-[#DCFCE7]",
      },
      {
        icon: "🛡️",
        title: "Admins",
        description: "Dashboard control, user management, and real-time analytics for insights.",
        color: "bg-[#EDE9FE]",
      },
    ].map(({ icon, title, description, color }) => (
      <div
        key={title}
        className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 border border-gray-100"
      >
        <div className={`w-14 h-14 mx-auto mb-5 text-3xl flex items-center justify-center rounded-full ${color}`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-[#14326E] mb-3">{title}</h3>
        <p className="text-[#4B5563] leading-relaxed text-[15px]">{description}</p>
      </div>
    ))}
  </div>
</section>
<TestimonialsSection/>

<section className="bg-[#10B981] text-white text-center py-16 px-6">
  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to bridge your career?</h2>
  <p className="mb-6">Join CampusBridge to explore jobs, internships, and more.</p>
  <a
    href="/auth/login"
    className="inline-block px-6 py-3 bg-white text-[#10B981] font-semibold rounded-full shadow-md hover:bg-gray-100 transition"
  >
    Get Started Now
  </a>
</section>


      {/* Testimonials Section */}
   


 
    </main>
  );
}
