import { useEffect, useMemo, useState } from 'react';
import { createId, db } from '../../../db.skill';
import { Circle, Member, Pillar } from '../../../types';

export function useCirclesData(spanId: string) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    setCircles(db.getCirclesBySpan(spanId));
    setMembers(db.getMembersBySpan(spanId));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [spanId]);

  const unassignedMembers = useMemo(() => members.filter((member) => !member.circleId), [members]);

  const getMembersInCircle = (circleId: string) => {
    return members.filter((member) => member.circleId === circleId);
  };

  const createCircle = (name: string, pillarId: Pillar) => {
    const circle = db.createCircle({
      id: createId('circle'),
      spanId,
      name,
      pillarId,
    });
    setCircles((current) => [...current, circle].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const deleteCircle = (circleId: string) => {
    db.deleteCircle(circleId);
    setCircles((current) => current.filter((circle) => circle.id !== circleId));
    setMembers((current) =>
      current.map((member) => (member.circleId === circleId ? { ...member, circleId: undefined } : member)),
    );
  };

  const addMemberToCircle = (memberId: string, circleId: string) => {
    db.addMemberToCircle(memberId, circleId);
    setMembers((current) => current.map((member) => (member.id === memberId ? { ...member, circleId } : member)));
  };

  const removeMemberFromCircle = (memberId: string) => {
    db.removeMemberFromCircle(memberId);
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, circleId: undefined } : member)),
    );
  };

  return {
    circles,
    members,
    unassignedMembers,
    loading,
    getMembersInCircle,
    createCircle,
    deleteCircle,
    addMemberToCircle,
    removeMemberFromCircle,
    reload: loadData,
  };
}
