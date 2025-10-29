import type { ReactNode } from "react";
import AppContainer from "@/components/containers/AppContainer";
import DevtoolsRoot from "@/components/dev/DevtoolsRoot"; // ⬅️ client wrapper

const approvedTheme = process.env.NEXT_PUBLIC_THEME_NAME || "apple";
const approvedMode =
  (process.env.NEXT_PUBLIC_THEME_MODE as "light" | "dark" | "system") ||
  "light";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppContainer
          themeUrl="/themes.json"
          themeName={approvedTheme}
          themeMode={approvedMode}
          headerHeight={Number(process.env.NEXT_PUBLIC_HEADER_HEIGHT ?? 56)}
        >
          {children}
        </AppContainer>

        {/* Mount outside AppContainer; client-only */}
        <DevtoolsRoot />
      </body>
    </html>
  );
}
