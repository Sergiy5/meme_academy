'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGameSocket, useGameStore } from '@/lib/game';

export default function JoinRoomPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [roomCode, setRoomCode] = useState(initialCode);
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const { connect, joinRoom, connectionStatus } = useGameSocket();
  const { isLoading, error, playerId, gameState } = useGameStore();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (playerId && gameState) {
      router.push(`/room/${gameState.roomCode}`);
    }
  }, [playerId, gameState, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && connectionStatus === 'connected') {
      joinRoom(roomCode.trim(), nickname.trim());
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomCode(value);
    }
  };

  const isCodeValid = roomCode.length === 6;
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 20;
  const isValid = isCodeValid && isNicknameValid;
  const canSubmit = isValid && connectionStatus === 'connected' && !isLoading;

  return (
    <div className="screen">
      {/* Header */}
      <div className="screen-header">
        <Link href="/" className="text-game-text-dim hover:text-game-neon transition-colors">
          &larr; Back
        </Link>
      </div>

      {/* Content */}
      <div className="screen-content items-center justify-center gap-8 px-4">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Join Game</h1>
          <p className="text-game-text-dim">Enter the room code to join</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 animate-slide-up">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium mb-2">
              Room Code
            </label>
            <input
              id="roomCode"
              type="text"
              value={roomCode}
              onChange={handleCodeChange}
              placeholder="ABCD12"
              className="game-input game-input-code"
              maxLength={6}
              autoFocus
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium mb-2">
              Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname..."
              className="game-input"
              maxLength={20}
              autoComplete="off"
            />
            <p className="text-xs text-game-text-dim mt-2">
              2-20 characters
            </p>
          </div>

          {error && (
            <div className="text-game-error text-sm text-center">
              {error}
            </div>
          )}

          {connectionStatus !== 'connected' && (
            <div className="text-yellow-400 text-sm text-center flex items-center justify-center gap-2">
              <span className="connection-dot connection-dot-connecting" />
              Connecting to server...
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="game-btn game-btn-primary w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" style={{ width: '1.25rem', height: '1.25rem' }} />
                Joining...
              </span>
            ) : (
              'Join Room'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
