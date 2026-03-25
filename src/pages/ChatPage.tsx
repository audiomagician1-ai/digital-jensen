import { useState, useRef, useEffect } from 'react';
import { Menu, Cpu } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { isConfigured } from '@/lib/llm';
import { Sidebar } from '@/components/Sidebar';
import { ChatBubble } from '@/components/ChatBubble';
import { ChatInput } from '@/components/ChatInput';
import { SettingsModal } from '@/components/SettingsModal';

export function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions, activeSessionId, isStreaming, streamingText, error,
    sendMessage, stopStreaming, isSettingsOpen, setSettingsOpen, toggleSettings, clearError, createSession,
  } = useAppStore();

  const session = sessions.find(s => s.id === activeSessionId);
  const messages = session?.messages ?? [];
  const configured = isConfigured();

  // Auto-create session on first visit
  useEffect(() => {
    if (sessions.length === 0) createSession();
  }, [sessions.length, createSession]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingText]);

  // Auto-open settings if not configured (one-shot on mount)
  const settingsPromptedRef = useRef(false);
  useEffect(() => {
    if (!configured && !settingsPromptedRef.current) {
      settingsPromptedRef.current = true;
      setSettingsOpen(true);
    }
  }, [configured, setSettingsOpen]);

  return (
    <div className="h-screen flex bg-surface-900">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-surface-700 flex items-center px-4 gap-3 shrink-0 bg-surface-800/50 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-surface-600 text-text-muted">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-nvidia-green/10 flex items-center justify-center">
              <Cpu size={14} className="text-nvidia-green" />
            </div>
            <span className="text-sm font-medium text-text-secondary">Digital Jensen</span>
          </div>
          {isStreaming && (
            <div className="ml-auto flex items-center gap-2 text-xs text-nvidia-green">
              <div className="w-2 h-2 rounded-full bg-nvidia-green pulse-dot" />
              Reasoning...
            </div>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isStreaming ? (
            <EmptyState />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role === 'system' ? 'assistant' : m.role} content={m.content} />
              ))}
              {isStreaming && streamingText && (
                <ChatBubble role="assistant" content={streamingText} isStreaming />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!configured}
        />
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="w-16 h-16 rounded-2xl bg-nvidia-green/10 border border-nvidia-green/20 flex items-center justify-center mb-6">
        <Cpu size={28} className="text-nvidia-green" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Ready to reason</h2>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
        Ask me about AI scaling laws, NVIDIA strategy, leadership philosophy, 
        or anything else. I will reason from first principles — just as I always do.
      </p>
      <p className="mt-4 text-xs text-text-muted italic">
        "The question is not how to optimize. The question is why it takes that long in the first place."
      </p>
    </div>
  );
}
