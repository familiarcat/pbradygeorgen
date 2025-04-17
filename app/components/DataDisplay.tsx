import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchData } from '../utils/data-access';

// Simple GraphQL query to test data access
const TEST_QUERY = `
  query GetData {
    listResumes {
      items {
        id
        title
        createdAt
      }
    }
  }
`;

interface Resume {
  id: string;
  title: string;
  createdAt: string;
}

interface QueryResult {
  listResumes: {
    items: Resume[];
  };
}

export const DataDisplay = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Resume[] | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        console.log('Fetching resume data...');
        
        // Fetch data using our utility function
        const result = await fetchData<QueryResult>(TEST_QUERY);
        
        if (result && result.listResumes && result.listResumes.items) {
          setData(result.listResumes.items);
          console.log('Resume data loaded successfully:', result.listResumes.items.length, 'items');
        } else {
          setError('No data returned');
          console.log('No resume data returned');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading resume data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.text}>Could not load data from DynamoDB</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Resumes from DynamoDB:</Text>
      {data.map(item => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      ))}
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
