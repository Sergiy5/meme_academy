'use client';

import { useGameSocket, useGameStore, selectIsJudge, selectJudge, selectCurrentRound, selectPlayers } from '@/lib/game';
import { RoomHeader, PlayerAvatar } from '../common';
import { PhraseCard, MemeHand } from '../cards';
import { useTranslations } from 'next-intl';

export default function PickingScreen() {
  const t = useTranslations('picking');
  const { submitMeme } = useGameSocket();
  const { myHand, selectedMemeId, hasSubmitted, playerId } = useGameStore();
  const isJudge = useGameStore(selectIsJudge);
  const judge = useGameStore(selectJudge);
  const round = useGameStore(selectCurrentRound);
  const players = useGameStore(selectPlayers);

  const handleSelectMeme = (memeId: string) => {
    if (!hasSubmitted && !isJudge) {
      useGameStore.getState().selectMeme(selectedMemeId === memeId ? null : memeId);
    }
  };

  const handleSubmit = () => {
    if (selectedMemeId && !hasSubmitted && !isJudge) {
      submitMeme(selectedMemeId);
    }
  };

  if (!round) return null;

  const nonJudgePlayers = players.filter(p => p.id !== round.judgeId);
  const submittedCount = round.submittedPlayerIds.length;
  const totalNeeded = nonJudgePlayers.length;

  return (
    <div className="screen">
      <RoomHeader compact />

      <div className="screen-content gap-4 px-4">
        {/* Round Info */}
        <div className="text-center">
          <span className="text-game-text-dim text-sm">{t('round', { number: round.roundNumber })}</span>
        </div>

        {/* Phrase Card */}
        <PhraseCard phrase={round.phrase} />

        {/* Judge indicator */}
        <div className="flex items-center justify-center gap-2">
          {judge && (
            <>
              <PlayerAvatar player={judge} size="sm" />
              <span className="text-game-text-dim">
                {isJudge ? t('youAreJudge') : t('judging', { nickname: judge.nickname })}
              </span>
            </>
          )}
        </div>

        {/* Submission Progress */}
        <div className="text-center">
          <span className="neon-text font-semibold">{submittedCount}</span>
          <span className="text-game-text-dim">/{totalNeeded} {t('submitted', { count: submittedCount, total: totalNeeded }).split('/')[1]}</span>
        </div>

        {/* Content based on role */}
        {isJudge ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="game-card p-8 text-center">
              <div className="spinner mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('waitingForPlayers')}</h2>
              <p className="text-game-text-dim">
                {t('playersPickingMemes')}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {nonJudgePlayers.map((player) => {
                  const playerHasSubmitted = round.submittedPlayerIds.includes(player.id);
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        playerHasSubmitted ? 'bg-game-neon/20 text-game-neon' : 'bg-game-bg-secondary text-game-text-dim'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: playerHasSubmitted ? 'var(--game-neon)' : 'var(--game-border)' }}
                      />
                      {player.nickname}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            {hasSubmitted ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="game-card p-8 text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h2 className="text-xl font-semibold neon-text mb-2">{t('memeSubmitted')}</h2>
                  <p className="text-game-text-dim">
                    {t('waitingForOthers')}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-center text-sm text-game-text-dim">
                  {t('pickMemeHint')}
                </h3>
                <MemeHand
                  memes={myHand}
                  selectedId={selectedMemeId}
                  onSelect={handleSelectMeme}
                  disabled={hasSubmitted}
                />
              </>
            )}
          </>
        )}
      </div>

      {!isJudge && !hasSubmitted && (
        <div className="screen-footer">
          <button
            onClick={handleSubmit}
            disabled={!selectedMemeId}
            className="game-btn game-btn-primary w-full"
          >
            {selectedMemeId ? t('submitMeme') : t('selectMeme')}
          </button>
        </div>
      )}
    </div>
  );
}
