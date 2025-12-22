import notifee, {
  AndroidImportance,
  Notification,
} from '@notifee/react-native';

class NotificationService {
  private channelId: string | null = null;

  constructor() {
    this.channelId = null;
  }

  async bootstrap(): Promise<void> {
    const initialNotification = await notifee.getInitialNotification();

    this.channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    if (initialNotification) {
      this.handleNotificationOpen(initialNotification.notification);
    }
  }

  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }

  async displayLocalNotification(
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) {
    await this.requestPermission();

    if (!this.channelId) {
      this.channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }

    await notifee.displayNotification({
      title: title,
      body: body,
      data: data,
      android: {
        channelId: this.channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  }

  handleNotificationOpen(notification: Notification) {
    console.log('User tapped notification:', notification);
  }
}

export default new NotificationService();
