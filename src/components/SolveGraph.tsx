import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";

/* Solve NCERT Search Console graph, re-coded as SVG (daily clicks + impressions, 27 Aug – 16 Nov).
 * Desktop: hover the chart for the GSC-style day tooltip. Touch: single tap pins/unpins it. */
const CLICKS = [
  0, 0.5, 0.7, 2.5, 3.3, 6.2, 4.8, 5.6, 4.6, 3.1, 2, 2.3, 4.6, 6, 10.4, 5.5, 2.2, 5.5, 7.2, 8.2,
  4.7, 9.1, 11.5, 10.1, 7.3, 5.3, 7.5, 6.2, 7.5, 4.9, 4.8, 12.3, 18.7, 14.8, 5.1, 8.3, 7.9, 6.1, 2,
  8.8, 20.3, 10.7, 5.1, 2.7, 2.6, 4.6, 7.3, 12.7, 13.2, 15.6, 10.1, 12.7, 8.7, 6.7, 4.4, 3.8, 3.9,
  3.5, 6.5, 4, 2.9, 2, 1.4, 4.7, 6.4, 7.1, 4, 4.8, 4.2, 6.8, 9.1, 9.5, 18.1, 8.6, 3, 3.3, 4.7, 4.1,
  2.5, 4.4, 3.8, 9.4,
];

const IMPRESSIONS = [
  4, 11, 16, 24, 29, 39, 32, 30, 27, 24, 22, 27, 38, 43, 55, 50, 47, 50, 46, 61, 63, 79, 88, 86, 80,
  68, 70, 74, 89, 87, 97, 108, 115, 106, 80, 74, 56, 84, 101, 118, 150, 119, 103, 67, 47, 60, 75, 88,
  92, 100, 92, 97, 85, 77, 69, 57, 49, 49, 62, 65, 77, 74, 73, 81, 79, 87, 78, 92, 99, 109, 118, 136,
  185, 122, 78, 72, 77, 83, 83, 132, 154, 220,
];

