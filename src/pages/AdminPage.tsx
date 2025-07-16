import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
import { flashCardService, type FlashCard } from '../services/database';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  const [csvContent, setCsvContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    loadCardCount();
  }, []);

  const loadCardCount = async () => {
    try {
      const count = await flashCardService.count();
      setCardCount(count);
    } catch (error) {
      console.error('Error loading card count:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvContent.trim()) {
      setMessage({ type: 'error', text: 'Please enter CSV content' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Parse CSV content
      const results = Papa.parse(csvContent.trim(), {
        header: false,
        skipEmptyLines: true,
      });

      if (results.errors.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `CSV parsing error: ${results.errors[0].message}` 
        });
        return;
      }

      // Convert parsed data to flash cards
      const flashCards: Omit<FlashCard, 'id'>[] = results.data
        .filter((row: unknown): row is string[] => Array.isArray(row) && row.length >= 2)
        .map((row: string[]) => ({
          front: String(row[0]).trim(),
          back: String(row[1]).trim(),
        }))
        .filter(card => card.front && card.back);

      if (flashCards.length === 0) {
        setMessage({ 
          type: 'error', 
          text: 'No valid flash cards found. Make sure your CSV has at least 2 columns (front, back)' 
        });
        return;
      }

      // Add flash cards to database
      await flashCardService.addMany(flashCards);
      
      setMessage({ 
        type: 'success', 
        text: `Successfully imported ${flashCards.length} flash cards!` 
      });
      
      setCsvContent('');
      await loadCardCount();

    } catch (error) {
      console.error('Error importing flash cards:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to import flash cards. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all flash cards? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await flashCardService.clear();
      setMessage({ 
        type: 'success', 
        text: 'All flash cards have been deleted.' 
      });
      await loadCardCount();
    } catch (error) {
      console.error('Error clearing flash cards:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to clear flash cards. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Flash Cards Admin</h1>
        <Link to="/" className="back-link">
          Back to Cards
        </Link>
      </header>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Cards</h3>
            <div className="stat-number">{cardCount}</div>
          </div>
        </div>

        <div className="import-section">
          <h2>Import Flash Cards</h2>
          <p className="import-instructions">
            Paste your CSV content below. Each row should have two columns: 
            <strong>front</strong> and <strong>back</strong> of the flash card.
          </p>
          
          <div className="csv-example">
            <h4>Example CSV format:</h4>
            <pre>{`What is the capital of France?,Paris
What is 2 + 2?,4
How do you say "hello" in Spanish?,Hola`}</pre>
          </div>

          <form onSubmit={handleSubmit} className="import-form">
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Paste your CSV content here..."
              className="csv-textarea"
              rows={10}
              disabled={isLoading}
            />
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="button button-primary"
                disabled={isLoading || !csvContent.trim()}
              >
                {isLoading ? 'Importing...' : 'Import Flash Cards'}
              </button>
              
              {cardCount > 0 && (
                <button 
                  type="button" 
                  onClick={handleClearAll}
                  className="button button-danger"
                  disabled={isLoading}
                >
                  Clear All Cards
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
