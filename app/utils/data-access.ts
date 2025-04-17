import { Amplify } from '../config/amplify-config';
import { GraphQLQuery } from '@aws-amplify/api';

/**
 * Utility functions for accessing data from Amplify DynamoDB
 */

// Example query
const LIST_ITEMS = `
  query ListItems {
    listItems {
      items {
        id
        name
        description
      }
    }
  }
`;

// Example mutation
const CREATE_ITEM = `
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      id
      name
      description
    }
  }
`;

/**
 * Fetch data from DynamoDB using GraphQL
 */
export async function fetchData<T>(query: string, variables?: any): Promise<T | null> {
  try {
    console.log('Fetching data with query:', query.substring(0, 50) + '...');
    
    // Use the real API.graphql method
    const response = await Amplify.API.graphql({
      query,
      variables,
      authMode: 'API_KEY' // Use API key auth mode
    } as GraphQLQuery);
    
    console.log('Data fetch successful');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

/**
 * Create or update data in DynamoDB using GraphQL
 */
export async function saveData<T>(mutation: string, variables: any): Promise<T | null> {
  try {
    console.log('Saving data with mutation:', mutation.substring(0, 50) + '...');
    
    // Use the real API.graphql method
    const response = await Amplify.API.graphql({
      query: mutation,
      variables,
      authMode: 'API_KEY' // Use API key auth mode
    } as GraphQLQuery);
    
    console.log('Data save successful');
    return response.data;
  } catch (error) {
    console.error('Error saving data:', error);
    return null;
  }
}

/**
 * Example function to list items
 */
export async function listItems() {
  return fetchData(LIST_ITEMS);
}

/**
 * Example function to create an item
 */
export async function createItem(name: string, description: string) {
  return saveData(CREATE_ITEM, {
    input: {
      name,
      description
    }
  });
}
