import MicroTag from './MicroTag';
import { riskColor, riskLabel } from '../utils/risk';
import { tagLabel } from '../utils/labels';

export default function PriorityQueue({ comments, selectedId, onSelect, compact = false }) {
  return (
    <div className={compact ? 'queue-list queue-list--compact' : 'queue-list'}>
      {comments.map((comment) => (
        <button
          className="queue-item"
          data-selected={selectedId === comment.id}
          key={comment.id}
          onClick={() => onSelect(comment.id)}
          style={{ '--risk': riskColor(comment.flag) }}
          type="button"
        >
          <span className="queue-accent" aria-hidden="true" />
          <span
            className="avatar"
            aria-hidden="true"
            style={{ '--avatar-hue': comment.avatarHue }}
          />
          <span className="queue-copy">
            <span className="queue-meta">
              <strong>u/{comment.user}</strong>
              <span>{comment.age}</span>
              <span>{comment.karma}</span>
            </span>
            <span className="queue-text">{comment.text}</span>
            {!compact && (
              <span className="queue-tags">
                {comment.tags.map((tag) => (
                  <MicroTag key={tag}>{tagLabel(tag)}</MicroTag>
                ))}
              </span>
            )}
          </span>
          <span className="risk-score">
            <strong>{comment.risk}</strong>
            <span>{riskLabel(comment.flag)}</span>
            {comment.reports > 0 && <em>{comment.reports} rapporter</em>}
          </span>
        </button>
      ))}
    </div>
  );
}
