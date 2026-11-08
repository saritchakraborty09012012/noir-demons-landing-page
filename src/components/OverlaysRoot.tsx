import { ConstellationPanel, EnginePanel, HeroPanel, ImpactPanel, PremisePanel } from "./Overlays";
import KeysPanel from "./KeysPanel";
import DecisionTable from "./DecisionTable";
import PlansHud from "./PlansHud";
import { OutroPanel, VisionPanel } from "./FinalPanels";

export default function OverlaysRoot() {
  return (
    <div className="overlay">
      <HeroPanel />
      <PremisePanel />
      <ImpactPanel />
      <ConstellationPanel />
      <EnginePanel />
      <KeysPanel />
      <DecisionTable />
      <PlansHud />
      <VisionPanel />
      <OutroPanel />
    </div>
  );
}
