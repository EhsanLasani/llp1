"use client";

import dynamic from "next/dynamic";

// Load the panel only on the client
const DevToolsPanel = dynamic(() => import("./DevToolsPanel"), { ssr: false });

export default function DevtoolsRoot() {
  return <DevToolsPanel />;
}
