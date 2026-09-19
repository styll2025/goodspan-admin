import { useEffect, useMemo, useState } from 'react';
import { createId, db } from '../../../db.skill';
import { practicesLib } from '../../../practices.skill';
import { Member, Pillar, Practice, PracticeSelection } from '../../../types';

export type PracticeFilters = {
  pillar: Pillar | 'all';
  level: Practice['level'] | 'all';
  category: string;
  query: string;
};

export function usePracticeSelection(spanId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selections, setSelections] = useState<PracticeSelection[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PracticeFilters>({
    pillar: 'all',
    level: 'all',
    category: 'all',
    query: '',
  });

  const loadData = () => {
    const loadedMembers = db.getMembersBySpan(spanId);
    setMembers(loadedMembers);
    setSelections(db.getPracticeSelectionsBySpan(spanId));
    setSelectedMemberId((current) => current || loadedMembers[0]?.id || null);
  };

  useEffect(() => {
    loadData();
  }, [spanId]);

  const selectedMember = members.find((member) => member.id === selectedMemberId) || null;

  const getSelectionsForMember = (memberId: string) => {
    return selections
      .filter((selection) => selection.memberId === memberId && selection.spanId === spanId)
      .sort((a, b) => a.position - b.position);
  };

  const selectedMemberSelections = selectedMember ? getSelectionsForMember(selectedMember.id) : [];

  const categories = useMemo(() => {
    const pillar = selectedMember?.pillar || 'sleep';
    const practices = practicesLib.getAllPractices(pillar);
    return Array.from(new Set(practices.map((practice) => practice.category))).sort();
  }, [selectedMember]);

  const availablePractices = useMemo(() => {
    if (!selectedMember) return [];

    const pillar = filters.pillar === 'all' ? selectedMember.pillar : filters.pillar;
    const selectedTexts = new Set(selectedMemberSelections.map((selection) => selection.practiceText));
    const query = filters.query.trim().toLowerCase();

    return practicesLib
      .getAllPractices(pillar)
      .filter((practice) => !selectedTexts.has(practice.text))
      .filter((practice) => (filters.level === 'all' ? true : practice.level === filters.level))
      .filter((practice) => (filters.category === 'all' ? true : practice.category === filters.category))
      .filter((practice) => {
        if (!query) return true;
        return (
          practice.text.toLowerCase().includes(query) ||
          practice.category.toLowerCase().includes(query) ||
          practice.why.toLowerCase().includes(query)
        );
      });
  }, [filters, selectedMember, selectedMemberSelections]);

  const addPractice = (practice: Practice, isStartWithThis = false) => {
    if (!selectedMember) return;
    const currentSelections = getSelectionsForMember(selectedMember.id);
    if (currentSelections.length >= 5) return;

    const selection = db.createPracticeSelection({
      id: createId('selection'),
      memberId: selectedMember.id,
      spanId,
      pillar: filters.pillar === 'all' ? selectedMember.pillar : filters.pillar,
      category: practice.category,
      practiceText: practice.text,
      position: (currentSelections.length + 1) as PracticeSelection['position'],
      isStartWithThis,
    });
    setSelections((current) => [...current, selection]);
  };

  const removePractice = (selectionId: string) => {
    const removed = selections.find((selection) => selection.id === selectionId);
    db.deletePracticeSelection(selectionId);
    const remaining = selections.filter((selection) => selection.id !== selectionId);

    if (removed) {
      const memberSelections = remaining
        .filter((selection) => selection.memberId === removed.memberId && selection.spanId === removed.spanId)
        .sort((a, b) => a.position - b.position);

      memberSelections.forEach((selection, index) => {
        const nextPosition = (index + 1) as PracticeSelection['position'];
        if (selection.position !== nextPosition) {
          db.updatePracticeSelection(selection.id, { position: nextPosition });
          selection.position = nextPosition;
        }
      });
    }

    setSelections([...remaining]);
  };

  const toggleStartWithThis = (selectionId: string) => {
    const selection = selections.find((item) => item.id === selectionId);
    if (!selection) return;

    const memberSelections = getSelectionsForMember(selection.memberId);
    memberSelections.forEach((item) => {
      const isStartWithThis = item.id === selectionId ? !item.isStartWithThis : false;
      db.updatePracticeSelection(item.id, { isStartWithThis });
    });

    setSelections((current) =>
      current.map((item) =>
        item.memberId === selection.memberId
          ? { ...item, isStartWithThis: item.id === selectionId ? !selection.isStartWithThis : false }
          : item,
      ),
    );
  };

  const completedCount = members.filter((member) => getSelectionsForMember(member.id).length === 5).length;

  return {
    members,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
    selections,
    selectedMemberSelections,
    availablePractices,
    categories,
    filters,
    setFilters,
    addPractice,
    removePractice,
    toggleStartWithThis,
    getSelectionsForMember,
    completedCount,
  };
}
