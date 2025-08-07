// components/ModernCarousel.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const imageSlides = [
  {
    category: "Kids",
    image: "/kids.jpg",
    caption: "Joyful Learning for Kids",
  },
  {
    category: "Primary School",
    image: "/primary.jpg",
    caption: "Building Strong Foundations",
  },
  {
    category: "High School",
    image: "/highschool.jpg",
    caption: "Shaping Future Leaders",
  },
  {
    category: "College",
    image: "/college.jpg",
    caption: "Empowering Young Minds",
  },
  {
    category: "Graduation",
    image: "/graduation.jpg",
    caption: "Celebrating Milestones",
  },
];

export default function ModernCarousel() {
  return (
    <section className="w-full py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {imageSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[300px] sm:h-[500px] w-full">
                <img
                  src={slide.image}
                  alt={slide.category}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-2xl sm:text-4xl font-bold drop-shadow">
                      {slide.caption}
                    </h2>
                    <p className="text-sm sm:text-lg mt-2 font-medium">
                      {slide.category}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
