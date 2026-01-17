'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameSocket, useGameStore, selectCurrentPhase } from '@/lib/game';
import LobbyScreen from '@/components/game/screens/LobbyScreen';
import PickingScreen from '@/components/game/screens/PickingScreen';
import JudgingScreen from '@/components/game/screens/JudgingScreen';
import ResultScreen from '@/components/game/screens/ResultScreen';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;

  const { connect, connectionStatus } = useGameSocket();
  const { gameState, playerId, error } = useGameStore();
  const phase = useGameStore(selectCurrentPhase);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    // If no game state and not loading, redirect to join
    if (connectionStatus === 'connected' && !gameState && !playerId) {
      const savedRoomCode = sessionStorage.getItem('roomCode');
      const savedPlayerId = sessionStorage.getItem('playerId');

      if (!savedRoomCode || savedRoomCode !== roomCode.toUpperCase() || !savedPlayerId) {
        router.push(`/join?code=${roomCode}`);
      }
    }
  }, [connectionStatus, gameState, playerId, roomCode, router]);

  // Show loading while connecting
  if (connectionStatus !== 'connected' || !gameState) {
    return (
      <div className="screen">
        <div className="screen-content items-center justify-center">
          <div className="spinner" />
          <p className="text-game-text-dim mt-4">
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Loading game...'}
          </p>
          {error && (
            <p className="text-game-error mt-2">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // Render appropriate screen based on game phase
  switch (phase) {
    case 'lobby':
      return <LobbyScreen />;
    case 'picking':
      return <PickingScreen />;
    case 'judging':
      return <JudgingScreen />;
    case 'result':
      return <ResultScreen />;
    default:
      return <LobbyScreen />;
  }
}
