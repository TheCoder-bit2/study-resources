import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function App() {
  const { isAuthenticated, login, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  useEffect(() => {
    // Check if we're on the admin route
    const path = window.location.pathname;
    if (path === '/admin' || path.startsWith('/admin/')) {
      setCurrentView('admin');
    } else {
      setCurrentView('public');
    }
  }, []);

  const handleNavigation = (view: 'public' | 'admin') => {
    setCurrentView(view);
    window.history.pushState({}, '', view === 'admin' ? '/admin' : '/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Public Dashboard
  if (currentView === 'public') {
    return (
      <div className="relative">
        <Dashboard />
        
        {/* Admin Access Button */}
        <button
          onClick={() => handleNavigation('admin')}
          className="fixed bottom-6 right-6 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200 z-50"
          title="Admin Access"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </button>
      </div>
    );
  }

  // Admin Portal
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return (
        <div className="relative">
          <AdminLogin onLogin={login} />
          
          {/* Back to Public Button */}
          <button
            onClick={() => handleNavigation('public')}
            className="fixed top-6 left-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200 z-50"
          >
            ← Back to Public
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        <AdminDashboard onLogout={() => {
          logout();
          handleNavigation('public');
        }} />
        
        {/* Back to Public Button */}
        <button
          onClick={() => handleNavigation('public')}
          className="fixed top-6 left-6 bg-white/10 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200 z-50 border"
        >
          ← Back to Public
        </button>
      </div>
    );
  }

  return null;
}

export default App;