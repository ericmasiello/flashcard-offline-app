import React, { useState } from 'react';
import { type FlashCard } from '../services/database';
import './FlashCardComponent.css';

interface FlashCardComponentProps {
  flashCard: FlashCard;
}

export const FlashCardComponent: React.FC<FlashCardComponentProps> = ({ flashCard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="flashcard-content">
            {flashCard.front}
          </div>
          <div className="flashcard-hint">Click to flip</div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-content">
            {flashCard.back}
          </div>
          <div className="flashcard-hint">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};
