import React, { useState, useEffect, useRef } from 'react';
import { type FlashCard } from '../services/database';
import './FlashCardComponent.css';

interface FlashCardComponentProps {
  flashCard: FlashCard;
  resetCard?: boolean;
  onResetComplete?: () => void;
}

export const FlashCardComponent: React.FC<FlashCardComponentProps> = ({ 
  flashCard, 
  resetCard = false,
  onResetComplete 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const frontContentRef = useRef<HTMLDivElement>(null);
  const backContentRef = useRef<HTMLDivElement>(null);

  // Reset card when resetCard prop changes
  useEffect(() => {
    if (resetCard) {
      setIsFlipped(false);
      
      // Scroll content to top
      if (frontContentRef.current) {
        frontContentRef.current.scrollTop = 0;
      }
      if (backContentRef.current) {
        backContentRef.current.scrollTop = 0;
      }
      
      // Notify parent that reset is complete
      onResetComplete?.();
    }
  }, [resetCard, onResetComplete]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    
    // Scroll to top when flipping
    setTimeout(() => {
      const currentContent = isFlipped ? frontContentRef.current : backContentRef.current;
      if (currentContent) {
        currentContent.scrollTop = 0;
      }
    }, 50); // Small delay to allow flip animation to start
  };

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="flashcard-content" ref={frontContentRef}>
            {flashCard.front}
          </div>
          <div className="flashcard-hint">Click to flip</div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-content" ref={backContentRef}>
            {flashCard.back}
          </div>
          <div className="flashcard-hint">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};
