// hooks/useIsDev.ts
export default function useIsDev() {
  if (typeof window === "undefined") return false;

  const qp = new URLSearchParams(window.location.search);
  const urlForcesOn = qp.get("devtools") === "1";

  const enableFlag =
    (process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS ?? "false") === "true";

  const allowed = enableFlag || urlForcesOn;

  // one-time log
  if ((window as any).__devtools_logged !== true) {
    (window as any).__devtools_logged = true;
    console.log("[DevTools] isDev:", allowed, {
      NEXT_PUBLIC_ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS,
      NODE_ENV: process.env.NODE_ENV,
      urlForcesOn,
    });
  }

  return allowed;
}
