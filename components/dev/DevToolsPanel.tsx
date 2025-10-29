"use client";

/**
 * DevToolsPanel
 * - Dev-only floating panel (open with FAB ⚙️)
 * - Theme switcher (name + mode)
 * - Per-scope overrides (route + container + element)
 * - Typography controls (scale + weights)
 * - Color controls with paired text + <input type="color">
 * - Export merged JSON / Reset overrides
 *
 * Requirements (already in your project from previous steps):
 *  - hooks/useIsDev
 *  - lib/theme/loader: { resolveThemeByName, getSystemMode }
 *  - lib/theme/adapter: { applyCSSVariables }
 */

import React, { useEffect, useMemo, useState } from "react";
import useIsDev from "@/hooks/useIsDev";
import { resolveThemeByName, getSystemMode } from "@/lib/theme/loader";
import { applyCSSVariables } from "@/lib/theme/adapter";

/* ---------------- helpers ---------------- */

type Mode = "light" | "dark" | "system";
type ThemeName =
  | "apple"
  | "fluent"
  | "material"
  | "carbon"
  | "atlassian"
  | "spectrum"
  | "polaris"
  | "mailchimp"
  | "uberBase"
  | "audi";

const THEMES: ThemeName[] = [
  "apple",
  "fluent",
  "material",
  "carbon",
  "atlassian",
  "spectrum",
  "polaris",
  "mailchimp",
  "uberBase",
  "audi",
];

const CONTAINERS = ["page", "header", "footer", "hero", "section"] as const;
type ContainerScope = (typeof CONTAINERS)[number];

type ThemeOverrides = Partial<{
  // typography
  scaleFactor: number;
  weightRegular: number;
  weightMedium: number;
  weightBold: number;

  // colors
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryContrast: string;
  border: string;
  link: string;
}>;

const canUseLS = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getLS = (k: string, fb = "") => {
  if (!canUseLS()) return fb;
  try {
    const v = window.localStorage.getItem(k);
    return v ?? fb;
  } catch {
    return fb;
  }
};
const setLS = (k: string, v: string) => {
  if (!canUseLS()) return;
  try {
    window.localStorage.setItem(k, v);
  } catch {}
};
const delLS = (k: string) => {
  if (!canUseLS()) return;
  try {
    window.localStorage.removeItem(k);
  } catch {}
};

const downloadJson = (filename: string, data: any) => {
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
};

// merge base ← overrides (only known keys)
function mergeOverrides(base: any, ov: ThemeOverrides) {
  const out = { ...base };
  const keys: (keyof ThemeOverrides)[] = [
    "scaleFactor",
    "weightRegular",
    "weightMedium",
    "weightBold",
    "bg",
    "surface",
    "text",
    "textMuted",
    "primary",
    "primaryContrast",
    "border",
    "link",
  ];
  for (const k of keys) {
    const v = ov[k];
    if (v !== undefined && v !== null && v !== "") {
      // typography weights & scale are not CSS vars by default but
      // your adapter can read them; also push vars for colors:
      (out as any)[k] = v;
    }
  }
  return out;
}

/* ---------------- styles ---------------- */

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 360,
  maxWidth: "92vw",
  height: "100vh",
  background: "#54d28b", // vivid dev-only green
  color: "#111",
  borderLeft: "1px solid #e5e5ea",
  boxShadow: "0 0 24px rgba(0,0,0,.18)",
  transform: "translateX(100%)",
  transition: "transform .25s ease",
  zIndex: 2000,
  display: "flex",
  flexDirection: "column",
};
const openStyle: React.CSSProperties = { transform: "translateX(0)" };

const Fab: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "fixed",
      right: 16,
      bottom: 16,
      zIndex: 2100,
      width: 56,
      height: 56,
      borderRadius: 28,
      border: "1px solid #d0d0d4",
      background: "#fff",
      boxShadow: "0 8px 24px rgba(0,0,0,.25)",
      cursor: "pointer",
      fontWeight: 700,
    }}
    aria-label="Open DevTools"
    title="Theme DevTools"
  >
    ⚙️
  </button>
);

/* ---------- small inputs ---------- */

const Row: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center", ...style }}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{ fontSize: 12, fontWeight: 600 }}>{children}</label>
);

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: 6,
        borderRadius: 6,
        border: "1px solid #d0d0d4",
        background: "#fff",
      }}
    />
  );
}

function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: 6,
        borderRadius: 6,
        border: "1px solid #d0d0d4",
        background: "#fff",
      }}
    />
  );
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h4
    style={{
      margin: "16px 0 8px",
      borderBottom: "1px solid #cdeacf",
      paddingBottom: 4,
    }}
  >
    {children}
  </h4>
);

