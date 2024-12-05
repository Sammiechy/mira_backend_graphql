// src/index.ts
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './data-source';
import { UserResolver } from './resolvers/UserResolver';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { createSchema } from './schemas';

dotenv.config();

async function startServer() {
  await AppDataSource.initialize();
  if (AppDataSource.isInitialized) {
    console.log('Database is connected');
  } else {
    console.log('Database is NOT connected');
  }
  const schema = await createSchema();

  const server = new ApolloServer({ schema });
  const app:any = express();
  await server.start();
  server.applyMiddleware({ app });
  app.get('/health', async (_req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; error?: unknown; }): void; new(): any; }; }; }) => {
    try {
      await AppDataSource.query('SELECT 1');
      res.status(200).json({ message: 'Database connection is active' });
    } catch (error) {
      res.status(500).json({ message: 'Database connection failed', error });
    }
  });
  app.use("/api/users", userRoutes);

  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
  });
}

startServer().catch((error) => console.error(error));
