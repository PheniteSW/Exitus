import { useState } from 'react';

const destinations = [
  { code: 'TH', name: 'Thailand', region: 'SE Asia', cost: '$900–$2k/mo', desc: 'Easy visas, great food, strong expat scene.', flag: '🇹🇭' },
  { code: 'GH', name: 'Ghana', region: 'West Africa', cost: '$700–$1.5k/mo', desc: 'Year of Return community, English-speaking.', flag: '🇬🇭' },
  { code: 'MY', name: 'Malaysia', region: 'SE Asia', cost: '$1k–$2k/mo', desc: 'MM2H visa, multicultural, top healthcare.', flag: '🇲🇾' },
  { code: 'CO', name: 'Colombia', region: 'Latin America', cost: '$900–$1.8k/mo', desc: 'Spring weather, digital nomad visa.', flag: '🇨🇴' },
  { code: 'MA', name: 'Morocco', region: 'MENA', cost: '$800–$1.6k/mo', desc: '1-year visa-free stays, gateway to EU.', flag: '🇲🇦' },
  { code: 'KE', name: 'Kenya', region: 'East Africa', cost: '$800–$1.7k/mo', desc: 'Nairobi tech hub, Swahili-English.', flag: '🇰🇪' },
  { code: 'VN', name: 'Vietnam', region: 'SE Asia', cost: '$700–$1.5k/mo', desc: 'Low cost, fast internet, food paradise.', flag: '🇻🇳' },
  { code: 'AE', name: 'UAE', region: 'MENA', cost: '$2k–$5k/mo', desc: 'Tax-free income, golden visa pathway.', flag: '🇦🇪' },
  { code: 'MU', name: 'Mauritius', region: 'Indian Ocean', cost: '$2k–$3.5k/mo', desc: '10-year residency, territorial tax, modern banking.', flag: '🇲🇺' },
  { code: 'RW', name: 'Rwanda', region: 'East Africa', cost: '$1.2k–$2k/mo', desc: 'Singapore of Africa, least corrupt, open business in 48hrs.', flag: '🇷🇼' },
  { code: 'CV', name: 'Cape Verde', region: 'Atlantic Africa', cost: '$1k–$1.8k/mo', desc: 'Digital nomad visa, investor pathway, Atlantic island life.', flag: '🇨🇻' },
  { code: 'PT', name: 'Panama', region: 'Latin America', cost: '$1.2k–$2k/mo', desc: 'Pensionado visa, dollarized economy, low taxes.', flag: '🇵🇦' },
];

export default function Destinations({ onOpenChat }) {
  const [active, setActive] = useState(null);

  const handleClick = (dest) => {
    setActive(dest.code);
    onOpenChat(`Tell me about moving to ${dest.name}. What do I need to know about visas, cost of living, and daily life there?`);
  };

  return (
    <section id="destinations">
      <div className="container">
        <div className="section-header">
          <h2>Popular destinations</h2>
          <p>Tap a country to chat with Emap about it.</p>
        </div>
        <div className="destinations-scroll">
          {destinations.map(d => (
            <div
              key={d.code}
              className={`dest-card${active === d.code ? ' active' : ''}`}
              onClick={() => handleClick(d)}
            >
              <div className="dest-code">{d.code}</div>
              <div className="dest-name">{d.flag} {d.name}</div>
              <div className="dest-region">{d.region}</div>
              <div className="dest-cost">{d.cost}</div>
              <div className="dest-desc">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
