import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  ShieldCheck,
  Info,
  BookOpen,
  FileSearch,
  Activity,
  Heart,
  Volume2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { aiService } from '../../services/ai/aiService.ts';
import { AIServiceStatus, AIQueryDomain, AIQueryResult } from '../../services/ai/types.ts';
import { useVoice } from '../voice/VoiceContext.tsx';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { Button } from '../../components/ui/Button.tsx';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowUps?: string[];
  isEmergency?: boolean;
}

export const AIAssistantPage: React.FC = () => {
  const { isVoiceMode, speak, startListening, stopListening, isListening, transcript } = useVoice();
  const { language } = useLanguage();

  const [status, setStatus] = useState<AIServiceStatus | null>(null);
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<AIQueryDomain>('health-education');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    aiService.getStatus().then((st) => setStatus(st));
  }, []);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  const handleVoiceInputToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setQuery(text);
      });
    }
  };

  const executeQuery = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const result: AIQueryResult = await aiService.queryAssistant({
        prompt: promptText.trim(),
        domain: selectedDomain,
        userContext: { language },
      });

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: result.sources,
        suggestedFollowUps: result.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (isVoiceMode) {
        speak(result.answer.slice(0, 200));
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to retrieve real-time medical intelligence at this moment. Please verify your connection or review our certified clinical guides.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['Clinical Safety Cache'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(query);
  };

  const domainOptions = [
    { id: 'health-education', label: 'Health Education', icon: BookOpen },
    { id: 'medical-report-explanation', label: 'Report Explanation', icon: FileSearch },
    { id: 'exercise-guidance', label: 'Cardio & Conditioning', icon: Activity },
    { id: 'nutrition-guidance', label: 'Clinical Nutrition', icon: Heart },
  ];

  const suggestedQuestions = [
    "What does 'Mean Corpuscular Volume (MCV)' mean on a CBC blood test?",
    'What is the difference between LDL-C and ApoB in cardiovascular risk?',
    'How does soluble prebiotic fiber reduce postprandial glucose spikes?',
    'What are the warning signs of metabolic insulin resistance?',
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitmadix Clinical Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash Grounded</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#002B49]">
            AI Health Assistant
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Translate complex lab abbreviations, evaluate clinical terminology, and review evidence-backed health education.
          </p>
        </div>

        {status && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF9] border border-[#00A88F]/30 rounded-full text-[11px] font-bold text-[#002B49]">
            <span className="w-2 h-2 rounded-full bg-[#00A88F] animate-pulse" />
            <span>Engine: {status.model || 'Gemini 3.8 Flash'}</span>
          </div>
        )}
      </div>

      {/* Strict Ethical Medical Disclaimer Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Clinical Safety Rule & Ethical Boundary</p>
          <p className="text-amber-900 leading-relaxed">
            Fitmadix is an educational health assistant, not a clinical doctor. It never diagnoses conditions, prescribes pharmaceuticals, or interprets acute emergencies. If experiencing severe chest pain, shortness of breath, or neurological symptoms, call 911 / 112 immediately.
          </p>
        </div>
      </div>

      {/* Query Domain Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Inquiry Domain Focus
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {domainOptions.map((opt) => {
            const isSelected = selectedDomain === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedDomain(opt.id as AIQueryDomain)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#00A88F] bg-[#F0FDF9] text-[#002B49] font-bold ring-1 ring-[#00A88F]/40'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00A88F]' : 'text-slate-400'}`} />
                <span className="text-xs whitespace-nowrap truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation Thread */}
      {messages.length > 0 && (
        <div className="space-y-4 pt-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-slate-100/90 border-slate-200 text-slate-900 ml-8 sm:ml-16'
                  : 'bg-white border-slate-200/90 shadow-2xs text-slate-800 mr-4 sm:mr-8 bg-medical-grid'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-[#002B49]">
                  {msg.sender === 'user' ? '👤 Your Inquiry' : '🏛 Fitmadix Clinical Intelligence'}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Message text with paragraph styling */}
              <div className="text-slate-800 whitespace-pre-line text-sm leading-relaxed">
                {msg.text}
              </div>

              {/* Assistant Footer: Sources & Audio */}
              {msg.sender === 'assistant' && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Verified Sources:</span>
                    {msg.sources?.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => speak(msg.text)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#00A88F] hover:bg-[#F0FDF9] rounded-lg transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 self-center">Follow-up:</span>
                  {msg.suggestedFollowUps.map((fu, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeQuery(fu)}
                      className="text-[11px] font-semibold text-[#002B49] bg-white border border-slate-200 hover:border-[#00A88F] px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      {fu} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Suggested Inquiries Shelf if thread is short */}
      {messages.length === 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Suggested High-Yield Clinical Questions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => executeQuery(q)}
                className="p-3 bg-white border border-slate-200/90 hover:border-[#00A88F] hover:bg-[#F0FDF9] rounded-xl text-left text-xs text-slate-700 font-medium transition-colors cursor-pointer flex items-center justify-between group"
              >
                <span>{q}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00A88F] shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Pulse */}
      {loading && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00A88F]">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting Medical Knowledge Base...</span>
          </div>
          <div className="w-3/4 h-3 bg-slate-200 rounded" />
          <div className="w-5/6 h-3 bg-slate-200 rounded" />
          <div className="w-1/2 h-3 bg-slate-200 rounded" />
        </div>
      )}

      {/* Query Input Box */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 sm:p-5 space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your medical education question or lab test inquiry..."
            className="w-full p-3.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A88F] focus:bg-white resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {/* Microphone button for speech input */}
            <button
              type="button"
              onClick={handleVoiceInputToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Voice Dictation</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">Web Speech API</span>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={!query.trim() || loading} size="sm">
              <span>{loading ? 'Synthesizing...' : 'Send Question'}</span>
              <Send className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
