import ReactMarkdown from 'react-markdown';
import { Cpu, User } from 'lucide-react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, isStreaming }: Props) {
  const isJensen = role === 'assistant';

  return (
    <div className={`flex gap-3 ${isJensen ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
        isJensen
          ? 'bg-nvidia-green/10 border border-nvidia-green/20'
          : 'bg-surface-600 border border-surface-500'
      }`}>
        {isJensen ? <Cpu size={16} className="text-nvidia-green" /> : <User size={16} className="text-text-muted" />}
      </div>

      {/* Message */}
      <div className={`max-w-[85%] ${isJensen ? '' : 'text-right'}`}>
        <p className="text-[11px] text-text-muted mb-1 font-medium uppercase tracking-wider">
          {isJensen ? 'Jensen' : 'You'}
        </p>
        <div className={`inline-block text-left rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isJensen
            ? 'bg-surface-700/80 text-text-primary border border-surface-600'
            : 'bg-nvidia-green/10 text-text-primary border border-nvidia-green/15'
        }`}>
          <div className={`chat-markdown ${isStreaming ? 'typing-cursor' : ''}`}>
            <ReactMarkdown>{content || '...'}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
