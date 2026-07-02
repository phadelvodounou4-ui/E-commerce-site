const router = require('express').Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.get('/conversations', messageController.getConversations);
router.get('/:partnerId', messageController.getMessages);
router.post('/', messageController.sendMessage);
module.exports = router;
