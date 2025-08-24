import { Database } from 'arangojs';

export const db = new Database({
  url: 'http://localhost:8529',
  databaseName: 'lcars',
});
