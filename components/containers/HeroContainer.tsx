// components/containers/HeroContainer.tsx
"use client";
import React from "react";

export default function HeroContainer({ children }: React.PropsWithChildren) {
  return (
    <header className="hero">
      <div className="cw">{children}</div>
    </header>
  );
}
