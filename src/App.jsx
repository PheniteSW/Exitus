import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Destinations from './components/Destinations';
import SafetyAlerts from './components/SafetyAlerts';
import AboutSection from './components/AboutSection';
import Banking from './components/Banking';
import VisaLinks from './components/VisaLinks';
import Pricing from './components/Pricing';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import { saveSubscription } from './utils/storage';

const EMAP_AVATAR = 'https://i.postimg.cc/25sLq1hS/Untitled-design-1-removebg-preview.png';
const DISCORD_LINK = 'https://discord.gg/TVJk5VqE';

function WelcomeModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 36,
        maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
        <h2 style={{ color: 'var(--purple-dark)', fontWeight: 900, fontSize: '1.5rem', marginBottom: 8 }}>
          Welcome to Nomad!
        </h2>
        <p style={{ color: '#555', marginBottom: 24, lineHeight: 1.6 }}>
          You now have <strong>unlimited Emap access</strong>. Your next chapter starts here.
        </p>

        <div style={{
          background: 'linear-gradient(135deg, #5865F2, #7289DA)',
          borderRadius: 16, padding: 20, marginBottom: 24,
        }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
            🎮 Your Nomad Community
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', marginBottom: 14 }}>
            Join the private EXIT US Discord — connect with other Nomads planning their move abroad.
            <br /><strong style={{ color: 'white' }}>Save this link — you'll need it!</strong>
          </div>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', background: 'white', color: '#5865F2',
              fontWeight: 800, fontSize: '0.95rem', padding: '10px 16px',
              borderRadius: 50, textDecoration: 'none',
            }}
          >
            {DISCORD_LINK}
          </a>
        </div>

        <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: 20 }}>
          Bookmark or copy the link above — this screen won't show again.
        </p>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, var(--purple), var(--purple-light))',
            color: 'white', fontWeight: 700, fontSize: '1rem',
            border: 'none', borderRadius: 50, cursor: 'pointer',
          }}
        >
          Let's plan my move with Emap →
        </button>
      </div>
    </div>
  );
}

function HomePage({ chatOpen, setChatOpen, initialMessage, setInitialMessage }) {
  const openChat = (msg = '') => {
    setInitialMessage(msg);
    setChatOpen(true);
  };

  return (
    <>
      <Navbar onOpenChat={() => openChat()} />
      <main>
        <Hero onOpenChat={() => openChat()} />
        <Features />
        <AboutSection />
        <Destinations onOpenChat={openChat} />
        <SafetyAlerts />
        <Banking />
        <VisaLinks />
        <Pricing onOpenChat={() => openChat()} />
      </main>
      <Footer />
    </>
  );
}

function AppInner() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [showNotif, setShowNotif] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const isTermsPage = location.pathname === '/terms';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      const sessionId = params.get('session_id');
      window.history.replaceState({}, '', window.location.pathname);

      const activate = async () => {
        let customerId = null;
        let subscriptionId = null;
        if (sessionId) {
          try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${API_URL}/api/checkout-session?session_id=${sessionId}`);
            if (res.ok) {
              const data = await res.json();
              customerId = data.customerId;
              subscriptionId = data.subscriptionId;
            }
          } catch { /* silently fall back */ }
        }
        saveSubscription({
          active: true, plan: 'nomad',
          activatedAt: new Date().toISOString(),
          customerId,
          subscriptionId,
        });
        setShowWelcome(true);
      };

      activate();
    }
  }, []);

  const openChat = (msg = '') => {
    setInitialMessage(msg);
    setChatOpen(true);
    setShowNotif(false);
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setChatOpen(true);
    setInitialMessage('I just upgraded to Nomad! What should I do first to start planning my relocation?');
  };

  return (
    <>
      {showWelcome && <WelcomeModal onClose={handleWelcomeClose} />}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
              initialMessage={initialMessage}
              setInitialMessage={setInitialMessage}
            />
          }
        />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      {/* Only show chat bubble on non-terms pages */}
      {!isTermsPage && (
        <>
          <div className="chat-bubble">
            <button
              className="chat-bubble-btn"
              onClick={() => openChat()}
              aria-label="Talk to Emap"
            >
              <img src={EMAP_AVATAR} alt="Emap" />
              {showNotif && <div className="chat-notif" />}
            </button>
          </div>

          <ChatWidget
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            initialMessage={initialMessage}
          />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
