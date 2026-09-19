import { span } from '../../../dashboardData';
import { Pillar } from '../../../types';
import { PracticeBank } from './PracticeBank';
import { SelectedPractices } from './SelectedPractices';
import { PracticeFilters, usePracticeSelection } from './usePracticeSelection';

const pillarLabels: Record<Pillar, string> = {
  sleep: 'GoodSleep',
  eat: 'GoodEat',
  move: 'GoodMove',
  mind: 'GoodMind',
};

const levels: Array<PracticeFilters['level']> = ['all', 'gentle', 'moderate', 'deep'];

type PracticeSelectorProps = {
  spanId: string;
};

export function PracticeSelector({ spanId }: PracticeSelectorProps) {
  const {
    members,
    selectedMember,
    selectedMemberId,
    setSelectedMemberId,
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
  } = usePracticeSelection(spanId);

  const updateFilter = <Key extends keyof PracticeFilters>(key: Key, value: PracticeFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <section>
      <div className="border-b border-goodspan-line pb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">{span.label}</p>
        <h1 className="text-[30px] font-black leading-none tracking-[-0.06em] text-goodspan-ink">Plans</h1>
        <p className="mt-2 text-sm text-neutral-600">Allocate five practices per member.</p>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-6 pt-6">
        <aside>
          <div className="mb-3 flex items-center justify-between border-b border-goodspan-line pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Members</p>
            <p className="text-xs text-neutral-600">{completedCount} done</p>
          </div>

          <div className="max-h-[420px] overflow-auto">
            {members.map((member) => {
              const count = getSelectionsForMember(member.id).length;
              const isActive = member.id === selectedMemberId;

              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`flex w-full items-center justify-between border-b border-goodspan-line px-3 py-3 text-left text-sm ${
                    isActive ? 'bg-goodspan-orange text-white' : 'text-goodspan-ink hover:bg-neutral-200'
                  }`}
                >
                  <span className="font-semibold tracking-[-0.03em]">{member.name}</span>
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-neutral-500'}`}>{count}/5</span>
                </button>
              );
            })}
          </div>

          {selectedMember ? (
            <div className="mt-5">
              <SelectedPractices
                selections={selectedMemberSelections}
                onRemove={removePractice}
                onToggleStart={toggleStartWithThis}
              />
            </div>
          ) : null}
        </aside>

        <div>
          <div className="mb-5 grid grid-cols-4 gap-3">
            <label className="block">
              <span className="mb-2 block text-xs text-neutral-600">Pillar</span>
              <select
                value={filters.pillar}
                onChange={(event) => updateFilter('pillar', event.target.value as PracticeFilters['pillar'])}
                className="w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none"
              >
                <option value="all">{selectedMember ? pillarLabels[selectedMember.pillar] : 'All pillars'}</option>
                <option value="sleep">GoodSleep</option>
                <option value="eat">GoodEat</option>
                <option value="move">GoodMove</option>
                <option value="mind">GoodMind</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-neutral-600">Level</span>
              <select
                value={filters.level}
                onChange={(event) => updateFilter('level', event.target.value as PracticeFilters['level'])}
                className="w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All levels' : level}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-neutral-600">Category</span>
              <select
                value={filters.category}
                onChange={(event) => updateFilter('category', event.target.value)}
                className="w-full border border-goodspan-line bg-goodspan-bg px-3 py-2 text-sm outline-none"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-neutral-600">Search</span>
              <input
                value={filters.query}
                onChange={(event) => updateFilter('query', event.target.value)}
                className="w-full border border-goodspan-line bg-transparent px-3 py-2 text-sm outline-none focus:border-goodspan-orange"
                placeholder="Search practices"
              />
            </label>
          </div>

          {selectedMember ? (
            <PracticeBank practices={availablePractices} selectedCount={selectedMemberSelections.length} onAdd={addPractice} />
          ) : (
            <div className="border-t border-goodspan-line py-10 text-sm text-neutral-600">Select a member to build a plan.</div>
          )}
        </div>
      </div>
    </section>
  );
}
