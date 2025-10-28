// components/layout/PageContainer.tsx
import React from "react";
export function PageContainer({ children, className = "" }) {
  return (
    <div className={`page-container ${className}`} data-theme="carbon-g10">
      {children}
    </div>
  );
}
