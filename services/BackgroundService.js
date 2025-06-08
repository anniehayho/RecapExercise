import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

// Define the task name
export const BACKGROUND_TASK_NAME = 'BACKGROUND_COUNT_TASK';

// Global counter for background task
let counter = 0;

// Define the task handler
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    // Simulate a long-running task
    counter++;
    console.log(`[Background Task] Count: ${counter}`);
    
    // Return success to indicate the task completed successfully
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background task
export const registerBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 1, // 1 second (minimum is actually 15 minutes in production)
      stopOnTerminate: false, // Task continues to run after app is terminated
      startOnBoot: true, // Task runs when device reboots
    });
    console.log('Background task registered');
    return true;
  } catch (error) {
    console.error('Background task registration failed:', error);
    return false;
  }
};

// Unregister the background task
export const unregisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
    console.log('Background task unregistered');
    return true;
  } catch (error) {
    console.error('Background task unregistration failed:', error);
    return false;
  }
};

// Check if the background task is registered
export const isBackgroundTaskRegistered = async () => {
  return await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
}; 