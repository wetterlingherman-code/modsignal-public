import BrandMark from './BrandMark';
import HeatRing from './HeatRing';
import PriorityQueue from './PriorityQueue';
import { overview, thread } from '../data/modData';

export default function ExtensionPopup({ queue, selectedId, onSelect }) {
  return (
    <section className="popup-preview" aria-label="Förhandsvy av tilläggspanel">
      <header>
        <BrandMark size={28} />
        <div>
          <strong>ModSignal</strong>
          <span>Förhandsvy av Chrome-panel</span>
        </div>
        <span className="status-dot" />
      </header>

      <div className="popup-thread">
        <HeatRing value={overview.heat} size={48} />
        <div>
          <span>Aktuell tråd</span>
          <strong>{thread.community}</strong>
          <p>{overview.alerts} signaler · {overview.trend}</p>
        </div>
      </div>

      <div className="popup-stats">
        <span>
          <strong>{overview.toxicity}%</strong> tonläge
        </span>
        <span>
          <strong>{overview.velocity}/h</strong> tempo
        </span>
      </div>

      <div className="section-title">
        <h2>Kompakt kö</h2>
        <span>{queue.length} ärenden</span>
      </div>
      <PriorityQueue comments={queue.slice(0, 3)} selectedId={selectedId} onSelect={onSelect} compact />
    </section>
  );
}
