import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Hub } from '@aws-amplify/core';
import { clearData, createMockData } from '../mock/mockData';

/**
 * DataSync component displays the current sync status of DataStore
 * and provides buttons to manage data synchronization
 */
export const DataSync = () => {
  const [syncStatus, setSyncStatus] = useState<string>('initializing');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set up Hub listener for DataStore events
    const listener = Hub.listen('datastore', async (hubData) => {
      const { event, data } = hubData.payload;

      switch (event) {
        case 'ready':
          setSyncStatus('ready');
          break;
        case 'syncQueriesStarted':
          setSyncStatus('syncing');
          break;
        case 'syncQueriesReady':
          setSyncStatus('synced');
          break;
        case 'syncQueriesFinished':
          setSyncStatus('finished');
          break;
        case 'networkStatus':
          if (data && typeof data === 'object' && 'active' in data) {
            setIsOnline(data.active);
          }
          break;
      }
    });

    // Clean up Hub listener
    return () => {
      listener();
    };
  }, []);

  const handleClearData = async () => {
    setIsLoading(true);
    try {
      await clearData();
      setSyncStatus('cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMockData = async () => {
    setIsLoading(true);
    try {
      await createMockData();
      setSyncStatus('created');
    } catch (error) {
      console.error('Error creating mock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSync = async () => {
    setIsLoading(true);
    try {
      await DataStore.start();
      setSyncStatus('started');
    } catch (error) {
      console.error('Error starting sync:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSync = async () => {
    setIsLoading(true);
    try {
      await DataStore.stop();
      setSyncStatus('stopped');
    } catch (error) {
      console.error('Error stopping sync:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.title}>DataStore Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'} - {syncStatus}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearData}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Clear Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateMockData}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Create Mock Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.syncButton]}
          onPress={handleStartSync}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Start Sync</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStopSync}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Stop Sync</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  syncButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
