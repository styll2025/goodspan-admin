import { Practice } from '../../../types';
import { PracticeCard } from './PracticeCard';

type PracticeBankProps = {
  practices: Practice[];
  selectedCount: number;
  onAdd: (practice: Practice, isStartWithThis: boolean) => void;
};

export function PracticeBank({ practices, selectedCount, onAdd }: PracticeBankProps) {
  const isFull = selectedCount >= 5;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Practice Library</p>
        <p className="text-xs text-neutral-500">{practices.length} practices</p>
      </div>

      <div className="max-h-[560px] overflow-auto border-t border-goodspan-line">
        {practices.slice(0, 25).map((practice) => (
          <PracticeCard key={`${practice.category}-${practice.level}-${practice.text}`} practice={practice} onAdd={onAdd} disabled={isFull} />
        ))}
      </div>
    </div>
  );
}
