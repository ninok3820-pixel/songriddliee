import { useState, type CSSProperties } from "react";

const CHARTS = Array.from({ length: 24 }, (_, i) => `/charts/chart-${String(i + 1).padStart(2, "0")}.webp`);
const OLD_COVERS = CHARTS.slice(0, 16);
const NEW_COVERS = CHARTS.slice(16);
const oldGroup = (group: number) => OLD_COVERS.filter((_, i) => i % 5 === group);
const COLUMN_COVERS = [oldGroup(0), NEW_COVERS, oldGroup(1), oldGroup(2), oldGroup(3), oldGroup(4)];
const MIN_COVERS_PER_COPY = 8;

const COLUMNS = COLUMN_COVERS.map((covers, column) => {
  const repeats = Math.ceil(MIN_COVERS_PER_COPY / covers.length);
  return {
    direction: column % 2 === 0 ? "up" : "down",
    covers: Array.from({ length: repeats }, () => covers).flat(),
  };
});

const BLURRED_MASK =
  "radial-gradient(circle at 50% 50%, transparent 0, transparent 240px, #000 320px)";
const SHARP_MASK =
  "radial-gradient(circle at 50% 50%, #000 0, #000 240px, transparent 300px)";

type Hovered = { column: number; id: string } | null;

function CoverColumns({
  blurred,
  hovered,
  onHover,
}: {
  blurred: boolean;
  hovered: Hovered;
  onHover: (value: Hovered) => void;
}) {
  return (
    <div className="absolute inset-0 flex gap-2">
      {COLUMNS.map((column, index) => {
        const isHoveredColumn = hovered?.column === index;
        return (
          <div
            key={index}
            className={`relative h-full [container-type:inline-size] ${index % 2 === 0 ? "flex-[418]" : "flex-[461]"} ${isHoveredColumn ? "z-10" : ""}`}
          >
            <div
              className={`cover-column cover-column-${column.direction} absolute left-0 top-0 w-full`}
              style={
                {
                  "--cover-duration": `${30 + index * 4}s`,
                  "--cover-offset": index % 2 === 1 ? "calc(50cqw + 0.5rem)" : "0px",
                  animationPlayState: isHoveredColumn ? "paused" : "running",
                } as CSSProperties
              }
            >
              {[0, 1].map((copy) =>
                column.covers.map((src, i) => {
                  const id = `${copy}-${i}`;
                  const isHovered = isHoveredColumn && hovered?.id === id;
                  return (
                    <img
                      key={id}
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onMouseEnter={() => onHover({ column: index, id })}
                      onMouseLeave={() => onHover(null)}
                      className="pointer-events-auto block w-full object-cover"
                      style={{
                        marginBottom: "0.5rem",
                        aspectRatio: index % 2 === 0 ? "418 / 498" : "461 / 438",
                        transform: isHovered ? "scale(1.08)" : undefined,
                        filter: blurred && !isHovered ? "blur(4px)" : undefined,
                        transition: "transform 200ms ease, filter 200ms ease",
                      }}
                    />
                  );
                }),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CoverBackground() {
  const [hovered, setHovered] = useState<Hovered>(null);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{ maskImage: BLURRED_MASK, WebkitMaskImage: BLURRED_MASK }}
      >
        <CoverColumns blurred hovered={hovered} onHover={setHovered} />
      </div>
      <div
        className="absolute inset-0 opacity-50"
        style={{ maskImage: SHARP_MASK, WebkitMaskImage: SHARP_MASK }}
      >
        <CoverColumns blurred={false} hovered={hovered} onHover={setHovered} />
      </div>
    </div>
  );
}
