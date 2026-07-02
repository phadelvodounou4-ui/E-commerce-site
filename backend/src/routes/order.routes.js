const router = require('express').Router();
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.post('/', [body('shippingAddress').isObject().notEmpty()], orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);
module.exports = router;
