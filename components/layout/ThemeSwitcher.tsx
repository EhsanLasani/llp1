// components/ThemeSwitcher.tsx
import React, { useState } from "react";
import { THEME_OPTIONS } from "@/lib/theme-config";
export function ThemeSwitcher() {
  const [theme, setTheme] = useState("carbon-g10");
  function handleChange(e) {
    document.documentElement.setAttribute("data-theme", e.target.value);
    setTheme(e.target.value);
  }
  return (
    <select value={theme} onChange={handleChange}>
      {THEME_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
