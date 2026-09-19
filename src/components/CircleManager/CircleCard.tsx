import { ChangeEvent } from 'react';
import { Circle, Member } from '../../../types';
import { MemberTag } from './MemberTag';

type CircleCardProps = {
  circle: Circle;
  members: Member[];
  unassignedMembers: Member[];
  onAddMember: (memberId: string, circleId: string) => void;
  onRemoveMember: (memberId: string) => void;
  onDeleteCircle: (circleId: string) => void;
};

export function CircleCard({
  circle,
  members,
  unassignedMembers,
  onAddMember,
  onRemoveMember,
  onDeleteCircle,
}: CircleCardProps) {
  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    const memberId = event.target.value;
    if (!memberId) return;
    onAddMember(memberId, circle.id);
    event.target.value = '';
  };

  return (
    <article className="min-w-[230px]">
      <div className="mb-4 flex items-center justify-between border-b border-goodspan-line pb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black tracking-[-0.03em] text-goodspan-ink">{circle.name}</h2>
          <span className="text-xs text-neutral-600">{members.length}</span>
        </div>
        <button onClick={() => onDeleteCircle(circle.id)} className="text-xs font-black text-goodspan-orange">
          ×
        </button>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <MemberTag key={member.id} member={member} onRemove={onRemoveMember} />
        ))}
      </div>

      <select
        onChange={handleAdd}
        className="mt-3 w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-xs outline-none"
        defaultValue=""
      >
        <option value="">Add unassigned member</option>
        {unassignedMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      <button className="mt-3 w-full border border-goodspan-line px-3 py-2 text-xs font-black text-goodspan-ink">
        Download overview (PDF)
      </button>
    </article>
  );
}
