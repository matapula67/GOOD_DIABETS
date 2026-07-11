import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBotReply, QUICK_SUGGESTIONS, BotAction } from '../lib/chatbot';
import { IconChat } from './Icons';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  action?: BotAction;
}

let counter = 0;
const nextId = () => 'm_' + Date.now().toString(36) + '_' + counter++;

const WELCOME =
  'Habari! Mimi ni msaidizi wa AfyaTathmini. Niulize chochote kuhusu tathmini, ripoti, historia, au jinsi ya kuwasiliana na daktari.';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), from: 'bot', text: WELCOME },
  ]);
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const userMsg: Message = { id: nextId(), from: 'user', text };
    const reply = getBotReply(text);
    const botMsg: Message = { id: nextId(), from: 'bot', text: reply.text, action: reply.action };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const goTo = (action: BotAction) => {
    setOpen(false);
    navigate(action.to);
  };

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>Msaidizi wa AfyaTathmini</span>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Funga">
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.from}`}>
                <div className="bubble">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {m.action && (
                    <button type="button" className="chat-action-btn" onClick={() => goTo(m.action!)}>
                      {m.action.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="chat-suggestions">
              {QUICK_SUGGESTIONS.map((s) => (
                <button type="button" key={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Andika swali lako..."
              aria-label="Andika swali lako kwa chatbot"
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
              Tuma
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Funga Msaidizi' : 'Fungua Msaidizi'}
      >
        <IconChat />
      </button>
    </div>
  );
}
