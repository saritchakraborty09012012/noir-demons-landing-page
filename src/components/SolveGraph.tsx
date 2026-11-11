import { useMemo } from "react";

/* Solve NCERT Search Console graph, re-coded as SVG (daily clicks + impressions, 27 Aug – 5 Nov). */
const CLICKS = [
  0, 1, 0.2, 1, 6.5, 6.5, 5.5, 5.5, 4.5, 3, 0.5, 4.5, 3.5, 4.5, 1, 4, 10.5, 1, 6, 1.5, 10, 9.5, 10.5,
  7, 10.5, 11, 14, 10.5, 10, 7.5, 6, 20.5, 9.5, 9.5, 21.5, 13, 8.5, 2.5, 1.5, 9, 5.5, 7.5, 19, 13,
  14, 11.5, 12, 5, 3.5, 3, 3.5, 3.5, 3.5, 7, 6, 5.5, 2, 4, 4, 6.5, 5, 5, 5, 9, 5, 4, 4, 17, 2.5,
  18.8, 2.5,
];

const IMPRESSIONS = [
  4, 4, 6, 21, 38, 50, 47, 42, 41, 25, 25, 27, 39, 29, 30, 48, 48, 55, 27, 55, 72, 103, 93, 96, 98,
  122, 122, 118, 96, 81, 127, 134, 148, 151, 164, 160, 89, 47, 48, 60, 82, 119, 148, 172, 143, 134,
  102, 73, 41, 36, 36, 38, 50, 59, 66, 48, 41, 36, 52, 55, 69, 63, 80, 80, 75, 55, 105, 98, 160,
  268, 58,
];

const X_LABELS = [
  "8/27/26",
  "9/6/26",
  "9/16/26",
  "9/26/26",
  "10/6/26",
  "10/16/26",
  "10/26/26",
  "11/5/26",
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

export default function SolveGraph() {
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

  const ticks = [0, 8, 16, 24];

  return (
    <section className="gsc" id="dive-growth" aria-label="Solve NCERT search growth">
      <div className="gsc__head">
        <h3>
          Solve NCERT <em>— growth with zero promotion in just 3 months</em>
        </h3>
        <span>GOOGLE SEARCH CONSOLE / DAILY</span>
      </div>

      <div className="gsc__kpis">
        <div className="gsc__kpi gsc__kpi--on">
          <span>
            <i aria-hidden="true">✓</i> Total clicks
          </span>
          <b>490</b>
        </div>
        <div className="gsc__kpi gsc__kpi--imp">
          <span>
            <i aria-hidden="true">✓</i> Total impressions
          </span>
          <b>5.43K</b>
        </div>
        <div className="gsc__kpi">
          <span>
            <i aria-hidden="true">□</i> Average CTR
          </span>
          <b>9%</b>
        </div>
        <div className="gsc__kpi">
          <span>
            <i aria-hidden="true">□</i> Average position
          </span>
          <b>8.4</b>
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
          aria-label="Line chart of daily clicks and impressions from 27 August to 5 November 2026"
        >
          {ticks.map((v, i) => {
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
          <path
            d={impressions.path}
            fill="none"
            stroke={PURPLE}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {impressions.pts.map((p, i) => (
            <circle key={`i${i}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={2.2} fill={PURPLE} />
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
            <circle key={`c${i}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={2.2} fill="#1a73e8" />
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
      </div>

      <p className="gsc__story">
        No advertisements. No social media. No promotions. In just 3 months, with 0 promotion, SolveNCERT
        grew the way genuinely useful things grow — shared once with a single struggling student who liked it,
        and soon every Class 9 student in his school started liking it.
      </p>
    </section>
  );
}
