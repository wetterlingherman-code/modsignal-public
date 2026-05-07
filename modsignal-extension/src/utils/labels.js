export const tabLabels = {
  Overview: 'Översikt',
  Queue: 'Kö',
  Case: 'Ärende',
  Settings: 'Inställningar',
};

export const actionLabels = {
  ignore: 'Ignorera',
  warn: 'Varna',
  remove: 'Ta bort',
  escalate: 'Eskalera',
  reviewed: 'Granskad',
  open: 'Öppen',
  background: 'Bakgrund',
};

export const toneLabels = {
  neutral: 'neutral',
  skeptical: 'skeptisk',
  heated: 'upptrappad',
  corrective: 'korrigerande',
  supportive: 'stödjande',
};

export const tagLabels = {
  watch: 'bevaka',
  'cluster anchor': 'klusterpunkt',
  '2 reports': '2 rapporter',
  '1 report': '1 rapport',
  'heated branch': 'upptrappad gren',
  'priority review': 'prioriterad granskning',
  'escalating tone': 'eskalerande ton',
  'context needed': 'kräver kontext',
  'reply chain': 'svarskedja',
};

export function actionLabel(action) {
  return actionLabels[action] || action || 'Ej vald';
}

export function statusLabel(status) {
  return actionLabels[status] || status;
}

export function toneLabel(tone) {
  return toneLabels[tone] || tone || 'neutral';
}

export function tagLabel(tag) {
  return tagLabels[tag] || tag.replace('reports', 'rapporter').replace('report', 'rapport');
}

export function suggestedActionLabel(action) {
  if (action === 'warn') return 'varna';
  if (action === 'monitor') return 'bevaka';
  if (action === 'review context') return 'granska kontext';
  if (action === 'no action') return 'ingen åtgärd';
  return action || 'granska kontext';
}

export function signalLabel(signal) {
  const signalMap = {
    'Strong language terms detected in public comment text.':
      'Starka formuleringar identifierades i kommentaren.',
    'Language intensity suggests a discussion may be heating up.':
      'Språkintensiteten tyder på att diskussionen kan vara på väg att trappas upp.',
    'Punctuation pattern suggests rising emotional intensity.':
      'Interpunktion och tonläge tyder på ökad intensitet.',
    'Long argumentative comment may anchor a reply chain.':
      'Lång argumenterande kommentar kan fungera som startpunkt för en svarskedja.',
    'Low visible escalation signals; keep as background context.':
      'Få synliga eskaleringssignaler; behåll som bakgrundskontext.',
    'Low visible escalation signals; keep as context.':
      'Få synliga eskaleringssignaler; behåll som kontext.',
    'High engagement comment anchoring a fast-moving branch.':
      'Kommentar med högt engagemang fungerar som klusterpunkt i en snabb gren.',
    'Directly adversarial phrasing in an active reply branch.':
      'Konfrontativ formulering i en aktiv svarstråd.',
    'Multiple reports on the same branch.':
      'Flera rapporter i samma diskussionsgren.',
    'Reply chain depth is increasing around a high-risk comment.':
      'Svarskedjan växer runt en kommentar med hög prioritet.',
    'Derived prototype signal.': 'Härledd prototypsignal.',
  };

  return signalMap[signal] || signal;
}
