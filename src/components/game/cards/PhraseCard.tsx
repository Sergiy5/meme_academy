'use client';

import { Phrase } from '@/lib/game/types';

interface PhraseCardProps {
  phrase: Phrase | null;
}

export default function PhraseCard({ phrase }: PhraseCardProps) {
  if (!phrase) return null;

  return (
    <div className="phrase-card animate-scale-in">
      <p className="phrase-text">{phrase.text}</p>
    </div>
  );
}
