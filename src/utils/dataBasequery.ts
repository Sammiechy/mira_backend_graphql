import { AppDataSource } from "../data-source";

async function testConnection() {
    try {
      await AppDataSource.query('SELECT 1');
      console.log('Database connection is active');
    } catch (error) {
      console.error('Database connection test failed:', error);
    }
  }
  
  testConnection();
  