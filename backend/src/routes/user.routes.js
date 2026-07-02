const router = require('express').Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth.middleware');
router.use(protect);
router.get('/profile', async (req, res) => { const user = await User.findByPk(req.user.id); res.status(200).json({ status: 'success', data: { user } }); });
router.patch('/profile', async (req, res) => { const { firstName, lastName, avatarUrl } = req.body; const user = await User.findByPk(req.user.id); await user.update({ firstName, lastName, avatarUrl }); res.status(200).json({ status: 'success', data: { user } }); });
module.exports = router;
