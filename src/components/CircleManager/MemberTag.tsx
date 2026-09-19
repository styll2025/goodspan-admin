import { Member, Pillar } from '../../../types';

const pillarLabels: Record<Pillar, string> = {
  sleep: 'GoodSleep',
  eat: 'GoodEat',
  move: 'GoodMove',
  mind: 'GoodMind',
};

type MemberTagProps = {
  member: Member;
  onRemove?: (memberId: string) => void;
};

export function MemberTag({ member, onRemove }: MemberTagProps) {
  return (
    <div className="flex items-center justify-between border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm">
      <span className="font-semibold tracking-[-0.03em] text-goodspan-ink">{member.name}</span>
      <span className="flex items-center gap-3 text-xs text-neutral-500">
        {pillarLabels[member.pillar]}
        {onRemove ? (
          <button onClick={() => onRemove(member.id)} className="font-black text-goodspan-orange">
            ×
          </button>
        ) : null}
      </span>
    </div>
  );
}
