// app/layout.tsx
import "@carbon/styles/css/styles.css"; // Carbon base/styles
import "./globals.scss"; // <-- your overrides LAST

import type { ReactNode } from "react";
import { Theme } from "@carbon/react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* g10 = light; g100 = dark */}
        <Theme theme="g10">{children}</Theme>
      </body>
    </html>
  );
}
