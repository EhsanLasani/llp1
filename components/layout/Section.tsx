// components/layout/Section.tsx
import { Grid, Row, Column } from "@carbon/react";
export function Section({ children, variant = "default", style = {}, ...props }) {
  const variantStyle = {
    default: { background: "var(--color-bg)" },
    raised: { background: "var(--color-surface-raised)" },
    muted: { background: "var(--color-surface)" },
    inverse: { background: "var(--color-inverse)" },
    gradient: { background: "linear-gradient(var(--color-bg), var(--color-accent))" },
  }[variant];
  return (
    <section style={{ padding: "2rem 0", ...variantStyle, ...style }} {...props}>
      <Grid>
        {children}
      </Grid>
    </section>
  );
}
