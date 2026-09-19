import { FormEvent, useState } from 'react';
import { span } from '../../../dashboardData';
import { Pillar } from '../../../types';
import { CircleBoard } from './CircleBoard';
import { useCirclesData } from './useCirclesData';

const pillarOptions: Array<{ value: Pillar; label: string }> = [
  { value: 'sleep', label: 'GoodSleep' },
  { value: 'eat', label: 'GoodEat' },
  { value: 'move', label: 'GoodMove' },
  { value: 'mind', label: 'GoodMind' },
];

type CircleManagerProps = {
  spanId: string;
};

export function CircleManager({ spanId }: CircleManagerProps) {
  const {
    circles,
    unassignedMembers,
    loading,
    getMembersInCircle,
    createCircle,
    deleteCircle,
    addMemberToCircle,
    removeMemberFromCircle,
  } = useCirclesData(spanId);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [pillarId, setPillarId] = useState<Pillar>('eat');

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    createCircle(trimmedName, pillarId);
    setName('');
    setPillarId('eat');
    setIsCreating(false);
  };

  const handleDeleteCircle = (circleId: string) => {
    if (!window.confirm('Delete this circle? Members will become unassigned.')) return;
    deleteCircle(circleId);
  };

  return (
    <section>
      <div className="flex items-start justify-between gap-6 border-b border-goodspan-line pb-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">{span.label}</p>
          <h1 className="text-[30px] font-black leading-none tracking-[-0.06em] text-goodspan-ink">Circles</h1>
          <p className="mt-2 text-sm text-neutral-600">Assign members between circles using the controls below.</p>
        </div>

        <button onClick={() => setIsCreating(true)} className="bg-goodspan-orange px-5 py-2 text-sm font-black text-white">
          New circle
        </button>
      </div>

      <div className="pt-6">
        {loading ? (
          <div className="border-t border-goodspan-line py-10 text-sm text-neutral-600">Loading circles...</div>
        ) : (
          <CircleBoard
            circles={circles}
            unassignedMembers={unassignedMembers}
            getMembersInCircle={getMembersInCircle}
            onAddMember={addMemberToCircle}
            onRemoveMember={removeMemberFromCircle}
            onDeleteCircle={handleDeleteCircle}
          />
        )}
      </div>

      {isCreating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <form onSubmit={handleCreate} className="w-full max-w-lg border border-goodspan-line bg-goodspan-bg p-6 shadow-xl">
            <div className="mb-6 border-b border-goodspan-line pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Circle</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-goodspan-ink">New circle</h2>
            </div>

            <label className="mb-4 block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Name</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-goodspan-line bg-transparent px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
                placeholder="GoodEat"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Pillar</span>
              <select
                value={pillarId}
                onChange={(event) => setPillarId(event.target.value as Pillar)}
                className="w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
              >
                {pillarOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCreating(false)} className="border border-goodspan-line px-5 py-2 text-sm font-black">
                Cancel
              </button>
              <button type="submit" className="bg-goodspan-orange px-5 py-2 text-sm font-black text-white">
                Create
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
