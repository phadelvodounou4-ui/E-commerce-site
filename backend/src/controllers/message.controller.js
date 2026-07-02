const { Message, User, Product } = require('../models');
const { Op } = require('sequelize');
exports.getConversations = async (req, res) => {
  const messages = await Message.findAll({
    where: { [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
    include: [
      { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
      { model: User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
      { model: Product, as: 'product', attributes: ['id', 'name', 'images'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  const conversations = new Map();
  messages.forEach(msg => {
    const partner = msg.senderId === req.user.id ? msg.receiver : msg.sender;
    if (!conversations.has(partner.id)) {
      conversations.set(partner.id, {
        partner: { id: partner.id, firstName: partner.firstName, lastName: partner.lastName, avatarUrl: partner.avatarUrl },
        lastMessage: { content: msg.content, createdAt: msg.createdAt },
        unreadCount: msg.receiverId === req.user.id && !msg.isRead ? 1 : 0,
      });
    } else if (msg.receiverId === req.user.id && !msg.isRead) {
      conversations.get(partner.id).unreadCount++;
    }
  });
  res.status(200).json({ status: 'success', data: { conversations: Array.from(conversations.values()) } });
};
exports.getMessages = async (req, res) => {
  const messages = await Message.findAll({
    where: { [Op.or]: [{ senderId: req.user.id, receiverId: req.params.partnerId }, { senderId: req.params.partnerId, receiverId: req.user.id }] },
    include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }, { model: Product, as: 'product', attributes: ['id', 'name'] }],
    order: [['createdAt', 'ASC']],
  });
  await Message.update({ isRead: true, readAt: new Date() }, { where: { senderId: req.params.partnerId, receiverId: req.user.id, isRead: false } });
  res.status(200).json({ status: 'success', data: { messages } });
};
exports.sendMessage = async (req, res) => {
  const { receiverId, content, productId } = req.body;
  const message = await Message.create({ senderId: req.user.id, receiverId, productId, content });
  const full = await Message.findByPk(message.id, { include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }, { model: Product, as: 'product', attributes: ['id', 'name'] }] });
  res.status(201).json({ status: 'success', data: { message: full } });
};
