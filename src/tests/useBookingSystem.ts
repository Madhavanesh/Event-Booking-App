import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingSystem } from '../hooks/useBookingSystem';

describe('useBookingSystem', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    expect(result.current.state.availableSlots).toBe(10);
    expect(result.current.state.bookings).toHaveLength(0);
    expect(result.current.state.waitingList).toHaveLength(0);
  });

  it('should successfully book when slots are available', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    act(() => {
      const bookingResult = result.current.book('John Doe', 'john@example.com');
      expect(bookingResult.success).toBe(true);
      expect(bookingResult.message).toBe('Booking confirmed!');
    });

    expect(result.current.state.availableSlots).toBe(9);
    expect(result.current.state.bookings).toHaveLength(1);
    expect(result.current.state.bookings[0].name).toBe('John Doe');
    expect(result.current.state.bookings[0].email).toBe('john@example.com');
  });

  it('should add to waiting list when no slots available', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    // Fill all slots
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.book(`User ${i}`, `user${i}@example.com`);
      });
    }

    act(() => {
      const waitingResult = result.current.joinWaitingList('Jane Doe', 'jane@example.com');
      expect(waitingResult.success).toBe(true);
      expect(waitingResult.message).toBe('Added to waiting list!');
    });

    expect(result.current.state.waitingList).toHaveLength(1);
    expect(result.current.state.waitingList[0].name).toBe('Jane Doe');
  });

  it('should handle booking cancellation correctly', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    act(() => {
      result.current.book('John Doe', 'john@example.com');
    });

    const bookingId = result.current.state.bookings[0].id;

    act(() => {
      result.current.cancelBooking(bookingId);
    });

    expect(result.current.state.availableSlots).toBe(10);
    expect(result.current.state.bookings).toHaveLength(0);
  });

  it('should automatically book from waiting list when slot becomes available', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    // Fill all slots
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.book(`User ${i}`, `user${i}@example.com`);
      });
    }

    // Add to waiting list
    act(() => {
      result.current.joinWaitingList('Jane Doe', 'jane@example.com');
    });

    // Cancel a booking
    const bookingId = result.current.state.bookings[0].id;
    act(() => {
      result.current.cancelBooking(bookingId);
    });

    expect(result.current.state.waitingList).toHaveLength(0);
    expect(result.current.state.bookings).toHaveLength(10);
    expect(result.current.state.bookings.some(b => b.name === 'Jane Doe')).toBe(true);
  });

  it('should reset system to initial state', () => {
    const { result } = renderHook(() => useBookingSystem());
    
    act(() => {
      result.current.book('John Doe', 'john@example.com');
      result.current.reset();
    });

    expect(result.current.state.availableSlots).toBe(10);
    expect(result.current.state.bookings).toHaveLength(0);
    expect(result.current.state.waitingList).toHaveLength(0);
  });
});