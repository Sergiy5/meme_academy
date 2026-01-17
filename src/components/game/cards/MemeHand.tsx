'use client';

import { MemeCard as MemeCardType } from '@/lib/game/types';
import MemeCard from './MemeCard';

interface MemeHandProps {
  memes: MemeCardType[];
  selectedId: string | null;
  onSelect: (memeId: string) => void;
  disabled?: boolean;
}

export default function MemeHand({ memes, selectedId, onSelect, disabled = false }: MemeHandProps) {
  return (
    <div className="meme-grid">
      {memes.map((meme) => (
        <MemeCard
          key={meme.id}
          meme={meme}
          selected={selectedId === meme.id}
          onClick={() => onSelect(meme.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
