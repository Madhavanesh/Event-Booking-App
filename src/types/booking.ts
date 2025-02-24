export interface Booking {
    id: string;
    timestamp: number;
    name: string;
    email: string;
  }
  
  export interface WaitingListEntry {
    id: string;
    timestamp: number;
    name: string;
    email: string;
  }
  
  export interface BookingState {
    availableSlots: number;
    bookings: Booking[];
    waitingList: WaitingListEntry[];
  }