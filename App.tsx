import React, { useState, useEffect } from 'react';
import { ViewMode, PromptData } from './types';
import { PromptList } from './components/PromptList';
import { PromptForm } from './components/PromptForm';
import { AuthForm } from './components/AuthForm'; // Import Auth Component
import { RetroButton } from './components/ui/RetroComponents';
import { Moon, Sun, Plus, Terminal, LogOut } from 'lucide-react';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [editingPrompt, setEditingPrompt] = useState<PromptData | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Theme Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    applyTheme(isDark);

    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setViewMode(ViewMode.LIST);
  };

  // Navigation Handlers
  const handleCreateNew = () => {
    setEditingPrompt(null);
    setViewMode(ViewMode.CREATE);
  };

  const handleEdit = (prompt: PromptData) => {
    setEditingPrompt(prompt);
    setViewMode(ViewMode.EDIT);
  };

  const handleSave = () => {
    setViewMode(ViewMode.LIST);
    setEditingPrompt(null);
  };

  const handleCancel = () => {
    setViewMode(ViewMode.LIST);
    setEditingPrompt(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-nes-gray dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="font-['Press_Start_2P'] text-xl text-nes-blue animate-pulse mb-4">LOADING...</div>
        <div className="w-48 h-4 border-2 border-black p-1">
            <div className="h-full bg-nes-red w-full animate-[pulse_1s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-nes-gray dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-nes-red dark:bg-red-900 border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Terminal size={24} className="text-black" />
            </div>
            <div>
                <h1 className="font-['Press_Start_2P'] text-white text-xs md:text-lg lg:text-xl tracking-widest drop-shadow-md">
                PROMPT<span className="text-yellow-300">MASTER</span>
                </h1>
                <p className="font-['VT323'] text-white text-lg opacity-90 hidden md:block">CONTROLE DE PROMPTS IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 bg-black border-2 border-gray-500 hover:border-white text-yellow-400 active:translate-y-1 transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && viewMode === ViewMode.LIST && (
              <RetroButton onClick={handleCreateNew} className="hidden sm:flex items-center gap-2 text-sm md:text-xl">
                <Plus size={20} /> <span className="hidden md:inline">NOVO</span>
              </RetroButton>
            )}

            {user && (
                <button 
                    onClick={handleLogout}
                    className="p-2 bg-red-800 border-2 border-black text-white hover:bg-red-700 active:translate-y-1"
                    title="Sair / Logout"
                >
                    <LogOut size={20} />
                </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!user ? (
            <AuthForm />
        ) : (
            <div className="max-w-7xl mx-auto">
            {viewMode === ViewMode.LIST && (
                <>
                <div className="flex justify-between items-end mb-8 border-b-2 border-black/10 dark:border-white/10 pb-2">
                    <div className="flex items-end gap-2">
                        <h2 className="font-['Press_Start_2P'] text-lg text-gray-700 dark:text-gray-300">
                            MEUS PROMPTS
                        </h2>
                        <span className="font-['VT323'] text-xl text-gray-500 dark:text-gray-500 hidden sm:inline">
                            // Gerencie sua biblioteca
                        </span>
                    </div>
                    {/* Mobile New Button */}
                    <RetroButton onClick={handleCreateNew} className="sm:hidden flex items-center gap-1 text-sm px-3 py-1">
                         <Plus size={16} /> NOVO
                    </RetroButton>
                </div>
                <PromptList onEdit={handleEdit} />
                </>
            )}

            {(viewMode === ViewMode.CREATE || viewMode === ViewMode.EDIT) && (
                <PromptForm 
                initialData={editingPrompt} 
                onSave={handleSave} 
                onCancel={handleCancel} 
                />
            )}
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-nes-darkGray text-white border-t-4 border-black py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="font-['VT323'] text-xl">
            © {new Date().getFullYear()} PROMPT MASTER | ESTILO NES
          </p>
          <p className="font-['VT323'] text-gray-400 mt-1">
            {user ? `PLAYER: ${user.email}` : 'PRESS START TO LOGIN'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;