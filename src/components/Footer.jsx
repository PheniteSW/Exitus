export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">Exit<span>us</span></div>
            <p>
              Helping people find the country that actually works for them.
              AI-powered relocation guidance for expats, digital nomads, and dreamers.
            </p>
            <p style={{ marginTop: 12, fontSize: '0.9rem' }}>
              ✉️ <a href="mailto:polySW@proton.me" style={{ color: 'var(--purple)', fontWeight: 600 }}>polySW@proton.me</a>
            </p>
          </div>

          <div>
            <div className="footer-heading">Explore</div>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#safety">Safety Alerts</a></li>
              <li><a href="#banking">Banking Abroad</a></li>
              <li><a href="#visas">Visa Resources</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Resources</div>
            <ul className="footer-links">
              <li><a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer">US Travel Advisories</a></li>
              <li><a href="https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad" target="_blank" rel="noopener noreferrer">IRS Abroad (FBAR)</a></li>
              <li><a href="https://www.ailalawyer.com/" target="_blank" rel="noopener noreferrer">Find Immigration Lawyer</a></li>
              <li><a href="https://www.numbeo.com" target="_blank" rel="noopener noreferrer">Cost of Living Data</a></li>
              <li><a href="https://wise.com" target="_blank" rel="noopener noreferrer">Wise (Money Transfers)</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Pricing</div>
            <ul className="footer-links">
              <li><a href="#pricing">Free Explorer</a></li>
              <li><a href="#pricing">Nomad ($9.99/mo)</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">Company</div>
            <ul className="footer-links">
              <li><a href="https://phenitesw.github.io/Phenite/" target="_blank" rel="noopener noreferrer">Landing Page</a></li>
              <li><a href="https://phenitesw.github.io/ExitUsSignUp/" target="_blank" rel="noopener noreferrer">Sign Up for Updates</a></li>
              <li><a href="https://fazier.com/launches/exitus" target="_blank" rel="noopener noreferrer">Leave a Review (Fazier)</a></li>
              <li><a href="https://www.producthunt.com/products/exitus/launches/exitus" target="_blank" rel="noopener noreferrer">Review on Product Hunt</a></li>
              <li><a href="mailto:polySW@proton.me">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Exitus. General information only — not legal or financial advice.</span>
          <span>Built for dreamers who want to live on their own terms. 🌍</span>
        </div>
      </div>
    </footer>
  );
}
