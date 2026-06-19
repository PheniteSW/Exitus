const cards = [
  {
    icon: '💸',
    title: 'Wise (formerly TransferWise)',
    desc: 'Best for international transfers with low fees. Holds multiple currencies, great exchange rates. Recommended first step for any expat.',
  },
  {
    icon: '🏦',
    title: 'SoFi',
    desc: 'US-based account with no foreign transaction fees and global ATM reimbursements. Keep it active alongside Wise for your US income.',
  },
  {
    icon: '💳',
    title: 'Charles Schwab',
    desc: 'Reimburses ALL ATM fees worldwide. Excellent for cash access in countries with less developed banking infrastructure.',
  },
  {
    icon: '🔐',
    title: 'VPN for Banking',
    desc: 'US apps (Chase, BoA) may lock your account if they detect a foreign IP. Use NordVPN or ExpressVPN set to a US city. Legal and standard expat practice.',
  },
  {
    icon: '₿',
    title: 'Crypto & Stablecoins',
    desc: 'USDC and USDT are useful in countries with volatile currencies. A practical hedge — not financial advice, always research local regulations.',
  },
  {
    icon: '🌐',
    title: 'Local Bank Accounts',
    desc: 'Ghana, Kenya, UAE, and Morocco allow non-residents to open local accounts with passport + proof of address. Others require a residency permit first.',
  },
];

export default function Banking() {
  return (
    <section id="banking" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Banking abroad made simple</h2>
          <p>Keep your money moving globally. These tools are trusted by thousands of expats worldwide.</p>
        </div>
        <div className="banking-grid">
          {cards.map((c, i) => (
            <div className="banking-card" key={i}>
              <h3>{c.icon} {c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="banking-tip">
          <strong>💡 Pro tip:</strong> Before you move, open a <strong>Wise account</strong> and a <strong>SoFi or Schwab account</strong>.
          Keep your US account active for Social Security, US income, or family transfers. Notify your bank of your move in advance to avoid frozen accounts.
          <br /><br />
          <em>This is general information, not financial advice. Confirm with your bank and a licensed financial advisor before making international transfers.</em>
        </div>
      </div>
    </section>
  );
}
