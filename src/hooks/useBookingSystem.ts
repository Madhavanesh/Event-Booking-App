import { useState, useEffect } from 'react';
import { Booking, WaitingListEntry, BookingState } from '../types/booking';

const STORAGE_KEY = 'event-booking-system';
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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

      return { success: true, message: 'Booking confirmed!' };
    }
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

      return newState;
    });
  };

  const reset = () => {
    setState({
      availableSlots: TOTAL_SLOTS,
      bookings: [],
      waitingList: []
    });
  };

  return {
    state,
    book,
    joinWaitingList,
    cancelBooking,
    reset
  };
};