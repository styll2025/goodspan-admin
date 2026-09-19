import { useMemo, useState } from 'react';
import { db } from '../../../db.skill';
import { span } from '../../../dashboardData';
import { Member } from '../../../types';
import { MemberForm } from './MemberForm';
import { MemberTable } from './MemberTable';
import { MemberFormData, useMembersData } from './useMembersData';

type MemberListProps = {
  spanId: string;
};

export function MemberList({ spanId }: MemberListProps) {
  const {
    members,
    filteredMembers,
    loading,
    searchQuery,
    setSearchQuery,
    addMember,
    updateMember,
    deleteMember,
  } = useMembersData(spanId);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const circles = useMemo(() => db.getCirclesBySpan(spanId), [spanId, members]);

  const handleAddClick = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    if (!window.confirm(`Delete ${member.name}? This will also remove their selections and feedback.`)) return;
    deleteMember(member.id);
  };

  const handleSave = (data: MemberFormData) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      addMember(data);
    }
    setIsFormOpen(false);
    setEditingMember(null);
  };

  return (
    <section>
      <div className="flex items-start justify-between gap-6 border-b border-goodspan-line pb-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">{span.label}</p>
          <h1 className="text-[30px] font-black leading-none tracking-[-0.06em] text-goodspan-ink">Members</h1>
        </div>

        <div className="flex gap-2">
          <button className="border border-goodspan-line px-5 py-2 text-sm font-black text-goodspan-ink">
            Upload list
          </button>
          <button onClick={handleAddClick} className="bg-goodspan-orange px-5 py-2 text-sm font-black text-white">
            New member
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 py-5">
        <label className="block">
          <span className="mb-2 block text-xs text-neutral-600">Search</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-64 border border-goodspan-line bg-transparent px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
            placeholder="Name or email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs text-neutral-600">Plan</span>
          <select className="w-44 border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none">
            <option>All members</option>
            <option>With plan</option>
            <option>No plan</option>
          </select>
        </label>

        <p className="pb-2 text-xs text-neutral-600">
          {filteredMembers.length} of {members.length} shown
        </p>
      </div>

      {loading ? (
        <div className="border-t border-goodspan-line py-10 text-sm text-neutral-600">Loading members...</div>
      ) : (
        <MemberTable members={filteredMembers} circles={circles} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}

      {isFormOpen ? (
        <MemberForm member={editingMember} onCancel={() => setIsFormOpen(false)} onSave={handleSave} />
      ) : null}
    </section>
  );
}
