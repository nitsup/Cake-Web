"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CakeCuttingLoaderProps {
  label?: string;
}

export function CakeCuttingLoader({ label = "Loading cakes" }: CakeCuttingLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] grid place-items-center bg-[rgb(15_23_19_/_0.42)] p-4">
      <div role="status" aria-live="polite" className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center text-sm font-medium text-muted-foreground shadow-[0_24px_60px_rgb(15_23_19_/_0.22)] animate-[account-menu-in_150ms_ease-out_both]">
        <div aria-hidden="true" className="relative mx-auto h-44 w-52">
          <div className="absolute bottom-5 left-3 h-3 w-46 rounded-full bg-fuchsia-200 shadow-inner" />
          <motion.div
            className="absolute bottom-9 left-5 h-14 w-42 rounded-b-[1.75rem] rounded-t-xl border-2 border-rose-600 bg-rose-500 shadow-md"
            animate={prefersReducedMotion ? undefined : { scaleX: [1, 0.97, 1] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
          <div className="absolute bottom-[5.7rem] left-5 h-7 w-42 rounded-t-xl border-x-2 border-amber-400 bg-amber-300" />
          <div className="absolute bottom-[7.15rem] left-5 h-5 w-42 rounded-t-full border-x-2 border-fuchsia-500 bg-fuchsia-400" />
          {prefersReducedMotion ? (
            <div className="absolute bottom-[8rem] left-[6.05rem] h-5 w-5 rounded-full bg-amber-200 shadow-sm" />
          ) : (
            <motion.div
              className="absolute bottom-7 left-[6.25rem] h-28 w-3 origin-bottom rounded-full bg-foreground shadow-md"
              animate={{ x: [30, 3, 3, 30], y: [-24, 0, 0, -24], rotate: [-12, 0, 0, -12] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, times: [0, 0.38, 0.58, 1] }}
            >
              <span className="absolute -top-4 left-1/2 h-9 w-7 -translate-x-1/2 rounded-md bg-amber-300 shadow-sm" />
            </motion.div>
          )}
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
}
