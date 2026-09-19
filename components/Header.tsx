import { span } from '../dashboardData';

export function Header() {
  return (
    <header className="flex h-[58px] items-center border-b border-goodspan-line bg-goodspan-bg px-6">
      <div className="flex items-center gap-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-500">Span</span>
        <button className="flex items-center gap-2 text-sm font-black tracking-[-0.03em] text-goodspan-ink">
          {span.label}
          <span className="text-[11px] text-neutral-600">⌄</span>
        </button>
      </div>
    </header>
  );
}
