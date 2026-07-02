const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Payment } = require('../models');
const logger = require('../utils/logger');

exports.createPaymentIntent = async (order, user) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency: order.currency.toLowerCase(),
    metadata: { orderId: order.id, userId: user.id },
    automatic_payment_methods: { enabled: true },
  });
  await Payment.create({ orderId: order.id, stripePaymentIntentId: paymentIntent.id, amount: order.totalAmount, currency: order.currency, status: 'pending' });
  return paymentIntent;
};

exports.handleWebhook = async (event) => {
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const payment = await Payment.findOne({ where: { stripePaymentIntentId: pi.id }, include: [{ model: Order, as: 'order' }] });
    if (payment) {
      await payment.update({ status: 'succeeded', paymentMethod: pi.payment_method_types[0] });
      await payment.order.update({ status: 'paid', paidAt: new Date() });
    }
  }
};
