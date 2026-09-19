import { Practice } from '../../../types';

type PracticeCardProps = {
  practice: Practice;
  onAdd: (practice: Practice, isStartWithThis: boolean) => void;
  disabled: boolean;
};

export function PracticeCard({ practice, onAdd, disabled }: PracticeCardProps) {
  return (
    <article className="grid grid-cols-[1fr_auto] gap-4 border-b border-goodspan-line py-4">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
          {practice.level} · {practice.category}
        </p>
        <h3 className="text-sm font-black tracking-[-0.03em] text-goodspan-ink">{practice.text}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-600">{practice.why}</p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          disabled={disabled}
          onClick={() => onAdd(practice, false)}
          className="bg-goodspan-orange px-4 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          Add
        </button>
        <button
          disabled={disabled}
          onClick={() => onAdd(practice, true)}
          className="border border-goodspan-line px-3 py-2 text-xs font-black text-goodspan-ink disabled:cursor-not-allowed disabled:text-neutral-400"
        >
          Start
        </button>
      </div>
    </article>
  );
}
