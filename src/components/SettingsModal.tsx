import { useState, useEffect } from 'react';
import { X, Key, Globe, Cpu, ExternalLink } from 'lucide-react';
import { getConfig, saveConfig } from '@/lib/llm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_MODELS = [
  { value: 'google/gemini-2.5-flash-preview:thinking', label: 'Gemini 2.5 Flash (Thinking) — Free' },
  { value: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash — Free' },
  { value: 'deepseek/deepseek-chat-v3-0324:free', label: 'DeepSeek V3 0324 — Free' },
  { value: 'meta-llama/llama-4-maverick:free', label: 'Llama 4 Maverick — Free' },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4 — Paid' },
  { value: 'openai/gpt-4o', label: 'GPT-4o — Paid' },
];

export function SettingsModal({ isOpen, onClose }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getConfig();
      setApiKey(cfg.apiKey);
      setBaseUrl(cfg.baseUrl);
      setModel(cfg.model);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSave() {
    saveConfig({ apiKey, baseUrl, model });
    setSaved(true);
    setTimeout(() => onClose(), 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-800 border border-surface-600 rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-600 text-text-muted">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {/* API Key */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <Key size={14} /> API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-or-..."
              className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-nvidia-green/50 transition-colors"
            />
            <p className="mt-1.5 text-xs text-text-muted flex items-center gap-1">
              Get a free key at
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener"
                className="text-nvidia-green hover:underline inline-flex items-center gap-0.5">
                openrouter.ai <ExternalLink size={10} />
              </a>
            </p>
          </div>

          {/* Base URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <Globe size={14} /> API Base URL
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1"
              className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-nvidia-green/50 transition-colors"
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Compatible with any OpenAI-format API (OpenRouter, Together, local LLMs...)
            </p>
          </div>

          {/* Model */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-2">
              <Cpu size={14} /> Model
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-text-primary text-sm focus:outline-none focus:border-nvidia-green/50 transition-colors appearance-none cursor-pointer"
            >
              {POPULAR_MODELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Or type custom model ID..."
              className="w-full mt-2 px-4 py-2 bg-surface-700/50 border border-surface-600 rounded-lg text-text-secondary placeholder:text-text-muted text-xs focus:outline-none focus:border-nvidia-green/50 transition-colors"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className={`text-sm transition-opacity ${saved ? 'opacity-100 text-nvidia-green' : 'opacity-0'}`}>
            ✓ Settings saved
          </p>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-nvidia-green text-black font-medium rounded-lg hover:bg-nvidia-green-dark transition-colors text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
