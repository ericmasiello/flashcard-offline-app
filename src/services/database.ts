import Dexie, { type Table } from 'dexie';

// Define the FlashCard interface
export interface FlashCard {
  id?: number;
  front: string;
  back: string;
}

// Define the database class
export class FlashCardDB extends Dexie {
  flashcards!: Table<FlashCard>;

  constructor() {
    super('FlashCardDB');
    this.version(1).stores({
      flashcards: '++id, front, back'
    });
  }
}

// Create and export the database instance
export const db = new FlashCardDB();

// Database operations
export const flashCardService = {
  // Get all flash cards
  async getAll(): Promise<FlashCard[]> {
    return await db.flashcards.toArray();
  },

  // Add a single flash card
  async add(flashCard: Omit<FlashCard, 'id'>): Promise<number> {
    return await db.flashcards.add(flashCard);
  },

  // Add multiple flash cards
  async addMany(flashCards: Omit<FlashCard, 'id'>[]): Promise<number[]> {
    return await db.flashcards.bulkAdd(flashCards, { allKeys: true });
  },

  // Delete a flash card by id
  async delete(id: number): Promise<void> {
    await db.flashcards.delete(id);
  },

  // Clear all flash cards
  async clear(): Promise<void> {
    await db.flashcards.clear();
  },

  // Get flash card count
  async count(): Promise<number> {
    return await db.flashcards.count();
  }
};
