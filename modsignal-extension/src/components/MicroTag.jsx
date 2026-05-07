import { tagKind } from '../utils/risk';

export default function MicroTag({ children, kind = tagKind(String(children)) }) {
  return <span className={`micro-tag micro-tag--${kind}`}>{children}</span>;
}
