import { initDb } from './client';

export async function ensureDbInitialized() {
  try {
    await initDb();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

