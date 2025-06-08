import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

// Define the task name
export const FOREGROUND_TASK_NAME = 'FOREGROUND_COUNT_TASK';

// Global counter for foreground service
let counter = 0;
let notificationId = null;

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Define the task handler
TaskManager.defineTask(FOREGROUND_TASK_NAME, async () => {
  try {
    // Simulate a long-running task
    counter++;
    console.log(`[Foreground Service] Count: ${counter}`);
    
    // Update the notification
    await updateNotification();
    
    return true;
  } catch (error) {
    console.error('Foreground service error:', error);
    return false;
  }
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('foreground-service', {
      name: 'Foreground Service',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Update the notification
const updateNotification = async () => {
  if (notificationId) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Foreground Service Running',
        body: `Current count: ${counter}`,
        data: { screen: 'home' },
      },
      trigger: null,
      identifier: notificationId,
    });
  }
};

// Start the foreground service
export const startForegroundService = async () => {
  try {
    // Reset counter
    counter = 0;
    
    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return false;
    }

    // Show the initial notification
    const notification = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Foreground Service Starting',
        body: 'The service is starting...',
        data: { screen: 'home' },
      },
      trigger: null,
    });
    
    notificationId = notification;
    
    // Register the foreground task
    await TaskManager.isTaskRegisteredAsync(FOREGROUND_TASK_NAME) && 
      await TaskManager.unregisterTaskAsync(FOREGROUND_TASK_NAME);
    
    // Start a repeating task to simulate foreground service
    const intervalId = setInterval(() => {
      // Manually trigger our task handler logic
      counter++;
      console.log(`[Foreground Service] Count: ${counter}`);
      updateNotification();
    }, 1000);
    
    // Store the interval ID
    global.foregroundServiceIntervalId = intervalId;
    
    console.log('Foreground service started');
    return true;
  } catch (error) {
    console.error('Foreground service start failed:', error);
    return false;
  }
};

// Stop the foreground service
export const stopForegroundService = async () => {
  try {
    // Clear the interval
    if (global.foregroundServiceIntervalId) {
      clearInterval(global.foregroundServiceIntervalId);
      global.foregroundServiceIntervalId = null;
    }
    
    // Cancel the notification
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      notificationId = null;
    }
    
    // Unregister the task
    if (await TaskManager.isTaskRegisteredAsync(FOREGROUND_TASK_NAME)) {
      await TaskManager.unregisterTaskAsync(FOREGROUND_TASK_NAME);
    }
    
    console.log('Foreground service stopped');
    return true;
  } catch (error) {
    console.error('Foreground service stop failed:', error);
    return false;
  }
};

// Get the current count
export const getForegroundServiceCount = () => {
  return counter;
}; 