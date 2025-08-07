// src/components/WhyCampusBridgeTitle.tsx
'use client'
import { motion } from "framer-motion";

const text = "Why CampusBridge?";

const letterAnimation = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function WhyCampusBridgeTitle() {
  return (
    <h2 className="text-2xl font-bold text-[#14326E] mb-4 tracking-tight leading-snug text-left text-center justify-center flex flex-wrap">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={letterAnimation}
          transition={{
            delay: i * 0.06,
            duration: 0.5,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
}
