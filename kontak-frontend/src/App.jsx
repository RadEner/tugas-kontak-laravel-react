import { useState } from 'react';
import AuthForm from './components/AuthForm';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import Toast from './components/Toast';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setToast(null);
  };

  if (!loggedIn) {
    return (
      <>
        <AuthForm onLogin={() => setLoggedIn(true)} showToast={showToast} />
        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-lg">📇</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">Aplikasi Kontak</h1>
              <p className="text-xs text-slate-400">Pemrograman Internet — Unud</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="pt-6">
        <ContactList refresh={refresh} showToast={showToast} />
      </main>

      <ContactForm onAdded={() => setRefresh(refresh + 1)} showToast={showToast} />

      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}