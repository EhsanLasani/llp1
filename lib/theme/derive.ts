// lib/theme/derive.ts
type Palette = {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryContrast: string;
  border: string;
  link: string;
};

const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

function hexToHsl(hex: string) {
  const m = hex.replace("#", "");
  const int = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16
  );
  const r = (int >> 16) & 255,
    g = (int >> 8) & 255,
    b = int & 255;
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h =
      (max === rn
        ? (gn - bn) / d + (gn < bn ? 6 : 0)
        : max === gn
        ? (bn - rn) / d + 2
        : (rn - gn) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function darken(hex: string, amount = 14, desat = 6) {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, clamp(s - desat), clamp(l - amount));
}

export function deriveDarkPalette(light: Palette): Palette {
  return {
    bg: darken(light.bg, 30, 0),
    surface: darken(light.surface, 26, 0),
    text: hslToHex(0, 0, 96), // near-white text
    textMuted: hslToHex(0, 0, 75),
    primary: light.primary, // keep brand
    primaryContrast: light.primaryContrast || "#ffffff",
    border: darken(light.border || "#e5e5ea", 30, 0),
    link: light.link || light.primary,
  };
}
