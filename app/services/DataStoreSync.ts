// DataStoreSync.ts - A dedicated service to manage DataStore synchronization
import { Amplify, DataStore, Hub } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { createMockData } from '../mock/mockData';

// Singleton instance
let instance: DataStoreSyncService | null = null;

export class DataStoreSyncService {
  private _isInitialized: boolean = false;
  private _isReady: boolean = false;
  private _networkStatus: string = 'unknown';
  private _syncStatus: string = 'not_started';
  private _listeners: Array<(status: any) => void> = [];
  private _syncInProgress: boolean = false;

  // Private constructor for singleton pattern
  private constructor() {}

  // Get the singleton instance
  public static getInstance(): DataStoreSyncService {
    if (!instance) {
      instance = new DataStoreSyncService();
    }
    return instance;
  }

  // Initialize the DataStore with proper configuration
  public async initialize(): Promise<void> {
    if (this._isInitialized) {
      console.log('DataStore already initialized');
      return;
    }

    try {
      console.log('Initializing Amplify with configuration');
      Amplify.configure(config);
      console.log('Amplify configured successfully');

      // Set up Hub listener for DataStore events
      this.setupHubListener();

      // Start DataStore
      await this.start();

      this._isInitialized = true;
      console.log('DataStore initialization completed');
    } catch (error) {
      console.error('Error initializing DataStore:', error);
      throw error;
    }
  }

  // Set up Hub listener for DataStore events
  private setupHubListener(): void {
    Hub.listen('datastore', (data) => {
      const { payload } = data;
      console.log('DataStore Hub event:', payload.event, payload);

      switch (payload.event) {
        case 'ready':
          this._isReady = true;
          this._syncStatus = 'ready';
          this.notifyListeners({ type: 'ready' });
          break;

        case 'networkStatus':
          if (payload.data && typeof payload.data === 'object' && 'active' in payload.data) {
            this._networkStatus = payload.data.active ? 'online' : 'offline';
            this.notifyListeners({ 
              type: 'networkStatus', 
              status: this._networkStatus 
            });
          }
          break;

        case 'outboxStatus':
          this.notifyListeners({ 
            type: 'outboxStatus', 
            status: payload.data 
          });
          break;

        case 'syncQueriesReady':
          this._syncStatus = 'queries_ready';
          this.notifyListeners({ type: 'syncQueriesReady' });
          break;

        case 'modelSynced':
          this.notifyListeners({ 
            type: 'modelSynced', 
            model: payload.data?.model,
            isFullSync: payload.data?.isFullSync,
            isDeltaSync: payload.data?.isDeltaSync,
            counts: payload.data?.counts
          });
          break;

        case 'syncQueriesStarted':
          this._syncStatus = 'queries_started';
          this.notifyListeners({ type: 'syncQueriesStarted' });
          break;

        case 'fullSyncStarted':
          this._syncStatus = 'full_sync_started';
          this._syncInProgress = true;
          this.notifyListeners({ type: 'fullSyncStarted' });
          break;

        case 'fullSyncCompleted':
          this._syncStatus = 'full_sync_completed';
          this._syncInProgress = false;
          this.notifyListeners({ type: 'fullSyncCompleted' });
          break;
      }
    });
  }

  // Start DataStore
  public async start(): Promise<void> {
    try {
      console.log('Starting DataStore');
      await DataStore.start();
      console.log('DataStore started successfully');
    } catch (error) {
      console.error('Error starting DataStore:', error);
      throw error;
    }
  }

  // Stop DataStore
  public async stop(): Promise<void> {
    try {
      console.log('Stopping DataStore');
      await DataStore.stop();
      console.log('DataStore stopped successfully');
      this._isReady = false;
      this._syncStatus = 'stopped';
      this.notifyListeners({ type: 'stopped' });
    } catch (error) {
      console.error('Error stopping DataStore:', error);
      throw error;
    }
  }

  // Clear DataStore
  public async clear(): Promise<void> {
    try {
      console.log('Clearing DataStore');
      await DataStore.clear();
      console.log('DataStore cleared successfully');
      this.notifyListeners({ type: 'cleared' });
    } catch (error) {
      console.error('Error clearing DataStore:', error);
      throw error;
    }
  }

  // Force a full sync
  public async forceSync(): Promise<void> {
    if (this._syncInProgress) {
      console.log('Sync already in progress, skipping force sync');
      return;
    }

    try {
      console.log('Forcing full DataStore sync');
      this._syncInProgress = true;
      
      // Stop DataStore
      await this.stop();
      
      // Start DataStore to trigger a full sync
      await this.start();
      
      console.log('Force sync initiated');
    } catch (error) {
      this._syncInProgress = false;
      console.error('Error forcing DataStore sync:', error);
      throw error;
    }
  }

  // Initialize data if needed
  public async initializeData(): Promise<void> {
    if (!this._isReady) {
      console.log('DataStore not ready, waiting before initializing data');
      return;
    }

    try {
      console.log('Checking if data initialization is needed');
      
      // Query for any existing data
      const models = await DataStore.query('Resume');
      console.log(`Found ${models.length} Resume models`);
      
      if (models.length === 0) {
        console.log('No data found, initializing with mock data');
        
        // Stop sync before creating mock data
        await this.stop();
        
        // Clear any existing data
        await this.clear();
        
        // Create mock data
        await createMockData();
        console.log('Mock data created successfully');
        
        // Restart sync to push the new data
        await this.start();
        
        console.log('Data initialization completed');
        this.notifyListeners({ type: 'dataInitialized' });
      } else {
        console.log('Data already exists, skipping initialization');
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }

  // Add a listener for status updates
  public addListener(callback: (status: any) => void): () => void {
    this._listeners.push(callback);
    
    // Return a function to remove this listener
    return () => {
      this._listeners = this._listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of a status change
  private notifyListeners(status: any): void {
    this._listeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in DataStore status listener:', error);
      }
    });
  }

  // Get current status
  public getStatus(): { isReady: boolean; networkStatus: string; syncStatus: string } {
    return {
      isReady: this._isReady,
      networkStatus: this._networkStatus,
      syncStatus: this._syncStatus
    };
  }
}

// Export a singleton instance
export const dataStoreSync = DataStoreSyncService.getInstance();
