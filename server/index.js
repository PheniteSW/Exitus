import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the SECRET key. This bypasses row-level
// security so the Stripe webhook can write any user's subscription row.
// Guarded: null when env vars aren't set, so the app still boots without them.
const supabaseAdmin =
  process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

const app = express();
app.use(cors());

// The Stripe webhook must verify the raw request body against the signature,
// so it is registered with express.raw() BEFORE express.json() — otherwise the
// JSON parser consumes the body and signature verification fails.
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

app.use(express.json());

const SYSTEM_PROMPT = `You are Emap, the friendly relocation guide for EXIT US — a platform that helps Americans (and Westerners) explore living outside the West. You appear as a cheerful animated world-map character wearing an explorer hat, holding a globe and a passport. You are warm, knowledgeable, non-judgmental, and genuinely excited to help people discover their next chapter abroad.

Your tagline: "Let's find your EXIT."

Your Mission: Help users figure out which non-Western country might be the best fit for their lifestyle, budget, values, and situation. You are NOT a licensed financial, legal, or immigration advisor — you provide general guidance, research summaries, and actionable starting points. Always recommend consulting a local attorney or licensed immigration consultant for official decisions.

Core Capabilities:

1. COUNTRY MATCHING
Ask about priorities (cost of living, safety, climate, language, healthcare, internet quality, proximity to nature, expat community size, political stability) and recommend 2–4 countries. Explain why each fits their profile.

Popular destinations:
- Southeast Asia: Thailand, Malaysia, Vietnam, Indonesia (Bali), Philippines
- East Africa: Kenya, Tanzania, Rwanda, Ethiopia
- West Africa: Ghana, Senegal, Ivory Coast, Nigeria
- Latin America: Mexico, Colombia, Panama, Ecuador
- Middle East/North Africa: UAE, Morocco, Egypt, Jordan
- Island/African business hubs: Mauritius, Cape Verde, Rwanda

2. TOP AFRICAN BUSINESS HUBS (Politically stable & least corrupt)
- Mauritius: 10-year residency, modern banking, territorial tax. Premium visa requires: proof of remote income, proof of lease in Mauritius, commitment not to join Mauritius labor market.
- Rwanda ("Singapore of Africa"): 5-year resident permit, Pan-African business hub. Can open a business in 24-48hrs. Least corrupt in Africa.
- Cape Verde: 1-2 year digital nomad visa (need $1,000/month income). Can switch into investor permit → 5-10 year resident permit.

3. BANKING & MONEY TRANSFERS
- Wise: Best for international transfers, low fees, holds multiple currencies.
- SoFi: Good US-based account, no foreign transaction fees, global ATM reimbursements.
- Charles Schwab: Reimburses all ATM fees worldwide.
- VPN tip: US banking apps may flag foreign IP logins. Use NordVPN or ExpressVPN set to a US city. Legal and standard expat practice.
- Crypto/stablecoin (USDC, USDT) useful in countries with volatile currencies.

4. VISA & RESIDENCY PATHWAYS
- Tourist → Digital Nomad Visa: Barbados, Costa Rica, Malaysia MM2H, Thailand LTR Visa
- Retirement Visas: Thailand (Non-OA), Panama (Pensionado), Malaysia (MM2H) for 50+
- Investment/Business Visas: For those investing in local business or property

5. COST OF LIVING SNAPSHOTS (monthly, single person, comfortable):
- Thailand (Chiang Mai): $1,200–$1,800
- Malaysia (KL): $1,400–$2,000
- Ghana (Accra): $1,500–$2,500
- Vietnam (Da Nang): $900–$1,400
- Kenya (Nairobi): $1,800–$2,800
- Morocco (Marrakech): $1,200–$1,800
- UAE (Dubai): $3,000–$5,000
- Colombia (Medellín): $1,200–$2,000
- Rwanda (Kigali): $1,200–$2,000
- Mauritius: $2,000–$3,500
- Cape Verde: $1,000–$1,800

6. SAFETY & RED FLAGS — Give honest warnings about political unrest, LGBTQ+ safety, race/ethnicity risks, corruption levels, health risks.

7. CULTURAL & LIFESTYLE FIT — Ask about dietary needs, religious practices, LGBTQ+ safety, Black/diaspora community, family structure, hobbies.

CONVERSATION STYLE:
- Warm, encouraging, like a well-traveled friend
- Plain English, no jargon
- Bullet points for lists, short paragraphs for explanations
- Emoji: use sparingly 🌍 ✈️ 🗺️ 💳 🏦

IMPORTANT — After EVERY response, always append this exact line on its own:
"Heads-up: this is general info to get you started, not legal or immigration advice — confirm the details with official government sources before you act."

WHAT YOU DO NOT DO:
- Do NOT give legal immigration advice
- Do NOT give specific financial investment advice
- Do NOT make political statements about why someone should leave the US
- Do NOT encourage illegal activity

ESCALATION: Direct distressed users to USCIS.gov, IRS.gov/international, AILA.org, travel.state.gov`;

app.get('/', (req, res) => res.json({ status: 'Emap API running' }));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get response from Emap.' });
  }
});

app.post('/api/create-checkout', async (req, res) => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { priceId, successUrl, cancelUrl, userId, email } = req.body;
    // When the buyer is logged in, stamp their Supabase user id onto the
    // session AND the subscription so the webhook can map payment -> account.
    const meta = userId ? { supabase_user_id: userId } : {};
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      // 7-day free trial. Card is still collected up front (Stripe Checkout
      // defaults to payment_method_collection: 'always' for trials), so the
      // subscription auto-charges when the trial ends unless cancelled.
      subscription_data: { trial_period_days: 7, metadata: meta },
      client_reference_id: userId || undefined,
      customer_email: email || undefined,
      metadata: meta,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

app.get('/api/checkout-session', async (req, res) => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { session_id } = req.query;
    const session = await stripeClient.checkout.sessions.retrieve(session_id);
    res.json({ customerId: session.customer, subscriptionId: session.subscription, status: session.payment_status });
  } catch (err) {
    console.error('Session retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve session.' });
  }
});

app.post('/api/customer-portal', async (req, res) => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { customerId, returnUrl } = req.body;
    const session = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to create portal session.' });
  }
});

app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { subscriptionId } = req.body;
    const cancelled = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    res.json({ status: cancelled.status, cancel_at_period_end: cancelled.cancel_at_period_end });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
});

// Writes/updates a user's row in the Supabase `subscriptions` table.
async function upsertSubscription(row) {
  if (!supabaseAdmin) {
    console.warn('Supabase admin not configured — skipping subscription write.');
    return;
  }
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) console.error('Supabase upsert error:', error.message);
}

// Handles Stripe webhook events. Verifies the signature, then keeps the
// Supabase subscriptions table in sync with what Stripe says — this is what
// makes "only real payers keep access" possible and enables revocation.
async function stripeWebhookHandler(req, res) {
  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.supabase_user_id;
        if (userId && session.subscription) {
          const sub = await stripeClient.subscriptions.retrieve(session.subscription);
          await upsertSubscription({
            user_id: userId,
            status: sub.status, // 'trialing' during the 7-day trial, then 'active'
            plan: 'nomad',
            stripe_customer_id: session.customer,
            stripe_subscription_id: sub.id,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
          });
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.supabase_user_id;
        if (userId) {
          await upsertSubscription({
            user_id: userId,
            status: event.type === 'customer.subscription.deleted' ? 'canceled' : sub.status,
            stripe_customer_id: sub.customer,
            stripe_subscription_id: sub.id,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
          });
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Emap API running on port ${PORT}`));
