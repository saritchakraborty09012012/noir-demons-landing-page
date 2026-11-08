import { useReel } from "../store/useReel";
import { jumpTo } from "../lib/scroll";
import { planCenter } from "../lib/planScroll";
import { PLAN_GROUPS } from "../content/content";

export default function PlansHud() {
  const mode = useReel((s) => s.planMode);
  const setMode = useReel((s) => s.setPlanMode);
  const active = useReel((s) => s.activePlan);
  const setActive = useReel((s) => s.setActivePlan);
  const group = PLAN_GROUPS[mode];
  const plan = group.plans[active] ?? group.plans[0];

  const pick = (i: number) => {
    setActive(i);
    jumpTo(planCenter(mode, i), 1.05);
  };

  return (
    <div className="plans-hud" data-live="plans">
      <div className="plan-toggle">
        <div className="plan-toggle__inner" role="tablist" aria-label="Plan type">
          <button
            role="tab"
            aria-selected={mode === "managed"}
            className={mode === "managed" ? "is-on" : ""}
            onClick={() => setMode("managed")}
          >
            Run it as a service <em>Popular</em>
          </button>
          <button
            role="tab"
            aria-selected={mode === "source"}
            className={mode === "source" ? "is-on" : ""}
            onClick={() => setMode("source")}
          >
            Own the source code
          </button>
        </div>
      </div>

      <div className="plan-detail">
        <div className="plan-tabs" role="tablist" aria-label="Plan level">
          {group.plans.map((item, i) => (
            <button
              key={item.no}
              role="tab"
              aria-selected={active === i}
              className={active === i ? "is-on" : ""}
              onClick={() => pick(i)}
            >
              {item.no} <b>{item.name}</b>
            </button>
          ))}
        </div>
        <div className="plan-body">
          <div className="plan-title">
            <p className="micro">
              {plan.no} / {plan.kicker}
            </p>
            <h3>
              <em>{plan.name}</em>
            </h3>
            <div className="plan-price">
              {plan.price} <small>{plan.unit || "scope-based"}</small>
            </div>
            <p className="plan-desc">{plan.desc}</p>
          </div>
          <ul className="plan-features">
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <a className="plan-cta" href={plan.href}>
            {plan.cta} ↗
          </a>
        </div>
        <div className="plan-blurb">
          <span>{group.blurb}</span>
          <b>{group.badge}</b>
        </div>
      </div>
    </div>
  );
}
