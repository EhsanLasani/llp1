// components/ThemeSwitcher.tsx
"use client";
import React from "react";
export function ThemeSwitcher() {
  function handleChange(e) {
    document.documentElement.setAttribute("data-theme", e.target.value);
  }
  return (
    <select onChange={handleChange} defaultValue="carbon-g100">
      <option value="carbon-g10">Carbon Light</option>
      <option value="carbon-g100">Carbon Dark</option>
    </select>
  );
}
