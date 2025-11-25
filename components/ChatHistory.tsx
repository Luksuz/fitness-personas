'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSession } from '@/lib/storage';

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hr';
}

export default function ChatHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose,
  language,
}: ChatHistoryProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return language === 'hr' ? 'Danas' : 'Today';
    } else if (diffDays === 1) {
      return language === 'hr' ? 'Jučer' : 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} ${language === 'hr' ? 'dana' : 'days ago'}`;
    } else {
      return date.toLocaleDateString(language === 'hr' ? 'hr-HR' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirm === sessionId) {
      onDeleteSession(sessionId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(sessionId);
      // Auto-reset after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-[#0a0f1a] to-black border-r border-[#4A70A9]/50 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#4A70A9]/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#8FABD4] to-[#4A70A9] bg-clip-text text-transparent">
                  {language === 'hr' ? '📜 Povijest Razgovora' : '📜 Chat History'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#4A70A9]/20 rounded-lg transition-colors"
                >
                  <span className="text-[#8FABD4]">✕</span>
                </button>
              </div>
              
              {/* New Chat Button */}
              <button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] hover:from-[#8FABD4] hover:to-[#4A70A9] rounded-xl font-semibold text-sm text-[#EFECE3] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#4A70A9]/30"
              >
                <span>✨</span>
                {language === 'hr' ? 'Novi Razgovor' : 'New Chat'}
              </button>
            </div>
            
            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-[#8FABD4] text-sm">
                    {language === 'hr' ? 'Nema prethodnih razgovora' : 'No previous chats'}
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      group relative p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${activeSessionId === session.id
                        ? 'bg-gradient-to-r from-[#4A70A9]/30 to-[#8FABD4]/20 border border-[#8FABD4]/50'
                        : 'bg-black/40 hover:bg-[#4A70A9]/20 border border-transparent hover:border-[#4A70A9]/30'
                      }
                    `}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#EFECE3] text-sm font-medium truncate">
                          {session.title}
                        </p>
                        <p className="text-[#8FABD4]/70 text-xs mt-1">
                          {formatDate(session.lastUpdated)} • {session.messages.length} {language === 'hr' ? 'poruka' : 'messages'}
                        </p>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className={`
                          p-1.5 rounded-lg transition-all duration-200
                          ${deleteConfirm === session.id
                            ? 'bg-red-500/30 text-red-400'
                            : 'opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-[#8FABD4] hover:text-red-400'
                          }
                        `}
                        title={deleteConfirm === session.id 
                          ? (language === 'hr' ? 'Klikni ponovo za brisanje' : 'Click again to delete')
                          : (language === 'hr' ? 'Obriši' : 'Delete')
                        }
                      >
                        {deleteConfirm === session.id ? '⚠️' : '🗑️'}
                      </button>
                    </div>
                    
                    {/* Active indicator */}
                    {activeSessionId === session.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#8FABD4] to-[#4A70A9] rounded-r-full" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {sessions.length > 0 && (
              <div className="p-3 border-t border-[#4A70A9]/30">
                <p className="text-[#8FABD4]/50 text-xs text-center">
                  {sessions.length} {language === 'hr' ? 'razgovora spremljeno' : 'chats saved'}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

