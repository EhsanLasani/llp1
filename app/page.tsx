// app/page.tsx
"use client";

import PageContainer from "@/components/containers/PageContainer";
import BodyContainer from "@/components/containers/BodyContainer";
import HeroContainer from "@/components/containers/HeroContainer";
import SectionContainer from "@/components/containers/SectionContainer";

export default function HomePage() {
  return (
    <PageContainer>
      <BodyContainer>
        <HeroContainer>
          <h1>Welcome to Apple Books</h1>
          <p className="lead">Why Partner choose Lasani Fluid Power LLP</p>
        </HeroContainer>

        {/* Section 1 – raised cards */}
        <SectionContainer tone="raised">
          <h2>section no 1</h2>
          <p>Lasani Fluid Power LLP website preparation</p>
        </SectionContainer>

        {/* Section 2 – contrast strip (dark) */}
        <SectionContainer tone="contrast">
          <h2>Capabilities</h2>
          <p>section no 2</p>
        </SectionContainer>
      </BodyContainer>
    </PageContainer>
  );
}
