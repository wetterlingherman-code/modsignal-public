import { riskColor, riskLabel } from '../utils/risk';
import { statusLabel, toneLabel } from '../utils/labels';

export default function ForumHost({
  assistanceMode,
  caseStatuses,
  comments,
  guidedId,
  selectedId,
  onSelectComment,
  thread,
}) {
  const showAssistance = assistanceMode === 'after';

  return (
    <section
      className="reddit-page"
      data-assistance={assistanceMode}
      aria-label="Mock Reddit thread"
    >
      <nav className="reddit-nav">
        <div className="reddit-brand">
          <span>r</span>
          reddit
        </div>
        <div className="reddit-search">Sök på Reddit</div>
        <button type="button">Skapa</button>
        <div className="reddit-user">Mod</div>
      </nav>

      <div className="reddit-thread">
        <main className="thread-column">
          <section className="subreddit-card">
            <div>
              <strong>r/{thread.community}</strong>
              <p>Diskussionsyta med aktiv moderering av tonläge och källkvalitet.</p>
            </div>
            <span>4.2M medlemmar</span>
            <span>18.4k aktiva</span>
            <span>{comments.filter((comment) => comment.flag).length} kommentarer behöver kontext</span>
          </section>

          <article className="post-card">
            <span>
              Publicerat av u/{thread.author} · {thread.posted}
            </span>
            <h1>{thread.title}</h1>
            <p>{threadBodyLabel(thread.body)}</p>
            <div>
              <button type="button">{thread.upvotes} röster</button>
              <button type="button">{thread.commentCount} kommentarer</button>
              <button type="button">Dela</button>
            </div>
          </article>

          <div className="comment-sort">
            <strong>Kommentarer</strong>
            <span>Sortera efter: kontroversiellt</span>
          </div>

          <div className="thread-comments">
            {comments.map((comment) => {
              const status = caseStatuses[comment.id] || comment.status;
              const flagged = showAssistance && Boolean(comment.flag);
              const selected = showAssistance && selectedId === comment.id;
              const guided = showAssistance && guidedId === comment.id;

              return (
                <article
                  className="thread-comment"
                  data-flagged={flagged}
                  data-guided={guided}
                  data-risk={comment.flag || 'clear'}
                  data-selected={selected}
                  data-status={status}
                  key={comment.id}
                  style={{
                    '--depth': comment.depth,
                    '--risk': riskColor(comment.flag),
                    '--avatar-hue': comment.avatarHue,
                  }}
                >
                  <button
                    className="comment-shell"
                    disabled={!flagged}
                    onClick={() => flagged && onSelectComment(comment.id)}
                    type="button"
                  >
                    <span className="comment-rail" aria-hidden="true" />
                    <span className="comment-content">
                      <span className="comment-meta">
                        <span className="avatar" aria-hidden="true" />
                        <strong>u/{comment.user}</strong>
                        <span>{comment.age}</span>
                        <span>{comment.votes} röster</span>
                        <span className="tone-pill">{toneLabel(comment.tone)}</span>
                        {showAssistance && comment.flag && (
                          <em>
                            {riskLabel(comment.flag)} · {comment.risk}
                            {comment.reports > 0 && ` · ${comment.reports} rapporter`}
                          </em>
                        )}
                        {showAssistance &&
                          status &&
                          status !== 'open' &&
                          status !== 'background' && <i>{statusLabel(status)}</i>}
                      </span>
                      <span className="comment-text">{comment.text}</span>
                      {comment.parent_comment && (
                        <span className="parent-context">
                          svar i gren: {comment.parent_comment.slice(0, 94)}
                          {comment.parent_comment.length > 94 ? '...' : ''}
                        </span>
                      )}
                      <span className="comment-tools">
                        <span>Svara</span>
                        <span>Utmärk</span>
                        <span>Dela</span>
                        {flagged && <strong>Öppna ärende i ModSignal</strong>}
                      </span>
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </section>
  );
}

function threadBodyLabel(body) {
  if (body?.startsWith('Prototype thread built from')) {
    return 'Prototyptråd byggd från ett mindre urval av skandinaviska Reddit-kommentarer. Modereringssignalerna är härledda från synlig text.';
  }

  return body;
}
