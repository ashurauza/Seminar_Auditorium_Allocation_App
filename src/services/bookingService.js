import { storage } from '../utils/helpers';
import { generateBookingId } from '../utils/helpers';

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const bookings = storage.get('bookings') || [];
      
      const conflict = bookingService.checkConflict(
        bookingData.hall,
        bookingData.date,
        bookingData.timeFrom,
        bookingData.timeTo,
        bookings
      );

      if (conflict) {
        if (bookingData.addToWaitingList) {
          return bookingService.addToWaitingList(bookingData);
        }
        return { 
          success: false, 
          message: 'This time slot is already booked',
          conflict: true
        };
      }

      const newBooking = {
        id: generateBookingId(),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        rejectionReason: null,
        cancellationReason: null,
        recurring: bookingData.recurring || null,
        notifications: {
          created: true,
          approved: false,
          rejected: false,
          reminder: false
        }
      };

      bookings.push(newBooking);
      storage.set('bookings', bookings);

      if (bookingData.recurring) {
        bookingService.createRecurringBookings(newBooking);
      }

      return { 
        success: true, 
        booking: newBooking,
        message: 'Booking created successfully! Awaiting approval.' 
      };
    } catch (error) {
      return { success: false, message: 'Failed to create booking' };
    }
  },

  // Check for booking conflicts
  checkConflict: (hall, date, timeFrom, timeTo, existingBookings = null) => {
    const bookings = existingBookings || storage.get('bookings') || [];
    
    const conflict = bookings.find(booking => 
      booking.hall === hall &&
      booking.date === date &&
      booking.status !== 'rejected' &&
      booking.status !== 'cancelled' &&
      (
        (timeFrom >= booking.timeFrom && timeFrom < booking.timeTo) ||
        (timeTo > booking.timeFrom && timeTo <= booking.timeTo) ||
        (timeFrom <= booking.timeFrom && timeTo >= booking.timeTo)
      )
    );

    return conflict || null;
  },

  // Get all bookings
  getAllBookings: (filters = {}) => {
    let bookings = storage.get('bookings') || [];

    // Apply filters
    if (filters.userId) {
      bookings = bookings.filter(b => b.userId === filters.userId);
    }
    if (filters.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    if (filters.hall) {
      bookings = bookings.filter(b => b.hall === filters.hall);
    }
    if (filters.date) {
      bookings = bookings.filter(b => b.date === filters.date);
    }
    if (filters.department) {
      bookings = bookings.filter(b => b.department === filters.department);
    }
    if (filters.dateFrom && filters.dateTo) {
      bookings = bookings.filter(b => b.date >= filters.dateFrom && b.date <= filters.dateTo);
    }

    // Sort by date and time (newest first)
    return bookings.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.timeFrom.localeCompare(a.timeFrom);
    });
  },

  // Get booking by ID
  getBookingById: (bookingId) => {
    const bookings = storage.get('bookings') || [];
    return bookings.find(b => b.id === bookingId);
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, reason = null, approvedBy = null) => {
    try {
      const bookings = storage.get('bookings') || [];
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);

      if (bookingIndex === -1) {
        return { success: false, message: 'Booking not found' };
      }

      bookings[bookingIndex].status = status;
      bookings[bookingIndex].updatedAt = new Date().toISOString();

      if (status === 'approved') {
        bookings[bookingIndex].approvedBy = approvedBy;
        bookings[bookingIndex].approvedAt = new Date().toISOString();
        bookings[bookingIndex].notifications.approved = true;
        
        // Check waiting list
        bookingService.processWaitingList(bookings[bookingIndex].hall, bookings[bookingIndex].date);
      }

      if (status === 'rejected') {
        bookings[bookingIndex].rejectionReason = reason;
        bookings[bookingIndex].notifications.rejected = true;
      }

      if (status === 'cancelled') {
        bookings[bookingIndex].cancellationReason = reason;
        bookings[bookingIndex].cancelledAt = new Date().toISOString();
      }

      storage.set('bookings', bookings);

      return { 
        success: true, 
        booking: bookings[bookingIndex],
        message: `Booking ${status} successfully` 
      };
    } catch (error) {
      return { success: false, message: `Failed to ${status} booking` };
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    return bookingService.updateBookingStatus(bookingId, 'cancelled', reason);
  },

  // Create recurring bookings
  createRecurringBookings: (baseBooking) => {
    const bookings = storage.get('bookings') || [];
    const { recurring, date } = baseBooking;

    if (!recurring || !recurring.enabled) return;

    const startDate = new Date(date);
    const occurrences = [];

    for (let i = 1; i < recurring.occurrences; i++) {
      const newDate = new Date(startDate);
      
      switch (recurring.frequency) {
        case 'daily':
          newDate.setDate(startDate.getDate() + i);
          break;
        case 'weekly':
          newDate.setDate(startDate.getDate() + (i * 7));
          break;
        case 'monthly':
          newDate.setMonth(startDate.getMonth() + i);
          break;
        default:
          break;
      }

      // Check if end date is set and respected
      if (recurring.endDate && newDate > new Date(recurring.endDate)) {
        break;
      }

      const recurringBooking = {
        ...baseBooking,
        id: generateBookingId(),
        date: newDate.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        parentBookingId: baseBooking.id,
        recurring: { ...recurring, isRecurring: true }
      };

      // Check for conflicts
      const conflict = bookingService.checkConflict(
        recurringBooking.hall,
        recurringBooking.date,
        recurringBooking.timeFrom,
        recurringBooking.timeTo,
        bookings
      );

      if (!conflict) {
        occurrences.push(recurringBooking);
        bookings.push(recurringBooking);
      }
    }

    if (occurrences.length > 0) {
      storage.set('bookings', bookings);
    }

    return occurrences;
  },

  // Waiting list management
  addToWaitingList: (bookingData) => {
    const waitingList = storage.get('waitingList') || [];
    
    const waitingItem = {
      id: generateBookingId(),
      ...bookingData,
      addedAt: new Date().toISOString(),
      notified: false
    };

    waitingList.push(waitingItem);
    storage.set('waitingList', waitingList);

    return {
      success: true,
      message: 'Added to waiting list. You will be notified if a slot becomes available.',
      waitingListItem: waitingItem
    };
  },

  processWaitingList: (hall, date) => {
    const waitingList = storage.get('waitingList') || [];
    const bookings = storage.get('bookings') || [];

    // Find waiting list items for this hall and date
    const eligibleWaiting = waitingList.filter(w => 
      w.hall === hall && 
      w.date === date &&
      !w.notified
    );

    eligibleWaiting.forEach(waiting => {
      // Check if slot is now available
      const conflict = bookingService.checkConflict(
        waiting.hall,
        waiting.date,
        waiting.timeFrom,
        waiting.timeTo,
        bookings
      );

      if (!conflict) {
        // Mark as notified
        const waitingIndex = waitingList.findIndex(w => w.id === waiting.id);
        if (waitingIndex !== -1) {
          waitingList[waitingIndex].notified = true;
          waitingList[waitingIndex].notifiedAt = new Date().toISOString();
        }
      }
    });

    storage.set('waitingList', waitingList);
  },

  getWaitingList: (userId = null) => {
    let waitingList = storage.get('waitingList') || [];
    
    if (userId) {
      waitingList = waitingList.filter(w => w.userId === userId);
    }

    return waitingList.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  },

  // Get booking statistics
  getBookingStats: (filters = {}) => {
    const bookings = bookingService.getAllBookings(filters);
    
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      byHall: bookings.reduce((acc, booking) => {
        acc[booking.hall] = (acc[booking.hall] || 0) + 1;
        return acc;
      }, {}),
      byDepartment: bookings.reduce((acc, booking) => {
        acc[booking.department] = (acc[booking.department] || 0) + 1;
        return acc;
      }, {}),
      byMonth: bookings.reduce((acc, booking) => {
        const month = new Date(booking.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    };
  },

  // Get available time slots for a hall on a specific date
  getAvailableSlots: (hall, date) => {
    const bookings = storage.get('bookings') || [];
    const bookedSlots = bookings
      .filter(b => 
        b.hall === hall && 
        b.date === date && 
        (b.status === 'approved' || b.status === 'pending')
      )
      .map(b => ({
        from: b.timeFrom,
        to: b.timeTo
      }));

    // Generate all possible time slots (9 AM to 6 PM, 1-hour intervals)
    const allSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      allSlots.push({
        from: `${hour.toString().padStart(2, '0')}:00`,
        to: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: true
      });
    }

    // Mark unavailable slots
    allSlots.forEach(slot => {
      bookedSlots.forEach(booked => {
        if (
          (slot.from >= booked.from && slot.from < booked.to) ||
          (slot.to > booked.from && slot.to <= booked.to) ||
          (slot.from <= booked.from && slot.to >= booked.to)
        ) {
          slot.available = false;
        }
      });
    });

    return allSlots;
  },

  // Export bookings
  exportBookings: (filters = {}, format = 'json') => {
    const bookings = bookingService.getAllBookings(filters);
    
    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'Hall', 'Date', 'Time From', 'Time To', 'Department', 'Status', 'Reason'];
      const rows = bookings.map(b => [
        b.id,
        b.hall,
        b.date,
        b.timeFrom,
        b.timeTo,
        b.department,
        b.status,
        b.reason || ''
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      return { success: true, data: csv, format: 'csv' };
    }

    return { success: true, data: bookings, format: 'json' };
  }
};
