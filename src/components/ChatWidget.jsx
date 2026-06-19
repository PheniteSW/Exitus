import { useState, useRef, useEffect } from 'react';
import {
  getChatHistory, saveChatHistory, clearChatHistory,
  getDailyCount, incrementDailyCount, FREE_DAILY_LIMIT, isPro,
} from '../utils/storage';

const EMAP_AVATAR = 'https://i.postimg.cc/25sLq1hS/Untitled-design-1-removebg-preview.png';

const OPENING_MESSAGE = {
  role: 'bot',
  content: `🌍 Hey there, I'm Emap!\n\nReady to explore what life looks like beyond the West? Whether you're dreaming of beaches in Southeast Asia, vibrant cities in West Africa, or affordable culture in the Mediterranean — I'm here to help you figure out where YOU fit.\n\nLet's start simple: What matters most to you in your next home? (Cost of living, safety, healthcare, weather, language, culture, internet speed — tell me anything!)`,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function ChatWidget({ open, onClose, initialMessage }) {
  const [messages, setMessages] = useState(() => {
    const saved = getChatHistory();
    return saved.length ? saved : [OPENING_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(getDailyCount);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open && initialMessage && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialMessage);
    }
  }, [open, initialMessage]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const pro = isPro();
    const count = getDailyCount();

    if (!pro && count >= FREE_DAILY_LIMIT) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: msg, time };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const newCount = incrementDailyCount();
    setDailyCount(newCount);

    const apiMessages = newMessages
      .filter(m => m.role !== 'bot' || m.content !== OPENING_MESSAGE.content)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      const botMsg = {
        role: 'bot',
        content: data.content || 'Sorry, I had trouble responding. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const final = [...newMessages, botMsg];
      setMessages(final);
      saveChatHistory(final);
    } catch {
      const errMsg = {
        role: 'bot',
        content: 'Connection issue — please check your internet and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const final = [...newMessages, errMsg];
      setMessages(final);
      saveChatHistory(final);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    const fresh = [OPENING_MESSAGE];
    setMessages(fresh);
    clearChatHistory();
    sentInitial.current = false;
  };

  const pro = isPro();
  const atLimit = !pro && dailyCount >= FREE_DAILY_LIMIT;

  if (!open) return null;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-avatar">
          <img src={EMAP_AVATAR} alt="Emap" />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">Emap</div>
          <div className="chat-header-status">Your AI relocation guide</div>
        </div>
        <button
          onClick={handleClear}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 10px', borderRadius: 12, fontSize: '0.75rem', cursor: 'pointer', marginRight: 4 }}
          title="Clear chat"
        >
          Clear
        </button>
        <button className="chat-header-close" onClick={onClose} aria-label="Close chat">✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'bot' && (
              <div className="msg-avatar">
                <img src={EMAP_AVATAR} alt="Emap" />
              </div>
            )}
            <div>
              <div className="msg-bubble">{m.content}</div>
              <div className="msg-time">{m.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="msg-avatar">
              <img src={EMAP_AVATAR} alt="Emap" />
            </div>
            <div className="msg-bubble" style={{ padding: '12px 16px' }}>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat-disclaimer">
        EXIT US · This is general advice only, not legal advice. Consult official sources and immigration lawyers.
      </div>

      {atLimit && (
        <div className="chat-limit-notice">
          Daily limit reached (5/day on free plan).{' '}
          <a href="#pricing" onClick={onClose}>Upgrade to Nomad for unlimited chats →</a>
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Tell Emap a bit about you to get started..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={atLimit || loading}
          rows={1}
        />
        <button
          className="chat-send"
          onClick={() => sendMessage()}
          disabled={atLimit || loading || !input.trim()}
          aria-label="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
