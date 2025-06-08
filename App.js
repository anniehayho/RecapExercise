import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  countWithCoroutine,
  createCountingTask
} from './services/AsyncTasks';
import {
  isBackgroundTaskRegistered,
  registerBackgroundTask,
  unregisterBackgroundTask,
} from './services/BackgroundService';
import boundService from './services/BoundService';
import {
  startForegroundService,
  stopForegroundService,
} from './services/ForegroundService';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [backgroundRunning, setBackgroundRunning] = useState(false);
  const [foregroundRunning, setForegroundRunning] = useState(false);
  const [boundRunning, setBoundRunning] = useState(false);
  const [boundCount, setBoundCount] = useState(0);
  const [asyncTaskProgress, setAsyncTaskProgress] = useState(0);
  const [coroutineProgress, setCoroutineProgress] = useState(0);
  const [isCoroutineRunning, setIsCoroutineRunning] = useState(false);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs.slice(0, 49)]);
  };
  
  useEffect(() => {
    const checkServices = async () => {
      try {
        const backgroundRegistered = await isBackgroundTaskRegistered();
        setBackgroundRunning(backgroundRegistered);
        
        // Check if bound service is running
        const isBoundRunning = boundService.isRunning();
        setBoundRunning(isBoundRunning);
        
        addLog('App initialized');
      } catch (error) {
        addLog(`Error checking services: ${error.message}`);
      }
    };
    
    checkServices();
    
    const unsubscribe = boundService.subscribe((count) => {
      setBoundCount(count);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleStartBackground = async () => {
    try {
      const result = await registerBackgroundTask();
      setBackgroundRunning(result);
      addLog(result ? 'Background task started' : 'Failed to start background task');
    } catch (error) {
      addLog(`Error starting background task: ${error.message}`);
    }
  };

  const handleStopBackground = async () => {
    try {
      await unregisterBackgroundTask();
      setBackgroundRunning(false);
      addLog('Background task stopped');
    } catch (error) {
      addLog(`Error stopping background task: ${error.message}`);
    }
  };

  const handleStartForeground = async () => {
    try {
      const result = await startForegroundService();
      setForegroundRunning(result);
      addLog(result ? 'Foreground service started' : 'Failed to start foreground service');
    } catch (error) {
      addLog(`Error starting foreground service: ${error.message}`);
    }
  };

  const handleStopForeground = async () => {
    try {
      await stopForegroundService();
      setForegroundRunning(false);
      addLog('Foreground service stopped');
    } catch (error) {
      addLog(`Error stopping foreground service: ${error.message}`);
    }
  };

  const handleBindService = () => {
    try {
      if (!boundRunning) {
        boundService.start();
        setBoundRunning(true);
        addLog('Bound to service');
      } else {
        boundService.stop();
        setBoundRunning(false);
        setBoundCount(0);
        addLog('Unbound from service');
      }
    } catch (error) {
      addLog(`Error binding to service: ${error.message}`);
    }
  };

  const handleRunAsyncTask = () => {
    addLog('Starting AsyncTask...');
    setAsyncTaskProgress(0);
    
    const task = createCountingTask(
      ({ progress, currentCount }) => {
        setAsyncTaskProgress(progress);
        addLog(`AsyncTask progress: ${progress}%, count: ${currentCount}`);
      },
      (results) => {
        addLog(`AsyncTask completed with ${results.length} counts`);
      }
    );
    
    task.execute(20);
  };

  const handleRunCoroutine = async () => {
    if (isCoroutineRunning) {
      addLog('Coroutine is already running');
      return;
    }
    
    addLog('Starting Coroutine...');
    setCoroutineProgress(0);
    setIsCoroutineRunning(true);
    
    const coroutine = await countWithCoroutine(
      10,
      ({ progress, currentCount }) => {
        setCoroutineProgress(progress);
        addLog(`Coroutine progress: ${progress}%, count: ${currentCount}`);
      },
      (results) => {
        addLog(`Coroutine completed with ${results.length} counts`);
        setIsCoroutineRunning(false);
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Background Services Demo</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, backgroundRunning ? styles.stopButton : styles.startButton]} 
            onPress={backgroundRunning ? handleStopBackground : handleStartBackground}
          >
            <Text style={styles.buttonText}>
              {backgroundRunning ? 'Stop Background Task' : 'Start Background Task'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, foregroundRunning ? styles.stopButton : styles.startButton]} 
            onPress={foregroundRunning ? handleStopForeground : handleStartForeground}
          >
            <Text style={styles.buttonText}>
              {foregroundRunning ? 'Stop Foreground Service' : 'Start Foreground Service'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, boundRunning ? styles.stopButton : styles.startButton]} 
            onPress={handleBindService}
          >
            <Text style={styles.buttonText}>
              {boundRunning ? 'Unbind Service' : 'Bind to Service'}
            </Text>
          </TouchableOpacity>
          
          {boundRunning && (
            <View style={styles.countContainer}>
              <Text style={styles.countText}>Count: {boundCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.taskButton]} 
            onPress={handleRunAsyncTask}
          >
            <Text style={styles.buttonText}>Run AsyncTask</Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${asyncTaskProgress}%` }]} />
            <Text style={styles.progressText}>{asyncTaskProgress}%</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, styles.taskButton, isCoroutineRunning && styles.disabledButton]} 
            onPress={handleRunCoroutine}
            disabled={isCoroutineRunning}
          >
            <Text style={styles.buttonText}>Run Coroutine</Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${coroutineProgress}%` }]} />
            <Text style={styles.progressText}>{coroutineProgress}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Logs:</Text>
        <ScrollView style={styles.logScroll}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  taskButton: {
    backgroundColor: '#9c27b0',
    minWidth: 150,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  countContainer: {
    marginLeft: 20,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 1,
    height: 20,
    marginLeft: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff9800',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logTitle: {
    backgroundColor: '#eee',
    padding: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logScroll: {
    flex: 1,
    padding: 10,
  },
  logText: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
}); 