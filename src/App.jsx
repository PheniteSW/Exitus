import { useState, useEffect } from 'react';
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
import { saveSubscription } from './utils/storage';

const EMAP_AVATAR = 'https://i.postimg.cc/25sLq1hS/Untitled-design-1-removebg-preview.png';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [showNotif, setShowNotif] = useState(true);

  useEffect(() => {
    // Handle successful Stripe redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      saveSubscription({ active: true, plan: 'nomad', activatedAt: new Date().toISOString() });
      window.history.replaceState({}, '', window.location.pathname);
      setChatOpen(true);
      setInitialMessage('I just upgraded to Nomad! What should I do first to start planning my relocation?');
    }
  }, []);

  const openChat = (msg = '') => {
    setInitialMessage(msg);
    setChatOpen(true);
    setShowNotif(false);
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

      {/* Chat bubble */}
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
  );
}
