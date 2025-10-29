// app/layout.tsx
import AppContainer from "@/components/containers/AppContainer";
import DevToolsPanel from "@/components/dev/DevToolsPanel";
import type { ReactNode } from "react";

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
          headerHeight={56}
        >
          {children}
          {/* Dev panel renders only if NEXT_PUBLIC_ENABLE_DEVTOOLS=true and not production */}
          <DevToolsPanel />
        </AppContainer>
      </body>
    </html>
  );
}
