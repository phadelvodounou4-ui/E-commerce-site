const router = require('express').Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.post('/toggle', wishlistController.toggleWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);
module.exports = router;
