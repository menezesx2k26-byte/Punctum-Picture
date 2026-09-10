"use client";

/**
 * BarytaGrain: Micro-textura tátil de papel fotográfico Baryta / Hahnemühle.
 * Aplica grão analógico sensorialmente presente, eliminando a frieza do
 * vidro digital sobre as fotografias e superfícies escuras.
 * Usa aceleração de GPU com mix-blend-mode: overlay e pointer-events: none.
 */
export function BarytaGrain() {
  return <div className="baryta-grain-layer" aria-hidden="true" />;
}
