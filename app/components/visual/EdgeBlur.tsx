import type { CSSProperties } from "react";

interface EdgeBlurProps {
  position?: "top" | "bottom" | "both";
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

const BLUR_LAYERS = [1, 2, 4, 8, 16];

export function EdgeBlur({
  position = "bottom",
  height = 80,
  className = "",
  style,
}: EdgeBlurProps) {
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  return (
    <>
      {(position === "top" || position === "both") && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden ${className}`}
          style={{ height: heightStyle, ...style }}
        >
          {BLUR_LAYERS.map((blur, index) => (
            <div
              key={`top-blur-${index}`}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage:
                  "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
              }}
            />
          ))}
        </div>
      )}
      {(position === "bottom" || position === "both") && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden ${className}`}
          style={{ height: heightStyle, ...style }}
        >
          {BLUR_LAYERS.map((blur, index) => (
            <div
              key={`bottom-blur-${index}`}
              className="absolute inset-0"
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage:
                  "linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
