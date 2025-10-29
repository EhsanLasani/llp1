// hooks/useIsDev.ts
export default function useIsDev() {
  if (typeof window === "undefined") return false;
  const flag =
    (process?.env?.NEXT_PUBLIC_ENABLE_DEVTOOLS ?? "false") === "true";
  const notProd = process?.env?.NODE_ENV !== "production";
  return notProd && flag;
}
