import { create } from 'zustand';
import { ClientState, GameState, MemeCard, PlayerId } from './types';

interface GameStore extends ClientState {
  // Connection actions
  setConnectionStatus: (status: ClientState['connectionStatus']) => void;
  setPlayerId: (id: PlayerId) => void;
  setRoomCode: (code: string) => void;

  // Game state sync
  syncGameState: (state: GameState) => void;

  // Hand management
  setHand: (hand: MemeCard[]) => void;
  selectMeme: (memeId: string | null) => void;
  setSubmitted: (submitted: boolean) => void;

  // UI
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState: ClientState = {
  playerId: null,
  roomCode: null,
  connectionStatus: 'disconnected',
  gameState: null,
  myHand: [],
  selectedMemeId: null,
  hasSubmitted: false,
  error: null,
  isLoading: false,
};

export const useGameStore = create<GameStore>()((set) => ({
  ...initialState,

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setPlayerId: (playerId) => set({ playerId }),
  setRoomCode: (roomCode) => set({ roomCode }),

  syncGameState: (gameState) => set({ gameState }),

  setHand: (myHand) => set({ myHand }),
  selectMeme: (selectedMemeId) => set({ selectedMemeId }),
  setSubmitted: (hasSubmitted) => set({ hasSubmitted }),

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set(initialState),
}));

// Selectors
export const selectIsHost = (state: GameStore): boolean => {
  if (!state.playerId || !state.gameState) return false;
  return state.gameState.hostId === state.playerId;
};

export const selectIsJudge = (state: GameStore): boolean => {
  if (!state.playerId || !state.gameState?.currentRound) return false;
  return state.gameState.currentRound.judgeId === state.playerId;
};

export const selectCurrentPhase = (state: GameStore) => {
  return state.gameState?.phase ?? 'lobby';
};

export const selectPlayers = (state: GameStore) => {
  return state.gameState?.players ?? [];
};

export const selectCurrentRound = (state: GameStore) => {
  return state.gameState?.currentRound ?? null;
};

export const selectMyPlayer = (state: GameStore) => {
  if (!state.playerId || !state.gameState) return null;
  return state.gameState.players.find(p => p.id === state.playerId) ?? null;
};

export const selectJudge = (state: GameStore) => {
  if (!state.gameState?.currentRound) return null;
  return state.gameState.players.find(p => p.id === state.gameState?.currentRound?.judgeId) ?? null;
};

export const selectCanStartGame = (state: GameStore): boolean => {
  if (!state.gameState) return false;
  return (
    selectIsHost(state) &&
    state.gameState.phase === 'lobby' &&
    state.gameState.players.length >= 3
  );
};
