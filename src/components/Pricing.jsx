import { useState } from 'react';
import { isPro, saveSubscription } from '../utils/storage';
import { createCheckout } from '../utils/api';

const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_placeholder';

export default function Pricing({ onOpenChat }) {
  const [loading, setLoading] = useState(false);
  const pro = isPro();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const data = await createCheckout(
        STRIPE_PRICE_ID,
        `${window.location.origin}?upgraded=true`,
        window.location.href
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not start checkout. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Simple pricing</h2>
          <p>Start free. Upgrade when you're ready to actually move.</p>
        </div>
        <div className="pricing-grid">
          {/* Free */}
          <div className="price-card">
            <div className="price-tier">Explorer</div>
            <div className="price-amount">Free</div>
            <div className="price-desc">Start exploring — no signup required</div>
            <ul className="price-features">
              {[
                [true, '5 Emap chats per day'],
                [true, 'Country overviews & cost snapshots'],
                [true, 'Visa link directory'],
                [true, 'Safety alerts & red flags'],
                [false, 'Unlimited Emap chats'],
                [false, 'Personalized relocation plan'],
                [false, 'Discord community access'],
              ].map(([check, label], i) => (
                <li key={i} className={check ? '' : 'locked'}>
                  <span className={check ? 'pf-check' : 'pf-x'}>{check ? '✓' : '✕'}</span>
                  {label}
                </li>
              ))}
            </ul>
            <button className="btn-plan btn-plan-secondary" onClick={onOpenChat}>
              Start for Free
            </button>
          </div>

          {/* Pro */}
          <div className="price-card popular">
            <div className="popular-badge">⭐ Most Popular</div>
            <div className="price-tier">Nomad</div>
            <div className="price-amount">$29<span>/mo</span></div>
            <div className="price-desc">Everything you need to actually move</div>
            <ul className="price-features">
              {[
                [true, 'Unlimited Emap chats'],
                [true, 'Personalized relocation plan'],
                [true, 'Priority country matching'],
                [true, 'Banking & visa deep dives'],
                [true, 'Safety briefings per destination'],
                [true, 'Cancel anytime'],
                [true, '🎮 Discord community access'],
              ].map(([check, label], i) => (
                <li key={i}>
                  <span className="pf-check">✓</span>
                  {label}
                </li>
              ))}
            </ul>
            {pro ? (
              <button className="btn-plan btn-plan-primary" disabled style={{ opacity: 0.7 }}>
                ✅ You're a Nomad member
              </button>
            ) : (
              <button className="btn-plan btn-plan-primary" onClick={handleUpgrade} disabled={loading}>
                {loading ? 'Redirecting...' : 'Upgrade to Nomad →'}
              </button>
            )}
          </div>
        </div>

        {pro && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ color: 'var(--gray)', marginBottom: 16 }}>
              You have full access! Join the community:
            </p>
            <a href="https://discord.gg/TVJk5VqE" target="_blank" rel="noopener noreferrer" className="discord-cta">
              🎮 Join the EXIT US Discord
            </a>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.8rem', color: 'var(--gray)' }}>
          Payments secured by Stripe. Cancel anytime from your subscription dashboard.
          No accounts required — all data saved locally on your device.
        </p>
      </div>
    </section>
  );
}
