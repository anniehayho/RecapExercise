# Background Services Demo

A React Native Expo application demonstrating background tasks, foreground services, and bound services.

## Features

- **Background Task**: Demonstrates running a task in the background using Expo's TaskManager.
- **Foreground Service**: Shows a notification and performs a task while the app is in the foreground or background.
- **Bound Service**: Allows the UI to interact with a service and get real-time updates.
- **AsyncTask**: Simulates Android's AsyncTask for synchronous operations.
- **Coroutines**: Demonstrates asynchronous tasks similar to Kotlin Coroutines.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## Installation

1. Clone the repository (or download the source code)
2. Install dependencies:

```bash
cd BackgroundServiceApp
npm install
```

## Running the App

Start the Expo development server:

```bash
npm start
```

Then:
- Press `a` to open the app in an Android emulator
- Press `i` to open the app in an iOS simulator (macOS only)
- Scan the QR code with the Expo Go app on your physical device

## Important Notes

- Background tasks in Expo have limitations. In a production environment, background tasks are only allowed to run at minimum intervals of 15 minutes.
- Foreground services with notifications require proper permissions, especially on Android.
- On iOS, background capabilities are more restricted than on Android.

## Project Structure

- `services/` - Contains service implementations
  - `BackgroundService.js` - Implementation of background tasks
  - `ForegroundService.js` - Implementation of foreground service with notifications
  - `BoundService.js` - Implementation of a bound service
  - `AsyncTasks.js` - Implementation of AsyncTask and Coroutine equivalents
- `models/` - Data models
  - `Alarm.js` - Simple model for alarm data
- `App.js` - Main application component with UI

## Learning Objectives

This app demonstrates:
1. How to implement background processing in React Native
2. Working with notifications for foreground services
3. Creating a service that can be bound to by UI components
4. Synchronous vs asynchronous task handling
