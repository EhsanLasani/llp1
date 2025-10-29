"use client";

/**
 * PageContainer
 * - Orchestrates page frame:
 *   HeaderContainer → <main class="main-wrap"> → FooterContainer
 * - Uses CSS from globals.scss for layout (fixed header/footer)
 */

import React, { ReactNode } from "react";
import HeaderContainer from "./HeaderContainer";
import FooterContainer from "./FooterContainer";

export default function PageContainer({
  children,
  maxWidth = 1200,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="page">
      <HeaderContainer />

      <main className="main-wrap" style={{ maxWidth, margin: "0 auto" }}>
        {children}
      </main>

      <FooterContainer />
    </div>
  );
}
