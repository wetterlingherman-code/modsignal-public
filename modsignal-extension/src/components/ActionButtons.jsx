import { actionLabel } from '../utils/labels';

const actions = [
  { id: 'ignore', icon: 'i' },
  { id: 'warn', icon: '!' },
  { id: 'remove', icon: '-' },
  { id: 'escalate', icon: '^' },
];

export default function ActionButtons({ recommended = 'warn', lastAction, onAction }) {
  return (
    <div className="action-grid" aria-label="Modereringsåtgärder">
      {actions.map((action) => (
        <button
          className={`action-button action-button--${action.id}`}
          data-recommended={recommended === action.id}
          data-active={lastAction === action.id}
          key={action.id}
          onClick={() => onAction(action.id)}
          type="button"
        >
          <span aria-hidden="true">{action.icon}</span>
          {actionLabel(action.id)}
        </button>
      ))}
    </div>
  );
}
