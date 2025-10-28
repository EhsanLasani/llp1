"use client";
import { Grid, Row, Column, Button } from "@carbon/react";
import "./globals.css"; // Import Carbon base styles & your token-based theme styles

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header>
        <Grid>
          <Row>
            <Column sm={4} md={2} lg={2}>
              <a href="/" style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Lasani</a>
            </Column>
            <Column sm={4} md={10} lg={10}>
              <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
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

      {/* Hero Section */}
      <section style={{ padding: "4rem 0", background: "var(--color-surface-raised)" }}>
        <Grid>
          <Row>
            <Column lg={12}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Powering Precision. Building Trust.</h1>
              <p style={{ fontSize: "1.25rem", margin: "1rem 0" }}>
                Lasani provides industrial solutions for hydraulic cylinders, chrome bars and advanced manufacturing.
              </p>
              <Button kind="primary">Get Started</Button>
            </Column>
          </Row>
        </Grid>
      </section>

      {/* Highlights Section */}
      <section>
        <Grid>
          <Row>
            <Column lg={4} md={4} sm={4}>
              <div className="card">
                <h3>Engineered Reliability</h3>
                <p>Our quality systems ensure every cylinder meets international standards.</p>
              </div>
            </Column>
            <Column lg={4} md={4} sm={4}>
              <div className="card">
                <h3>Flexible Manufacturing</h3>
                <p>Short lead times, custom orders, and scalable logistics to suit your needs.</p>
              </div>
            </Column>
            <Column lg={4} md={4} sm={4}>
              <div className="card">
                <h3>Global Reach</h3>
                <p>Lasani supports customers worldwide with robust supply partnerships.</p>
              </div>
            </Column>
          </Row>
        </Grid>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--color-surface)", padding: "2rem 0", color: "var(--color-text-secondary)" }}>
        <Grid>
          <Row>
            <Column lg={12} style={{ textAlign: "center" }}>
              <small>© {new Date().getFullYear()} Lasani Fluid Power LLP. All rights reserved.</small>
            </Column>
          </Row>
        </Grid>
      </footer>
    </div>
  );
}
