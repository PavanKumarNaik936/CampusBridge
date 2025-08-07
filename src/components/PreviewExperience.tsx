'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const screenshots = [
  "/mobile-1.png",
  "/mobile-2.png",
  "/mobile-3.png",
  "/mobile-4.png",
  "/mobile-5.png",
];

const PreviewExperience = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeIndex = (index: number) => {
    const total = screenshots.length;
    const diff = index - currentIndex;
    if (diff > Math.floor(total / 2)) return diff - total;
    if (diff < -Math.floor(total / 2)) return diff + total;
    return diff;
  };

  return (
    <section className="py-6 px-6 bg-[#F9FAFB] mb-6">
      <h2 className="text-2xl font-bold text-[#14326E] text-center mb-2">
        Preview the Experience
      </h2>
      <p className="text-center text-[#6B7280] mb-8 max-w-2xl mx-auto">
        See how students, admins, and recruiters interact with CampusBridge’s modern UI.
      </p>

      <div className="relative w-full overflow-hidden max-w-5xl mx-auto px-4 h-[400px]">
        <div className="relative h-full flex justify-center items-center">
          {screenshots.map((src, index) => {
            const relativeIndex = getRelativeIndex(index);

            // Positioning logic
            const x = relativeIndex * 150;
            const y = Math.abs(relativeIndex) * 30; // Downward curve
            const scale = relativeIndex === 0 ? 1.1 : 1 - Math.abs(relativeIndex) * 0.1;
            const opacity = Math.abs(relativeIndex) > 2 ? 0 : 1;
            const zIndex = 10 - Math.abs(relativeIndex);

            return (
              <motion.div
                key={index}
                className="absolute"
                animate={{ x, y, scale, opacity, zIndex }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <img
                  src={src}
                  alt={`Screenshot ${index + 1}`}
                  className={`h-[340px] w-[200px] rounded-xl shadow-lg transition-all duration-300 ${
                    relativeIndex === 0 ? 'border-4 border-[#14326E]' : ''
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PreviewExperience;
