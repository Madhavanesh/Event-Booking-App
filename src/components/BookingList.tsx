import React from 'react';
import { Booking } from '../types/booking';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingListProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  onCancel, 
  currentPage,
  onPageChange,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Current Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No bookings yet</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {currentBookings.map((booking) => (
              <li key={booking.id} className="py-4 flex justify-between items-center group hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(booking.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onCancel(booking.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};