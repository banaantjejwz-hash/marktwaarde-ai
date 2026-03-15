'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  'Ik heb €500 per maand om te beleggen. Wat is een verstandige verdeling?',
  'Hoe denk ik na over het opbouwen van mijn eerste portefeuille?',
  'Past Bitcoin bij mijn profiel, of moet ik me focussen op ETFs?',
  'Ik wil beleggen, maar heb ook een noodfonds nodig. Wat gaat voor?',
  'Wat is het verschil tussen risico en volatiliteit als belegger?',
  'Hoe werkt dollar-cost averaging en wanneer is het slim?',
];

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-slate-200">$1</code>')
    .replace(/^— (.*)$/gm, '<span class="text-slate-500 italic text-xs">— $1</span>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br />');
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Verzoek mislukt');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { role: 'assistant', content: last.content + chunk },
            ];
          }
          return prev;
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Onbekende fout';
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // remove empty assistant msg
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] md:h-[calc(100vh-48px)] px-0">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-[#1e2d45] bg-[#0a0e1a]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-100">AI Beleggingsadviseur</h1>
              <p className="text-xs text-slate-500">Persoonlijke financiële denkpartner</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setError(null); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            >
              Nieuw gesprek
            </button>
          )}
        </div>
      </div>

      {/* ── Message area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

          {/* Empty state */}
          {isEmpty && (
            <div className="space-y-8">
              {/* Welcome */}
              <div className="text-center space-y-3 pt-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Hoe kan ik je helpen?</h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Ik ben je professionele beleggings-denkpartner. Stel me een vraag over je financiële situatie, strategie of doelen — ik help je helder nadenken.
                  </p>
                </div>
              </div>

              {/* Starter prompts */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">Veelgestelde vragen</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left px-4 py-3 rounded-xl bg-[#111827] border border-[#1e2d45] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-sm text-slate-300 hover:text-slate-100 leading-snug group"
                    >
                      <span className="text-blue-500 mr-2 group-hover:text-blue-400 transition-colors">→</span>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">Waarmee kan ik je helpen</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '📊', title: 'Portefeuilledenken', desc: 'Allocatie, diversificatie, balans' },
                    { icon: '🎯', title: 'Doelen stellen', desc: 'Pensioen, vermogensopbouw, aankoop' },
                    { icon: '⚖️', title: 'Risico begrijpen', desc: 'Profiel bepalen, trade-offs wegen' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-2.5">
                      <span className="text-base flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-300">{title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isEmpty && (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      : 'bg-slate-700/50 border border-slate-600 text-slate-400'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-500/15 border border-blue-500/25 text-slate-200 rounded-tr-sm'
                      : 'bg-[#111827] border border-[#1e2d45] text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      msg.content ? (
                        <div
                          className="space-y-0"
                          dangerouslySetInnerHTML={{
                            __html: '<p>' + formatMessage(msg.content) + '</p>',
                          }}
                        />
                      ) : (
                        // Typing indicator
                        <div className="flex items-center gap-1 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t border-[#1e2d45] bg-[#0a0e1a] px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Stel een vraag over je beleggingssituatie..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
                         focus:outline-none focus:border-blue-500/50 focus:bg-[#111827] transition-colors resize-none
                         disabled:opacity-50 min-h-[40px] max-h-[120px]"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:opacity-50
                         flex items-center justify-center transition-colors"
              aria-label="Verstuur bericht"
            >
              {isLoading ? (
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </form>

          <p className="text-xs text-slate-700 mt-2 text-center leading-relaxed">
            Beslissingsondersteuning — geen financieel advies. Raadpleeg een gecertificeerd adviseur voor persoonlijke beslissingen.
          </p>
        </div>
      </div>

    </div>
  );
}
