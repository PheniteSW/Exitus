const API_URL = import.meta.env.VITE_API_URL || '';

export async function sendChatMessage(messages) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function createCheckout(priceId, successUrl, cancelUrl) {
  const res = await fetch(`${API_URL}/api/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, successUrl, cancelUrl }),
  });
  if (!res.ok) throw new Error('Checkout error');
  return res.json();
}

export async function cancelSubscription(subscriptionId) {
  const res = await fetch(`${API_URL}/api/cancel-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId }),
  });
  if (!res.ok) throw new Error('Cancel error');
  return res.json();
}
