import { useEffect, useRef } from 'react';

const features = [
  { icon: '🌍', title: 'Country Matching', desc: 'Personalized picks based on your income, family, lifestyle, and priorities.' },
  { icon: '💳', title: 'Banking Abroad', desc: 'Wise, SoFi, and VPN tips for expats who need to keep their money moving globally.' },
  { icon: '📋', title: 'Visa Pathways', desc: 'Digital nomad, retirement, and investment visas explained in plain English.' },
  { icon: '🏥', title: 'Healthcare Tips', desc: 'International insurance options plus affordable private care abroad.' },
  { icon: '⚠️', title: 'Safety Alerts', desc: 'Red-flag warnings for political risk, discrimination, and conflict zones.' },
  { icon: '💰', title: 'Cost Snapshots', desc: 'Real monthly budgets per destination, no fantasy numbers, based on actual expat data.' },
  { icon: '🏦', title: 'Business Hubs', desc: 'Top African & global business destinations: Mauritius, Rwanda, Cape Verde & more.' },
  { icon: '🗺️', title: 'Step-by-Step Plans', desc: 'Exactly how to move out of the US, UK, Canada, and other western countries.' },
  { icon: '🤝', title: 'Expat Community', desc: 'Connect with the EXIT US Discord and find your people abroad.' },
];

export default function Features() {
  const ref = useRef(null);

  useEffect(() => {
    const cards = ref.current?.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    cards?.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>Everything you need to relocate</h2>
          <p>Emap covers every angle of your international move, from first question to first flight.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card fade-in" key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
