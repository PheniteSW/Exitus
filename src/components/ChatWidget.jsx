import { useState, useRef, useEffect } from 'react';
import {
  getChatHistory, saveChatHistory, clearChatHistory,
  getDailyCount, incrementDailyCount, FREE_DAILY_LIMIT,
} from '../utils/storage';
import { sendChatMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EMAP_AVATAR = 'https://i.postimg.cc/25sLq1hS/Untitled-design-1-removebg-preview.png';
const DISCLAIMER_SEEN_KEY = 'exitus_disclaimer_seen';

const OPENING_MESSAGE = {
  role: 'bot',
  content: `🌍 Hey there, I'm Emap!\n\nReady to explore what life looks like beyond the West? Whether you're dreaming of beaches in Southeast Asia, vibrant cities in West Africa, or affordable culture in the Mediterranean, I'm here to help you figure out where YOU fit.\n\nLet's start simple: What matters most to you in your next home? (Cost of living, safety, healthcare, weather, language, culture, internet speed, tell me anything!)`,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function DisclaimerModal({ onAccept }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, borderRadius: 24, padding: 16,
    }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 24, maxHeight: '90%', overflowY: 'auto' }}>
        <h3 style={{ color: 'var(--purple-dark)', fontWeight: 800, marginBottom: 16, fontSize: '1.1rem' }}>
          Before you chat with Emap
        </h3>

        {[
          {
            title: 'AI-generated guidance (Emap)',
            text: "Emap's responses can be incomplete, outdated, or incorrect. Treat everything as a starting point for your own research, not a final answer or guarantee.",
          },
          {
            title: 'Safety & country information',
            text: 'Conditions change quickly and may be outdated. Always check current travel advisories from your own government before making plans.',
          },
          {
            title: 'No liability',
            text: 'Exitus is provided "as is" without warranties. We are not responsible for any loss, harm, cost, or decision that results from using this service.',
          },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'rgba(91,45,142,0.05)', border: '1.5px solid rgba(91,45,142,0.12)',
            borderRadius: 14, padding: '16px 18px', marginBottom: 12,
          }}>
            <div style={{ color: 'var(--purple)', fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{item.title}</div>
            <div style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.text}</div>
          </div>
        ))}

        <a href="/terms" style={{ display: 'block', textAlign: 'center', color: 'var(--gray)', fontSize: '0.85rem', marginBottom: 16 }}>
          Read full disclaimer →
        </a>

        <button
          onClick={onAccept}
          style={{
            width: '100%', padding: '13px', borderRadius: 50,
            background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
            color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
          }}
        >
          I understand, let's go 🌍
        </button>
      </div>
    </div>
  );
}

export default function ChatWidget({ open, onClose, initialMessage }) {
  const { isProAccount } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = getChatHistory();
    return saved.length ? saved : [OPENING_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(getDailyCount);
  const [showDisclaimer, setShowDisclaimer] = useState(
    () => !localStorage.getItem(DISCLAIMER_SEEN_KEY)
  );
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const sentInitial = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !showDisclaimer) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, showDisclaimer]);

  useEffect(() => {
    if (open && initialMessage && !sentInitial.current && !showDisclaimer) {
      sentInitial.current = true;
      sendMessage(initialMessage);
    }
  }, [open, initialMessage, showDisclaimer]);

  const acceptDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_SEEN_KEY, 'true');
    setShowDisclaimer(false);
    if (initialMessage && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialMessage);
    }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    if (!isProAccount && getDailyCount() >= FREE_DAILY_LIMIT) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: msg, time };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const newCount = incrementDailyCount();
    setDailyCount(newCount);

    const apiMessages = newMessages
      .filter(m => !(m.role === 'bot' && m.content === OPENING_MESSAGE.content))
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

    try {
      const data = await sendChatMessage(apiMessages);
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
        content: 'Connection issue, please check your internet and try again.',
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

  const atLimit = !isProAccount && dailyCount >= FREE_DAILY_LIMIT;

  if (!open) return null;

  return (
    <div className="chat-window" style={{ background: '#111', color: 'white' }}>
      {showDisclaimer && <DisclaimerModal onAccept={acceptDisclaimer} />}

      {/* Header */}
      <div className="chat-header" style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div className="chat-header-avatar">
          <img src={EMAP_AVATAR} alt="Emap" />
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name" style={{ color: 'white' }}>Emap</div>
          <div className="chat-header-status" style={{ color: '#aaa', fontSize: '0.75rem' }}>Your AI relocation guide</div>
        </div>
        <span style={{ fontSize: '1.2rem', letterSpacing: 3, color: '#aaa', marginRight: 8, cursor: 'default' }}>···</span>
        <button className="chat-header-close" onClick={onClose} aria-label="Close chat" style={{ background: '#333', color: 'white' }}>✕</button>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ background: '#111', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'bot' && (
              <div className="msg-avatar">
                <img src={EMAP_AVATAR} alt="Emap" />
              </div>
            )}
            <div>
              <div className="msg-bubble" style={
                m.role === 'bot'
                  ? { background: '#222', color: 'white', border: '1px solid #333' }
                  : { background: 'var(--purple)', color: 'white' }
              }>
                {m.content}
              </div>
              <div className="msg-time" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.time}
                {m.role === 'bot' && (
                  <span style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
                    <span style={{ cursor: 'pointer', opacity: 0.5 }}>👍</span>
                    <span style={{ cursor: 'pointer', opacity: 0.5 }}>👎</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="msg-avatar"><img src={EMAP_AVATAR} alt="Emap" /></div>
            <div className="msg-bubble" style={{ background: '#222', border: '1px solid #333', padding: '12px 16px' }}>
              <div className="typing-indicator">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Disclaimer bar */}
      <div style={{
        padding: '6px 16px', background: '#1a1a1a', borderTop: '1px solid #333',
        fontSize: '0.7rem', color: '#777', textAlign: 'center',
      }}>
        EXIT US · This is general advice only, not legal advice. Consult official sources and immigration lawyers.
      </div>

      {atLimit && (
        <div className="chat-limit-notice">
          Daily limit reached (5/day free).{' '}
          <a href="#pricing" onClick={onClose}>Upgrade to Nomad for unlimited →</a>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area" style={{ background: '#1a1a1a', borderTop: '1px solid #333' }}>
        <textarea
          ref={inputRef}
          className="chat-input"
          style={{ background: '#2a2a2a', border: '1.5px solid #444', color: 'white' }}
          placeholder="Tell Emap a bit about you to get started...."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={atLimit || loading || showDisclaimer}
          rows={1}
        />
        <button
          className="chat-send"
          onClick={() => sendMessage()}
          disabled={atLimit || loading || !input.trim() || showDisclaimer}
          aria-label="Send"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
