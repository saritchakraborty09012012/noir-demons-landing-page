import { useState, type CSSProperties } from "react";
import { DECISION_HEAD, DECISION_ROWS } from "../content/content";

/* 1–2 word phone forms — full text stays on larger screens. */
const SHORT: Record<string, [string, string, string]> = {
  "Source code": ["Source code", "Yours", "We maintain"],
  Hosting: ["Hosting", "Your servers", "Ours"],
  "Database infrastructure": ["Database", "You run it", "We run it"],
  "Customer data": ["Customer data", "Yours, always", "Yours, always"],
  Updates: ["Updates", "Quoted", "Included"],
  "Bug fixes": ["Bug fixes", "Separate", "We fix"],
  "New features": ["New features", "Scoped", "Included"],
  "Recurring payments": ["Recurring", "None", "One plan"],
  "Client independence": ["Independence", "High", "Lower"],
  "Your control": ["Your control", "Higher", "Lower"],
  "Your responsibility": ["Responsibility", "Higher", "Lower"],
  Scalability: ["Scalability", "Harder", "Easier"],
  Backend: ["Backend", "Yours", "We run"],
};

const Cell = ({ full, short }: { full: string; short: string }) => (
  <>
    <span className="v-d">{full}</span>
    <span className="v-s">{short}</span>
  </>
);

export default function DecisionTable() {
  const [hint, setHint] = useState(false);
  const detail = () => {
    setHint(true);
    window.setTimeout(() => setHint(false), 2800);
  };
  return (
    <>
      <div className="table-wrap" data-live="table" aria-label="Buy versus managed comparison">
      <div className="table-head">
        <h3>
          Side by side — <em>no fine print.</em>
        </h3>
        <div className="micro">
          13 DECISION POINTS
          <br />
          PLAIN LANGUAGE
        </div>
      </div>
      <p className="table-cue" aria-hidden="true">
        Swipe for the full comparison →
      </p>
      <div className="table-scroll">
        <table className="decision">
          <caption className="sr-only">
            Thirteen decision points comparing buying the source code with the managed service.
          </caption>
          <thead>
            <tr>
              {DECISION_HEAD.map((head, i) => (
                <th key={head} scope="col">
                  <Cell full={head} short={["Point", "Buy the build", "Run as SaaS"][i] ?? head} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DECISION_ROWS.map((row, i) => {
              const short = SHORT[row[0]];
              return (
                <tr key={row[0]} style={{ "--i": i } as CSSProperties}>
                  <td>
                    <Cell full={row[0]} short={short ? short[0] : row[0]} />
                  </td>
                  <td>
                    <Cell full={row[1]} short={short ? short[1] : row[1]} />
                  </td>
                  <td>
                    <Cell full={row[2]} short={short ? short[2] : row[2]} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
      <button type="button" className="table-detail-btn" data-live="table" onClick={detail} aria-expanded={hint}>
        See in detail <i aria-hidden="true">↓</i>
      </button>
      {hint && (
        <p className="table-detail-hint" role="status">
          Keep scrolling — you&apos;ll get the details just after the animations end.
        </p>
      )}
    </>
  );
}
