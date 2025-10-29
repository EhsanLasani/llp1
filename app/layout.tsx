// app/layout.tsx
import AppContainer from "@/components/containers/AppContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppContainer
          themeUrl="/themes.json" // or your CMS endpoint
          themeName="apple" // "apple" | "fluent" | "material"
          themeMode="system" // "light" | "dark" | "system"
          headerHeight={56}
        >
          {children}
        </AppContainer>
      </body>
    </html>
  );
}
