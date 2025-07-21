import React, { useState, useEffect } from 'react';
import { 
  Bell, X, Check, AlertTriangle, Info, CheckCircle,
  Clock, Settings, Filter, MoreHorizontal
} from 'lucide-react';

const NotificationCenter = ({ notifications, onDismiss, onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const getIcon = (type) => {
    const icons = {
      success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      error: <AlertTriangle className="w-4 h-4 text-red-400" />,
      warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
      info: <Info className="w-4 h-4 text-blue-400" />
    };
    return icons[type] || icons.info;
  };

  const getBgColor = (type) => {
    const colors = {
      success: 'bg-emerald-500/10 border-emerald-500/20',
      error: 'bg-red-500/10 border-red-500/20',
      warning: 'bg-yellow-500/10 border-yellow-500/20',
      info: 'bg-blue-500/10 border-blue-500/20'
    };
    return colors[type] || colors.info;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'unread', label: 'No leídas' },
    { value: 'read', label: 'Leídas' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 w-96">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h3 className="font-semibold text-white">Notificaciones</h3>
                <p className="text-sm text-slate-400">
                  {unreadCount} sin leer de {notifications.length} total
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onClearAll?.()}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Limpiar todo
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-3 border-b border-slate-700">
              <div className="flex space-x-1">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      filter === option.value
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-700 last:border-b-0 ${
                      !notification.read ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-white' : 'text-slate-300'
                          }`}>
                            {notification.title || 'Notificación'}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead?.(notification.id)}
                                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                Marcar leída
                              </button>
                            )}
                            <button
                              onClick={() => onDismiss?.(notification.id)}
                              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                            >
                              Descartar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-700 text-center">
                <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  Ver todas las notificaciones
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
