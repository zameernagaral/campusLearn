const Notification = require('../models/Notification');
const { successResponse } = require('../utils/response');

// ─── @desc    Get user notifications
// ─── @route   GET /api/notifications
// ─── @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
    ]);

    successResponse(res, 200, 'Notifications fetched.', { notifications, unreadCount });
  } catch (error) { next(error); }
};

// ─── @desc    Mark notification as read
// ─── @route   PATCH /api/notifications/:id/read
// ─── @access  Private
exports.markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true, readAt: new Date() }
    );
    successResponse(res, 200, 'Notification marked as read.');
  } catch (error) { next(error); }
};

// ─── @desc    Mark all notifications as read
// ─── @route   PATCH /api/notifications/read-all
// ─── @access  Private
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    successResponse(res, 200, 'All notifications marked as read.');
  } catch (error) { next(error); }
};

// ─── @desc    Delete notification
// ─── @route   DELETE /api/notifications/:id
// ─── @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    successResponse(res, 200, 'Notification deleted.');
  } catch (error) { next(error); }
};
