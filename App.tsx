import { useState } from 'react';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { Sidebar } from './components/Sidebar';
import { StubView } from './components/StubView';
import { PageId } from './dashboardData';

function MainView({ activePage, onNavigate }: { activePage: PageId; onNavigate: (page: PageId) => void }) {
  if (activePage === 'overview') {
    return <Overview onNavigate={onNavigate} />;
  }

  return <StubView page={activePage} />;
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');

  return (
    <div className="flex min-h-screen bg-goodspan-bg text-goodspan-ink">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="min-w-0 flex-1">
        <Header />
        <div className="px-6 py-6 lg:px-8">
          <MainView activePage={activePage} onNavigate={setActivePage} />
        </div>
      </main>
    </div>
  );
}
