"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const StudioMotion = createContext<"none" | "subtle" | "expressive">("subtle");
export function StudioMotionProvider({intensity, children}: {intensity:"none" | "subtle" | "expressive"; children:ReactNode}) {
  return <StudioMotion.Provider value={intensity}>{children}</StudioMotion.Provider>;
}
export function useStudioMotion() { return useContext(StudioMotion); }

const key = "punctum-reduce-motion";
const event = "punctum:motion";
let sessionChoice: boolean | null = null;
export function motionPreference() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "system";
  if (sessionChoice !== null) return sessionChoice ? "reduced" : "full";
  try { if (localStorage.getItem(key) === "true") return "reduced"; } catch { /* Storage may be unavailable. */ }
  return "full";
}
export function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    query.removeEventListener("change", callback);
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
export function useReducedMotion() {
  const preference = useSyncExternalStore(subscribeMotion, motionPreference, () => "full");
  return useStudioMotion() === "none" || preference !== "full";
}
export function MotionControl() {
  const preference = useSyncExternalStore(subscribeMotion, motionPreference, () => "full");
  const disabledByStudio = useStudioMotion() === "none";
  return <button className="motion-control" type="button" aria-pressed={disabledByStudio || preference !== "full"} disabled={disabledByStudio || preference === "system"}
    onClick={() => {
      sessionChoice = preference === "full";
      try { localStorage.setItem(key, String(sessionChoice)); } catch { /* The in-memory preference still works. */ }
      window.dispatchEvent(new Event(event));
    }}>{disabledByStudio ? "Site sem movimento" : preference === "system" ? "Movimento reduzido pelo dispositivo" : preference === "reduced" ? "Ativar movimento" : "Reduzir movimento"}</button>;
}
