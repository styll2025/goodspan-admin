import { attentionItems, overviewStats, PageId, pillarStats, span } from '../dashboardData';

type OverviewProps = {
  onNavigate: (page: PageId) => void;
};

export function Overview({ onNavigate }: OverviewProps) {
  const maxPillarCount = Math.max(...pillarStats.map((pillar) => pillar.count));

  return (
    <section>
      <div className="border-b border-goodspan-line pb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Overview</p>
        <h1 className="text-[30px] font-black leading-none tracking-[-0.06em] text-goodspan-ink">{span.label}</h1>
        <p className="mt-2 text-sm text-neutral-600">{span.dateRange}</p>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-5 border-b border-goodspan-line py-8">
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">Members</p>
          <p className="text-[32px] font-black leading-none tracking-[-0.05em] text-goodspan-ink">{overviewStats.members}</p>
          <p className="mt-2 text-sm text-neutral-600">in this span</p>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">In A Circle</p>
          <p className="text-[32px] font-black leading-none tracking-[-0.05em] text-goodspan-ink">
            {overviewStats.inCircle}/{overviewStats.totalMembers}
          </p>
          <p className="mt-2 text-sm text-neutral-600">{overviewStats.circles} circles</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-5 pt-7">
        <div>
          <p className="mb-4 border-b border-goodspan-line pb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
            Needs Attention
          </p>

          <div>
            {attentionItems.map((item) => (
              <div
                key={item.title}
                className="grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-goodspan-line py-4"
              >
                <p className="text-2xl font-black tracking-[-0.06em] text-goodspan-orange">{item.count}</p>
                <div>
                  <p className="text-sm font-black tracking-[-0.03em] text-goodspan-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-neutral-600">{item.detail}</p>
                </div>
                <button
                  onClick={() => onNavigate(item.target)}
                  className="border border-goodspan-line bg-goodspan-bg px-4 py-2 text-xs font-black tracking-[-0.02em] text-goodspan-ink hover:bg-white"
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 border-b border-goodspan-line pb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
            Assigned Pillars
          </p>

          <div className="space-y-6">
            {pillarStats.map((pillar) => (
              <div key={pillar.label}>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <p className="font-black tracking-[-0.03em] text-goodspan-ink">{pillar.label}</p>
                  <p className="text-xs text-neutral-600">{pillar.count}</p>
                </div>
                <div className="h-[7px] bg-neutral-200">
                  <div
                    className="h-full bg-goodspan-ink"
                    style={{ width: `${(pillar.count / maxPillarCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
