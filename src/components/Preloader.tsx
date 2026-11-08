import { useReel } from "../store/useReel";

export default function Preloader() {
  const boot = useReel((s) => s.boot);
  const booted = useReel((s) => s.booted);
  const pct = Math.round(boot * 100);
  return (
    <div className={`preloader ${booted ? "is-leaving" : ""}`} aria-hidden={booted}>
      <div className="preloader__inner">
        <div className="preloader__logo">
          <img src="/images/noirdemons.webp" alt="" />
        </div>
        <p className="preloader__word">NOIRDEMONS</p>
        <div className="preloader__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="preloader__meta">
          <span>
            INITIALIZING REEL <b>{pct}%</b>
          </span>
          <span>NDE / REEL / 1900VH</span>
        </div>
      </div>
    </div>
  );
}
