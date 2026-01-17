'use client';

import { useState, useEffect } from 'react';
import { MemeCard as MemeCardType } from '@/lib/game/types';

// Fallback placeholder images (picsum photos that are reliable)
const FALLBACK_IMAGES = [
  'https://picsum.photos/seed/meme1/400/400',
  'https://picsum.photos/seed/meme2/400/400',
  'https://picsum.photos/seed/meme3/400/400',
  'https://picsum.photos/seed/meme4/400/400',
  'https://picsum.photos/seed/meme5/400/400',
];

function getFallbackImage(id: string): string {
  // Use meme ID to get consistent fallback
  const index = id.charCodeAt(id.length - 1) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

interface MemeCardProps {
  meme: MemeCardType;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MemeCard({ meme, selected = false, onClick, disabled = false }: MemeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(meme.imageUrl);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state when meme changes
    setImageLoaded(false);
    setImageError(false);
    setCurrentSrc(meme.imageUrl);
    setRetryCount(0);
  }, [meme.imageUrl]);

  const handleError = () => {
    if (retryCount < 1) {
      // Try fallback image
      setRetryCount(prev => prev + 1);
      setCurrentSrc(getFallbackImage(meme.id));
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };

  return (
    <div
      className={`meme-card ${selected ? 'meme-card-selected' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          onClick?.();
        }
      }}
    >
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-game-card">
          <div className="spinner" style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
      )}

      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-game-card text-game-text-dim">
          <span className="text-2xl mb-1">🖼️</span>
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt="Meme"
          className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
}
