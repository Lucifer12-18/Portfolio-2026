"use client";

import React, { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;      // ms per character
  className?: string;  // full control from caller
  loop?: boolean;
}

export function TypewriterText({
  text,
  speed = 40,
  className = "",
  loop = false,
}: TypewriterTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= text.length) {
      if (!loop) return;
      const resetTimeout = setTimeout(() => setIndex(0), 1400);
      return () => clearTimeout(resetTimeout);
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed, loop]);

  const visible = text.slice(0, index);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{visible}</span>
      <span className="ml-1 h-5 w-[2px] bg-emerald-400 animate-pulse rounded-full" />
    </span>
  );
}

