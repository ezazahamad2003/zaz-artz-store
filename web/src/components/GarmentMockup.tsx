"use client";

import type { GarmentId, Layer, Side, TextLayer, ImageLayer } from "@/lib/types";
import { colorById } from "@/lib/catalog";

/* All garments are drawn in a 400x480 viewBox. Each returns its print area. */
export interface PrintArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Shape {
  path: string;
  details?: string; // secondary strokes (seams, ribs)
  print: PrintArea;
  printBack?: PrintArea;
}

const SHAPES: Record<GarmentId, Shape> = {
  tee: {
    path:
      "M150 60 C165 80 235 80 250 60 L330 92 L365 165 L300 190 L300 440 L100 440 L100 190 L35 165 L70 92 Z",
    details: "M150 60 C165 100 235 100 250 60 M100 190 L300 190",
    print: { x: 120, y: 130, w: 160, h: 220 },
  },
  "heavy-tee": {
    path:
      "M148 58 C165 78 235 78 252 58 L340 95 L372 172 L305 198 L305 445 L95 445 L95 198 L28 172 L60 95 Z",
    details: "M148 58 C165 98 235 98 252 58 M95 198 L305 198",
    print: { x: 118, y: 135, w: 164, h: 220 },
  },
  "oversized-tee": {
    path:
      "M145 60 C165 80 235 80 255 60 L355 100 L380 185 L310 205 L310 460 L90 460 L90 205 L20 185 L45 100 Z",
    details: "M145 60 C165 102 235 102 255 60 M90 205 L310 205",
    print: { x: 115, y: 140, w: 170, h: 230 },
  },
  longsleeve: {
    path:
      "M150 60 C165 80 235 80 250 60 L325 90 L385 300 L335 315 L300 200 L300 440 L100 440 L100 200 L65 315 L15 300 L75 90 Z",
    details: "M150 60 C165 100 235 100 250 60 M335 315 L385 300 M15 300 L65 315",
    print: { x: 120, y: 130, w: 160, h: 220 },
  },
  hoodie: {
    path:
      "M200 30 C240 30 265 55 268 95 L340 115 L385 215 L320 235 L320 450 L80 450 L80 235 L15 215 L60 115 L132 95 C135 55 160 30 200 30 Z",
    details:
      "M200 30 C240 30 265 55 268 95 C250 120 150 120 132 95 M150 390 L250 390 L250 450 L150 450 M190 112 L185 140 M210 112 L215 140",
    print: { x: 120, y: 150, w: 160, h: 190 },
  },
  crewneck: {
    path:
      "M150 60 C165 78 235 78 250 60 L335 100 L385 215 L320 235 L320 410 L310 445 L90 445 L80 410 L80 235 L15 215 L65 100 Z",
    details: "M150 60 C165 95 235 95 250 60 M80 410 L320 410",
    print: { x: 120, y: 135, w: 160, h: 220 },
  },
  "zip-hoodie": {
    path:
      "M200 30 C240 30 265 55 268 95 L340 115 L385 215 L320 235 L320 450 L80 450 L80 235 L15 215 L60 115 L132 95 C135 55 160 30 200 30 Z",
    details:
      "M200 30 C240 30 265 55 268 95 C250 120 150 120 132 95 M200 110 L200 450 M150 395 L185 395 L185 450 M215 395 L250 395 L250 450",
    print: { x: 215, y: 150, w: 90, h: 110 },
    printBack: { x: 120, y: 150, w: 160, h: 190 },
  },
  joggers: {
    path:
      "M100 40 L300 40 L310 120 L300 280 L290 440 L220 440 L205 200 L195 200 L180 440 L110 440 L100 280 L90 120 Z",
    details: "M100 70 L300 70 M110 410 L180 410 M220 410 L290 410",
    print: { x: 215, y: 170, w: 70, h: 110 },
  },
  "camp-shirt": {
    path:
      "M150 55 L200 100 L250 55 L340 92 L375 170 L310 195 L310 440 L90 440 L90 195 L25 170 L60 92 Z",
    details:
      "M150 55 L200 100 L200 440 M250 55 L200 100 M150 55 L170 80 L200 100 M250 55 L230 80 L200 100 M200 160 L200 170 M200 220 L200 230 M200 280 L200 290 M200 340 L200 350",
    print: { x: 220, y: 135, w: 80, h: 90 },
    printBack: { x: 120, y: 130, w: 160, h: 220 },
  },
  "pj-set": {
    path:
      "M150 60 C165 80 235 80 250 60 L325 90 L385 300 L335 315 L300 200 L300 440 L100 440 L100 200 L65 315 L15 300 L75 90 Z",
    details: "M150 60 C165 100 235 100 250 60 M335 315 L385 300 M15 300 L65 315",
    print: { x: 120, y: 130, w: 160, h: 220 },
  },
};

