import BrandMark from './BrandMark';
import CommentDetail from './CommentDetail';
import HeatRing from './HeatRing';
import PriorityQueue from './PriorityQueue';
import { modColors, overview, thread } from '../data/modData';

export default function ModerationSidebar({
  queue,
  selectedComment,
  selectedId,
  lastAction,
  onAction,
  onSelect,
}) {
  return (
    <aside className="mod-sidebar">
      <header className="mod-header">
        <BrandMark />
        <div>
          <strong>ModSignal</strong>
          <span>
            <i /> Live · 14 trådar
          </span>
        </div>
        <button type="button" aria-label="Inställningar">
          ...
        </button>
      </header>

      <div className="tabs" aria-label="Sidopanelens flikar">
        <button data-active="true" type="button">
          Kö <span>{queue.length}</span>
        </button>
        <button type="button">Tråd</button>
        <button type="button">Analys</button>
      </div>

      <div className="sidebar-scroll">
        <section className="overview-card">
          <div>
            <p>Aktuell tråd</p>
            <h2>{thread.title}</h2>
          </div>
          <div className="overview-row">
            <HeatRing value={overview.heat} />
            <div>
              <strong>Aktivitet: {overview.heatLabel}</strong>
              <span>Ökar snabbt</span>
              <em style={{ color: modColors.amber }}>{overview.trend}</em>
            </div>
          </div>
          <div className="metric-grid">
            <Metric label="Tonläge" value={`${overview.toxicity}%`} width="38%" color={modColors.red} />
            <Metric label="Tempo" value={`${overview.velocity}/h`} width="74%" color={modColors.amber} />
            <Metric label="Signaler" value={overview.alerts} width="46%" color={modColors.blue} />
          </div>
        </section>

        <section className="queue-section">
          <div className="section-title">
            <h2>Prioritetskö</h2>
            <span>Alla · Hög · Rapporter</span>
          </div>
          <PriorityQueue comments={queue} selectedId={selectedId} onSelect={onSelect} compact />
        </section>

        <CommentDetail comment={selectedComment} lastAction={lastAction} onAction={onAction} />
      </div>
    </aside>
  );
}

function Metric({ label, value, width, color }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <i>
        <b style={{ width, background: color }} />
      </i>
    </div>
  );
}
