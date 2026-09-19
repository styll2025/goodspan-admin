import { PracticeSelection } from '../../../types';

type SelectedPracticesProps = {
  selections: PracticeSelection[];
  onRemove: (selectionId: string) => void;
  onToggleStart: (selectionId: string) => void;
};

export function SelectedPractices({ selections, onRemove, onToggleStart }: SelectedPracticesProps) {
  const slots = Array.from({ length: 5 }, (_, index) => selections[index] || null);

  return (
    <div>
      <div className="mb-3 border-b border-goodspan-line pb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-goodspan-orange">Plan</p>
        <h2 className="mt-2 text-lg font-black tracking-[-0.05em] text-goodspan-ink">Selected practices</h2>
        <p className="mt-1 text-xs text-neutral-600">{selections.length} of 5 chosen</p>
      </div>

      <div className="space-y-3">
        {slots.map((selection, index) => (
          <div key={selection?.id || index} className="border-b border-goodspan-line pb-3">
            <div className="grid grid-cols-[24px_1fr_auto] gap-3 text-sm">
              <span className="text-neutral-500">{index + 1}</span>
              {selection ? (
                <>
                  <div>
                    <p className="font-semibold tracking-[-0.03em] text-goodspan-ink">{selection.practiceText}</p>
                    <button
                      onClick={() => onToggleStart(selection.id)}
                      className="mt-2 flex items-center gap-2 text-xs text-goodspan-ink"
                    >
                      <span
                        className={`h-3 w-3 rounded-full border ${
                          selection.isStartWithThis ? 'border-goodspan-orange bg-goodspan-orange' : 'border-goodspan-line'
                        }`}
                      />
                      Best place to start
                    </button>
                  </div>
                  <button onClick={() => onRemove(selection.id)} className="font-black text-goodspan-orange">
                    ×
                  </button>
                </>
              ) : (
                <p className="col-span-2 text-neutral-500">Empty slot</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
