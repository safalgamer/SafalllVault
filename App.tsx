
import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { Page, DocumentItem, Writing } from './types';
import Hero from './components/Hero';
import Documents from './components/Documents';
import Writings from './components/Writings';
import Particles from './components/Particles';
import { Mail, LogOut } from './components/Icons';

// --- AUTH CONTEXT ---
interface AuthContextType {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);
  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};

// --- VAULT CONTEXT ---
interface VaultContextType {
  documents: DocumentItem[];
  writings: Writing[];
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  updateDocument: (doc: DocumentItem) => void;
  deleteDocument: (id: string) => void;
  addWriting: (writing: Omit<Writing, 'id'>) => void;
  updateWriting: (writing: Writing) => void;
  deleteWriting: (id: string) => void;
}
export const VaultContext = createContext<VaultContextType | null>(null);

const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [writings, setWritings] = useState<Writing[]>([]);

    useEffect(() => {
        try {
            const storedDocs = localStorage.getItem('vault_documents');
            if (storedDocs) setDocuments(JSON.parse(storedDocs));
            const storedWritings = localStorage.getItem('vault_writings');
            if (storedWritings) setWritings(JSON.parse(storedWritings));
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    const updateLocalStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Failed to save ${key} to localStorage`, error);
        }
    };
    
    const addDocument = useCallback((doc: Omit<DocumentItem, 'id'>) => {
        setDocuments(prev => {
            const newDocs = [...prev, { ...doc, id: Date.now().toString() }];
            updateLocalStorage('vault_documents', newDocs);
            return newDocs;
        });
    }, []);

    const updateDocument = useCallback((updatedDoc: DocumentItem) => {
        setDocuments(prev => {
            const newDocs = prev.map(d => d.id === updatedDoc.id ? updatedDoc : d);
            updateLocalStorage('vault_documents', newDocs);
            return newDocs;
        });
    }, []);

    const deleteDocument = useCallback((id: string) => {
        setDocuments(prev => {
            const newDocs = prev.filter(d => d.id !== id);
            updateLocalStorage('vault_documents', newDocs);
            return newDocs;
        });
    }, []);
    
    const addWriting = useCallback((writing: Omit<Writing, 'id'>) => {
        setWritings(prev => {
            const newWritings = [...prev, { ...writing, id: Date.now().toString() }];
            updateLocalStorage('vault_writings', newWritings);
            return newWritings;
        });
    }, []);

    const updateWriting = useCallback((updatedWriting: Writing) => {
        setWritings(prev => {
            const newWritings = prev.map(w => w.id === updatedWriting.id ? updatedWriting : w);
            updateLocalStorage('vault_writings', newWritings);
            return newWritings;
        });
    }, []);

    const deleteWriting = useCallback((id: string) => {
        setWritings(prev => {
            const newWritings = prev.filter(w => w.id !== id);
            updateLocalStorage('vault_writings', newWritings);
            return newWritings;
        });
    }, []);


    return (
        <VaultContext.Provider value={{ documents, writings, addDocument, updateDocument, deleteDocument, addWriting, updateWriting, deleteWriting }}>
            {children}
        </VaultContext.Provider>
    );
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const { isAdmin, logout } = useContext(AuthContext);

  const renderPage = () => {
    switch (currentPage) {
      case Page.DOCUMENTS:
        return <Documents onBack={() => setCurrentPage(Page.HOME)} />;
      case Page.WRITINGS:
        return <Writings onBack={() => setCurrentPage(Page.HOME)} />;
      case Page.HOME:
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-900 text-gray-200 font-sans overflow-hidden">
      <Particles />
      <main className="relative z-10 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="w-full max-w-5xl mx-auto" key={currentPage}>
          {renderPage()}
        </div>
      </main>
      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-4">
        {isAdmin && (
           <button
             onClick={logout}
             className="p-3 bg-red-800/80 backdrop-blur-md rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
             aria-label="Logout"
             title="Logout"
           >
             <LogOut />
           </button>
        )}
        <a
          href="mailto:contact@safalll.com"
          className="p-3 bg-gray-800/80 backdrop-blur-md rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300"
          aria-label="Contact me"
          title="Contact me"
        >
          <Mail />
        </a>
      </div>
    </div>
  );
};


const App: React.FC = () => (
    <AuthProvider>
        <VaultProvider>
            <AppContent />
        </VaultProvider>
    </AuthProvider>
);

export default App;
