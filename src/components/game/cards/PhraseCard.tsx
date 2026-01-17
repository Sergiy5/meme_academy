'use client';

import { Phrase } from '@/lib/game/types';

interface PhraseCardProps {
  phrase: Phrase;
}

export default function PhraseCard({ phrase }: PhraseCardProps) {
  return (
    <div className="phrase-card animate-scale-in">
      <p className="phrase-text">{phrase.text}</p>
    </div>
  );
}
