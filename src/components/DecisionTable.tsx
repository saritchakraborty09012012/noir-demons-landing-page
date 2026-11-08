import type { CSSProperties } from "react";
import { DECISION_HEAD, DECISION_ROWS } from "../content/content";

export default function DecisionTable() {
  return (
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
              {DECISION_HEAD.map((head) => (
                <th key={head} scope="col">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DECISION_ROWS.map((row, i) => (
              <tr key={row[0]} style={{ "--i": i } as CSSProperties}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
