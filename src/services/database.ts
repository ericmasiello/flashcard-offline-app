import Dexie, { type Table } from 'dexie';

// Define the FlashCard interface
export interface FlashCard {
  id?: number;
  front: string;
  back: string;
  favorite?: boolean;
}

export interface FormattedFlashCard {
  id?: number;
  front: {
    question: string;
    options: string[];
    _raw: string;
  };
  back: string;
  favorite?: boolean;
}

// Define the CardOrder interface for tracking randomized order
export interface CardOrder {
  id?: number;
  flashCardId: number;
  position: number;
}

// Define the UserProgress interface for tracking user's current position
export interface UserProgress {
  id?: number;
  key: string; // Always 'currentPosition' for this app
  currentIndex: number;
}

// Define the database class
export class FlashCardDB extends Dexie {
  flashcards!: Table<FlashCard>;
  cardOrder!: Table<CardOrder>;
  userProgress!: Table<UserProgress>;

  constructor() {
    super('FlashCardDB');
    this.version(1).stores({
      flashcards: '++id, front, back',
      cardOrder: '++id, flashCardId, position',
      userProgress: '++id, &key, currentIndex',
    });

    // Version 2: Add favorite field
    this.version(2).stores({
      flashcards: '++id, front, back, favorite',
      cardOrder: '++id, flashCardId, position',
      userProgress: '++id, &key, currentIndex',
    });
  }
}

// Create and export the database instance
export const db = new FlashCardDB();

// Database operations
export const flashCardService = {
  // Get all flash cards in randomized order
  async getAll(): Promise<FormattedFlashCard[]> {
    // Get all card orders sorted by position
    const cardOrders = await db.cardOrder.orderBy('position').toArray();

    if (cardOrders.length === 0) {
      // If no order exists, return cards in their natural order
      return (await db.flashcards.toArray()).map(this.format);
    }

    // Get flash cards in the randomized order
    const flashCards = await Promise.all(
      cardOrders.map((order) => db.flashcards.get(order.flashCardId)),
    );

    // Filter out any undefined cards (in case of data inconsistency)
    return flashCards
      .filter((card): card is FlashCard => card !== undefined)
      .map(this.format);
  },

  format(card: FlashCard): FormattedFlashCard {
    const [question, rawOptions] = card.front.split('A:');

    // split options by "A:", "B:", etc into an array, removing the "A:", "B:", etc.
    const options = rawOptions
      .split(/(?=[A-Z]:)/)
      .map((option) => option.replace(/^[A-Z]:\s*/, '').trim())
      .filter(Boolean);

    return {
      ...card,
      front: {
        question: question.trim(),
        options: options,
        _raw: card.front, // Store the original front text for reference
      },
    };
  },

  // Get all flash cards in their natural order (without randomization)
  async getAllNatural(): Promise<FormattedFlashCard[]> {
    return (await db.flashcards.toArray()).map(this.format);
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
    await this.resetCurrentPosition();
  },

  // Get flash card count
  async count(): Promise<number> {
    return await db.flashcards.count();
  },

  // Save the current card position
  async saveCurrentPosition(index: number): Promise<void> {
    await db.userProgress.clear();

    await db.userProgress.add({
      key: 'currentPosition',
      currentIndex: index,
    });
  },

  // Get the current card position
  async getCurrentPosition(): Promise<number> {
    const progress = await db.userProgress
      .where('key')
      .equals('currentPosition')
      .toArray()
      .then((results) => results.at(0));

    return progress?.currentIndex ?? 0;
  },

  // Reset current position to 0
  async resetCurrentPosition(): Promise<void> {
    await this.saveCurrentPosition(0);
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
    const cardIds = allCards.map((card) => card.id!);
    const shuffledIds = this.shuffleArray([...cardIds]);

    // Create card order entries
    const cardOrderEntries: Omit<CardOrder, 'id'>[] = shuffledIds.map(
      (flashCardId, index) => ({
        flashCardId,
        position: index,
      }),
    );

    // Save the new order
    await db.cardOrder.bulkAdd(cardOrderEntries);

    // Reset current position to the first card
    await this.resetCurrentPosition();
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

  // Get all favorite flash cards
  async getFavorites(): Promise<FormattedFlashCard[]> {
    const favoriteCards = await db.flashcards
      .filter((card) => card.favorite === true)
      .toArray();
    return favoriteCards.map(this.format);
  },

  // Toggle favorite status of a flash card
  async toggleFavorite(id: number): Promise<void> {
    const card = await db.flashcards.get(id);
    if (card) {
      await db.flashcards.update(id, { favorite: !card.favorite });
    }
  },

  // Set favorite status of a flash card
  async setFavorite(id: number, favorite: boolean): Promise<void> {
    await db.flashcards.update(id, { favorite });
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
  },
};
