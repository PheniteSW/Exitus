export default function Hero({ onOpenChat }) {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">✈️ Your Global Relocation Guide</div>
        <h1>Ready to Exit <span>the West?</span></h1>
        <p>
          Find the best country for you with Emap — your friendly AI relocation guide.
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
      </div>
    </section>
  );
}
