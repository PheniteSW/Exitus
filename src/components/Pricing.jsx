import { useState } from 'react';
import { createCheckout, createPortalSession } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STRIPE_PRICE_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_placeholder';
const STRIPE_PRICE_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ANNUAL || 'price_placeholder';

export default function Pricing({ onOpenChat, onOpenAuth }) {
  const { user, isProAccount, subscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cycle, setCycle] = useState('annual'); // 'annual' pre-selected (best value)
  // Pro status now comes from the user's Supabase subscription row (kept in
  // sync by the Stripe webhook) — not localStorage — so it's correct across
  // devices and reflects real cancellations.
  const pro = isProAccount;

  const isAnnual = cycle === 'annual';
  const selectedPriceId = isAnnual ? STRIPE_PRICE_ANNUAL : STRIPE_PRICE_MONTHLY;

  const handleManageBilling = async () => {
    const customerId = subscription?.stripe_customer_id;
    if (!customerId) {
      alert('Billing info not found for your account. Please contact us for help.');
      return;
    }
    setPortalLoading(true);
    try {
      const data = await createPortalSession(customerId, window.location.href);
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Could not open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    // Require an account so the payment maps to a user and access can follow
    // them across devices (and be revoked on cancellation).
    if (!user) {
      onOpenAuth?.();
      return;
    }
    setLoading(true);
    try {
      const data = await createCheckout(
        selectedPriceId,
        `${window.location.origin}?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
        window.location.href,
        user?.id,
        user?.email
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
            <div className="price-desc">Start exploring, no signup required</div>
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
            <div className="popular-badge">⭐ Best Value, Save 33%</div>
            <div className="price-tier">Nomad</div>
            <div className="price-desc">Everything you need to actually move</div>

            {/* Billing cycle toggle */}
            <div className="cycle-toggle" role="tablist" aria-label="Billing cycle">
              <button
                role="tab"
                aria-selected={!isAnnual}
                className={`cycle-opt ${!isAnnual ? 'active' : ''}`}
                onClick={() => setCycle('monthly')}
              >
                <span className="cycle-label">Monthly</span>
                <span className="cycle-price">$9.99/mo</span>
              </button>
              <button
                role="tab"
                aria-selected={isAnnual}
                className={`cycle-opt ${isAnnual ? 'active' : ''}`}
                onClick={() => setCycle('annual')}
              >
                <span className="cycle-badge">Best Value</span>
                <span className="cycle-label">Annual</span>
                <span className="cycle-price">$79.99/yr</span>
              </button>
            </div>

            {/* Headline price for selected cycle */}
            {isAnnual ? (
              <div className="price-amount" style={{ marginTop: 4 }}>
                $6.67<span>/mo</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--gray)', marginTop: 4 }}>
                  <s>$9.99/mo</s> &nbsp;billed $79.99/year <strong style={{ color: 'var(--purple)' }}>(Save 33%)</strong>
                </div>
              </div>
            ) : (
              <div className="price-amount" style={{ marginTop: 4 }}>
                $9.99<span>/mo</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--gray)', marginTop: 4 }}>
                  billed monthly
                </div>
              </div>
            )}

            <ul className="price-features">
              {[
                [true, 'Unlimited Emap chats'],
                [true, 'Personalized relocation plan'],
                [true, 'Priority country matching'],
                [true, 'Banking & visa deep dives'],
                [true, 'Safety briefings per destination'],
                [true, '7-day free trial, cancel anytime'],
                [true, '🎮 Discord community access'],
              ].map(([check, label], i) => (
                <li key={i}>
                  <span className="pf-check">✓</span>
                  {label}
                </li>
              ))}
            </ul>
            {pro ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-plan btn-plan-primary" disabled style={{ opacity: 0.7 }}>
                  ✅ You're a Nomad member
                </button>
                <button
                  className="btn-plan btn-plan-secondary"
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  style={{ fontSize: '0.85rem' }}
                >
                  {portalLoading ? 'Opening...' : 'Manage / Cancel Subscription →'}
                </button>
              </div>
            ) : (
              <>
                <button className="btn-plan btn-plan-primary" onClick={handleUpgrade} disabled={loading}>
                  {loading ? 'Redirecting...' : 'Start your 7-day free trial'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.8rem', color: 'var(--gray)' }}>
                  No payment due now. Cancel anytime. Payments by Stripe.
                </p>
              </>
            )}
          </div>
        </div>

        {pro && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ color: 'var(--gray)', marginBottom: 16 }}>
              You have full access! Join the community:
            </p>
            <a href="https://discord.gg/RrSpRpCAs" target="_blank" rel="noopener noreferrer" className="discord-cta">
              🎮 Join the EXIT US Discord
            </a>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.8rem', color: 'var(--gray)' }}>
          Payments secured by Stripe. Cancel anytime from your account, your
          access follows you on any device you log in from.
        </p>
      </div>
    </section>
  );
}
