"use client";

import AppHeader from "@/components/Header";
import AppFooter from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AppHeader />

      <main className="main-wrap">
        <h1>Welcome to Apple Books</h1>
        <h3>Testing areas under headers</h3>
        <p>Lasani Fluid Power LLP website preparation</p>
      </main>

      <AppFooter />
    </>
  );
}
