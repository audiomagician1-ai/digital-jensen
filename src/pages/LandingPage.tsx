import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Cpu, Brain, Zap, ArrowRight } from 'lucide-react';
import { getPersonaTopics } from '@/lib/persona';

const QUOTES = [
  { text: "How hard could it be?", context: "On starting NVIDIA" },
  { text: "Either you are running for food, or running from becoming food.", context: "NTU Commencement 2023" },
  { text: "Intelligence will be commoditized. Character will not.", context: "Lex Fridman 2026" },
  { text: "Enough crying. Get up and get to work.", context: "On resilience" },
  { text: "If we do NOT build it, they CANNOT come.", context: "On the CUDA bet" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const topics = getPersonaTopics();

  return (
    <div className="min-h-screen bg-surface-900 overflow-hidden">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(118,185,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(118,185,0,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-20"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-nvidia-green/10 border border-nvidia-green/20 flex items-center justify-center">
              <Cpu size={18} className="text-nvidia-green" />
            </div>
            <span className="text-sm font-medium tracking-wider text-text-secondary uppercase">Digital Jensen</span>
          </div>
          <a href="https://github.com/audiomagician1-ai/digital-jensen" target="_blank" rel="noopener"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            GitHub ↗
          </a>
        </motion.header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-text-primary">Think like</span><br />
            <span className="glow-green text-nvidia-green">Jensen Huang</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
            An AI persona distilled from Jensen's public speeches, keynotes, and interviews.
            Ask about first-principles thinking, scaling laws, NVIDIA history, leadership, 
            or the future of computing — and get answers as Jensen would reason through them.
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-nvidia-green text-black font-semibold rounded-xl hover:bg-nvidia-green-dark transition-all duration-200 shadow-lg shadow-nvidia-green/20 hover:shadow-nvidia-green/30"
          >
            <MessageSquare size={20} />
            Start Conversation
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.section>

        {/* Quotes carousel */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {QUOTES.map((q, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="border-l-2 border-nvidia-green/30 pl-5 py-3"
              >
                <p className="text-text-primary font-medium italic">"{q.text}"</p>
                <cite className="text-xs text-text-muted mt-1 block not-italic">— {q.context}</cite>
              </motion.blockquote>
            ))}
          </div>
        </motion.section>

        {/* Topics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <Brain size={14} /> Areas of expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {topics.map(t => (
              <span key={t} className="px-3 py-1.5 text-sm text-text-secondary bg-surface-700 rounded-lg border border-surface-600">
                {t}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Data sources */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap size={14} /> Distilled from
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              'Lex Fridman Podcast #494 (2026)',
              'GTC 2025 & 2026 Keynotes',
              'Acquired Podcast (2023)',
              'NTU & Caltech Commencement Speeches',
              'CBS 60 Minutes Interview',
              'Forbes / Inc / CNBC Profiles',
            ].map(s => (
              <div key={s} className="flex items-center gap-2 text-text-secondary">
                <div className="w-1.5 h-1.5 rounded-full bg-nvidia-green/50" />
                {s}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-surface-700 pt-6 text-xs text-text-muted">
          <p>This is a fan project for educational purposes. All source material is from Jensen Huang's public appearances.
          Not affiliated with NVIDIA Corporation.</p>
        </footer>
      </div>
    </div>
  );
}
