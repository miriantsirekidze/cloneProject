import React, { useEffect } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import notifee, { EventType } from '@notifee/react-native';
import NotificationService from './src/services/NotificationService';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    NotificationService.bootstrap();

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          NotificationService.handleNotificationOpen(detail.notification);
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
      <Toast />
    </QueryClientProvider>
  );
}
