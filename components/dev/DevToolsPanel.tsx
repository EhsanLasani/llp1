"use client";

import React, { useEffect, useState } from "react";
import useIsDev from "@/hooks/useIsDev";
import { getSystemMode, resolveThemeByName } from "@/lib/theme/loader";
import { applyCSSVariables } from "@/lib/theme/adapter";
import {
  loadOverrides,
  saveOverrides,
  clearOverrides,
  applyOverrides,
  downloadJson,
  ThemeOverrides,
} from "@/lib/theme/overrides";

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: 360,
  maxWidth: "90vw",
  height: "100vh",
  background: "#fff",
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
      width: 52,
      height: 52,
      borderRadius: 26,
      border: "1px solid #e0e0e0",
      background: "#fff",
      boxShadow: "0 6px 18px rgba(0,0,0,.16)",
      cursor: "pointer",
      fontWeight: 600,
    }}
    aria-label="Open DevTools"
    title="Theme DevTools"
  >
    ⚙️
  </button>
);

type Mode = "light" | "dark" | "system";
const Themes = [
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
] as const;

// safe localStorage helpers
const canUseBrowserStorage = () =>
  typeof window !== "undefined" && "localStorage" in window;

function getLS(key: string, fallback: string) {
  if (!canUseBrowserStorage()) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function setLS(key: string, value: string) {
  if (!canUseBrowserStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export default function DevToolsPanel({
  themeUrl = "/themes.json",
}: {
  themeUrl?: string;
}) {
  const isDev = useIsDev();

  // 1) Initialize with safe defaults (no localStorage in render)
  const [open, setOpen] = useState(false);
  const [themeName, setThemeName] = useState<string>("apple");
  const [mode, setMode] = useState<Mode>("light");
  const [ov, setOv] = useState<ThemeOverrides>({});
  const [scale, setScale] = useState<number>(1);

  // 2) Hydrate from localStorage on client
  useEffect(() => {
    if (!isDev) return;
    const initialTheme = getLS("theme:name", "apple");
    const initialMode = (getLS("theme:mode", "light") as Mode) || "light";
    const initialOverrides = loadOverrides();
    setThemeName(initialTheme);
    setMode(initialMode);
    setOv(initialOverrides);
    setScale(initialOverrides.scaleFactor ?? 1);
  }, [isDev]);

  // 3) Apply theme every time controls change
  useEffect(() => {
    if (!isDev) return;
    (async () => {
      const effective = mode === "system" ? getSystemMode() : mode;
      const base = await resolveThemeByName(themeName, effective, {
        fallbackUrl: themeUrl,
      });
      if (!base) return;
      const merged = applyOverrides(base, ov);
      applyCSSVariables(merged);
    })();
  }, [isDev, themeName, mode, ov, themeUrl]);

  if (!isDev) return null;

  const handleOverride = (k: keyof ThemeOverrides, v: string | number) => {
    const next = { ...ov, [k]: v as any };
    setOv(next);
    saveOverrides(next);
  };

  const resetOverrides = async () => {
    clearOverrides();
    const effective = mode === "system" ? getSystemMode() : mode;
    const base = await resolveThemeByName(themeName, effective, {
      fallbackUrl: themeUrl,
    });
    if (base) applyCSSVariables(base);
    setOv({});
    setScale(1);
  };

  const exportMerged = async () => {
    const effective = mode === "system" ? getSystemMode() : mode;
    const base = await resolveThemeByName(themeName, effective, {
      fallbackUrl: themeUrl,
    });
    if (!base) return;
    const merged = applyOverrides(base, ov);
    downloadJson(`${themeName}-${effective}-merged.json`, merged);
  };

  return (
    <>
      <Fab onClick={() => setOpen(true)} />
      <aside
        style={{ ...panelStyle, ...(open ? openStyle : {}) }}
        aria-hidden={!open}
      >
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
          }}
        >
          <strong>Theme DevTools</strong>
          <button
            onClick={() => setOpen(false)}
            style={{
              border: "1px solid #e0e0e0",
              background: "#fff",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 16, overflow: "auto" }}>
          {/* Theme */}
          <label>Theme</label>
          <select
            value={themeName}
            onChange={(e) => {
              const n = e.target.value;
              setThemeName(n);
              setLS("theme:name", n);
            }}
            style={{ width: "100%", padding: 8 }}
          >
            {Themes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Mode */}
          <label style={{ marginTop: 12 }}>Mode</label>
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as Mode;
              setMode(m);
              setLS("theme:mode", m);
            }}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="system">system</option>
          </select>

          {/* Typography */}
          <h4 style={{ margin: "16px 0 8px" }}>Typography</h4>
          <label>Scale factor: {scale.toFixed(2)}</label>
          <input
            type="range"
            min={0.8}
            max={1.5}
            step={0.02}
            value={scale}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setScale(v);
              handleOverride("scaleFactor", v);
            }}
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
              <label>Regular</label>
              <input
                type="number"
                placeholder="400"
                value={ov.weightRegular ?? ""}
                onChange={(e) =>
                  handleOverride(
                    "weightRegular",
                    e.target.value ? +e.target.value : (undefined as any)
                  )
                }
                style={{ width: "100%", padding: 6 }}
              />
            </div>
            <div>
              <label>Medium</label>
              <input
                type="number"
                placeholder="500"
                value={ov.weightMedium ?? ""}
                onChange={(e) =>
                  handleOverride(
                    "weightMedium",
                    e.target.value ? +e.target.value : (undefined as any)
                  )
                }
                style={{ width: "100%", padding: 6 }}
              />
            </div>
            <div>
              <label>Bold</label>
              <input
                type="number"
                placeholder="700"
                value={ov.weightBold ?? ""}
                onChange={(e) =>
                  handleOverride(
                    "weightBold",
                    e.target.value ? +e.target.value : (undefined as any)
                  )
                }
                style={{ width: "100%", padding: 6 }}
              />
            </div>
          </div>

          {/* Colors */}
          <h4 style={{ margin: "16px 0 8px" }}>Colors</h4>
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
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <label>{label}</label>
              <input
                type="text"
                placeholder="#RRGGBB or rgba()"
                value={(ov as any)[k] ?? ""}
                onChange={(e) =>
                  handleOverride(
                    k as keyof ThemeOverrides,
                    e.target.value || (undefined as any)
                  )
                }
                style={{ width: "100%", padding: 6 }}
              />
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={exportMerged}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
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
                border: "1px solid #e0e0e0",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Reset overrides
            </button>
          </div>

          <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
            Dev-only. Set <code>NEXT_PUBLIC_ENABLE_DEVTOOLS=false</code> to
            disable in production.
          </p>
        </div>
      </aside>
    </>
  );
}
