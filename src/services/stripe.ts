import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createPaymentMethod(cardElement: any) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) throw error;
  return paymentMethod;
}