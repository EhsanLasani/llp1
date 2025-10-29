"use client";

import PageContainer from "@/components/containers/PageContainer";
import BodyContainer from "@/components/containers/BodyContainer";
import HeroContainer from "@/components/containers/HeroContainer";
import SectionContainer from "@/components/containers/SectionContainer";

export default function Home() {
  return (
    <PageContainer>
      <BodyContainer>
        <HeroContainer
          title="Welcome to Apple Books"
          subtitle="Testing areas under headers"
        />
        <SectionContainer heading="Latest">
          <h1>section no 1Lasani Fluid Power LLP website preparation</h1>
        </SectionContainer>
        <SectionContainer heading="Latest">
          <h1>section no 2</h1>
        </SectionContainer>
      </BodyContainer>
    </PageContainer>
  );
}
