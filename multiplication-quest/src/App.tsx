import { useState, useEffect } from 'react';
import { loadData, saveData } from './services/persistence/storage';
import type { StorageSchema } from './types';
import Dashboard from './features/dashboard/Dashboard';
import StudyGuide from './features/study-guide/StudyGuide';
import Practice from './features/practice/Practice';
import TestCenter from './features/test-center/TestCenter';
import Adventure from './features/adventure/Adventure';
import ParentDashboard from './features/parent-dashboard/ParentDashboard';
import Navigation from './components/layout/Navigation';

type View = 'dashboard' | 'study' | 'practice' | 'test' | 'adventure' | 'parent' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [appData, setAppData] = useState<StorageSchema>(loadData());

  const navigate = (view: string) => {
    setCurrentView(view as View);
  };

  // Save data whenever it changes
  useEffect(() => {
    saveData(appData);
  }, [appData]);

  // Update last active date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = appData.student.lastActiveDate?.split('T')[0];

    if (today !== lastActive) {
      setAppData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          lastActiveDate: new Date().toISOString(),
        },
      }));
    }
  }, []);

  const updateAppData = (updates: Partial<StorageSchema>) => {
    setAppData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen tactile-pattern">
      <Navigation currentView={currentView} onNavigate={navigate} studentName={appData.student.displayName} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === 'dashboard' && (
          <Dashboard
            data={appData}
            onNavigate={navigate}
            onUpdateData={updateAppData}
          />
        )}

        {currentView === 'study' && (
          <StudyGuide
            data={appData}
            onUpdateData={updateAppData}
            onNavigate={navigate}
          />
        )}

        {currentView === 'practice' && (
          <Practice
            data={appData}
            onUpdateData={updateAppData}
            onNavigate={navigate}
          />
        )}

        {currentView === 'test' && (
          <TestCenter
            data={appData}
            onUpdateData={updateAppData}
            onNavigate={navigate}
          />
        )}

        {currentView === 'adventure' && (
          <Adventure
            data={appData}
            onUpdateData={updateAppData}
            onNavigate={navigate}
          />
        )}

        {currentView === 'parent' && (
          <ParentDashboard
            data={appData}
            onUpdateData={updateAppData}
            onNavigate={navigate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
