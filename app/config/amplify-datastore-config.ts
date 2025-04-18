import { Amplify, DataStore } from 'aws-amplify';
import { Hub } from '@aws-amplify/core';

// Initialize Amplify with DataStore configuration
export const configureAmplifyDataStore = () => {
  try {
    console.log('Configuring Amplify DataStore in local-only mode...');

    // Configure Amplify with DataStore settings for local-only mode
    Amplify.configure({
      // DataStore configuration
      DataStore: {
        // Disable cloud synchronization
        sync: false
      }
    });

    // Set up DataStore event listeners
    Hub.listen('datastore', async (hubData) => {
      const { event, data } = hubData.payload;

      switch (event) {
        case 'ready':
          console.log('DataStore is ready');
          break;
        case 'syncQueriesStarted':
          console.log('DataStore sync queries started');
          break;
        case 'syncQueriesReady':
          console.log('DataStore sync queries ready');
          break;
        case 'syncQueriesFinished':
          console.log('DataStore sync queries finished');
          break;
        case 'outboxStatus':
          console.log('DataStore outbox status:', data.isEmpty ? 'Empty' : 'Not Empty');
          break;
        case 'networkStatus':
          console.log('DataStore network status:', data.active ? 'Online' : 'Offline');
          break;
        case 'syncError':
          console.error('DataStore sync error:', data);
          break;
      }
    });

    // Start DataStore
    DataStore.start();

    console.log('Amplify DataStore configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify DataStore:', error);
  }
};

// Function to clear the DataStore
export const clearDataStore = async () => {
  try {
    console.log('Clearing DataStore...');
    await DataStore.clear();
    console.log('DataStore cleared successfully');
  } catch (error) {
    console.error('Error clearing DataStore:', error);
  }
};

// Function to start DataStore sync
export const startDataStoreSync = async () => {
  try {
    console.log('Starting DataStore sync...');
    await DataStore.start();
    console.log('DataStore sync started');
  } catch (error) {
    console.error('Error starting DataStore sync:', error);
  }
};

// Function to stop DataStore sync
export const stopDataStoreSync = async () => {
  try {
    console.log('Stopping DataStore sync...');
    await DataStore.stop();
    console.log('DataStore sync stopped');
  } catch (error) {
    console.error('Error stopping DataStore sync:', error);
  }
};
