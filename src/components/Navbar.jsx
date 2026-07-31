import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenChat, onOpenAuth }) {
  const { user, isSupabaseConfigured, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Countries', href: '#destinations' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="#home" className="logo">Exit<span>us</span></a>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
            {isSupabaseConfigured && (
              <li>
                {user ? (
                  <button
                    style={{background:'none',border:'1.5px solid var(--purple)',color:'var(--purple)',padding:'8px 16px',borderRadius:'50px',fontWeight:600,cursor:'pointer',fontSize:'0.9rem'}}
                    onClick={signOut}
                    title={user.email}
                  >
                    Log out
                  </button>
                ) : (
                  <button
                    style={{background:'none',border:'none',color:'var(--purple)',fontWeight:600,cursor:'pointer',fontSize:'0.95rem'}}
                    onClick={onOpenAuth}
                  >
                    Log in
                  </button>
                )}
              </li>
            )}
            <li>
              <button className="nav-cta" style={{background:'var(--purple)',color:'white',padding:'10px 20px',borderRadius:'50px',fontWeight:600,border:'none',cursor:'pointer',fontSize:'0.95rem'}} onClick={onOpenChat}>
                Talk to Emap
              </button>
            </li>
          </ul>
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <button style={{background:'var(--purple)',color:'white',padding:'12px',borderRadius:'50px',fontWeight:600,border:'none',cursor:'pointer'}} onClick={() => { setMobileOpen(false); onOpenChat(); }}>
          Talk to Emap
        </button>
        {isSupabaseConfigured && (
          user ? (
            <button style={{background:'none',border:'1.5px solid var(--purple)',color:'var(--purple)',padding:'12px',borderRadius:'50px',fontWeight:600,cursor:'pointer'}} onClick={() => { setMobileOpen(false); signOut(); }}>
              Log out
            </button>
          ) : (
            <button style={{background:'none',border:'1.5px solid var(--purple)',color:'var(--purple)',padding:'12px',borderRadius:'50px',fontWeight:600,cursor:'pointer'}} onClick={() => { setMobileOpen(false); onOpenAuth(); }}>
              Log in
            </button>
          )
        )}
      </div>
    </>
  );
}
