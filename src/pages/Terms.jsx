import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', borderBottom: '1px solid rgba(91,45,142,0.1)',
        padding: '0 24px', height: 70, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--purple)' }}>
          Exit<span style={{ color: 'var(--gold)' }}>us</span>
        </a>
        <a href="/" style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.95rem' }}>
          ← Back to Home
        </a>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '110px 24px 80px' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--purple-dark)', marginBottom: 8 }}>
          Terms of Use & Disclaimer
        </h1>
        <p style={{ color: 'var(--gray)', marginBottom: 48, fontSize: '0.9rem' }}>
          Last updated: June 2026
        </p>

        {[
          {
            title: '1. General Information Only',
            text: 'Exitus and the Emap AI agent provide general informational content about international relocation, countries, visa pathways, cost of living, and banking. Nothing on this website constitutes legal advice, immigration advice, financial advice, or tax advice. Always consult a licensed immigration attorney, financial advisor, or tax professional before making any decisions.',
          },
          {
            title: '2. AI-Generated Guidance (Emap)',
            text: "Emap is powered by artificial intelligence and may produce responses that are incomplete, outdated, or incorrect. Treat all Emap responses as a starting point for your own research — not a final answer or a guarantee. Emap's knowledge has a training cutoff date and may not reflect current laws, visa rules, or country conditions.",
          },
          {
            title: '3. No Attorney-Client Relationship',
            text: 'Use of this website does not create an attorney-client relationship, financial advisor relationship, or any other professional relationship. Emap is an AI assistant — not a licensed professional of any kind.',
          },
          {
            title: '4. Accuracy of Information',
            text: 'Visa rules, immigration laws, tax laws, and country conditions change frequently. We make no guarantee that information is current, complete, or accurate. Always verify with official government sources (travel.state.gov, official embassy websites, etc.) before making any plans.',
          },
          {
            title: '5. Safety & Country Information',
            text: 'Safety alerts and country risk information provided on this site are for general awareness only. Conditions on the ground can change rapidly. Always check the US State Department (travel.state.gov) and your own government\'s official travel advisories before traveling or relocating.',
          },
          {
            title: '6. No Liability',
            text: 'Exitus is provided "as is" without warranties of any kind. We are not responsible for any loss, harm, cost, injury, or decision that results from using this service. You use Exitus and the Emap agent entirely at your own risk.',
          },
          {
            title: '7. Payments & Subscriptions',
            text: 'Paid plans are billed monthly through Stripe. You may cancel at any time — your access continues until the end of the billing period. Refunds are not guaranteed but may be considered on a case-by-case basis. Contact us at polySW@proton.me for billing issues.',
          },
          {
            title: '8. Privacy & Data Storage — Important Notice',
            text: 'Exitus does not require account creation and does not collect personal information on our servers. Your chat history and paid subscription status are stored entirely on your own device using browser LocalStorage (similar to cookies). We have no server-side account for you. IMPORTANT: If you clear your browser history, cookies, or site data — your paid Nomad status will be erased from this device and you will appear as a free user. Your Stripe subscription continues to be billed normally, but you will need to contact us on Discord with proof of payment to restore access on that device. Subscription status does not transfer between browsers or devices. To protect your access, do not clear browser site data for this website. We do not store, sell, or share any personal data.',
          },
          {
            title: '9. External Links',
            text: 'We link to third-party government websites, visa portals, and services for your convenience. We are not responsible for the content, accuracy, availability, or privacy policies of external sites. Links to government portals are provided as-is — always navigate directly to official sites when in doubt.',
          },
          {
            title: '10. Prohibited Uses',
            text: 'You agree not to use Exitus to engage in or plan any illegal activity, including but not limited to: working on tourist visas where prohibited, tax evasion, or circumventing immigration law. We do not encourage or support any illegal activity.',
          },
          {
            title: '11. Escalation — When to Seek Real Help',
            text: 'If you are in danger, facing deportation, or need urgent immigration assistance, please contact: USCIS.gov for immigration status questions, IRS.gov/international for US tax obligations abroad (FBAR, FATCA), a licensed immigration attorney via AILA.org, or the US State Department emergency line for citizens abroad.',
          },
          {
            title: '12. Changes to These Terms',
            text: 'We may update these terms at any time without prior notice. Continued use of the site after changes are posted constitutes your acceptance of the updated terms. Check this page periodically.',
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--purple-dark)', marginBottom: 10 }}>
              {section.title}
            </h2>
            <p style={{ color: '#444', lineHeight: 1.8, fontSize: '0.95rem' }}>{section.text}</p>
          </div>
        ))}

        <div style={{
          background: 'rgba(91,45,142,0.05)', border: '1.5px solid rgba(91,45,142,0.15)',
          borderRadius: 16, padding: 24, marginTop: 16,
        }}>
          <p style={{ color: 'var(--purple-dark)', fontWeight: 700, marginBottom: 8 }}>
            Key resources to verify information:
          </p>
          {[
            ['US Travel Advisories', 'https://travel.state.gov'],
            ['IRS Abroad / FBAR', 'https://www.irs.gov/individuals/international-taxpayers/us-citizens-and-resident-aliens-abroad'],
            ['Find an Immigration Attorney (AILA)', 'https://www.ailalawyer.com/'],
            ['Cost of Living Data (Numbeo)', 'https://www.numbeo.com'],
          ].map(([label, url], i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <a href={url} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.9rem' }}>
                → {label}
              </a>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--gray)', fontSize: '0.85rem', textAlign: 'center', marginTop: 48 }}>
          EXIT US — Emap Agent v1.0 | For general informational purposes only.<br />
          Questions? Email us at{' '}
          <a href="mailto:polySW@proton.me" style={{ color: 'var(--purple)' }}>
            polySW@proton.me
          </a>
        </p>
      </main>
    </>
  );
}
