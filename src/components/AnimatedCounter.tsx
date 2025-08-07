// AnimatedCounter.tsx
'use client'
import { useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

interface CounterProps {
  from: number;
  to: number;
}

export default function AnimatedCounter({ from, to }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Animate only once
  const count = useMotionValue(from);
  const [currentValue, setCurrentValue] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: 2,
        onUpdate(value) {
          setCurrentValue(Math.floor(value));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, from, to]);

  return (
    <div ref={ref} className="text-4xl font-bold">
      {currentValue}
    </div>
  );
}
