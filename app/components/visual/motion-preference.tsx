"use client";

import { useSyncExternalStore } from "react";

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
  return useSyncExternalStore(subscribeMotion, motionPreference, () => "full") !== "full";
}
export function MotionControl() {
  const preference = useSyncExternalStore(subscribeMotion, motionPreference, () => "full");
  return <button className="motion-control" type="button" aria-pressed={preference !== "full"} disabled={preference === "system"}
    onClick={() => {
      sessionChoice = preference === "full";
      try { localStorage.setItem(key, String(sessionChoice)); } catch { /* The in-memory preference still works. */ }
      window.dispatchEvent(new Event(event));
    }}>{preference === "system" ? "Movimento reduzido pelo dispositivo" : preference === "reduced" ? "Ativar movimento" : "Reduzir movimento"}</button>;
}
