import { modColors } from '../data/modData';

export default function HeatRing({ value, size = 56, light = false }) {
  const track = light ? 'oklch(0.92 0.01 80)' : 'oklch(0.27 0.01 250)';
  const center = light ? '#ffffff' : 'var(--panel)';

  return (
    <div
      className="heat-ring"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${modColors.red} 0 ${value}%, ${track} ${value}% 100%)`,
      }}
    >
      <span style={{ background: center, color: modColors.red }}>{value}</span>
    </div>
  );
}
