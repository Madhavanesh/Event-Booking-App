import { useState, useEffect } from 'react';
import { Booking, WaitingListEntry, BookingState } from '../types/booking';

// Add notification type
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

const STORAGE_KEY = 'event-booking-system';
const NOTIFICATION_TIMEOUT = 5000; // 5 seconds
const TOTAL_SLOTS = import.meta.env.VITE_TOTAL_SLOTS 
  ? parseInt(import.meta.env.VITE_TOTAL_SLOTS as string, 10) 
  : 10;

export const useBookingSystem = () => {
  const [state, setState] = useState<BookingState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      availableSlots: TOTAL_SLOTS,
      bookings: [],
      waitingList: []
    };
  });

  // Add notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Handle notification timeouts
  useEffect(() => {
    // Set up cleanup timers for each notification
    const timers = notifications.map(notification => {
      return setTimeout(() => {
        setNotifications(current => 
          current.filter(n => n.id !== notification.id)
        );
      }, NOTIFICATION_TIMEOUT);
    });
    
    // Clean up timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  // Add a notification
  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(current => [...current, newNotification]);
  };

  const book = (name: string, email: string): { success: boolean; message: string } => {
    if (state.availableSlots > 0) {
      const newBooking: Booking = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        name,
        email
      };

      setState(prev => ({
        ...prev,
        availableSlots: prev.availableSlots - 1,
        bookings: [...prev.bookings, newBooking]
      }));

      // Add success notification
      addNotification('Booking confirmed!', 'success');
      return { success: true, message: 'Booking confirmed!' };
    }
    
    // Add error notification
    addNotification('No slots available. Try joining the waiting list.', 'error');
    return { success: false, message: 'No slots available. Try joining the waiting list.' };
  };

  const joinWaitingList = (name: string, email: string): { success: boolean; message: string } => {
    const entry: WaitingListEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name,
      email
    };

    setState(prev => ({
      ...prev,
      waitingList: [...prev.waitingList, entry]
    }));

    // Add success notification
    addNotification('Added to waiting list!', 'success');
    return { success: true, message: 'Added to waiting list!' };
  };

  const cancelBooking = (bookingId: string): void => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking) return prev;

      const newState = {
        ...prev,
        bookings: prev.bookings.filter(b => b.id !== bookingId),
        availableSlots: prev.availableSlots + 1
      };

      if (prev.waitingList.length > 0) {
        const [nextInLine, ...remainingWaitList] = prev.waitingList;
        
        // Add notification about promotion from waiting list
        addNotification(`${nextInLine.name} has been promoted from the waiting list.`, 'info');
        
        return {
          ...newState,
          availableSlots: newState.availableSlots - 1,
          waitingList: remainingWaitList,
          bookings: [...newState.bookings, {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            name: nextInLine.name,
            email: nextInLine.email
          }]
        };
      }

      // Add notification about cancellation
      addNotification('Booking successfully cancelled.', 'success');
      return newState;
    });
  };

  const reset = () => {
    setState({
      availableSlots: TOTAL_SLOTS,
      bookings: [],
      waitingList: []
    });
    
    // Add notification about system reset
    addNotification('Booking system has been reset.', 'info');
  };

  // Method to dismiss a specific notification
  const dismissNotification = (id: string) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  return {
    state,
    book,
    joinWaitingList,
    cancelBooking,
    reset,
    notifications,
    dismissNotification
  };
};