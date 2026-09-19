import { useEffect, useMemo, useState } from 'react';
import { createId, db } from '../../../db.skill';
import { Member, Pillar } from '../../../types';

type MemberFormData = {
  name: string;
  email: string;
  pillar: Pillar;
};

export function useMembersData(spanId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMembers = () => {
    setLoading(true);
    setMembers(db.getMembersBySpan(spanId));
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, [spanId]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => {
      return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
    });
  }, [members, searchQuery]);

  const addMember = (data: MemberFormData) => {
    const member = db.createMember({
      id: createId('member'),
      spanId,
      name: data.name,
      email: data.email,
      pillar: data.pillar,
    });
    setMembers((current) => [...current, member].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const updateMember = (memberId: string, data: MemberFormData) => {
    db.updateMember(memberId, data);
    setMembers((current) =>
      current
        .map((member) => (member.id === memberId ? { ...member, ...data, updatedAt: new Date().toISOString() } : member))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  };

  const deleteMember = (memberId: string) => {
    db.deleteMember(memberId);
    setMembers((current) => current.filter((member) => member.id !== memberId));
  };

  return {
    members,
    filteredMembers,
    loading,
    searchQuery,
    setSearchQuery,
    addMember,
    updateMember,
    deleteMember,
    reload: loadMembers,
  };
}

export type { MemberFormData };
