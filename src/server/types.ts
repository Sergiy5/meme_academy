import { MemeCard, Phrase, Player, PlayerId, RoomCode, GamePhase, Submission } from '../lib/game/types';

export interface ServerPlayer extends Player {
  socketId: string;
  hand: MemeCard[];
}

export interface ServerRoundState {
  roundNumber: number;
  judgeId: PlayerId;
  phraseOptions: Phrase[];
  phrase: Phrase | null;
  submissions: Map<PlayerId, { memeId: string; meme: MemeCard }>;
  winnerId: PlayerId | null;
  winningMemeId: string | null;
}

export interface ServerRoom {
  code: RoomCode;
  phase: GamePhase;
  players: Map<PlayerId, ServerPlayer>;
  hostId: PlayerId;
  currentRound: ServerRoundState | null;
  usedPhraseIds: string[];
  usedMemeIds: string[];
  createdAt: number;
}

export interface RoomPublicState {
  roomCode: RoomCode;
  phase: GamePhase;
  players: Player[];
  hostId: PlayerId;
  currentRound: {
    roundNumber: number;
    judgeId: PlayerId;
    phraseOptions: Phrase[];
    phrase: Phrase | null;
    submittedPlayerIds: PlayerId[];
    revealedSubmissions: Submission[];
    winnerId: PlayerId | null;
    winningMemeId: string | null;
  } | null;
}

export function toPublicState(room: ServerRoom): RoomPublicState {
  const players: Player[] = Array.from(room.players.values()).map(p => ({
    id: p.id,
    nickname: p.nickname,
    avatarColor: p.avatarColor,
    score: p.score,
    isConnected: p.isConnected,
    isHost: p.isHost,
  }));

  let currentRound = null;
  if (room.currentRound) {
    const submittedPlayerIds = Array.from(room.currentRound.submissions.keys());

    // Only reveal submissions during judging or result phase
    let revealedSubmissions: Submission[] = [];
    if (room.phase === 'judging' || room.phase === 'result') {
      const shuffled = Array.from(room.currentRound.submissions.entries())
        .sort(() => Math.random() - 0.5);

      revealedSubmissions = shuffled.map(([playerId, sub], index) => ({
        oderId: `order-${index}`,
        memeId: sub.memeId,
        meme: sub.meme,
      }));
    }

    currentRound = {
      roundNumber: room.currentRound.roundNumber,
      judgeId: room.currentRound.judgeId,
      phraseOptions: room.currentRound.phraseOptions,
      phrase: room.currentRound.phrase,
      submittedPlayerIds,
      revealedSubmissions,
      winnerId: room.currentRound.winnerId,
      winningMemeId: room.currentRound.winningMemeId,
    };
  }

  return {
    roomCode: room.code,
    phase: room.phase,
    players,
    hostId: room.hostId,
    currentRound,
  };
}
