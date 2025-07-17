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
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

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

  /**
   * This is a kludge to fix an issue in iOS where inner scrolling won't work
   * if both front and backside are rendered at the same time.
   */
  useEffect(() => {
      setTimeout(() => {      
      if (backRef.current && frontRef.current) {
        if (isFlipped) {
          frontRef.current.style.display = "none"
          backRef.current.style.display = "grid"
        } else  {
          frontRef.current.style.display = "grid"
          backRef.current.style.display = "none"          
        }
      }
    }, 400); // Small delay to allow flip animation to start
  }, [isFlipped]);

  const handleFlip = () => {

    
    // before performing the flip, show both sides
    if (frontRef.current && backRef.current) {
      frontRef.current.style.display = "grid";
      backRef.current.style.display = "grid";
    }

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
        <div className="flashcard-front" ref={frontRef}>
          <div className="flashcard-content" ref={frontContentRef}>
            {flashCard.front}
          </div>
          <div className="flashcard-hint">Click to flip</div>
        </div>        
        <div className="flashcard-back" ref={backRef}>
          <div className="flashcard-content" ref={backContentRef}>
            {flashCard.back}
          </div>
          <div className="flashcard-hint">Click to flip back</div>
        </div>
      </div>
    </div>
  );
};
