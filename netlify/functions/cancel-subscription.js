const stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    const { subscriptionId } = JSON.parse(event.body);

    const cancelled = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: cancelled.status, cancel_at_period_end: cancelled.cancel_at_period_end }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to cancel subscription." }),
    };
  }
};
