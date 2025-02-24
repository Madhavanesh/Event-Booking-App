import { useState } from 'react';
import { useBookingSystem } from './hooks/useBookingSystem';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { WaitingList } from './components/WaitingList';
import { AlertCircle, RefreshCw, Calendar } from 'lucide-react';

function App() {
  const { state, book, joinWaitingList, cancelBooking, reset } = useBookingSystem();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [bookingPage, setBookingPage] = useState(1);
  const [waitingPage, setWaitingPage] = useState(1);

  const handleBook = (name: string, email: string) => {
    const result = book(name, email);
    setMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });
  };

  const handleWaitingList = (name: string, email: string) => {
    const result = joinWaitingList(name, email);
    setMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-700 to-black">
      {/* Header */}
      <header className="bg-black shadow-lg border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-white">Lask Event Booking</h1>
                <p className="text-sm text-red-500">Secure your spot today!</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-black hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset System
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Booking Form Section */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg border border-red-800 transform hover:scale-[1.01] transition-all duration-300 bg-opacity-90">
          <div className="p-8">
            <div className="mb-8">
              <div className="inline-block bg-red-900 rounded-full px-6 py-3 border border-red-800">
                <p className="text-lg text-white">
                  Available Slots:{' '}
                  <span className="font-bold text-white">{state.availableSlots}</span>
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`mb-8 p-4 rounded-lg ${
                  message.type === 'success' ? 'bg-green-250' : 'bg-red-50'
                }`}
              >
                <div className="flex">
                  <AlertCircle
                    className={`h-5 w-5 ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  />
                  <p
                    className={`ml-3 text-sm ${
                      message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-center text-black-900">
                {state.availableSlots > 0 ? 'Book Your Spot' : 'Join Waiting List'}
              </h2>
              <BookingForm
                onSubmit={state.availableSlots > 0 ? handleBook : handleWaitingList}
                buttonText={state.availableSlots > 0 ? 'Book Now' : 'Join Waiting List'}
              />
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg border border-red-800 transform hover:scale-[1.01] transition-all duration-300 bg-opacity-90">
            <BookingList 
              bookings={state.bookings}
              onCancel={cancelBooking}
              currentPage={bookingPage}
              onPageChange={setBookingPage}
              itemsPerPage={5}
            />
          </div>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg border border-red-800 transform hover:scale-[1.01] transition-all duration-300 bg-opacity-90">
            <WaitingList 
              entries={state.waitingList}
              currentPage={waitingPage}
              onPageChange={setWaitingPage}
              itemsPerPage={5}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;