const X_LABELS = [
  "8/27/26",
  "9/7/26",
  "9/18/26",
  "9/29/26",
  "10/10/26",
  "10/21/26",
  "11/1/26",
  "11/12/26",
];
const W = 1000;
const H = 300;
const PAD_L = 34;
const PAD_R = 44;
const PAD_T = 12;
const PAD_B = 26;
const MAX_CLICKS = 24;
const MAX_IMPR = 300;
const PURPLE = "#8430ce";
const DAY_ONE = Date.UTC(2026, 7, 27);
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export default function SolveGraph() {
  const [hover, setHover] = useState<number | null>(null);

  const { clicks, impressions } = useMemo(() => {
    const iw = W - PAD_L - PAD_R;
    const ih = H - PAD_T - PAD_B;
    const toPts = (data: number[], max: number) =>
      data.map((v, i) => ({
        x: PAD_L + (i / (data.length - 1)) * iw,
        y: PAD_T + (1 - v / max) * ih,
      }));
    const path = (pts: { x: number; y: number }[]) =>
      pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    return {
      clicks: { pts: toPts(CLICKS, MAX_CLICKS), path: path(toPts(CLICKS, MAX_CLICKS)) },
      impressions: { pts: toPts(IMPRESSIONS, MAX_IMPR), path: path(toPts(IMPRESSIONS, MAX_IMPR)) },
    };
  }, []);

  const idxFromEvent = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const iw = W - PAD_L - PAD_R;
    return Math.max(0, Math.min(CLICKS.length - 1, Math.round(((x - PAD_L) / iw) * (CLICKS.length - 1))));
  };

  const ticks = [0, 8, 16, 24];
  const tip = hover == null ? null : { c: clicks.pts[hover], i: impressions.pts[hover], idx: hover };
  const tipX = tip ? (tip.c.x / W) * 100 : 0;
  const tipShift = tipX < 20 ? "0%" : tipX > 80 ? "-100%" : "-50%";

  return (
    <section className="gsc" id="dive-growth" aria-label="Solve NCERT search growth">
      <div className="gsc__head">
        <h3>
          Solve NCERT <em>— growth with zero promotion in less than 3 months</em>
        </h3>
        <span>GOOGLE SEARCH CONSOLE / DAILY</span>
      </div>

      <div className="gsc__kpis">
        <div className="gsc__kpi gsc__kpi--on">
          <span>
            <i aria-hidden="true">✓</i> Total clicks
          </span>
          <b>532</b>
        </div>
        <div className="gsc__kpi gsc__kpi--imp">
          <span>
            <i aria-hidden="true">✓</i> Total impressions
          </span>
          <b>6.31K</b>
        </div>
        <div className="gsc__kpi">
          <span>
            <i aria-hidden="true">□</i> Average CTR
          </span>
          <b>8.4%</b>
        </div>
        <div className="gsc__kpi">
          <span>
            <i aria-hidden="true">□</i> Average position
          </span>
          <b>8.6</b>
        </div>
        <span className="gsc__range" aria-hidden="true">
          Daily ▾
        </span>
      </div>

      <div className="gsc__chart">
        <span className="gsc__axis-label gsc__axis-label--top">Clicks</span>
        <span className="gsc__axis-label gsc__axis-label--top gsc__axis-label--right">Impressions</span>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Line chart of daily clicks and impressions from 27 August to 16 November 2026"
          onPointerMove={(e) => {
            if (e.pointerType !== "touch") setHover(idxFromEvent(e));
          }}
          onPointerDown={(e) => {
            const i = idxFromEvent(e);
            setHover((prev) => (e.pointerType === "touch" ? (prev === i ? null : i) : i));
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "touch") setHover(null);
          }}
        >
          {ticks.map((v) => {
            const y = PAD_T + (1 - v / MAX_CLICKS) * (H - PAD_T - PAD_B);
            return (
              <g key={v}>
                <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="rgba(0,0,0,0.12)" />
                <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="13" fill="#5f6368">
                  {v}
                </text>
                <text x={W - PAD_R + 8} y={y + 4} fontSize="13" fill="#5f6368">
                  {(v / MAX_CLICKS) * MAX_IMPR}
                </text>
              </g>
            );
          })}
          {tip ? (
            <line
              x1={tip.c.x}
              x2={tip.c.x}
              y1={PAD_T}
              y2={H - PAD_B}
              stroke="#9aa0a6"
              strokeDasharray="4 4"
            />
          ) : null}
          <path
            d={impressions.path}
            fill="none"
            stroke={PURPLE}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {impressions.pts.map((p, i) => (
            <circle
              key={`i${i}`}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={hover === i ? 4.2 : 2.2}
              fill={PURPLE}
            />
          ))}
          <path
            d={clicks.path}
            fill="none"
            stroke="#1a73e8"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {clicks.pts.map((p, i) => (
            <circle
              key={`c${i}`}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={hover === i ? 4.2 : 2.2}
              fill="#1a73e8"
            />
          ))}
          {X_LABELS.map((label, i) => {
            const last = i === X_LABELS.length - 1;
            return (
              <text
                key={label}
                x={last ? W - PAD_R : PAD_L + (i / (X_LABELS.length - 1)) * (W - PAD_L - PAD_R)}
                y={H - 6}
                textAnchor={last ? "end" : "middle"}
                fontSize="13"
                fill="#5f6368"
              >
                {label}
              </text>
            );
          })}
        </svg>
        {tip ? (
          <div
            className="gsc__tip"
            style={{ left: `${tipX}%`, transform: `translateX(${tipShift})` }}
            role="status"
          >
            <b>{DATE_FMT.format(new Date(DAY_ONE + tip.idx * 86400000))}</b>
            <div className="gsc__tip-row">
              <i style={{ background: "#1a73e8" }} aria-hidden="true" />
              Clicks
              <b>{Math.round(CLICKS[tip.idx])}</b>
            </div>
            <div className="gsc__tip-row">
              <i style={{ background: PURPLE }} aria-hidden="true" />
              Impressions
              <b>{IMPRESSIONS[tip.idx]}</b>
            </div>
          </div>
        ) : null}
      </div>

      <p className="gsc__story">
        No advertisements. No social media. No promotions. In less than 3 months, with 0 promotion, SolveNCERT
        grew the way genuinely useful things grow — shared once with a single struggling student who liked it,
        and soon every Class 9 student in his school started liking it.
      </p>
    </section>
  );
}
