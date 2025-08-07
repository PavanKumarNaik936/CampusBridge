'use client';
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillStar } from "react-icons/ai";

const testimonials = [
  {
    quote: "CampusBridge made it so easy to find my dream job!",
    role: "– Student",
    rating: 5,
  },
  {
    quote: "Managing campus hiring events has never been simpler.",
    role: "– Recruiter",
    rating: 4,
  },
  {
    quote: "The UI is so smooth and intuitive. Loved using it!",
    role: "– Alumni",
    rating: 5,
  },
  {
    quote: "Helped us connect with top talent seamlessly.",
    role: "– Company HR",
    rating: 4,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 640) {
        setCardsToShow(2); // show 2 cards on tablets/desktops
      } else {
        setCardsToShow(1); // show 1 card on mobile
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);

    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + cardsToShow) % testimonials.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cardsToShow]);

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8  text-center bg-[#F9FAFB] rounded-xl shadow-inner overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#14326E] mb-4 sm:mb-12">
        What People Say
      </h2>

      <div className="relative h-[300px] sm:h-[320px] md:h-[340px] flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + '-' + cardsToShow}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5 }}
            className={`flex gap-6 justify-center items-center w-full`}
          >
            {visibleTestimonials.slice(0, cardsToShow).map((testimonial, idx) => (
              <div
                key={idx}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-md"
              >
                <p className="text-[#1F2937] italic text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
                  “{testimonial.quote}”
                </p>
                <div className="flex justify-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <AiFillStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
                  ))}
                </div>
                <span className="text-[#6B7280] text-sm sm:text-base">
                  {testimonial.role}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
