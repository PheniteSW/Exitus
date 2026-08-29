export default function Hero({ onOpenChat }) {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">✈️ Your Global Relocation Guide</div>
        <h1>Ready to Exit <span>the West?</span></h1>
        <p>
          Find the best country for you with Emap, your friendly AI relocation guide.
          Discover where your income, lifestyle, and values align with a place you can truly call home.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={onOpenChat}>
            🗺️ Let's find your EXIT
          </button>
          <a href="#features" className="btn-secondary">
            Explore Features →
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">50+</div>
            <div className="hero-stat-label">Countries Covered</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">AI</div>
            <div className="hero-stat-label">Powered by Emap</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">Free</div>
            <div className="hero-stat-label">Start Today</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">Step</div>
            <div className="hero-stat-label">by Step Guidance</div>
          </div>
        </div>

        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          border: '1px solid #e0e0e0', borderRadius: 12, padding: 20, maxWidth: 500,
          background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', margin: '32px auto 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img
              alt="Exitus, Find Your EXIT"
              src="https://ph-files.imgix.net/8bdf05e1-ad20-4981-aaf5-69949fbd5c6e.png?auto=compress,format&codec=mozjpeg&cs=strip&fit=crop&h=80&w=80"
              style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: '1 1 0%', minWidth: 0, textAlign: 'left' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Exitus, Find Your EXIT
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#666', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                How to move abroad
              </p>
            </div>
          </div>
          <a
            href="https://www.producthunt.com/products/exitus?embed=true&utm_source=embed&utm_medium=post_embed"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, padding: '8px 16px',
              background: '#ff6154', color: '#fff', textDecoration: 'none', borderRadius: 9999,
              fontSize: 16, fontWeight: 600, lineHeight: 1.5,
            }}
          >
            Check it out on Product Hunt →
          </a>
        </div>
      </div>
    </section>
  );
}
