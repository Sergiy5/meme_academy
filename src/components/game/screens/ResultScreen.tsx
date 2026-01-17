'use client';

import { useGameSocket, useGameStore, selectCurrentRound, selectPlayers, selectIsJudge } from '@/lib/game';
import { RoomHeader, PlayerAvatar } from '../common';
import { PhraseCard } from '../cards';

export default function ResultScreen() {
  const { nextRound } = useGameSocket();
  const { playerId } = useGameStore();
  const round = useGameStore(selectCurrentRound);
  const players = useGameStore(selectPlayers);
  const isJudge = useGameStore(selectIsJudge);

  if (!round) return null;

  const winner = players.find(p => p.id === round.winnerId);
  const winningSubmission = round.revealedSubmissions.find(
    s => s.memeId === round.winningMemeId
  );

  // Sort players by score for leaderboard
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const isWinner = playerId === round.winnerId;

  return (
    <div className="screen">
      <RoomHeader compact />

      <div className="screen-content gap-4 px-4 overflow-y-auto">
        {/* Winner Announcement */}
        <div className="text-center animate-scale-in pt-2">
          {isWinner ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold neon-text mb-2">You Won!</h1>
              <p className="text-game-text-dim text-sm">You'll be the Judge next round</p>
            </>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                <span className="neon-text">{winner?.nickname}</span>
                <span className="text-white"> wins!</span>
              </h1>
              <p className="text-game-text-dim text-sm">They'll be the Judge next round</p>
            </>
          )}
        </div>

        {/* Phrase */}
        <PhraseCard phrase={round.phrase} />

        {/* Winning Meme */}
        {winningSubmission && (
          <div className="game-card p-3 sm:p-4 animate-slide-up">
            <p className="text-xs text-game-text-dim mb-2 text-center">Winning Meme</p>
            <div className="aspect-square max-w-[200px] sm:max-w-xs mx-auto rounded-lg overflow-hidden neon-border">
              <img
                src={winningSubmission.meme.imageUrl}
                alt="Winning meme"
                className="w-full h-full object-cover"
              />
            </div>
            {winner && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <PlayerAvatar player={winner} size="sm" />
                <span className="font-medium text-sm">{winner.nickname}</span>
              </div>
            )}
          </div>
        )}

        {/* Scoreboard */}
        <div className="game-card p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-semibold text-game-text-dim mb-3">Scoreboard</h2>
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  player.id === round.winnerId
                    ? 'bg-game-neon/10 border border-game-neon/30'
                    : 'bg-game-bg-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' : 'bg-game-border text-game-text-dim'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <PlayerAvatar player={player} size="sm" />
                  <span className={player.id === playerId ? 'font-medium' : ''}>
                    {player.nickname}
                    {player.id === playerId && (
                      <span className="text-game-text-dim text-xs ml-1">(You)</span>
                    )}
                  </span>
                </div>
                <span className={`font-bold ${player.id === round.winnerId ? 'neon-text' : ''}`}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Next Round Button (only for judge) */}
      {isJudge && (
        <div className="screen-footer">
          <button
            onClick={nextRound}
            className="game-btn game-btn-primary w-full"
          >
            Next Round
          </button>
        </div>
      )}
    </div>
  );
}
