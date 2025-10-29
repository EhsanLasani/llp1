"use client";

/**
 * SectionContainer
 * - Generic content section with optional heading
 */

import React from "react";

export default function SectionContainer({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      {heading && <h2 className="section-title">{heading}</h2>}
      {children}
    </section>
  );
}
