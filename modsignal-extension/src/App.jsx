import { useEffect, useMemo, useRef, useState } from 'react';
import BrandMark from './components/BrandMark';
import ActionButtons from './components/ActionButtons';
import ForumHost from './components/ForumHost';
import HeatRing from './components/HeatRing';
import MicroTag from './components/MicroTag';
import PriorityQueue from './components/PriorityQueue';
import {
  fallbackModerationData,
  getPriorityQueue,
  modColors,
  normalizeModerationData,
} from './data/modData';
import {
  actionLabel,
  signalLabel,
  suggestedActionLabel,
  tabLabels,
  tagLabel,
  toneLabel,
} from './utils/labels';
import { riskColor } from './utils/risk';
import './App.css';

const tabs = ['Overview', 'Queue', 'Case', 'Settings'];
const panelWidth = 380;
const panelMargin = 24;

function getStartPosition() {
  if (typeof window === 'undefined') return { x: 28, y: 24 };
  return {
    x: Math.max(panelMargin, window.innerWidth - panelWidth - panelMargin),
    y: panelMargin,
  };
}

export default function App() {
  const [moderationData, setModerationData] = useState(() =>
    normalizeModerationData(fallbackModerationData),
  );
  const queue = useMemo(() => getPriorityQueue(moderationData.comments), [moderationData.comments]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedId, setSelectedId] = useState(queue[0]?.id || moderationData.comments[0]?.id);
  const [caseStatuses, setCaseStatuses] = useState({});
  const [toast, setToast] = useState('');
  const [position, setPosition] = useState(getStartPosition);
  const [dragStart, setDragStart] = useState(null);
  const [assistanceMode, setAssistanceMode] = useState('before');
  const [demoStep, setDemoStep] = useState('idle');
  const [evaluation, setEvaluation] = useState({
    startedAt: null,
    firstCaseSelectedAt: null,
    selectedAction: '',
  });
  const toastTimer = useRef(null);

  const urgentComment = queue[0] || moderationData.comments[0];
  const selectedComment =
    moderationData.comments.find((comment) => comment.id === selectedId) ||
    urgentComment ||
    moderationData.comments[0];
  const showAssistance = assistanceMode === 'after';
  const timeToFirstCase =
    evaluation.startedAt && evaluation.firstCaseSelectedAt
      ? Math.max(0, Math.round((evaluation.firstCaseSelectedAt - evaluation.startedAt) / 1000))
      : null;

  useEffect(() => {
    let isMounted = true;

    fetch('/data/modsignal_cases.json')
      .then((response) => {
        if (!response.ok) throw new Error('Generated dataset cache not found.');
        return response.json();
      })
      .then((payload) => {
        if (!isMounted) return;
        const normalized = normalizeModerationData(payload);
        setModerationData(normalized);
        setSelectedId((current) => {
          if (normalized.comments.some((comment) => comment.id === current)) return current;
          return getPriorityQueue(normalized.comments)[0]?.id || normalized.comments[0]?.id;
        });
      })
      .catch(() => {
        // Fallback data keeps the UI usable before the HuggingFace cache is generated.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function startDemo() {
    const startedAt = Date.now();
    setAssistanceMode('after');
    setDemoStep('highlighted');
    setEvaluation({ startedAt, firstCaseSelectedAt: null, selectedAction: '' });
    setCaseStatuses({});
    if (urgentComment) setSelectedId(urgentComment.id);
    setActiveTab('Overview');
    setPosition(getStartPosition());
    setToast('Demo startad: ModSignal markerar den mest prioriterade grenen.');
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }

  function openCase(id) {
    setSelectedId(id);
    setActiveTab('Case');
    if (demoStep === 'highlighted' || demoStep === 'idle') {
      setDemoStep('case-opened');
    }
    setEvaluation((current) => ({
      ...current,
      firstCaseSelectedAt: current.firstCaseSelectedAt || Date.now(),
    }));
  }

  function handleAction(action) {
    setCaseStatuses((current) => ({ ...current, [selectedId]: action }));
    setEvaluation((current) => ({ ...current, selectedAction: action }));
    setDemoStep('resolved');
    setToast(`${actionLabel(action)} sparad för u/${selectedComment.user}`);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }

  function startDrag(event) {
    if (event.target.closest('button')) return;
    setDragStart({
      pointerX: event.clientX,
      pointerY: event.clientY,
      panelX: position.x,
      panelY: position.y,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePanel(event) {
    if (!dragStart) return;

    const nextX = dragStart.panelX + event.clientX - dragStart.pointerX;
    const nextY = dragStart.panelY + event.clientY - dragStart.pointerY;
    setPosition({
      x: clamp(nextX, 8, window.innerWidth - panelWidth - 8),
      y: clamp(nextY, 8, window.innerHeight - 620),
    });
  }

  function stopDrag() {
    setDragStart(null);
  }

  return (
    <main className="extension-demo">
      <DemoToolbar
        assistanceMode={assistanceMode}
        demoStep={demoStep}
        onModeChange={setAssistanceMode}
        onStartDemo={startDemo}
      />

      <ForumHost
        assistanceMode={assistanceMode}
        caseStatuses={caseStatuses}
        comments={moderationData.comments}
        guidedId={demoStep === 'highlighted' ? urgentComment?.id : ''}
        onSelectComment={openCase}
        selectedId={selectedId}
        thread={moderationData.thread}
      />

      {showAssistance && (
        <section
          className="extension-panel"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          aria-label="ModSignal tilläggspanel"
        >
          <header
            className="extension-header"
            onPointerDown={startDrag}
            onPointerMove={movePanel}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          >
            <BrandMark size={30} />
            <div>
              <strong>ModSignal</strong>
              <span>Stöd för modereringsarbete</span>
            </div>
            <button type="button" onClick={() => setPosition(getStartPosition())}>
              Återställ
            </button>
          </header>

          <nav className="extension-tabs" aria-label="Navigering i tillägget">
            {tabs.map((tab) => (
              <button
                data-active={activeTab === tab}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tabLabels[tab]}
              </button>
            ))}
          </nav>

          <div className="extension-body">
            {activeTab === 'Overview' && (
              <OverviewView
                demoStep={demoStep}
                openCase={openCase}
                overview={moderationData.overview}
                queue={queue}
                selectedId={selectedId}
                setActiveTab={setActiveTab}
                thread={moderationData.thread}
              />
            )}
            {activeTab === 'Queue' && (
              <QueueView
                caseStatuses={caseStatuses}
                openCase={openCase}
                queue={queue}
                selectedId={selectedId}
              />
            )}
            {activeTab === 'Case' && selectedComment && (
              <CaseView
                caseStatus={caseStatuses[selectedId]}
                comment={selectedComment}
                onAction={handleAction}
              />
            )}
            {activeTab === 'Settings' && <SettingsView source={moderationData.source} />}
          </div>
        </section>
      )}

      {demoStep === 'resolved' && (
        <EvaluationSummary
          action={evaluation.selectedAction}
          timeToFirstCase={timeToFirstCase}
          user={selectedComment?.user}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function DemoToolbar({ assistanceMode, demoStep, onModeChange, onStartDemo }) {
  return (
    <aside className="demo-toolbar" aria-label="Demokontroller för moderator">
      <div>
        <strong>MVP-demo för moderering</strong>
        <span>{demoStatusLabel(demoStep)}</span>
      </div>
      <div className="mode-toggle" aria-label="Före- och efterläge">
        <button
          data-active={assistanceMode === 'before'}
          onClick={() => onModeChange('before')}
          type="button"
        >
          Före
        </button>
        <button
          data-active={assistanceMode === 'after'}
          onClick={() => onModeChange('after')}
          type="button"
        >
          Efter
        </button>
      </div>
      <button className="start-demo" onClick={onStartDemo} type="button">
        Starta demo
      </button>
    </aside>
  );
}

function OverviewView({ demoStep, openCase, overview, queue, selectedId, setActiveTab, thread }) {
  const highestRisk = queue[0];

  return (
    <div className="tab-view">
      <section className="panel-card demo-step-card">
        <p className="eyebrow">Guidat flöde</p>
        <h1>{demoStatusLabel(demoStep)}</h1>
        <p className="context-line">
          Använd den markerade diskussionsgrenen, granska ärendets förklaring och välj sedan
          en stödåtgärd.
        </p>
      </section>

      <section className="panel-card overview-top">
        <div>
          <p className="eyebrow">Aktuell tråd</p>
          <h1>{thread.community}</h1>
          <span>{thread.title}</span>
        </div>
        <HeatRing value={overview.heat} />
      </section>

      <section className="quick-stats">
        <Stat label="Signaler" value={overview.alerts} color={modColors.red} />
        <Stat label="Tonläge" value={`${overview.toxicity}%`} color={modColors.amber} />
        <Stat label="Tempo" value={`${overview.velocity}/h`} color={modColors.blue} />
      </section>

      <section className="panel-card">
        <div className="card-title">
          <h2>Högst prioritet</h2>
          {highestRisk && (
            <button type="button" onClick={() => openCase(highestRisk.id)}>
              Öppna
            </button>
          )}
        </div>
        {highestRisk && (
          <PriorityQueue comments={[highestRisk]} selectedId={selectedId} onSelect={openCase} compact />
        )}
      </section>

      <section className="panel-card compact-alerts">
        <div className="card-title">
          <h2>Aktiva signaler</h2>
          <button type="button" onClick={() => setActiveTab('Queue')}>
            Kö
          </button>
        </div>
        <Signal text={`${overview.alerts} kommentarer ligger i stödkön.`} tone="danger" />
        <Signal text="Flera intensiva svar är samlade i ett fåtal synliga grenar." tone="warn" />
        <Signal text="Kommentarer med låg prioritet visas som kontext, inte som bedömningar." tone="info" />
      </section>
    </div>
  );
}

function QueueView({ caseStatuses, openCase, queue, selectedId }) {
  return (
    <div className="tab-view">
      <div className="queue-header">
        <div>
          <p className="eyebrow">Prioritetskö</p>
          <h1>{queue.length} öppna ärenden</h1>
        </div>
        <span>Högst först</span>
      </div>

      <div className="case-list">
        {queue.map((comment) => (
          <button
            className="case-row"
            data-selected={selectedId === comment.id}
            key={comment.id}
            onClick={() => openCase(comment.id)}
            style={{ '--risk': riskColor(comment.flag), '--avatar-hue': comment.avatarHue }}
            type="button"
          >
            <span className="avatar" aria-hidden="true" />
            <span>
              <strong>u/{comment.user}</strong>
              <em>
                {comment.tags.slice(0, 2).map(tagLabel).join(' · ') || toneLabel(comment.tone)}
              </em>
              <small>{comment.text}</small>
            </span>
            <b>{comment.risk}</b>
            {caseStatuses[comment.id] && <i>{actionLabel(caseStatuses[comment.id])}</i>}
          </button>
        ))}
      </div>
    </div>
  );
}

function CaseView({ caseStatus, comment, onAction }) {
  const recommended = comment.suggested_action === 'monitor' ? 'ignore' : 'warn';

  return (
    <div
      className="tab-view case-view"
      style={{ '--risk': riskColor(comment.flag), '--avatar-hue': comment.avatarHue }}
    >
      <section className="panel-card selected-case">
        <div className="case-person">
          <span className="avatar avatar--large" aria-hidden="true" />
          <div>
            <h1>u/{comment.user}</h1>
            <p>
              {comment.karma} karma · för {comment.age} sedan · {comment.reports} rapporter
            </p>
          </div>
          <strong>Risk {comment.risk}</strong>
        </div>
        <blockquote>{comment.text}</blockquote>
        <div className="tag-row">
          {comment.tags.map((tag) => (
            <MicroTag key={tag}>{tagLabel(tag)}</MicroTag>
          ))}
        </div>
      </section>

      <section className="panel-card explain-card">
        <h2>Varför prioriterat</h2>
        <p className="context-line">
          Ärendet lyfts eftersom den härledda risksiffran väger samman synligt tonläge,
          antal rapporter och signaler från svarskedjan.
        </p>
        <div className="score-row">
          <span>Tonläge {comment.toxicity_score}</span>
          <span>Eskalering {comment.escalation_score}</span>
          <span>Rapporter {comment.reports}</span>
        </div>
      </section>

      <section className="panel-card">
        <h2>Bidragande signaler</h2>
        {comment.risk_signals.map((signal) => (
          <Signal key={signal} text={signalLabel(signal)} tone={comment.flag === 'high' ? 'danger' : 'warn'} />
        ))}
        <Signal
          text={`Föreslagen stödåtgärd: ${suggestedActionLabel(comment.suggested_action)}.`}
          tone="info"
        />
      </section>

      <section className="panel-card caution-card">
        <h2>Osäkerhetsnotering</h2>
        <p className="context-line">
          Signalerna bedömer inte användaren och fattar inga beslut. De hjälper moderatorn att
          välja vilken kontext som bör granskas först.
        </p>
      </section>

      <section className="panel-card">
        <h2>Kontext</h2>
        <p className="context-line">
          <strong>Tråd:</strong> {comment.thread_title}
        </p>
        <p className="context-line">
          <strong>Föregående:</strong> {comment.parent_comment || 'Toppnivåkommentar'}
        </p>
      </section>

      <section className="panel-card">
        <div className="card-title">
          <h2>Beslut</h2>
          {caseStatus && <span className="case-status">{actionLabel(caseStatus)}</span>}
        </div>
        <ActionButtons lastAction={caseStatus} onAction={onAction} recommended={recommended} />
      </section>
    </div>
  );
}

function SettingsView({ source }) {
  return (
    <div className="tab-view settings-view">
      <section className="panel-card">
        <h1>Inställningar</h1>
        <label>
          <span>Markera kommentarer som behöver granskas</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label>
          <span>Visa bekräftelse efter modereringsåtgärd</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label>
          <span>Öppna ärende från markerad kommentar</span>
          <input type="checkbox" defaultChecked />
        </label>
      </section>

      <section className="panel-card">
        <h2>Prototypläge</h2>
        <p className="context-line">
          Datakälla: {source?.dataset || 'fallback'} / {source?.config || 'local'}.
        </p>
        <p className="context-line">
          Poäng och åtgärder är härledda stödsignaler för modereringsarbete.
        </p>
      </section>
    </div>
  );
}

function EvaluationSummary({ action, timeToFirstCase, user }) {
  return (
    <aside className="evaluation-summary" aria-label="Sammanfattning av demotest">
      <p className="eyebrow">Testsammanfattning</p>
      <strong>Ärende granskat</strong>
      <span>Första ärende valt: {timeToFirstCase ?? 0}s</span>
      <span>Vald åtgärd: {actionLabel(action || 'reviewed')}</span>
      <span>Granskat ärende: u/{user}</span>
    </aside>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong style={{ color }}>{value}</strong>
    </div>
  );
}

function Signal({ text, tone }) {
  return <p className={`signal signal--${tone}`}>{text}</p>;
}

function demoStatusLabel(step) {
  if (step === 'highlighted') return 'Mest prioriterad gren markerad';
  if (step === 'case-opened') return 'Ärendeförklaring öppen';
  if (step === 'resolved') return 'Granskad status sparad';
  return 'Före/efter-jämförelse redo';
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}
