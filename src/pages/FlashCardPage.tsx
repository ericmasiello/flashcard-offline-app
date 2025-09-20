import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { FlashCardComponent } from '../components/FlashCardComponent';
import { flashCardService } from '../services/database';
import './FlashCardPage.css';

export const FlashCardPage: React.FC = () => {
  const [resetCard, setResetCard] = useState(false);
  const queryClient = useQueryClient();

  const flashCardsResult = useSuspenseQuery({
    queryKey: ['flash-cards'],
    queryFn: async () => {
      // // Initialize random order if it doesn't exist
      await flashCardService.initializeRandomOrder();
      // Get cards in randomized order
      const [flashCards, savedPosition] = await Promise.all([
        flashCardService.getAll(),
        flashCardService.getCurrentPosition(),
      ]);
      return [flashCards, savedPosition] as const;
    },
  });

  const [flashCards, currentIndex] = flashCardsResult.data;

  const goToNext = async () => {
    if (flashCards.length > 0) {
      setResetCard(true);
      await flashCardService.saveCurrentPosition(
        (currentIndex + 1) % flashCards.length,
      );
      await queryClient.invalidateQueries({ queryKey: ['flash-cards'] });
    }
  };

  const goToPrevious = async () => {
    if (flashCards.length > 0) {
      setResetCard(true);
      await flashCardService.saveCurrentPosition(
        (currentIndex - 1 + flashCards.length) % flashCards.length,
      );
      await queryClient.invalidateQueries({ queryKey: ['flash-cards'] });
    }
  };

  const handleResetComplete = () => {
    setResetCard(false);
  };

  const handleFavoriteChange = async () => {
    // Invalidate the main flash cards query to refresh the data
    await queryClient.invalidateQueries({ queryKey: ['flash-cards'] });
  };

  if (flashCards.length === 0) {
    return (
      <div className="flashcard-page">
        <div className="empty-state">
          <h2>No Flash Cards Found</h2>
          <p>Create some flash cards to get started!</p>
          <Link to="/admin" className="button button-primary">
            Go to Admin Page
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashCards[currentIndex];

  return (
    <div className="flashcard-page">
      <header className="flashcard-header">
        <h1>Flash Cards</h1>
        <div className="header-links">
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        </div>
      </header>

      <div className="flashcard-wrapper">
        <div className="card-counter">
          Card {currentIndex + 1} of {flashCards.length}
        </div>

        <FlashCardComponent
          flashCard={currentCard}
          resetCard={resetCard}
          onResetComplete={handleResetComplete}
          onFavoriteChange={handleFavoriteChange}
        />

        <div className="navigation-controls">
          <button
            onClick={goToPrevious}
            disabled={flashCards.length <= 1}
            className="button button-secondary"
          >
            Previous
          </button>
          <button
            onClick={goToNext}
            disabled={flashCards.length <= 1}
            className="button button-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
