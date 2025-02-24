# Event Booking System

A React-based event booking interface with TypeScript and Tailwind CSS. This application manages event bookings using local storage, featuring booking cancellation, waiting list management, and booking history.

## Features

- Book and cancel event slots
- Automatic waiting list management
- Persistent state across page refreshes
- Responsive design with Tailwind CSS
- Notification system with auto-dismissal
- Configurable total slots via environment variables
- System reset functionality

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Madhavanesh/Event-Booking-App.git
   cd Event-Booking-App
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_TOTAL_SLOTS=10
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_TOTAL_SLOTS` | The initial number of available booking slots | 10 |

## Project Structure

```
src/
├── components/           # UI components
│   ├── BookingForm.tsx   # Form for creating bookings
│   ├── BookingList.tsx   # List of current bookings
│   ├── Notification.tsx  # Notification component
│   └── WaitingList.tsx   # Waiting list component
├── hooks/
│   └── useBookingSystem.ts # Custom hook for state management
├── types/
│   └── booking.ts        # TypeScript interfaces
├── utils/
│   └── formatters.ts     # Utility functions
├── App.tsx               # Main application component
└── main.tsx              # Entry point
```

## State Management Approach

This application uses a custom React hook (`useBookingSystem`) for state management with the following features:

### Local Storage Persistence

All booking data is stored in the browser's localStorage, ensuring that the application state persists across page refreshes. The state is automatically loaded on application startup and saved whenever it changes.

```typescript
// Load state from localStorage
const [state, setState] = useState<BookingState>(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {
    availableSlots: TOTAL_SLOTS,
    bookings: [],
    waitingList: []
  };
});

// Save state to localStorage
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}, [state]);
```

### Core State Structure

The state is organized into three main elements:

1. `availableSlots`: The number of slots currently available for booking
2. `bookings`: An array of confirmed bookings
3. `waitingList`: An array of users waiting for a slot

### Automatic Waiting List Processing

When a booking is cancelled, the system automatically promotes the first person from the waiting list to a confirmed booking:

```typescript
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
```

### Notification System

The system features a notification mechanism that:
- Shows success, error, and info messages
- Automatically dismisses notifications after 5 seconds
- Allows for manual dismissal

## Testing

### Manual Testing Instructions

1. **Booking Flow**:
   - Try booking when slots are available
   - Verify slot count decreases
   - Check that the booking appears in the booking list

2. **Cancellation Flow**:
   - Cancel a booking
   - Verify slot count increases (if no waiting list)
   - Verify the booking is removed from the list

3. **Waiting List**:
   - Book all available slots
   - Try to book again and join the waiting list
   - Cancel a booking and verify someone from the waiting list is automatically promoted

4. **Reset**:
   - Click the reset button
   - Verify all bookings and waiting list entries are cleared
   - Verify available slots return to the initial configured value

5. **Persistence**:
   - Make some bookings
   - Refresh the page
   - Verify the state persists correctly