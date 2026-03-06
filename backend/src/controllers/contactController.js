/* ============================================================
   Contact Controller
   ============================================================ */

const Contact = require('../models/Contact');

exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name, email, phone, subject, message
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Our concierge team will respond within 24 hours.',
      data: { id: contact.id }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const { unread } = req.query;
    const messages = await Contact.findAll({ unread: unread === 'true' });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const msg = await Contact.markAsRead(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};
