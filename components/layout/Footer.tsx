// components/layout/Footer.tsx
import { Grid, Row, Column } from "@carbon/react";
export function Footer() {
  return (
    <footer style={{ background: "var(--color-surface)", padding: "2rem 0", color: "var(--color-text-secondary)" }}>
      <Grid>
        <Row>
          <Column lg={12} style={{ textAlign: "center" }}>
            <small>© {new Date().getFullYear()} Lasani Fluid Power LLP</small>
          </Column>
        </Row>
      </Grid>
    </footer>
  );
}
