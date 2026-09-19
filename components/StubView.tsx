import { PageId, span } from '../dashboardData';

const stubCopy: Record<Exclude<PageId, 'overview'>, { eyebrow: string; title: string; body: string }> = {
  members: {
    eyebrow: 'Members',
    title: 'Members',
    body: 'Member directory, status, and span assignment tools will live here.',
  },
  circles: {
    eyebrow: 'Circles',
    title: 'Circles',
    body: 'Circle creation and member assignment tools will live here.',
  },
  plans: {
    eyebrow: 'Plans',
    title: 'Plans',
    body: 'Plan generation and review workflows will live here.',
  },
  evaluation: {
    eyebrow: 'Evaluation',
    title: 'Evaluation',
    body: 'Feedback collection, evaluation progress, and completion reporting will live here.',
  },
  directory: {
    eyebrow: 'All Spans',
    title: 'Directory',
    body: 'Cross-span people and participation records will live here.',
  },
  library: {
    eyebrow: 'Practice Bank',
    title: 'Library',
    body: 'The full GoodSpan practices library will live here.',
  },
};

type StubViewProps = {
  page: Exclude<PageId, 'overview'>;
};

export function StubView({ page }: StubViewProps) {
  const copy = stubCopy[page];

  return (
    <section>
      <div className="border-b border-goodspan-line pb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">{copy.eyebrow}</p>
        <h1 className="text-[30px] font-black leading-none tracking-[-0.06em] text-goodspan-ink">{copy.title}</h1>
        <p className="mt-2 text-sm text-neutral-600">{span.label}</p>
      </div>

      <div className="mt-8 border border-dashed border-goodspan-line bg-white/40 p-8">
        <p className="text-sm font-black tracking-[-0.03em] text-goodspan-ink">Stub view</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">{copy.body}</p>
      </div>
    </section>
  );
}
