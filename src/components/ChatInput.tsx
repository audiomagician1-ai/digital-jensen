import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "What's the most important lesson from NVIDIA's near-death experiences?",
  "How should I think about scaling laws in 2026?",
  "Tell me about your 60 direct reports and why you don't do 1-on-1s.",
  "What is token factory economics?",
  "Will programmers be replaced by AI?",
  "How do you make decisions under extreme uncertainty?",
];

export function ChatInput({ onSend, onStop, isStreaming, disabled }: Props) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput('');
    setShowSuggestions(false);
  }

  function handleSuggestion(text: string) {
    onSend(text);
    setShowSuggestions(false);
  }

  return (
    <div className="border-t border-surface-700 bg-surface-800/80 backdrop-blur-sm">
      {/* Suggestions */}
      {showSuggestions && !disabled && (
        <div className="px-4 pt-3 pb-1 flex flex-wrap gap-2">
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="text-xs px-3 py-1.5 bg-surface-700 hover:bg-surface-600 text-text-secondary hover:text-text-primary rounded-full border border-surface-600 transition-colors truncate max-w-[280px]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder={disabled ? 'Configure API key in Settings to start...' : 'Ask Jensen anything...'}
          disabled={disabled || isStreaming}
          rows={1}
          className="flex-1 resize-none bg-surface-700 border border-surface-500 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-nvidia-green/40 transition-colors disabled:opacity-50"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            <Square size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className="shrink-0 p-3 bg-nvidia-green text-black rounded-xl hover:bg-nvidia-green-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
