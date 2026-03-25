// Zustand store — chat state + settings
import { create } from 'zustand';
import type { ChatMessage } from './llm';
import { streamChat, getConfig, isConfigured } from './llm';
import { buildSystemPrompt } from './persona';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

interface AppState {
  // Chat
  sessions: ChatSession[];
  activeSessionId: string | null;
  isStreaming: boolean;
  streamingText: string;
  error: string | null;

  // Settings
  isSettingsOpen: boolean;

  // Actions
  createSession: () => string;
  setActiveSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
  clearError: () => void;
}

let abortController: AbortController | null = null;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getActiveSession(state: AppState): ChatSession | undefined {
  return state.sessions.find(s => s.id === state.activeSessionId);
}

function persistSessions(sessions: ChatSession[]): void {
  try {
    // Keep only last 50 sessions and last 100 messages per session
    const trimmed = sessions.slice(-50).map(s => ({
      ...s,
      messages: s.messages.slice(-100),
    }));
    localStorage.setItem('dj-sessions', JSON.stringify(trimmed));
  } catch { /* quota exceeded — silently ignore */ }
}

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem('dj-sessions');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export const useAppStore = create<AppState>((set, get) => ({
  sessions: loadSessions(),
  activeSessionId: loadSessions()[loadSessions().length - 1]?.id ?? null,
  isStreaming: false,
  streamingText: '',
  error: null,
  isSettingsOpen: false,

  createSession: () => {
    const id = generateId();
    const session: ChatSession = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
    };
    set(state => {
      const sessions = [...state.sessions, session];
      persistSessions(sessions);
      return { sessions, activeSessionId: id };
    });
    return id;
  },

  setActiveSession: (id) => set({ activeSessionId: id }),

  deleteSession: (id) => {
    set(state => {
      const sessions = state.sessions.filter(s => s.id !== id);
      persistSessions(sessions);
      const activeSessionId = state.activeSessionId === id
        ? (sessions[sessions.length - 1]?.id ?? null)
        : state.activeSessionId;
      return { sessions, activeSessionId };
    });
  },

  clearAllSessions: () => {
    set({ sessions: [], activeSessionId: null });
    localStorage.removeItem('dj-sessions');
  },

  sendMessage: async (content: string) => {
    const state = get();
    if (state.isStreaming) return;
    if (!isConfigured()) {
      set({ error: 'Please configure your API key in Settings first.', isSettingsOpen: true });
      return;
    }

    let session = getActiveSession(state);
    if (!session) {
      const id = get().createSession();
      session = get().sessions.find(s => s.id === id)!;
    }

    const userMsg: ChatMessage = { role: 'user', content };
    const systemMsg: ChatMessage = { role: 'system', content: buildSystemPrompt() };
    const allMessages = [systemMsg, ...session.messages, userMsg];

    // Add user message immediately
    set(state => {
      const sessions = state.sessions.map(s =>
        s.id === session!.id
          ? {
              ...s,
              messages: [...s.messages, userMsg],
              title: s.messages.length === 0 ? content.slice(0, 60) : s.title,
            }
          : s
      );
      persistSessions(sessions);
      return { sessions, isStreaming: true, streamingText: '', error: null };
    });

    abortController = new AbortController();
    let fullResponse = '';

    try {
      for await (const chunk of streamChat(allMessages, getConfig(), abortController.signal)) {
        fullResponse += chunk;
        set({ streamingText: fullResponse });
      }

      // Add assistant message
      const assistantMsg: ChatMessage = { role: 'assistant', content: fullResponse };
      set(state => {
        const sessions = state.sessions.map(s =>
          s.id === session!.id
            ? { ...s, messages: [...s.messages, assistantMsg] }
            : s
        );
        persistSessions(sessions);
        return { sessions, isStreaming: false, streamingText: '' };
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled — save partial response if any
        if (fullResponse.length > 0) {
          const partialMsg: ChatMessage = { role: 'assistant', content: fullResponse + '\n\n*[Stopped]*' };
          set(state => {
            const sessions = state.sessions.map(s =>
              s.id === session!.id
                ? { ...s, messages: [...s.messages, partialMsg] }
                : s
            );
            persistSessions(sessions);
            return { sessions, isStreaming: false, streamingText: '' };
          });
        } else {
          set({ isStreaming: false, streamingText: '' });
        }
      } else {
        const message = err instanceof Error ? err.message : 'Unknown error';
        set({ isStreaming: false, streamingText: '', error: message });
      }
    }
  },

  stopStreaming: () => {
    abortController?.abort();
    abortController = null;
  },

  toggleSettings: () => set(state => ({ isSettingsOpen: !state.isSettingsOpen })),
  setSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
  clearError: () => set({ error: null }),
}));
