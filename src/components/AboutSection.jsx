export default function AboutSection() {
  return (
    <section id="about">
      <div className="container">
        <div className="about-section">
          <div className="about-img">
            <img
              src="https://i.postimg.cc/GmkVJHCs/1On-XA.jpg"
              alt="Expats exploring a new country"
              loading="lazy"
            />
          </div>
          <div className="about-content">
            <h2>Live in a place that actually works for you</h2>
            <p>
              Millions of Americans, Brits, and Canadians are realizing that the country they were born in
              doesn't have to be the country they live in. High costs, political stress, and limited opportunities
              are pushing people to explore a different path.
            </p>
            <p>
              Exitus helps you figure out — based on who you actually are — which country fits your income, values,
              family situation, and lifestyle. No guesswork, just real guidance.
            </p>
            <ul className="about-list">
              {[
                'Personalized country matching based on your profile',
                'Step-by-step relocation guides for every destination',
                'Real visa & residency pathways explained simply',
                'Banking, healthcare, and safety intel for expats',
                'Built for people of all backgrounds and budgets',
              ].map((item, i) => (
                <li key={i}>
                  <span className="check-icon">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <div className="about-section" style={{ gap: 48 }}>
            <div className="about-content">
              <h2>African business hubs you didn't know about</h2>
              <p>
                Africa has some of the world's most stable, least corrupt, and fastest-growing economies.
                Emap will walk you through the top destinations for remote workers, entrepreneurs, and retirees.
              </p>
              <ul className="about-list">
                {[
                  'Mauritius: 10-year residency, modern banking, territorial tax',
                  'Rwanda: Open a business in 24–48hrs, least corrupt in Africa',
                  'Cape Verde: Digital nomad visa, 1,000/mo income threshold',
                  'Ghana: Year of Return community, English-speaking, growing tech scene',
                  'Kenya: East Africa\'s startup hub with modern infrastructure',
                ].map((item, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-img">
              <img
                src="https://i.postimg.cc/YSScrM5F/Xf7XI.jpg"
                alt="African city skyline"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
