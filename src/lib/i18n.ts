// Lightweight i18n — EN / ZH toggle
import { create } from 'zustand';

export type Lang = 'en' | 'zh';

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

function loadLang(): Lang {
  try {
    const saved = localStorage.getItem('dj-lang');
    if (saved === 'zh' || saved === 'en') return saved;
    // Auto-detect from browser
    if (navigator.language.startsWith('zh')) return 'zh';
  } catch { /* ignore */ }
  return 'en';
}

export const useI18n = create<I18nState>((set) => ({
  lang: loadLang(),
  setLang: (lang) => { localStorage.setItem('dj-lang', lang); set({ lang }); },
  toggleLang: () => set(state => {
    const next = state.lang === 'en' ? 'zh' : 'en';
    localStorage.setItem('dj-lang', next);
    return { lang: next };
  }),
}));

// Translation dictionary
const dict = {
  // Header
  'header.github': { en: 'GitHub ↗', zh: 'GitHub ↗' },

  // Hero
  'hero.title1': { en: 'Think like', zh: '像' },
  'hero.title2': { en: 'Jensen Huang', zh: '黄仁勋' },
  'hero.title3': { en: '', zh: '一样思考' },
  'hero.desc': {
    en: "An AI persona distilled from Jensen's public speeches, keynotes, and interviews. Ask about first-principles thinking, scaling laws, NVIDIA history, leadership, or the future of computing.",
    zh: '一个从黄仁勋公开演讲、主题演讲和访谈中蒸馏出的 AI 人格。你可以询问第一性原理思维、Scaling Laws、NVIDIA 历史、领导力或计算的未来。',
  },

  // Quotes
  'quote.1.text': { en: 'How hard could it be?', zh: '这能有多难？' },
  'quote.1.ctx': { en: 'On starting NVIDIA', zh: '谈创立 NVIDIA' },
  'quote.2.text': { en: 'Either you are running for food, or running from becoming food.', zh: '你要么在觅食，要么在逃命。' },
  'quote.2.ctx': { en: 'NTU Commencement 2023', zh: '台大毕业典礼 2023' },
  'quote.3.text': { en: 'Intelligence will be commoditized. Character will not.', zh: '智能会被商品化，但品格不会。' },
  'quote.3.ctx': { en: 'Lex Fridman 2026', zh: 'Lex Fridman 访谈 2026' },
  'quote.4.text': { en: 'Enough crying. Get up and get to work.', zh: '别哭了，起来干活。' },
  'quote.4.ctx': { en: 'On resilience', zh: '谈韧性' },
  'quote.5.text': { en: 'If we do NOT build it, they CANNOT come.', zh: '如果我们不去建造，他们就不会到来。' },
  'quote.5.ctx': { en: 'On the CUDA bet', zh: '谈 CUDA 的豪赌' },

  // Sections
  'section.expertise': { en: 'Areas of expertise', zh: '专业领域' },
  'section.sources': { en: 'Distilled from', zh: '知识来源' },

  // Topics
  'topic.1': { en: 'AI & Computing Architecture', zh: 'AI 与计算架构' },
  'topic.2': { en: 'Token Factory Economics', zh: 'Token 工厂经济学' },
  'topic.3': { en: 'Leadership & Management', zh: '领导力与管理' },
  'topic.4': { en: 'Entrepreneurship & Resilience', zh: '创业与韧性' },
  'topic.5': { en: 'Future of Work & Programming', zh: '工作与编程的未来' },
  'topic.6': { en: 'NVIDIA History & Strategy', zh: 'NVIDIA 历史与战略' },
  'topic.7': { en: 'Scaling Laws & Infrastructure', zh: 'Scaling Laws 与基础设施' },
  'topic.8': { en: 'Philosophy of Intelligence', zh: '智能哲学' },

  // Chat panel
  'chat.title': { en: 'Ask Jensen', zh: '向 Jensen 提问' },
  'chat.conversation': { en: 'Conversation', zh: '对话中' },
  'chat.ready': { en: 'Ready to reason', zh: '准备推理' },
  'chat.readyDesc': { en: "Ask anything — I'll reason from first principles, just as I always do.", zh: '随便问——我会从第一性原理出发推理，一如既往。' },
  'chat.reasoning': { en: 'Reasoning…', zh: '推理中…' },
  'chat.placeholder': { en: 'Ask Jensen anything...', zh: '向 Jensen 提问...' },
  'chat.configHint': { en: 'Configure API key to start...', zh: '请先配置 API Key...' },

  // Quick asks
  'ask.1': { en: 'How should I think about scaling laws?', zh: '我该如何理解 Scaling Laws？' },
  'ask.2': { en: 'What is token factory economics?', zh: '什么是 Token 工厂经济学？' },
  'ask.3': { en: 'Will programmers be replaced by AI?', zh: '程序员会被 AI 取代吗？' },
  'ask.4': { en: 'Tell me about your leadership philosophy.', zh: '谈谈你的领导力哲学。' },

  // Footer
  'footer': {
    en: "Fan project for educational purposes. All source material is from Jensen Huang's public appearances. Not affiliated with NVIDIA Corporation.",
    zh: '粉丝项目，仅供学习交流。所有素材均来自黄仁勋的公开演讲。与 NVIDIA 公司无关。',
  },
} as const;

type Key = keyof typeof dict;

export function t(key: Key, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}
