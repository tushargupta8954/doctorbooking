import Notification from '../models/Notification.js';
import ApiResponse from '../utils/apiResponse.js';

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    
    let query = { recipient: req.user.id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Notification.countDocuments(query);

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    return ApiResponse.paginated(res, notifications, {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      unreadCount
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404);
    }

    if (notification.recipient.toString() !== req.user.id) {
      return ApiResponse.error(res, 'Not authorized', 403);
    }

    notification.isRead = true;
    await notification.save();

    return ApiResponse.success(res, notification, 'Notification marked as read');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    return ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404);
    }

    if (notification.recipient.toString() !== req.user.id) {
      return ApiResponse.error(res, 'Not authorized', 403);
    }

    await notification.deleteOne();
    return ApiResponse.success(res, null, 'Notification deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};