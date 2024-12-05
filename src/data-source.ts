// src/data-source.ts
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host:  'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USERNAME || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'your_database',
  synchronize: true, // Automatically sync schema in development
  logging: true,
  entities: [__dirname + '/entities/*.ts'],
});
