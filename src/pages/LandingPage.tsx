import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Cpu, Brain, Zap, Send, Square, ArrowRight, Maximize2, Settings, Languages } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { isConfigured } from '@/lib/llm';
import { ChatBubble } from '@/components/ChatBubble';
import { SettingsModal } from '@/components/SettingsModal';
import { useI18n, t } from '@/lib/i18n';

const QUOTE_KEYS = [1, 2, 3, 4, 5] as const;
const TOPIC_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const ASK_KEYS = [1, 2, 3, 4] as const;

const SOURCES = [
  'Lex Fridman Podcast #494 (2026)',
  'GTC 2025 & 2026 Keynotes',
  'Acquired Podcast (2023)',
  'NTU & Caltech Commencement Speeches',
  'CBS 60 Minutes Interview',
  'Forbes / Inc / CNBC Profiles',
];

export function LandingPage() {
  const navigate = useNavigate();
  const { lang, toggleLang } = useI18n();
  const T = (key: Parameters<typeof t>[0]) => t(key, lang);

  const [chatExpanded, setChatExpanded] = useState(false);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions, activeSessionId, isStreaming, streamingText, error,
    sendMessage, stopStreaming, createSession, isSettingsOpen, setSettingsOpen, clearError,
  } = useAppStore();

  const session = sessions.find(s => s.id === activeSessionId);
  const messages = session?.messages ?? [];
  const configured = isConfigured();

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;

    if (!configured) {
      setSettingsOpen(true);
      return;
    }

    // Ensure a session exists
    if (!session) createSession();

    // Expand chat panel
    if (!chatExpanded) setChatExpanded(true);

    sendMessage(msg);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasMessages = messages.length > 0 || isStreaming;

  return (
    <div className="h-screen bg-surface-900 overflow-hidden flex flex-col">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(118,185,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(118,185,0,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex items-center justify-between px-6 py-3 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-nvidia-green/10 border border-nvidia-green/20 flex items-center justify-center">
            <Cpu size={16} className="text-nvidia-green" />
          </div>
          <span className="text-sm font-medium tracking-wider text-text-secondary uppercase">Digital Jensen</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-surface-700 border border-transparent hover:border-surface-600 transition-all"
            title={lang === 'en' ? '切换中文' : 'Switch to English'}
          >
            <Languages size={14} />
            <span className="font-medium">{lang === 'en' ? '中文' : 'EN'}</span>
          </button>
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-700 transition-colors"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          {/* GitHub */}
          <a href="https://github.com/audiomagician1-ai/digital-jensen" target="_blank" rel="noopener"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            {T('header.github')}
          </a>
        </div>
      </motion.header>

      {/* Main content: two-column layout */}
      <div className="relative z-10 flex flex-1 min-h-0">
        {/* LEFT — Hero & Info */}
        <motion.div
          className="flex flex-col overflow-y-auto px-6 lg:px-10 py-4 shrink-0"
          animate={{ width: chatExpanded ? '42%' : '50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ minWidth: 0 }}
        >
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
              {lang === 'zh' ? (
                <>
                  <span className="text-text-primary">{T('hero.title1')}</span>
                  <span className="glow-green text-nvidia-green">{T('hero.title2')}</span>
                  <span className="text-text-primary">{T('hero.title3')}</span>
                </>
              ) : (
                <>
                  <span className="text-text-primary">{T('hero.title1')}</span><br />
                  <span className="glow-green text-nvidia-green">{T('hero.title2')}</span>
                </>
              )}
            </h1>
            <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
              {T('hero.desc')}
            </p>
          </motion.section>

          {/* Quotes */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="space-y-2">
              {QUOTE_KEYS.map((n) => (
                <motion.blockquote
                  key={n}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + n * 0.07 }}
                  className="border-l-2 border-nvidia-green/30 pl-4 py-1.5"
                >
                  <p className="text-sm text-text-primary font-medium italic">"{T(`quote.${n}.text`)}"</p>
                  <cite className="text-[11px] text-text-muted block not-italic">— {T(`quote.${n}.ctx`)}</cite>
                </motion.blockquote>
              ))}
            </div>
          </motion.section>

          {/* Topics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Brain size={12} /> {T('section.expertise')}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_KEYS.map(n => (
                <span key={n} className="px-2 py-1 text-[11px] text-text-secondary bg-surface-700 rounded-md border border-surface-600">
                  {T(`topic.${n}`)}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Data sources */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-6"
          >
            <h2 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap size={12} /> {T('section.sources')}
            </h2>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {SOURCES.map(s => (
                <div key={s} className="flex items-center gap-1.5 text-text-secondary">
                  <div className="w-1 h-1 rounded-full bg-nvidia-green/50 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="mt-auto border-t border-surface-700 pt-3 text-[10px] text-text-muted leading-relaxed">
            {T('footer')}
          </footer>
        </motion.div>

        {/* RIGHT — Inline Chat Panel */}
        <motion.div
          className="flex flex-col min-h-0 min-w-0 border-l border-surface-700"
          style={{ backgroundColor: 'rgba(20,20,23,0.85)', flex: 1 }}
        >
          {/* Chat header */}
          <div className="shrink-0 px-4 py-3 border-b border-surface-700 flex items-center justify-between bg-surface-800/40 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-nvidia-green" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                {hasMessages ? T('chat.conversation') : T('chat.title')}
              </span>
              {!configured && (
                <span className="text-[10px] text-amber-400/80 ml-2">
                  ⚠ API Key
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isStreaming && (
                <div className="flex items-center gap-1.5 text-[11px] text-nvidia-green">
                  <div className="w-1.5 h-1.5 rounded-full bg-nvidia-green pulse-dot" />
                  {T('chat.reasoning')}
                </div>
              )}
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-1 rounded hover:bg-surface-600 text-text-muted hover:text-text-secondary transition-colors"
                title="Settings"
              >
                <Settings size={13} />
              </button>
              {hasMessages && (
                <button
                  onClick={() => navigate('/chat')}
                  className="p-1 rounded hover:bg-surface-600 text-text-muted hover:text-text-secondary transition-colors"
                  title="Open full chat"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            {!hasMessages ? (
              /* Empty state with prompt suggestions */
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-nvidia-green/10 border border-nvidia-green/20 flex items-center justify-center mb-5">
                  <Cpu size={24} className="text-nvidia-green" />
                </div>
                <p className="text-sm text-text-secondary mb-1">{T('chat.ready')}</p>
                <p className="text-xs text-text-muted mb-6 max-w-xs leading-relaxed">
                  {T('chat.readyDesc')}
                </p>
                <div className="w-full max-w-sm space-y-2">
                  {ASK_KEYS.map(n => (
                    <button
                      key={n}
                      onClick={() => handleSend(T(`ask.${n}`))}
                      className="w-full text-left text-xs px-3 py-2.5 bg-surface-700/60 hover:bg-surface-600 text-text-secondary hover:text-text-primary rounded-lg border border-surface-600 transition-colors group flex items-center gap-2"
                    >
                      <ArrowRight size={12} className="text-nvidia-green/50 group-hover:text-nvidia-green shrink-0 group-hover:translate-x-0.5 transition-all" />
                      {T(`ask.${n}`)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message list */
              <div className="px-4 py-4 space-y-4">
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
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs flex items-center justify-between overflow-hidden"
              >
                <span>{error}</span>
                <button onClick={clearError} className="text-[10px] underline shrink-0 ml-2">Dismiss</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="shrink-0 border-t border-surface-700 bg-surface-800/80 backdrop-blur-sm px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (!chatExpanded) setChatExpanded(true); }}
                placeholder={configured ? T('chat.placeholder') : T('chat.configHint')}
                rows={1}
                className="flex-1 resize-none bg-surface-700 border border-surface-500 rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-nvidia-green/40 transition-colors"
              />
              {isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="shrink-0 p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  <Square size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="shrink-0 p-2.5 bg-nvidia-green text-black rounded-xl hover:bg-nvidia-green-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
