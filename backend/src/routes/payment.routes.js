const router = require('express').Router();
const { Order } = require('../models');
const stripeService = require('../services/stripe.service');
const { protect } = require('../middleware/auth.middleware');
const logger = require('../utils/logger');
router.post('/create-intent/:orderId', protect, async (req, res, next) => {
  const order = await Order.findOne({ where: { id: req.params.orderId, userId: req.user.id, status: 'pending' } });
  if (!order) return res.status(404).json({ status: 'fail', message: 'Order not found' });
  const paymentIntent = await stripeService.createPaymentIntent(order, req.user);
  res.status(200).json({ status: 'success', data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id } });
});
const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = require('stripe')(process.env.STRIPE_SECRET_KEY).webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    await stripeService.handleWebhook(event);
    res.status(200).json({ received: true });
  } catch (err) { logger.error('Webhook error:', err.message); res.status(400).send(`Webhook Error: ${err.message}`); }
};
router.webhookHandler = webhookHandler;
module.exports = router;
