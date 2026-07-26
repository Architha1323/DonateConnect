"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  viewportMargin?: string;
}

export function AnimatedCounter({ value, suffix = "", prefix = "", decimals = 0, viewportMargin = "-100px" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: viewportMargin as any });

  return (
    <span ref={ref}>
      {isInView ? (
        <CountUp
          start={0}
          end={value}
          duration={2.5}
          separator=","
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
