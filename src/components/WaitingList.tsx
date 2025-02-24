import React from 'react';
import { WaitingListEntry } from '../types/booking';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface WaitingListProps {
  entries: WaitingListEntry[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const WaitingList: React.FC<WaitingListProps> = ({ 
  entries,
  currentPage,
  onPageChange,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = entries.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Waiting List</h2>
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No one in the waiting list</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {currentEntries.map((entry, index) => (
              <li key={entry.id} className="py-4 flex items-center space-x-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  {startIndex + index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                  <p className="text-sm text-gray-500">{entry.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
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