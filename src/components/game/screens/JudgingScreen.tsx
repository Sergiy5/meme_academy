'use client';

import { useEffect, useState } from 'react';
import { useGameSocket, useGameStore, selectIsJudge, selectJudge, selectCurrentRound } from '@/lib/game';
import { RoomHeader, PlayerAvatar } from '../common';
import { PhraseCard, MemeCard } from '../cards';

export default function JudgingScreen() {
  const { selectWinner } = useGameSocket();
  const isJudge = useGameStore(selectIsJudge);
  const judge = useGameStore(selectJudge);
  const round = useGameStore(selectCurrentRound);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleSelectSubmission = (oderId: string) => {
    if (isJudge) {
      setSelectedOrderId(selectedOrderId === oderId ? null : oderId);
    }
  };

  const handlePickWinner = () => {
    if (isJudge && selectedOrderId) {
      selectWinner(selectedOrderId);
    }
  };

  if (!round) return null;

  const submissions = round.revealedSubmissions;


  return (
    <div className="screen">
      <RoomHeader compact />

      <div className="screen-content gap-4 px-4">
        {/* Round Info */}
        <div className="text-center">
          <span className="text-game-text-dim text-sm">Round {round.roundNumber}</span>
        </div>

        {/* Phrase Card */}
        <PhraseCard phrase={round.phrase} />

        {/* Judge indicator */}
        <div className="flex items-center justify-center gap-2">
          {judge && (
            <>
              <PlayerAvatar player={judge} size="sm" />
              <span className="text-game-text-dim">
                {isJudge ? 'Pick the winning meme!' : `${judge.nickname} is picking...`}
              </span>
            </>
          )}
        </div>

        {/* Submissions Grid */}
        <div className="flex-1">
          {isJudge ? (
            <>
              <h3 className="text-center text-sm text-game-text-dim mb-4">
                Tap on the meme that best matches the phrase
              </h3>
              <div className="meme-grid">
                {submissions.map((submission) => (
                  <MemeCard
                    key={submission.oderId}
                    meme={submission.meme}
                    selected={selectedOrderId === submission.oderId}
                    onClick={() => handleSelectSubmission(submission.oderId)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="game-card p-8 text-center">
                <div className="spinner mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Judge is deciding...</h2>
                <p className="text-game-text-dim mb-4">
                  {judge?.nickname} is picking the winner
                </p>

                {/* Show all submissions (read-only) */}
                <p className="text-xs text-game-text-dim mb-4">Submissions:</p>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {submissions.map((submission) => (
                    <div key={submission.oderId} className="aspect-square rounded overflow-hidden">
                      <img
                        src={submission.meme.imageUrl}
                        alt="Submitted meme"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Pick Winner Button (only for judge) */}
      {isJudge && (
        <div className="screen-footer">
          <button
            onClick={handlePickWinner}
            disabled={!selectedOrderId}
            className="game-btn game-btn-primary w-full animate-glow"
          >
            {selectedOrderId ? 'Pick This Winner!' : 'Select a meme'}
          </button>
        </div>
      )}
    </div>
  );
}
