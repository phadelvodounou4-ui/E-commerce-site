const { Notification } = require('../models');
const { redisClient } = require('../config/redis');
exports.getNotifications = async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const where = { userId: req.user.id };
  if (unreadOnly === 'true') where.isRead = false;
  const { count, rows: notifications } = await Notification.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
  const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });
  res.status(200).json({ status: 'success', data: { notifications, unreadCount, pagination: { page: parseInt(page), limit: parseInt(limit), total: count } } });
};
exports.markAsRead = async (req, res) => {
  const notif = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!notif) return res.status(404).json({ status: 'fail', message: 'Not found' });
  await notif.update({ isRead: true });
  res.status(200).json({ status: 'success', data: { notification: notif } });
};
exports.markAllAsRead = async (req, res) => {
  await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
  res.status(200).json({ status: 'success', message: 'All marked as read' });
};
exports.deleteNotification = async (req, res) => {
  await Notification.destroy({ where: { id: req.params.id, userId: req.user.id } });
  res.status(200).json({ status: 'success', message: 'Deleted' });
};
exports.createNotification = async (userId, type, title, message, data = {}) => {
  const notification = await Notification.create({ userId, type, title, message, data });
  await redisClient.publish(`notifications:${userId}`, JSON.stringify(notification));
};
