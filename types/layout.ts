// types/layout.ts
import type { ThemeName } from "./theme";

export interface LayoutConfig {
  header: { sticky: boolean; height: number };
  footer: { sticky: boolean };
  containerMaxWidth?: number; // px
  theme: ThemeName;
}
