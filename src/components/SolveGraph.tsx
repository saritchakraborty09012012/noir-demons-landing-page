import { useMemo } from "react";

/* Solve NCERT Search Console graph, re-coded as SVG (daily clicks, 27 Aug – 3 Nov). */
const DAILY = [
  0, 1, 0.2, 1, 6.5, 6.5, 5.5, 5.5, 4.5, 3, 0.5, 4.5, 3.5, 4.5, 1, 4, 10.5, 1, 6, 1.5, 10, 9.5, 10.5,
  7, 10.5, 11, 14.5, 10.5, 10, 7.5, 6, 21, 9.5, 9.5, 22, 13, 8.5, 2.5, 1.5, 9, 5.5, 7.5, 19.5, 13, 14,
  11.5, 12, 5, 3.5, 3, 3.5, 3.5, 3.5, 7, 6, 5.5, 2, 4, 4, 6.5, 5, 5, 5, 9, 5, 4, 4, 17.5, 2.5,
];

const X_LABELS = ["8/27/26", "9/6/26", "9/15/26", "9/25/26", "10/5/26", "10/15/26", "10/24/26", "11/3/26"];
const W = 1000;
const H = 300;
const PAD_L = 34;
const PAD_R = 8;
const PAD_T = 12;
const PAD_B = 26;
const MAX = 24;

export default function SolveGraph() {
  const { line, dots } = useMemo(() => {
    const iw = W - PAD_L - PAD_R;
    const ih = H - PAD_T - PAD_B;
    const pts = DAILY.map((v, i) => ({
      x: PAD_L + (i / (DAILY.length - 1)) * iw,
      y: PAD_T + (1 - v / MAX) * ih,
      v,
    }));
    return {
      line: pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
      dots: pts,
    };
  }, []);

  const grid = [0, 8, 16, 24].map((v) => PAD_T + (1 - v / MAX) * (H - PAD_T - PAD_B));

  return (
    <section className="gsc" id="dive-growth" aria-label="Solve NCERT search growth">
      <div className="gsc__head">
        <h3>
          Solve NCERT <em>— growth with zero promotion in just 3 months</em>
        </h3>
        <span>GOOGLE SEARCH CONSOLE / DAILY</span>
      </div>

      <div className="gsc__kpis">
        <div className="gsc__kpi gsc__kpi--on gsc__kpi--mark">
          <span>
            <i aria-hidden="true">✓</i> Total clicks
          </span>
          <b>478</b>
        </div>
        <div className="gsc__kpi gsc__kpi--mark">
          <span>
            <i aria-hidden="true">□</i> Total impressions
          </span>
          <b>5.06K</b>
        </div>
        <div className="gsc__kpi">
          <span>
            <i aria-hidden="true">□</i> Average CTR
          </span>
          <b>9.4%</b>
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
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line chart of daily clicks from 27 August to 3 November 2026">
          {grid.map((y, i) => (
            <g key={y}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="rgba(0,0,0,0.12)" />
              <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="13" fill="#5f6368">
                {[0, 8, 16, 24][i]}
              </text>
            </g>
          ))}
          <path d={line} fill="none" stroke="#1a73e8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {dots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.2} fill="#1a73e8" />
          ))}
          {X_LABELS.map((label, i) => (
            <text
              key={label}
              x={i === X_LABELS.length - 1 ? W - PAD_R : PAD_L + (i / (X_LABELS.length - 1)) * (W - PAD_L - PAD_R)}
              y={H - 6}
              textAnchor={i === X_LABELS.length - 1 ? "end" : "middle"}
              fontSize="13"
              fill="#5f6368"
            >
              {label}
            </text>
          ))}
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
