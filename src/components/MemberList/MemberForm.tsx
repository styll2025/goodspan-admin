import { FormEvent, useEffect, useState } from 'react';
import { Member, Pillar } from '../../../types';
import { MemberFormData } from './useMembersData';

const pillarOptions: Array<{ value: Pillar; label: string }> = [
  { value: 'sleep', label: 'GoodSleep' },
  { value: 'eat', label: 'GoodEat' },
  { value: 'move', label: 'GoodMove' },
  { value: 'mind', label: 'GoodMind' },
];

type MemberFormProps = {
  member: Member | null;
  onCancel: () => void;
  onSave: (data: MemberFormData) => void;
};

export function MemberForm({ member, onCancel, onSave }: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    pillar: 'sleep',
  });

  useEffect(() => {
    setFormData({
      name: member?.name || '',
      email: member?.email || '',
      pillar: member?.pillar || 'sleep',
    });
  }, [member]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      name: formData.name.trim(),
      email: formData.email.trim(),
      pillar: formData.pillar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg border border-goodspan-line bg-goodspan-bg p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-goodspan-line pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Member</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-goodspan-ink">
              {member ? 'Edit member' : 'New member'}
            </h2>
          </div>
          <button type="button" onClick={onCancel} className="text-sm font-black text-goodspan-orange">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Name</span>
            <input
              required
              value={formData.name}
              onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
              className="w-full border border-goodspan-line bg-transparent px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
              placeholder="Sofia Morazzo"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Email</span>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
              className="w-full border border-goodspan-line bg-transparent px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
              placeholder="sofia@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Pillar</span>
            <select
              value={formData.pillar}
              onChange={(event) => setFormData((current) => ({ ...current, pillar: event.target.value as Pillar }))}
              className="w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
            >
              {pillarOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="border border-goodspan-line px-5 py-2 text-sm font-black">
            Cancel
          </button>
          <button type="submit" className="bg-goodspan-orange px-5 py-2 text-sm font-black text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
