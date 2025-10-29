// lib/theme/overrides.ts
import type { ResolvedTheme } from "@/types/theme";

export type ThemeOverrides = Partial<{
  // color overrides
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryContrast: string;
  border: string;
  link: string;

  // typography
  scaleFactor: number; // multiplies H1/H2/H3/body
  weightRegular: number;
  weightMedium: number;
  weightBold: number;
}>;

const KEY = "theme:overrides";

export function loadOverrides(): ThemeOverrides {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ThemeOverrides) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(o: ThemeOverrides) {
  localStorage.setItem(KEY, JSON.stringify(o));
}

export function clearOverrides() {
  localStorage.removeItem(KEY);
}

export function applyOverrides(
  base: ResolvedTheme,
  o: ThemeOverrides
): ResolvedTheme {
  const t = structuredClone(base);

  // Colors
  t.colors.bg = o.bg ?? t.colors.bg;
  t.colors.surface = o.surface ?? t.colors.surface;
  t.colors.text = o.text ?? t.colors.text;
  t.colors.textMuted = o.textMuted ?? t.colors.textMuted;
  t.colors.primary = o.primary ?? t.colors.primary;
  t.colors.primaryContrast = o.primaryContrast ?? t.colors.primaryContrast;
  t.colors.border = o.border ?? t.colors.border;
  t.colors.link = o.link ?? t.colors.link;

  // Typography weights
  t.font.weightRegular = o.weightRegular ?? t.font.weightRegular;
  t.font.weightMedium = o.weightMedium ?? t.font.weightMedium;
  t.font.weightBold = o.weightBold ?? t.font.weightBold;

  // Typography scale (multiplies clamp() and px intelligently)
  if (o.scaleFactor && o.scaleFactor !== 1) {
    const mul = (v: string) =>
      v
        .replace(
          /(\d+(\.\d+)?)(px|rem)/g,
          (m, num, _d, unit) => `${(+num * o.scaleFactor!).toFixed(2)}${unit}`
        )
        .replace(/clamp\(([^)]+)\)/g, (m) => {
          const parts = m.slice(6, -1).split(",");
          if (parts.length !== 3) return m;
          const [min, mid, max] = parts.map((s) => s.trim());
          const scaleNum = (s: string) =>
            s.replace(
              /(\d+(\.\d+)?)(px|rem)/g,
              (m2, n2, _d2, u2) => `${(+n2 * o.scaleFactor!).toFixed(2)}${u2}`
            );
          return `clamp(${scaleNum(min)}, ${mid}, ${scaleNum(max)})`;
        });

    t.font.sizeBody = mul(t.font.sizeBody);
    t.font.sizeH1 = mul(t.font.sizeH1);
    t.font.sizeH2 = mul(t.font.sizeH2);
    t.font.sizeH3 = mul(t.font.sizeH3);
  }

  return t;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
