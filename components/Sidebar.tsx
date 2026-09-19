import { allSpansNav, PageId, thisSpanNav } from '../dashboardData';

type SidebarProps = {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
};

function NavGroup({
  label,
  items,
  activePage,
  onNavigate,
}: {
  label: string;
  items: typeof thisSpanNav;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}) {
  return (
    <div className="mb-7">
      <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === activePage;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold transition ${
                isActive
                  ? 'bg-goodspan-orange text-white'
                  : 'text-goodspan-ink hover:bg-neutral-200'
              }`}
            >
              <span>{item.label}</span>
              {item.count ? (
                <span className={`text-xs ${isActive ? 'text-white' : 'text-neutral-500'}`}>{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-[186px] shrink-0 flex-col border-r border-goodspan-line bg-goodspan-panel">
      <div className="border-b border-goodspan-line px-4 py-5">
        <p className="text-[15px] font-black leading-none tracking-[-0.04em] text-goodspan-ink">The GoodSpan</p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.35em] text-neutral-600">Admin</p>
      </div>

      <nav className="flex-1 py-5">
        <NavGroup label="This Span" items={thisSpanNav} activePage={activePage} onNavigate={onNavigate} />
        <NavGroup label="All Spans" items={allSpansNav} activePage={activePage} onNavigate={onNavigate} />
      </nav>
    </aside>
  );
}
