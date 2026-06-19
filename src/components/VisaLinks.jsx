const visaResources = [
  { country: '🇺🇸 Leaving the US', title: 'US State Dept Travel Advisories', desc: 'Official country-by-country safety ratings and travel notices.', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html' },
  { country: '🇹🇭 Thailand', title: 'Thailand LTR Visa', desc: 'Long-Term Resident visa for remote workers & retirees. Up to 10 years.', url: 'https://ltr.boi.go.th/' },
  { country: '🇲🇾 Malaysia', title: 'Malaysia MM2H', desc: 'Malaysia My Second Home program — long-term renewable visa.', url: 'https://www.mm2h.gov.my/' },
  { country: '🇷🇼 Rwanda', title: 'Rwanda Online Business Hub', desc: 'Open a business in 24–48 hours. Least corrupt in Africa.', url: 'https://org.rdb.rw/' },
  { country: '🇲🇺 Mauritius', title: 'Mauritius Premium Visa', desc: '10-year residency with modern banking and territorial tax system.', url: 'https://www.edb.gov.mu/' },
  { country: '🇨🇻 Cape Verde', title: 'Cape Verde Digital Nomad Visa', desc: '1-2 year visa for remote workers earning $1,000+/month.', url: 'https://digitalnomads.capeverde.com/' },
  { country: '🇵🇦 Panama', title: 'Panama Pensionado Visa', desc: 'Retirement visa with significant discounts. One of the best in the world.', url: 'https://www.migration.gob.pa/' },
  { country: '🇲🇦 Morocco', title: 'Morocco Long-Stay Visa', desc: '1-year renewable stay. Gateway to Europe. Low cost of living.', url: 'https://www.consulat.ma/' },
  { country: '🇰🇪 Kenya', title: 'Kenya e-Visa Portal', desc: 'Online visa application for East Africa\'s tech hub.', url: 'https://evisa.go.ke/' },
  { country: '🇦🇪 UAE', title: 'UAE Golden Visa', desc: '5 or 10-year residency for investors, professionals & remote workers.', url: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas' },
  { country: '💼 Tax Obligations', title: 'IRS Abroad (FBAR & FATCA)', desc: 'US citizens must file taxes abroad. Know your FBAR and FATCA obligations.', url: 'https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad' },
  { country: '⚖️ Immigration Lawyers', title: 'AILA Attorney Directory', desc: 'Find a licensed immigration attorney through the official AILA directory.', url: 'https://www.ailalawyer.com/' },
];

export default function VisaLinks() {
  return (
    <section id="visas">
      <div className="container">
        <div className="section-header">
          <h2>Visa & residency resources</h2>
          <p>Direct links to official government portals and trusted resources — always go to the source.</p>
        </div>
        <div className="visa-grid">
          {visaResources.map((v, i) => (
            <div className="visa-link-card" key={i}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 600 }}>{v.country}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
              <a href={v.url} target="_blank" rel="noopener noreferrer">
                Visit official site →
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.875rem', color: 'var(--gray)' }}>
          Immigration rules change frequently. Always verify with official government sources and consult a licensed immigration attorney.
        </p>
      </div>
    </section>
  );
}