/* ---------- color row with picker ---------- */

function ColorRow({
  label,
  value,
  onChange,
  title,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  title?: string;
}) {
  // if value isn't a hex, still allow editing in text box; picker needs hex
  const hexOk = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
  const safe = value && hexOk(value) ? value : "#000000";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr 38px",
        gap: 8,
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <Label>{label}</Label>
      <TextInput
        placeholder="#RRGGBB or rgba()"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        title={title}
      />
      <input
        type="color"
        value={safe}
        onChange={(e) => onChange(e.target.value)}
        title={title}
        style={{
          width: 38,
          height: 32,
          padding: 0,
          border: "1px solid #d0d0d4",
          background: "#fff",
          borderRadius: 6,
        }}
      />
    </div>
  );
}

/* ---------------- main ---------------- */

export default function DevToolsPanel({
  themeUrl = "/themes.json",
}: {
  themeUrl?: string;
}) {
  // dev gating
  const isDev = useIsDev();

  // open/close
  const [open, setOpen] = useState(false);

  // theme selection
  const [themeName, setThemeName] = useState<ThemeName>(
    (getLS(
      "theme:name",
      process.env.NEXT_PUBLIC_THEME_NAME || "apple"
    ) as ThemeName) || "apple"
  );
  const [mode, setMode] = useState<Mode>(
    (getLS(
      "theme:mode",
      (process.env.NEXT_PUBLIC_THEME_MODE as Mode) || "light"
    ) as Mode) || "light"
  );

  // scope (route + container + element)
  const initialRoute =
    typeof window !== "undefined" ? window.location.pathname : ("/" as string);
  const [route, setRoute] = useState<string>(initialRoute);
  const [scopeContainer, setScopeContainer] = useState<ContainerScope>("page");
  const [scopeElement, setScopeElement] = useState<string>("default");

  // overrides (scoped)
  const scopeKey = useMemo(
    () => `theme:overrides:${route}:${scopeContainer}:${scopeElement}`,
    [route, scopeContainer, scopeElement]
  );
  const [ov, setOv] = useState<ThemeOverrides>({});

  // local typography UI state
  const [scale, setScale] = useState<number>(1);
  const [wReg, setWReg] = useState<number | undefined>(undefined);
  const [wMed, setWMed] = useState<number | undefined>(undefined);
  const [wBold, setWBold] = useState<number | undefined>(undefined);

  // load current scope overrides
  useEffect(() => {
    if (!isDev) return;
    try {
      const raw = getLS(scopeKey, "");
      const parsed = raw ? (JSON.parse(raw) as ThemeOverrides) : {};
      setOv(parsed);
      setScale(parsed.scaleFactor ?? 1);
      setWReg(parsed.weightRegular);
      setWMed(parsed.weightMedium);
      setWBold(parsed.weightBold);
    } catch {
      setOv({});
      setScale(1);
      setWReg(undefined);
      setWMed(undefined);
      setWBold(undefined);
    }
  }, [isDev, scopeKey]);

  // apply on any change
  useEffect(() => {
    if (!isDev) return;
    (async () => {
      const effective = mode === "system" ? getSystemMode() : mode;
      const base = await resolveThemeByName(themeName, effective, {
        fallbackUrl: themeUrl,
      });
      if (!base) return;
      const merged = mergeOverrides(base, {
        ...ov,
        scaleFactor: scale,
        weightRegular: wReg,
        weightMedium: wMed,
        weightBold: wBold,
      });
      applyCSSVariables(merged);
      // notify any listeners (e.g., DevThemeBadge)
      window.dispatchEvent(new CustomEvent("theme:applied"));
    })();
  }, [isDev, themeName, mode, ov, scale, wReg, wMed, wBold, themeUrl]);

  if (!isDev) return null;

  // helpers to persist current scope overrides
  const saveCurrentScope = (next: ThemeOverrides) => {
    setOv(next);
    setLS(scopeKey, JSON.stringify(next));
  };

  const handleOverride = (
    k: keyof ThemeOverrides,
    v: string | number | undefined
  ) => {
    const next = { ...ov, [k]: v as any };
    saveCurrentScope(next);
  };

  const resetOverrides = async () => {
    delLS(scopeKey);
    setOv({});
    setScale(1);
    setWReg(undefined);
    setWMed(undefined);
    setWBold(undefined);

    const effective = mode === "system" ? getSystemMode() : mode;
    const base = await resolveThemeByName(themeName, effective, {
      fallbackUrl: themeUrl,
    });
    if (base) applyCSSVariables(base);
  };

  const exportMerged = async () => {
    const effective = mode === "system" ? getSystemMode() : mode;
    const base = await resolveThemeByName(themeName, effective, {
      fallbackUrl: themeUrl,
    });
    if (!base) return;
    const merged = mergeOverrides(base, {
      ...ov,
      scaleFactor: scale,
      weightRegular: wReg,
      weightMedium: wMed,
      weightBold: wBold,
    });
    downloadJson(`${themeName}-${effective}-merged.json`, merged);
  };

  return (
    <>
      <Fab onClick={() => setOpen(true)} />
      <aside
        style={{ ...panelStyle, ...(open ? openStyle : {}) }}
        aria-hidden={!open}
      >
        {/* header */}
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #cdeacf",
          }}
        >
          <strong>Theme DevTools</strong>
          <button
            onClick={() => setOpen(false)}
            style={{
              border: "1px solid #cdeacf",
              background: "#fff",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        {/* body */}
        <div style={{ padding: 16, overflow: "auto" }}>
          {/* Scope */}
          <SectionTitle>Scope</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            <TextInput
              value={route}
              onChange={(e) => setRoute(e.target.value || "/")}
              placeholder="/ (route)"
              title="Route (e.g., /, /products, /contact)"
            />
            <Select
              value={scopeContainer}
              onChange={(e) =>
                setScopeContainer(e.target.value as ContainerScope)
              }
              title="Container"
            >
              {CONTAINERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <TextInput
              value={scopeElement}
              onChange={(e) => setScopeElement(e.target.value || "default")}
              placeholder="element (optional)"
              title="Element key within the container (optional)"
            />
          </div>

          {/* Theme */}
          <SectionTitle>Theme</SectionTitle>
          <Row>
            <Label>Theme</Label>
            <Select
              value={themeName}
              onChange={(e) => {
                const n = e.target.value as ThemeName;
                setThemeName(n);
                setLS("theme:name", n);
              }}
            >
              {THEMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Row>

          <Row style={{ marginTop: 8 }}>
            <Label>Mode</Label>
            <Select
              value={mode}
              onChange={(e) => {
                const m = e.target.value as Mode;
                setMode(m);
                setLS("theme:mode", m);
              }}
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
              <option value="system">system</option>
            </Select>
          </Row>

          {/* Typography */}
          <SectionTitle>Typography</SectionTitle>
          <Label>Scale factor: {scale.toFixed(2)}</Label>
          <input
            type="range"
            min={0.8}
            max={1.5}
            step={0.02}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginTop: 8,
            }}
          >
            <div>
              <Label>Regular</Label>
              <TextInput
                type="number"
                placeholder="400"
                value={wReg ?? ""}
                onChange={(e) =>
                  setWReg(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
            <div>
              <Label>Medium</Label>
              <TextInput
                type="number"
                placeholder="500"
                value={wMed ?? ""}
                onChange={(e) =>
                  setWMed(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
            <div>
              <Label>Bold</Label>
              <TextInput
                type="number"
                placeholder="700"
                value={wBold ?? ""}
                onChange={(e) =>
                  setWBold(e.target.value ? +e.target.value : undefined)
                }
              />
            </div>
          </div>

          {/* Colors */}
          <SectionTitle>Colors</SectionTitle>
          {[
            ["bg", "Background"],
            ["surface", "Surface"],
            ["text", "Text"],
            ["textMuted", "Text muted"],
            ["primary", "Primary"],
            ["primaryContrast", "Primary contrast"],
            ["border", "Border"],
            ["link", "Link"],
          ].map(([k, label]) => (
            <ColorRow
              key={k}
              label={label}
              value={(ov as any)[k]}
              onChange={(val) =>
                handleOverride(
                  k as keyof ThemeOverrides,
                  val || (undefined as any)
                )
              }
              title={k}
            />
          ))}

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={async () => {
                // persist latest local UI to the override object before export
                const next = {
                  ...ov,
                  scaleFactor: scale,
                  weightRegular: wReg,
                  weightMedium: wMed,
                  weightBold: wBold,
                } as ThemeOverrides;
                saveCurrentScope(next);
                await exportMerged();
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cdeacf",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Export merged JSON
            </button>
            <button
              onClick={resetOverrides}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #cdeacf",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Reset overrides
            </button>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, color: "#225e37" }}>
            Dev-only. Set <code>NEXT_PUBLIC_ENABLE_DEVTOOLS=false</code> to
            disable in production.
          </p>
        </div>
      </aside>
    </>
  );
}
