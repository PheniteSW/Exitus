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
        setChatOpen(true);
        setInitialMessage('I just upgraded to Nomad! What should I do first to start planning my relocation?');
      };

      activate();
    }
  }, []);

  const openChat = (msg = '') => {
    setInitialMessage(msg);
    setChatOpen(true);
    setShowNotif(false);
  };

  return (
    <>
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
