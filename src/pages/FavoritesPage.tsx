import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { FlashCardComponent } from '../components/FlashCardComponent';
import { flashCardService } from '../services/database';
import './FavoritesPage.css';

export const FavoritesPage: React.FC = () => {
  const [resetCard, setResetCard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const favoriteCardsResult = useSuspenseQuery({
    queryKey: ['favorite-cards'],
    queryFn: async () => {
      const favoriteCards = await flashCardService.getFavorites();
      return favoriteCards;
    },
  });

  const favoriteCards = favoriteCardsResult.data;

  const goToNext = () => {
    if (favoriteCards.length > 0) {
      setResetCard(true);
      setCurrentIndex((currentIndex + 1) % favoriteCards.length);
    }
  };

  const goToPrevious = () => {
    if (favoriteCards.length > 0) {
      setResetCard(true);
      setCurrentIndex(
        (currentIndex - 1 + favoriteCards.length) % favoriteCards.length,
      );
    }
  };

  const handleResetComplete = () => {
    setResetCard(false);
  };

  const handleFavoriteChange = async () => {
    // Refresh the favorites list when a card's favorite status changes
    await queryClient.invalidateQueries({ queryKey: ['favorite-cards'] });

    // If we removed the last favorite and are now at an invalid index, reset to 0
    const updatedFavorites = await flashCardService.getFavorites();
    if (updatedFavorites.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= updatedFavorites.length) {
      setCurrentIndex(updatedFavorites.length - 1);
    }
  };

  if (favoriteCards.length === 0) {
    return (
      <div className="favorites-page">
        <header className="favorites-header">
          <h1>Favorite Flash Cards</h1>
          <div className="header-links">
            <Link to="/" className="nav-link">
              All Cards
            </Link>
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          </div>
        </header>
        <div className="empty-state">
          <h2>No Favorite Cards Found</h2>
          <p>Star some cards to add them to your favorites!</p>
          <Link to="/" className="button button-primary">
            View All Flash Cards
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = favoriteCards[currentIndex];

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <h1>Favorite Flash Cards</h1>
        <div className="header-links">
          <Link to="/" className="nav-link">
            All Cards
          </Link>
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        </div>
      </header>

      <div className="favorites-wrapper">
        <div className="card-counter">
          Favorite {currentIndex + 1} of {favoriteCards.length}
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
            disabled={favoriteCards.length <= 1}
            className="button button-secondary"
          >
            Previous
          </button>
          <button
            onClick={goToNext}
            disabled={favoriteCards.length <= 1}
            className="button button-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
