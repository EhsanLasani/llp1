// components/layout/Header.tsx
import { Grid, Row, Column } from "@carbon/react";
export function Header() {
  return (
    <header>
      <Grid>
        <Row>
          <Column lg={2} md={2} sm={4}>
            <a href="/" style={{ fontWeight: "bold" }}>Lasani</a>
          </Column>
          <Column lg={10} md={10} sm={12}>
            <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <a href="/">Home</a>
              <a href="/product">Product</a>
              <a href="/services">Services</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </Column>
        </Row>
      </Grid>
    </header>
  );
}
