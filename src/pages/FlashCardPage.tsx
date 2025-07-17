import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FlashCardComponent } from '../components/FlashCardComponent';
import { flashCardService, type FlashCard } from '../services/database';
import './FlashCardPage.css';

export const FlashCardPage: React.FC = () => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetCard, setResetCard] = useState(false);

  useEffect(() => {
    loadFlashCards();
  }, []);

  const loadFlashCards = async () => {
    try {
      setLoading(true);
      const cards = await flashCardService.getAll();
      setFlashCards(cards);
      setCurrentIndex(0);
      setError(null);
    } catch (err) {
      setError('Failed to load flash cards');
      console.error('Error loading flash cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    if (flashCards.length > 0) {
      setResetCard(true);
      setCurrentIndex((prev) => (prev + 1) % flashCards.length);
    }
  };

  const goToPrevious = () => {
    if (flashCards.length > 0) {
      setResetCard(true);
      setCurrentIndex((prev) => (prev - 1 + flashCards.length) % flashCards.length);
    }
  };

  const handleResetComplete = () => {
    setResetCard(false);
  };

  if (loading) {
    return (
      <div className="flashcard-page">
        <div className="loading">Loading flash cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flashcard-page">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadFlashCards}>Try Again</button>
        </div>
      </div>
    );
  }

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
        <Link to="/admin" className="admin-link">
          Admin
        </Link>
      </header>

      <div className="flashcard-wrapper">
        <div className="card-counter">
          Card {currentIndex + 1} of {flashCards.length}
        </div>

        <FlashCardComponent 
          flashCard={currentCard} 
          resetCard={resetCard}
          onResetComplete={handleResetComplete}
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
