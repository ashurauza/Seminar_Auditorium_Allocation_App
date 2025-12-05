import { storage } from '../utils/helpers';

export const notificationService = {
  createNotification: (notification) => {
    const notifications = storage.get('notifications') || [];
    
    const newNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.push(newNotification);
    storage.set('notifications', notifications);

    return newNotification;
  },

  getUserNotifications: (userId, unreadOnly = false) => {
    let notifications = storage.get('notifications') || [];
    
    notifications = notifications.filter(n => n.userId === userId);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markAsRead: (notificationId) => {
    const notifications = storage.get('notifications') || [];
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].read = true;
      notifications[index].readAt = new Date().toISOString();
      storage.set('notifications', notifications);
      return { success: true };
    }
    
    return { success: false, message: 'Notification not found' };
  },

  markAllAsRead: (userId) => {
    const notifications = storage.get('notifications') || [];
    let updated = 0;
    
    notifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        updated++;
      }
    });
    
    if (updated > 0) {
      storage.set('notifications', notifications);
    }
    
    return { success: true, updated };
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    let notifications = storage.get('notifications') || [];
    const initialLength = notifications.length;
    
    notifications = notifications.filter(n => n.id !== notificationId);
    
    if (notifications.length < initialLength) {
      storage.set('notifications', notifications);
      return { success: true };
    }
    
    return { success: false, message: 'Notification not found' };
  },

  // Clear all notifications for a user
  clearAllNotifications: (userId) => {
    let notifications = storage.get('notifications') || [];
    const initialLength = notifications.length;
    
    notifications = notifications.filter(n => n.userId !== userId);
    
    storage.set('notifications', notifications);
    
    return { success: true, deleted: initialLength - notifications.length };
  },

  // Get unread count
  getUnreadCount: (userId) => {
    const notifications = storage.get('notifications') || [];
    return notifications.filter(n => n.userId === userId && !n.read).length;
  },

  // Notification types
  notifyBookingCreated: (userId, booking) => {
    return notificationService.createNotification({
      userId,
      type: 'booking_created',
      title: 'Booking Created',
      message: `Your booking for ${booking.hall} on ${booking.date} has been submitted for approval.`,
      data: { bookingId: booking.id },
      priority: 'normal'
    });
  },

  notifyBookingApproved: (userId, booking) => {
    return notificationService.createNotification({
      userId,
      type: 'booking_approved',
      title: 'Booking Approved',
      message: `Your booking for ${booking.hall} on ${booking.date} has been approved!`,
      data: { bookingId: booking.id },
      priority: 'high'
    });
  },

  notifyBookingRejected: (userId, booking, reason) => {
    return notificationService.createNotification({
      userId,
      type: 'booking_rejected',
      title: 'Booking Rejected',
      message: `Your booking for ${booking.hall} on ${booking.date} was rejected. Reason: ${reason}`,
      data: { bookingId: booking.id },
      priority: 'high'
    });
  },

  notifyBookingReminder: (userId, booking) => {
    return notificationService.createNotification({
      userId,
      type: 'booking_reminder',
      title: 'Upcoming Booking',
      message: `Reminder: You have a booking for ${booking.hall} on ${booking.date} at ${booking.timeFrom}.`,
      data: { bookingId: booking.id },
      priority: 'normal'
    });
  },

  notifySlotAvailable: (userId, waitingItem) => {
    return notificationService.createNotification({
      userId,
      type: 'slot_available',
      title: 'Slot Available',
      message: `A slot is now available for ${waitingItem.hall} on ${waitingItem.date}. Book now!`,
      data: { waitingListId: waitingItem.id },
      priority: 'high'
    });
  },

  notifyNewBookingRequest: (adminUserId, booking) => {
    return notificationService.createNotification({
      userId: adminUserId,
      type: 'new_booking_request',
      title: 'New Booking Request',
      message: `New booking request for ${booking.hall} on ${booking.date} requires your approval.`,
      data: { bookingId: booking.id },
      priority: 'high'
    });
  }
};
