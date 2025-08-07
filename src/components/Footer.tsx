// components/Footer.tsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#14326E] text-white py-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-lg">CampusBridge</span>{" "}
          <span className="text-[#00A8E8]">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/about" className="hover:text-[#00A8E8] transition">
            About
          </a>
          <a href="/contact" className="hover:text-[#00A8E8] transition">
            Contact
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00A8E8] transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
