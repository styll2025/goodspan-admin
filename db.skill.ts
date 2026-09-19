import { Circle, FeedbackEntry, Member, PracticeSelection, Span } from './types';

type StoreShape = {
  spans: Span[];
  members: Member[];
  circles: Circle[];
  practiceSelections: PracticeSelection[];
  feedback: FeedbackEntry[];
};

const STORE_KEY = 'goodspan-admin-store-v1';
const SPAN_ID = 'sep-2026';

const now = '2026-09-14T00:00:00.000Z';

const seedSpans: Span[] = [
  {
    id: SPAN_ID,
    name: 'Sep 2026',
    pillar: 'mind',
    startDate: '2026-09-14',
    endDate: '2026-10-16',
    createdAt: now,
    updatedAt: now,
  },
];

const seedCircles: Circle[] = [
  { id: 'circle-goodeat', spanId: SPAN_ID, pillarId: 'eat', name: 'GoodEat', createdAt: now },
  { id: 'circle-goodmove', spanId: SPAN_ID, pillarId: 'move', name: 'GoodMove', createdAt: now },
  { id: 'circle-goodmind', spanId: SPAN_ID, pillarId: 'mind', name: 'GoodMind', createdAt: now },
  { id: 'circle-goodsleep', spanId: SPAN_ID, pillarId: 'sleep', name: 'GoodSleep', createdAt: now },
];

