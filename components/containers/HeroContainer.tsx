"use client";

/**
 * HeroContainer
 * - Simple hero block using theme-driven typography
 */

export default function HeroContainer({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="hero">
      <h1>{title}</h1>
      {subtitle && <p className="hero-sub muted">{subtitle}</p>}
    </section>
  );
}
