import ActionButtons from './ActionButtons';
import MicroTag from './MicroTag';
import { modColors } from '../data/modData';
import { actionLabel, tagLabel } from '../utils/labels';
import { riskColor, riskLabel } from '../utils/risk';

export default function CommentDetail({ comment, lastAction, onAction }) {
  return (
    <section className="comment-detail" style={{ '--risk': riskColor(comment.flag) }}>
      <div className="detail-header">
        <span
          className="avatar avatar--large"
          aria-hidden="true"
          style={{ '--avatar-hue': comment.avatarHue }}
        />
        <div>
          <h3>u/{comment.user}</h3>
          <p>
            {comment.karma} karma · för {comment.age} sedan · {comment.reports} rapporter
          </p>
        </div>
        <span className="detail-risk">
          Risk {comment.risk}
          <small>{riskLabel(comment.flag)}</small>
        </span>
      </div>

      <blockquote>{comment.text}</blockquote>

      <div className="tag-row">
        {comment.tags.map((tag) => (
          <MicroTag key={tag}>{tagLabel(tag)}</MicroTag>
        ))}
      </div>

      <div className="context-box">
        <h4>Samtalskontext</h4>
        <p>
          <strong>u/policy_wonk_22</strong> bad om en källänk tidigare i tråden.
        </p>
        <p>
          <strong>u/{comment.user}</strong> skrev den markerade kommentaren.
        </p>
        <p>
          <strong>u/tea_and_truth</strong> rapporterade ett återkommande mönster.
        </p>
      </div>

      <div className="suggestion-box">
        <span>Föreslagen åtgärd</span>
        <strong>Varna användaren och ta bort kommentaren</strong>
        <p>
          Mönstret kombinerar språkintensitet, användarrapporter och kontokontext. Beslutet
          bör vara möjligt att ompröva i MVP-demot.
        </p>
      </div>

      <ActionButtons lastAction={lastAction} onAction={onAction} recommended="warn" />

      {lastAction && (
        <p className="action-feedback">
          Vald åtgärd: <strong style={{ color: modColors.blue }}>{actionLabel(lastAction)}</strong>
        </p>
      )}
    </section>
  );
}
