// components/containers/SectionContainer.tsx
"use client";
import React from "react";
type Tone = "default" | "raised" | "contrast" | "brand";

export default function SectionContainer({
  children,
  tone = "default",
  className = "",
}: React.PropsWithChildren<{ tone?: Tone; className?: string }>) {
  return (
    <section className={`section tone-${tone} ${className}`}>
      <div className="cw">{children}</div>
    </section>
  );
}
