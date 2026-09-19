export type PageId = 'overview' | 'members' | 'circles' | 'plans' | 'evaluation' | 'directory' | 'library';

export type NavItem = {
  id: PageId;
  label: string;
  count?: string;
};

export const span = {
  label: 'Sep 2026',
  dateRange: '14 Sept - 16 Oct 2026',
};

export const thisSpanNav: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members', count: '33' },
  { id: 'circles', label: 'Circles', count: '4' },
  { id: 'plans', label: 'Plans', count: '0/33' },
  { id: 'evaluation', label: 'Evaluation', count: '9/33' },
];

export const allSpansNav: NavItem[] = [
  { id: 'directory', label: 'Directory', count: '36' },
  { id: 'library', label: 'Library', count: '203' },
];

export const overviewStats = {
  members: 33,
  inCircle: 25,
  totalMembers: 33,
  circles: 4,
};

export const attentionItems = [
  {
    count: 32,
    title: 'members have no plan yet',
    detail: 'Luisa Carlano, Matteo Girault, Julia and 29 more',
    action: 'Build plans',
    target: 'plans' as PageId,
  },
  {
    count: 8,
    title: 'members are not in a circle',
    detail: 'Teresa Cutelo, Fabricio, Michelangelo and 5 more',
    action: 'Assign circles',
    target: 'circles' as PageId,
  },
  {
    count: 24,
    title: 'members have not submitted feedback',
    detail: 'Matteo Girault, Yvonne, Ivana Istochka and 21 more',
    action: 'Open evaluation',
    target: 'evaluation' as PageId,
  },
];

export const pillarStats = [
  { label: 'GoodSleep', count: 4 },
  { label: 'GoodEat', count: 10 },
  { label: 'GoodMove', count: 11 },
  { label: 'GoodMind', count: 8 },
];
