const alerts = [
  {
    type: 'red',
    icon: '🚨',
    title: 'Active Conflict Zones',
    text: 'Sudan, Haiti, Myanmar, Yemen, and parts of the Sahel are experiencing active conflict. Exercise extreme caution or avoid entirely. Check travel.state.gov before any trip.',
  },
  {
    type: 'red',
    icon: '⚠️',
    title: 'Political Unrest Risk',
    text: 'Some countries face significant political instability. Monitor news and US State Dept advisories regularly. Avoid large gatherings and protests.',
  },
  {
    type: 'yellow',
    icon: '🏥',
    title: 'Healthcare & Disease Risk',
    text: 'Some regions have elevated malaria, cholera, or yellow fever risk. Get vaccinations before travel and secure international health insurance (SafetyWing, Cigna Global).',
  },
  {
    type: 'yellow',
    icon: '🏳️‍🌈',
    title: 'LGBTQ+ Safety',
    text: 'Same-sex relationships are criminalized in 60+ countries. Destinations like Thailand, Colombia, and South Africa are generally LGBTQ+-friendly. Research your destination carefully.',
  },
  {
    type: 'yellow',
    icon: '✊🏾',
    title: 'Race & Ethnicity Awareness',
    text: 'Some countries have higher rates of discrimination against certain groups. Research expat community forums for honest perspectives. Ghana, Portugal, and Colombia have strong Black expat communities.',
  },
  {
    type: 'green',
    icon: '✅',
    title: 'Safest & Least Corrupt',
    text: 'Rwanda, Mauritius, Botswana, Namibia, and Cape Verde consistently rank as Africa\'s least corrupt and most politically stable nations (Transparency International CPI).',
  },
];

export default function SafetyAlerts() {
  return (
    <section id="safety" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Safety & Risk Alerts</h2>
          <p>Know before you go. Emap keeps you informed on real risks — not just headlines.</p>
        </div>
        <div className="alerts-grid">
          {alerts.map((a, i) => (
            <div key={i} className={`alert-card ${a.type}`}>
              <div className="alert-icon">{a.icon}</div>
              <div>
                <h4>{a.title}</h4>
                <p>{a.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.875rem', color: 'var(--gray)' }}>
          Always verify current conditions at{' '}
          <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--purple)', fontWeight: 600 }}>travel.state.gov</a>{' '}
          before making any travel or relocation decisions.
        </p>
      </div>
    </section>
  );
}
