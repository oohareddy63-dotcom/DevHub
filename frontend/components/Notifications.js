'use client';
import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Heart, MessageSquare, UserPlus } from 'lucide-react';

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'endorsement',
        message: 'John Doe endorsed your JavaScript skill',
        icon: Heart,
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'comment',
        message: 'Sarah commented on your build log',
        icon: MessageSquare,
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'connection',
        message: 'Mike Johnson wants to connect with you',
        icon: UserPlus,
        time: '1 day ago',
        read: true
      },
      {
        id: 4,
        type: 'system',
        message: 'Your profile is 80% complete',
        icon: AlertCircle,
        time: '2 days ago',
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomNotification = {
        id: Date.now(),
        type: 'endorsement',
        message: `Someone endorsed your ${['JavaScript', 'React', 'Node.js'][Math.floor(Math.random() * 3)]} skill`,
        icon: Heart,
        time: 'Just now',
        read: false
      };
      
      setNotifications(prev => [randomNotification, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (IconComponent) => {
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'endorsement' ? 'bg-red-100 text-red-600' :
                      notification.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'connection' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {getNotificationIcon(notification.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
