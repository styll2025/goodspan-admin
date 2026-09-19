import { Circle, Member } from '../../../types';
import { CircleCard } from './CircleCard';
import { MemberTag } from './MemberTag';

type CircleBoardProps = {
  circles: Circle[];
  unassignedMembers: Member[];
  getMembersInCircle: (circleId: string) => Member[];
  onAddMember: (memberId: string, circleId: string) => void;
  onRemoveMember: (memberId: string) => void;
  onDeleteCircle: (circleId: string) => void;
};

export function CircleBoard({
  circles,
  unassignedMembers,
  getMembersInCircle,
  onAddMember,
  onRemoveMember,
  onDeleteCircle,
}: CircleBoardProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-7">
        <article className="min-w-[230px]">
          <div className="mb-4 flex items-center justify-between border-b border-goodspan-line pb-3">
            <h2 className="text-sm font-black tracking-[-0.03em] text-goodspan-ink">Unassigned</h2>
            <span className="text-xs text-neutral-600">{unassignedMembers.length}</span>
          </div>

          <div className="space-y-2">
            {unassignedMembers.map((member) => (
              <MemberTag key={member.id} member={member} />
            ))}
          </div>
        </article>

        {circles.map((circle) => (
          <CircleCard
            key={circle.id}
            circle={circle}
            members={getMembersInCircle(circle.id)}
            unassignedMembers={unassignedMembers}
            onAddMember={onAddMember}
            onRemoveMember={onRemoveMember}
            onDeleteCircle={onDeleteCircle}
          />
        ))}
      </div>
    </div>
  );
}