const memberSeed: Array<Pick<Member, 'name' | 'email' | 'pillar' | 'circleId'>> = [
  { name: 'Sofia Morazzo', email: 'sf.morazzo@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Luisa Cariano', email: 'luisa.m.cariano@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Mattéo Girault', email: 'matteo.girault2000@gmail.com', pillar: 'eat', circleId: 'circle-goodmind' },
  { name: 'Julia', email: 'hoopla.jule@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Isabel', email: 'izabella.getsu@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Yvonne', email: 'yvonne.knap@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Teresa Cutelo', email: 'teresa.cv.cutelo@gmail.com', pillar: 'move' },
  { name: 'Farimah Milani', email: 'milanifarimah@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
  { name: 'Ivana Istochka', email: 'ivanaistochka@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Vanessa', email: 'vanessa+gs@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Fabricio', email: 'fabricio+gs@gmail.com', pillar: 'sleep' },
  { name: 'Michelangelo', email: 'michelangelo+gs@gmail.com', pillar: 'mind' },
  { name: 'Muriel Bille', email: 'muriel.bille@gmail.com', pillar: 'eat' },
  { name: 'Xana', email: 'xana+gs@gmail.com', pillar: 'sleep' },
  { name: 'CF', email: 'cf+gs@gmail.com', pillar: 'mind' },
  { name: 'Ana Contreras Meca', email: 'ana.contreras@gmail.com', pillar: 'sleep' },
  { name: 'Nicolas Ronco', email: 'nicolas.ronco@gmail.com', pillar: 'sleep' },
  { name: 'Nausica Palazzo', email: 'nausica.palazzo@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Joel Antunes', email: 'joel.antunes@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Flaminia Buda', email: 'flaminia.buda@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Andreas', email: 'andreas+gs@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'António Ricciardi', email: 'antonio.ricciardi@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Denise Prino', email: 'denise.prino@gmail.com', pillar: 'eat', circleId: 'circle-goodeat' },
  { name: 'Alexandra Franco', email: 'alexandra.franco@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Thomas Weidlich', email: 'thomas.weidlich@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Max', email: 'max+gs@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Naomi Silver', email: 'naomi.silver@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'James', email: 'james+gs@gmail.com', pillar: 'move', circleId: 'circle-goodmove' },
  { name: 'Miguel Montez Tabuado', email: 'miguel.montez@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
  { name: 'Edgars Nemše', email: 'edgars.nemse@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
  { name: 'Karla', email: 'karla+gs@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
  { name: 'Filipa Almeida', email: 'filipa.almeida@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
  { name: 'Hayley Holle', email: 'hayley.holle@gmail.com', pillar: 'mind', circleId: 'circle-goodmind' },
];

const seedMembers: Member[] = memberSeed.map((member, index) => ({
  id: `member-${index + 1}`,
  spanId: SPAN_ID,
  ...member,
  createdAt: now,
  updatedAt: now,
}));

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createInitialStore(): StoreShape {
  return {
    spans: seedSpans,
    members: seedMembers,
    circles: seedCircles,
    practiceSelections: [],
    feedback: [],
  };
}

class SpanDB {
  private store: StoreShape;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): StoreShape {
    if (typeof window === 'undefined') return createInitialStore();

    const existing = window.localStorage.getItem(STORE_KEY);
    if (!existing) {
      const seeded = createInitialStore();
      window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    try {
      return JSON.parse(existing) as StoreShape;
    } catch {
      const seeded = createInitialStore();
      window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
      return seeded;
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(this.store));
    }
  }

  private timestamp() {
    return new Date().toISOString();
  }

  createSpan(span: Omit<Span, 'createdAt' | 'updatedAt'>): Span {
    const timestamp = this.timestamp();
    const newSpan = { ...span, createdAt: timestamp, updatedAt: timestamp };
    this.store.spans = [newSpan, ...this.store.spans];
    this.persist();
    return newSpan;
  }

  getSpan(spanId: string): Span | null {
    return this.store.spans.find((span) => span.id === spanId) || null;
  }

  getAllSpans(): Span[] {
    return [...this.store.spans].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateSpan(spanId: string, updates: Partial<Span>): void {
    const timestamp = this.timestamp();
    this.store.spans = this.store.spans.map((span) =>
      span.id === spanId ? { ...span, ...updates, id: span.id, createdAt: span.createdAt, updatedAt: timestamp } : span,
    );
    this.persist();
  }

  deleteSpan(spanId: string): void {
    this.store.spans = this.store.spans.filter((span) => span.id !== spanId);
    this.store.members = this.store.members.filter((member) => member.spanId !== spanId);
    this.store.circles = this.store.circles.filter((circle) => circle.spanId !== spanId);
    this.store.practiceSelections = this.store.practiceSelections.filter((selection) => selection.spanId !== spanId);
    this.store.feedback = this.store.feedback.filter((entry) => entry.spanId !== spanId);
    this.persist();
  }

  createMember(member: Omit<Member, 'createdAt' | 'updatedAt'>): Member {
    const timestamp = this.timestamp();
    const newMember = { ...member, createdAt: timestamp, updatedAt: timestamp };
    this.store.members = [...this.store.members, newMember];
    this.persist();
    return newMember;
  }

  getMember(memberId: string): Member | null {
    return this.store.members.find((member) => member.id === memberId) || null;
  }

  getMembersBySpan(spanId: string): Member[] {
    return this.store.members
      .filter((member) => member.spanId === spanId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getMembersByCircle(circleId: string): Member[] {
    return this.store.members
      .filter((member) => member.circleId === circleId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  updateMember(memberId: string, updates: Partial<Member>): void {
    const timestamp = this.timestamp();
    this.store.members = this.store.members.map((member) =>
      member.id === memberId
        ? { ...member, ...updates, id: member.id, createdAt: member.createdAt, updatedAt: timestamp }
        : member,
    );
    this.persist();
  }

  deleteMember(memberId: string): void {
    this.store.members = this.store.members.filter((member) => member.id !== memberId);
    this.store.practiceSelections = this.store.practiceSelections.filter((selection) => selection.memberId !== memberId);
    this.store.feedback = this.store.feedback.filter((entry) => entry.memberId !== memberId);
    this.persist();
  }

  createCircle(circle: Omit<Circle, 'createdAt'>): Circle {
    const newCircle = { ...circle, createdAt: this.timestamp() };
    this.store.circles = [...this.store.circles, newCircle];
    this.persist();
    return newCircle;
  }

  getCircle(circleId: string): Circle | null {
    return this.store.circles.find((circle) => circle.id === circleId) || null;
  }

  getCirclesBySpan(spanId: string): Circle[] {
    return this.store.circles
      .filter((circle) => circle.spanId === spanId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  updateCircle(circleId: string, updates: Partial<Circle>): void {
    this.store.circles = this.store.circles.map((circle) =>
      circle.id === circleId ? { ...circle, ...updates, id: circle.id, createdAt: circle.createdAt } : circle,
    );
    this.persist();
  }

  deleteCircle(circleId: string): void {
    this.store.circles = this.store.circles.filter((circle) => circle.id !== circleId);
    this.store.members = this.store.members.map((member) =>
      member.circleId === circleId ? { ...member, circleId: undefined, updatedAt: this.timestamp() } : member,
    );
    this.persist();
  }

  addMemberToCircle(memberId: string, circleId: string): void {
    this.updateMember(memberId, { circleId });
  }

  removeMemberFromCircle(memberId: string): void {
    this.updateMember(memberId, { circleId: undefined });
  }

  createPracticeSelection(selection: Omit<PracticeSelection, 'createdAt'>): PracticeSelection {
    const newSelection = { ...selection, createdAt: this.timestamp() };
    this.store.practiceSelections = [...this.store.practiceSelections, newSelection];
    this.persist();
    return newSelection;
  }

  getPracticeSelectionsBySpan(spanId: string): PracticeSelection[] {
    return this.store.practiceSelections
      .filter((selection) => selection.spanId === spanId)
      .sort((a, b) => a.position - b.position);
  }

  getPracticeSelectionsByMember(memberId: string, spanId?: string): PracticeSelection[] {
    return this.store.practiceSelections
      .filter((selection) => selection.memberId === memberId && (!spanId || selection.spanId === spanId))
      .sort((a, b) => a.position - b.position);
  }

  updatePracticeSelection(selectionId: string, updates: Partial<PracticeSelection>): void {
    this.store.practiceSelections = this.store.practiceSelections.map((selection) =>
      selection.id === selectionId ? { ...selection, ...updates, id: selection.id, createdAt: selection.createdAt } : selection,
    );
    this.persist();
  }

  deletePracticeSelection(selectionId: string): void {
    this.store.practiceSelections = this.store.practiceSelections.filter((selection) => selection.id !== selectionId);
    this.persist();
  }

  createFeedback(feedback: Omit<FeedbackEntry, 'createdAt'>): FeedbackEntry {
    const newFeedback = { ...feedback, createdAt: this.timestamp() };
    this.store.feedback = [...this.store.feedback, newFeedback];
    this.persist();
    return newFeedback;
  }

  getFeedbackByMember(memberId: string): FeedbackEntry[] {
    return this.store.feedback
      .filter((entry) => entry.memberId === memberId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  getFeedbackBySpan(spanId: string): FeedbackEntry[] {
    return this.store.feedback
      .filter((entry) => entry.spanId === spanId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  updateFeedback(feedbackId: string, updates: Partial<FeedbackEntry>): void {
    this.store.feedback = this.store.feedback.map((entry) =>
      entry.id === feedbackId ? { ...entry, ...updates, id: entry.id, createdAt: entry.createdAt } : entry,
    );
    this.persist();
  }

  close() {
    this.persist();
  }
}

export { createId };
export const db = new SpanDB();
