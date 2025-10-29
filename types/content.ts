// types/content.ts
export type SectionKind = "hero" | "text" | "grid" | "custom";

export interface SectionBlock {
  id: string;
  kind: SectionKind;
  props: Record<string, any>;
}
