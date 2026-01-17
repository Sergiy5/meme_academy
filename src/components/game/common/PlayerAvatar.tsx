'use client';

import { Player } from '@/lib/game/types';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export default function PlayerAvatar({ player, size = 'md', showName = false }: PlayerAvatarProps) {
  const sizeClasses = {
    sm: 'player-avatar player-avatar-sm',
    md: 'player-avatar',
    lg: 'player-avatar player-avatar-lg',
  };

  const initial = player.nickname.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${!player.isConnected ? 'opacity-50' : ''}`}
        style={{ backgroundColor: player.avatarColor }}
      >
        {initial}
      </div>
      {showName && (
        <span className={`font-medium ${!player.isConnected ? 'opacity-50' : ''}`}>
          {player.nickname}
        </span>
      )}
    </div>
  );
}