export function printAreaFor(garment: GarmentId, side: Side): PrintArea {
  const s = SHAPES[garment];
  return side === "back" && s.printBack ? s.printBack : s.print;
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/* ------------------------------ text helpers ------------------------------ */

/** Approximate average glyph width ratio for sizing text to the layer width. */
const GLYPH = 0.56;

export function textFontSize(layer: TextLayer, areaW: number) {
  const chars = Math.max(1, layer.text.length);
  const ls = layer.letterSpacing ?? 0;
  const widthPx = layer.w * areaW;
  return Math.max(6, widthPx / (chars * (GLYPH + ls)));
}

function TextLayerSvg({ layer, area }: { layer: TextLayer; area: PrintArea }) {
  const fs = textFontSize(layer, area.w);
  const cx = area.x + layer.x * area.w;
  const cy = area.y + layer.y * area.h;
  const text = layer.uppercase ? layer.text.toUpperCase() : layer.text;
  const common = {
    fontFamily: `'${layer.font}', Impact, sans-serif`,
    fontSize: fs,
    fontWeight: layer.weight ?? 700,
    fontStyle: layer.italic ? "italic" : "normal",
    letterSpacing: `${(layer.letterSpacing ?? 0) * fs}px`,
    fill: layer.color,
    stroke: layer.stroke,
    strokeWidth: layer.stroke ? fs * 0.06 : 0,
    paintOrder: "stroke" as const,
    textAnchor: "middle" as const,
    dominantBaseline: "central" as const,
  };
  if (layer.curve && Math.abs(layer.curve) > 0.02) {
    const r = (layer.w * area.w) / (Math.abs(layer.curve) * Math.PI);
    const dir = layer.curve > 0 ? 1 : 0;
    const pathId = `arc-${layer.id}`;
    const yOff = layer.curve > 0 ? r : -r;
    const d = `M ${cx - layer.w * area.w / 2} ${cy + yOff * 0.5} A ${r} ${r} 0 0 ${dir} ${cx + layer.w * area.w / 2} ${cy + yOff * 0.5}`;
    return (
      <g transform={`rotate(${layer.rotation} ${cx} ${cy})`}>
        <defs>
          <path id={pathId} d={d} fill="none" />
        </defs>
        <text {...common} dominantBaseline="middle">
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </g>
    );
  }
  return (
    <text {...common} x={cx} y={cy} transform={`rotate(${layer.rotation} ${cx} ${cy})`}>
      {text}
    </text>
  );
}

function ImageLayerSvg({ layer, area }: { layer: ImageLayer; area: PrintArea }) {
  const w = layer.w * area.w;
  const h = w * layer.aspect;
  const cx = area.x + layer.x * area.w;
  const cy = area.y + layer.y * area.h;
  return (
    <image
      href={layer.src}
      x={cx - w / 2}
      y={cy - h / 2}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      transform={`rotate(${layer.rotation} ${cx} ${cy})`}
      crossOrigin="anonymous"
    />
  );
}

export function LayersSvg({ layers, area }: { layers: Layer[]; area: PrintArea }) {
  return (
    <>
      {layers.map((l) =>
        l.type === "text" ? (
          <TextLayerSvg key={l.id} layer={l} area={area} />
        ) : (
          <ImageLayerSvg key={l.id} layer={l} area={area} />
        ),
      )}
    </>
  );
}

/* --------------------------------- mockup --------------------------------- */

export interface MockupProps {
  garment: GarmentId;
  color: string;
  layers: Layer[];
  side?: Side;
  showPrintArea?: boolean;
  className?: string;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onPointerDownLayer?: (id: string, e: React.PointerEvent) => void;
  svgRef?: React.Ref<SVGSVGElement>;
  background?: string;
}

export default function GarmentMockup({
  garment,
  color,
  layers,
  side = "front",
  showPrintArea,
  className,
  selectedId,
  onSelect,
  onPointerDownLayer,
  svgRef,
  background,
}: MockupProps) {
  const shape = SHAPES[garment];
  const area = printAreaFor(garment, side);
  const c = colorById(color);
  const gid = `g-${garment}-${side}`;
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 480"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget && onSelect) onSelect(null);
      }}
    >
      <defs>
        <linearGradient id={`${gid}-shade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(c.hex, -18)} />
          <stop offset="0.2" stopColor={c.hex} />
          <stop offset="0.8" stopColor={c.hex} />
          <stop offset="1" stopColor={shade(c.hex, -22)} />
        </linearGradient>
        <clipPath id={`${gid}-clip`}>
          <rect x={area.x} y={area.y} width={area.w} height={area.h} />
        </clipPath>
      </defs>
      {background && <rect width="400" height="480" fill={background} />}
      <path d={shape.path} fill={`url(#${gid}-shade)`} stroke={shade(c.hex, c.dark ? 30 : -40)} strokeWidth="1.5" strokeLinejoin="round" />
      {shape.details && (
        <path d={shape.details} fill="none" stroke={shade(c.hex, c.dark ? 28 : -36)} strokeWidth="1.2" opacity="0.9" />
      )}
      <g clipPath={`url(#${gid}-clip)`}>
        <LayersSvg layers={layers} area={area} />
      </g>
      {showPrintArea && (
        <rect
          x={area.x}
          y={area.y}
          width={area.w}
          height={area.h}
          fill="none"
          stroke="#c8102e"
          strokeDasharray="4 4"
          strokeWidth="1"
          opacity="0.7"
          pointerEvents="none"
        />
      )}
      {/* interaction hit boxes */}
      {onSelect &&
        layers.map((l) => {
          const w = l.w * area.w;
          const h = l.type === "image" ? w * l.aspect : textFontSize(l, area.w) * 1.3;
          const cx = area.x + l.x * area.w;
          const cy = area.y + l.y * area.h;
          const sel = selectedId === l.id;
          return (
            <rect
              key={`hit-${l.id}`}
              x={cx - w / 2}
              y={cy - h / 2}
              width={w}
              height={h}
              fill="transparent"
              stroke={sel ? "#c8102e" : "transparent"}
              strokeWidth="1.5"
              transform={`rotate(${l.rotation} ${cx} ${cy})`}
              style={{ cursor: "move" }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelect(l.id);
                onPointerDownLayer?.(l.id, e);
              }}
            />
          );
        })}
    </svg>
  );
}
