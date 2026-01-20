'use client';

import { useState } from 'react';
import { useGameSocket, useGameStore, selectIsHost, selectPlayers, selectCanStartGame } from '@/lib/game';
import { RoomHeader, PlayerAvatar } from '../common';
import { useTranslations } from 'next-intl';

export default function LobbyScreen() {
  const t = useTranslations('lobby');
  const tCommon = useTranslations('common');
  const { startGame } = useGameSocket();
  const { gameState, playerId, error } = useGameStore();
  const isHost = useGameStore(selectIsHost);
  const players = useGameStore(selectPlayers);
  const canStart = useGameStore(selectCanStartGame);
  const [copied, setCopied] = useState(false);

  if (!gameState) return null;

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/join?code=${gameState.roomCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/join?code=${gameState.roomCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle'),
          text: t('shareText', { roomCode: gameState.roomCode }),
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleStartGame = () => {
    if (canStart) {
      startGame();
    }
  };

  return (
    <div className="screen">
      <RoomHeader />

      <div className="screen-content gap-6 px-4">
        {/* Room Code Section */}
        <div className="game-card p-6 text-center animate-fade-in">
          <p className="text-sm text-game-text-dim mb-2">{t('shareCode')}</p>
          <p className="room-code text-3xl mb-4">{gameState.roomCode}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleCopyLink} className="game-btn game-btn-secondary text-sm py-2 px-4">
              {copied ? tCommon('copied') : tCommon('copyLink')}
            </button>
            {'share' in navigator && (
              <button onClick={handleShare} className="game-btn game-btn-primary text-sm py-2 px-4">
                {tCommon('share')}
              </button>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="game-card p-4 animate-slide-up">
          <h2 className="text-sm font-semibold text-game-text-dim mb-4">
            {t('playersCount', { count: players.length })}
          </h2>
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.id === playerId ? 'bg-game-neon/10 border border-game-neon/30' : 'bg-game-bg-secondary'
                }`}
              >
                <PlayerAvatar player={player} showName />
                <div className="flex items-center gap-2">
                  {player.isHost && <span className="badge badge-host">{tCommon('host')}</span>}
                  {player.id === playerId && (
                    <span className="text-xs text-game-text-dim">({tCommon('you')})</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {players.length < 3 && (
            <p className="text-center text-game-text-dim text-sm mt-4">
              {t('needMorePlayers', { count: 3 - players.length })}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-game-error text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Footer with Start Button */}
      <div className="screen-footer">
        {isHost ? (
          <button
            onClick={handleStartGame}
            disabled={!canStart}
            className="game-btn game-btn-primary w-full"
          >
            {players.length < 3 ? t('waitingForPlayers', { count: players.length }) : t('startGame')}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-game-text-dim">{t('waitingForHost')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
