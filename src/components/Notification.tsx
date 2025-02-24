import React from 'react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  id, 
  message, 
  type, 
  onDismiss 
}) => {
  // Define color scheme based on notification type
  const colorScheme = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  };
  
  return (
    <div 
      className={`${colorScheme[type]} border-l-4 p-4 rounded shadow-md mb-2 flex justify-between items-center transition-opacity duration-300`}
      role="alert"
    >
      <span>{message}</span>
      <button 
        onClick={() => onDismiss(id)} 
        className="text-gray-500 hover:text-gray-700"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fillRule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

// Container component to manage multiple notifications
export const NotificationContainer: React.FC<{
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
  onDismiss: (id: string) => void;
}> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 w-72 z-50">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};