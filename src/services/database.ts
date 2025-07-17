import Dexie, { type Table } from 'dexie';

// Define the FlashCard interface
export interface FlashCard {
  id?: number;
  front: string;
  back: string;
}

// Define the CardOrder interface for tracking randomized order
export interface CardOrder {
  id?: number;
  flashCardId: number;
  position: number;
}

// Define the database class
export class FlashCardDB extends Dexie {
  flashcards!: Table<FlashCard>;
  cardOrder!: Table<CardOrder>;

  constructor() {
    super('FlashCardDB');
    this.version(1).stores({
      flashcards: '++id, front, back',
      cardOrder: '++id, flashCardId, position'
    });
  }
}

// Create and export the database instance
export const db = new FlashCardDB();

// Database operations
export const flashCardService = {
  // Get all flash cards in randomized order
  async getAll(): Promise<FlashCard[]> {
    // Get all card orders sorted by position
    const cardOrders = await db.cardOrder.orderBy('position').toArray();
    
    if (cardOrders.length === 0) {
      // If no order exists, return cards in their natural order
      return await db.flashcards.toArray();
    }
    
    // Get flash cards in the randomized order
    const flashCards = await Promise.all(
      cardOrders.map(order => db.flashcards.get(order.flashCardId))
    );
    
    // Filter out any undefined cards (in case of data inconsistency)
    return flashCards.filter((card): card is FlashCard => card !== undefined);
  },

  // Get all flash cards in their natural order (without randomization)
  async getAllNatural(): Promise<FlashCard[]> {
    return await db.flashcards.toArray();
  },

  // Add a single flash card and update random order
  async add(flashCard: Omit<FlashCard, 'id'>): Promise<number> {
    const id = await db.flashcards.add(flashCard);
    await this.regenerateRandomOrder();
    return id;
  },

  // Add multiple flash cards and generate random order
  async addMany(flashCards: Omit<FlashCard, 'id'>[]): Promise<number[]> {
    const ids = await db.flashcards.bulkAdd(flashCards, { allKeys: true });
    await this.regenerateRandomOrder();
    return ids;
  },

  // Delete a flash card by id and update random order
  async delete(id: number): Promise<void> {
    await db.flashcards.delete(id);
    await db.cardOrder.where('flashCardId').equals(id).delete();
    await this.regenerateRandomOrder();
  },

  // Clear all flash cards and card order
  async clear(): Promise<void> {
    await db.flashcards.clear();
    await db.cardOrder.clear();
  },

  // Get flash card count
  async count(): Promise<number> {
    return await db.flashcards.count();
  },

  // Generate a new random order for all flash cards
  async regenerateRandomOrder(): Promise<void> {
    const allCards = await db.flashcards.toArray();
    
    // Clear existing order
    await db.cardOrder.clear();
    
    if (allCards.length === 0) {
      return;
    }
    
    // Create array of card IDs and shuffle them
    const cardIds = allCards.map(card => card.id!);
    const shuffledIds = this.shuffleArray([...cardIds]);
    
    // Create card order entries
    const cardOrderEntries: Omit<CardOrder, 'id'>[] = shuffledIds.map((flashCardId, index) => ({
      flashCardId,
      position: index
    }));
    
    // Save the new order
    await db.cardOrder.bulkAdd(cardOrderEntries);
  },

  // Utility function to shuffle an array using Fisher-Yates algorithm
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Check if random order exists and is complete
  async isRandomOrderValid(): Promise<boolean> {
    const cardCount = await this.count();
    const orderCount = await db.cardOrder.count();
    return cardCount === orderCount && cardCount > 0;
  },

  // Initialize random order if it doesn't exist or is incomplete
  async initializeRandomOrder(): Promise<void> {
    const isValid = await this.isRandomOrderValid();
    if (!isValid) {
      await this.regenerateRandomOrder();
    }
  }
};
