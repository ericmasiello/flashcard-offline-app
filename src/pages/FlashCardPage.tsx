import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FlashCardComponent } from '../components/FlashCardComponent';
import { flashCardService } from '../services/database';
import './FlashCardPage.css';

export const FlashCardPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [resetCard, setResetCard] = useState(false);

  const flashCardsResult = useSuspenseQuery({
    queryKey: ['flash-cards'],
    queryFn: async () => {
      // Initialize random order if it doesn't exist
      await flashCardService.initializeRandomOrder();
      // Get cards in randomized order
      return await flashCardService.getAll();
    },
  });

  const goToNext = () => {
    if (flashCardsResult.data.length > 0) {
      setResetCard(true);
      setCurrentIndex((prev) => (prev + 1) % flashCardsResult.data.length);
    }
  };

  const goToPrevious = () => {
    if (flashCardsResult.data.length > 0) {
      setResetCard(true);
      setCurrentIndex(
        (prev) =>
          (prev - 1 + flashCardsResult.data.length) %
          flashCardsResult.data.length,
      );
    }
  };

  const handleResetComplete = () => {
    setResetCard(false);
  };

  if (flashCardsResult.data.length === 0) {
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

  const currentCard = flashCardsResult.data[currentIndex];

  return (
    <div className="flashcard-page">
      <header className="flashcard-header">
        <h1>Flash Cards</h1>
        <Link to="/admin" className="admin-link">
          Admin
        </Link>
      </header>

      <div className="flashcard-wrapper">
        <div className="card-counter">
          Card {currentIndex + 1} of {flashCardsResult.data.length}
        </div>

        <FlashCardComponent
          flashCard={currentCard}
          resetCard={resetCard}
          onResetComplete={handleResetComplete}
        />

        <div className="navigation-controls">
          <button
            onClick={goToPrevious}
            disabled={flashCardsResult.data.length <= 1}
            className="button button-secondary"
          >
            Previous
          </button>
          <button
            onClick={goToNext}
            disabled={flashCardsResult.data.length <= 1}
            className="button button-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
