import { useState, useRef, useEffect } from 'react'
import { api } from '../api/endpoints'
import clsx from 'clsx'

const QUICK_PROMPTS = [
  'Which shipment is highest risk?',
  'Are any shipments delayed?',
  'Give me a fleet status report',
  'Should I reroute any shipments?',
  'What is the ETA for active routes?',
  'What happens during a storm simulation?',
]

/** Renders markdown-lite: **bold**, line breaks, bullet • */
function RenderText({ text }) {
  if (!text) return null
  return (
    <span>
      {text.split('\n').map((line, li, arr) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <span key={li}>
            {parts.map((part, pi) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={pi} className="font-semibold">{part.slice(2, -2)}</strong>
                : <span key={pi}>{part}</span>
            )}
            {li < arr.length - 1 && <br />}
          </span>
        )
      })}
    </span>
  )
}

function SourceBadge({ source }) {
  const isGemini = source === 'gemini-1.5-flash'
  if (!source) return null
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1.5',
      isGemini
        ? 'bg-blue-100/60 text-blue-500 border border-blue-200/60'
        : 'bg-slate-100/60 text-slate-400 border border-slate-200/60'
    )}>
      {isGemini ? '✦ Gemini 1.5 Flash' : '⚙ Rule-based'}
    </span>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-2 animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 font-medium',
        isUser ? 'bg-indigo-500 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
      )}>
        {isUser ? '👤' : '✦'}
      </div>

      {/* Bubble */}
      <div className={clsx(
        'max-w-[85%] text-sm leading-relaxed',
        isUser ? 'items-end' : 'items-start',
        'flex flex-col'
      )}>
        <div className={clsx(
          'rounded-2xl px-3.5 py-2.5',
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-md'
            : 'bg-white/85 text-slate-700 border border-white/50 shadow-sm rounded-tl-md'
        )}>
          {msg.typing ? (
            <span className="flex gap-1 items-center py-0.5 px-1">
              {[0, 150, 300].map(d => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          ) : (
            <RenderText text={msg.text} />
          )}
        </div>

        {/* Source badge — only on assistant messages */}
        {!isUser && !msg.typing && msg.source && (
          <SourceBadge source={msg.source} />
        )}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant', source: 'gemini-1.5-flash',
      text: "✦ Hello! I'm **SmartChain Copilot**, powered by Gemini 1.5 Flash.\n\nAsk me about fleet risk, ETAs, rerouting decisions, or disruption impact — I have live visibility into your shipments.",
    },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  async function send(text) {
    const q = (text || input).trim()
    if (!q || loading) return

    const uid     = Date.now()
    const thinkId = uid + 1

    setMessages(m => [
      ...m,
      { id: uid,     role: 'user',      text: q },
      { id: thinkId, role: 'assistant', text: '', typing: true },
    ])
    setInput('')
    setLoading(true)

    try {
      const res    = await api.chat({ query: q })
      const source = res.data.source || 'rule-based-fallback'
      setMessages(m =>
        m.filter(x => x.id !== thinkId).concat({
          id: uid + 2,
          role: 'assistant',
          text: res.data.response,
          source,
        })
      )
    } catch {
      setMessages(m =>
        m.filter(x => x.id !== thinkId).concat({
          id: uid + 2,
          role: 'assistant',
          text: 'Sorry — could not reach the AI service. Please check that the backend and ai-service are both running.',
          source: 'error',
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-float flex items-center justify-center transition-all hover:scale-105 active:scale-95',
          open
            ? 'bg-slate-700 text-white text-xl'
            : 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-2xl'
        )}
        title="SmartChain Copilot — Gemini 1.5 Flash"
      >
        {open ? '×' : '✦'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 flex flex-col animate-slide-up overflow-hidden rounded-2xl shadow-float glass-dark"
          style={{ width: 390, maxWidth: 'calc(100vw - 2rem)', maxHeight: '72vh' }}
        >
          {/* Header */}
          <div className="shrink-0 px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-700/80 to-blue-700/80 border-b border-indigo-600/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-base font-bold text-white">
                ✦
              </div>
              <div>
                <div className="text-white font-semibold text-sm leading-tight">SmartChain Copilot</div>
                <div className="text-indigo-200 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                  Gemini 1.5 Flash
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map(msg => <Message key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — visible on fresh chat */}
          {messages.length <= 2 && (
            <div className="shrink-0 px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.slice(0, 4).map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] bg-indigo-800/50 hover:bg-indigo-700/60 text-indigo-200 border border-indigo-600/40 rounded-full px-2.5 py-1 transition-colors leading-snug"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="shrink-0 px-3 pb-3 pt-2 border-t border-indigo-800/30 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about your fleet..."
              disabled={loading}
              className="flex-1 bg-indigo-900/40 border border-indigo-700/30 text-white placeholder-indigo-300/50 text-sm rounded-xl px-3 py-2 outline-none focus:border-indigo-500/60 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-xl px-3.5 py-2 transition-all font-medium text-sm active:scale-95"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                : '↑'
              }
            </button>
          </div>
        </div>
      )}
    </>
  )
}
