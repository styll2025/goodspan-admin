import React, { useState, useEffect } from 'react';
import { practicesLib } from './practices.skill';

type View = 'members' | 'circles' | 'practices' | 'feedback' | 'history';

export default function App() {
  const [currentSpanId, setCurrentSpanId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('members');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load practices on app startup
    (async () => {
      try {
        await practicesLib.load();
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load practices');
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GoodSpan Admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GoodSpan</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        {/* Span Selector */}
        {currentSpanId && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Current Span</p>
            <p className="font-semibold text-sm text-gray-900">{currentSpanId}</p>
            <button
              onClick={() => setCurrentSpanId(null)}
              className="text-xs text-blue-600 hover:text-blue-700 mt-2"
            >
              Change span
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('members')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'members'
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setCurrentView('circles')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'circles'
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Circles
          </button>
          <button
            onClick={() => setCurrentView('practices')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'practices'
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Practice Selection
          </button>
          <button
            onClick={() => setCurrentView('feedback')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'feedback'
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Feedback
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              currentView === 'history'
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            History
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {!currentSpanId ? (
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select a Span</h2>
              <p className="text-gray-600 mb-6">
                Choose a span to manage members, circles, practices, and feedback.
              </p>

              {/* TODO: Load and display available spans */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Span selector not yet implemented. Component skeleton is ready for data integration.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {currentView === 'members' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Members</h2>
                  {/* TODO: MemberList component */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      📋 MemberList component skeleton ready for implementation
                    </p>
                  </div>
                </div>
              )}

              {currentView === 'circles' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Circles</h2>
                  {/* TODO: CircleManager component */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      👥 CircleManager component skeleton ready for implementation
                    </p>
                  </div>
                </div>
              )}

              {currentView === 'practices' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Practice Selection</h2>
                  {/* TODO: PracticeSelector component */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      🎯 PracticeSelector component skeleton ready for implementation
                    </p>
                  </div>
                </div>
              )}

              {currentView === 'feedback' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Feedback</h2>
                  {/* TODO: FeedbackForm component */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💬 FeedbackForm component skeleton ready for implementation
                    </p>
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">History</h2>
                  {/* TODO: HistoryView component */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      📚 HistoryView component skeleton ready for implementation
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
