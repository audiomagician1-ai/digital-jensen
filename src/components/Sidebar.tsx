import { Plus, MessageSquare, Trash2, Settings, Home, ChevronLeft } from 'lucide-react';
import { useAppStore, type ChatSession } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const { sessions, activeSessionId, createSession, setActiveSession, deleteSession, toggleSettings } = useAppStore();

  const sortedSessions = [...sessions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed md:relative z-40 h-full bg-surface-800 border-r border-surface-700 flex flex-col transition-all duration-200 ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-64 md:w-0 md:-translate-x-0'
      } overflow-hidden`}>
        {/* Header */}
        <div className="p-3 border-b border-surface-700 flex items-center justify-between shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Home size={16} />
          </button>
          <button
            onClick={() => { createSession(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-nvidia-green/10 text-nvidia-green rounded-lg hover:bg-nvidia-green/20 transition-colors"
          >
            <Plus size={14} /> New Chat
          </button>
          <button onClick={onToggle} className="p-1 rounded hover:bg-surface-600 text-text-muted md:hidden">
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sortedSessions.length === 0 && (
            <p className="text-xs text-text-muted text-center py-8">No conversations yet</p>
          )}
          {sortedSessions.map(s => (
            <SessionItem
              key={s.id}
              session={s}
              isActive={s.id === activeSessionId}
              onClick={() => setActiveSession(s.id)}
              onDelete={() => deleteSession(s.id)}
            />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t border-surface-700 shrink-0">
          <button
            onClick={toggleSettings}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-lg transition-colors"
          >
            <Settings size={16} /> Settings
          </button>
        </div>
      </aside>
    </>
  );
}

function SessionItem({ session, isActive, onClick, onDelete }: {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-surface-600 text-text-primary' : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
      }`}
    >
      <MessageSquare size={14} className="shrink-0 opacity-50" />
      <span className="text-sm truncate flex-1">{session.title}</span>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-surface-500 transition-all"
      >
        <Trash2 size={12} className="text-text-muted" />
      </button>
    </div>
  );
}
