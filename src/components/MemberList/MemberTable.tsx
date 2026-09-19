import { Circle, Member, Pillar } from '../../../types';

const pillarLabels: Record<Pillar, string> = {
  sleep: 'GoodSleep',
  eat: 'GoodEat',
  move: 'GoodMove',
  mind: 'GoodMind',
};

type MemberTableProps = {
  members: Member[];
  circles: Circle[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
};

export function MemberTable({ members, circles, onEdit, onDelete }: MemberTableProps) {
  const circleNames = new Map(circles.map((circle) => [circle.id, circle.name]));

  if (members.length === 0) {
    return (
      <div className="border-t border-goodspan-line py-10 text-sm text-neutral-600">
        No members match the current search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-goodspan-line text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
            <th className="px-3 py-4 font-bold">Name</th>
            <th className="px-3 py-4 font-bold">Contact</th>
            <th className="px-3 py-4 font-bold">Pillar</th>
            <th className="px-3 py-4 font-bold">Circle</th>
            <th className="px-3 py-4 font-bold">Status</th>
            <th className="px-3 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-goodspan-line">
              <td className="px-3 py-4 font-black tracking-[-0.03em] text-goodspan-ink">{member.name}</td>
              <td className="px-3 py-4 text-neutral-600">{member.email}</td>
              <td className="px-3 py-4 text-goodspan-ink">{pillarLabels[member.pillar]}</td>
              <td className="px-3 py-4 text-neutral-600">
                {member.circleId ? circleNames.get(member.circleId) || 'Unknown circle' : 'Unassigned'}
              </td>
              <td className="px-3 py-4">
                <span className="bg-orange-50 px-3 py-1 text-xs font-bold text-goodspan-ink">Active</span>
              </td>
              <td className="px-3 py-4 text-right">
                <button onClick={() => onEdit(member)} className="mr-4 text-sm font-black text-goodspan-orange">
                  Open
                </button>
                <button onClick={() => onDelete(member)} className="text-sm font-black text-goodspan-orange">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
