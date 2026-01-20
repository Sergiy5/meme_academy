'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useGameSocket, useGameStore } from '@/lib/game';
import { useTranslations } from 'next-intl';

export default function CreateRoomPage() {
  const t = useTranslations('create');
  const tCommon = useTranslations('common');
  const [nickname, setNickname] = useState('');
  const router = useRouter();
  const { connect, createRoom, connectionStatus } = useGameSocket();
  const { isLoading, error, roomCode } = useGameStore();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (roomCode) {
      router.push(`/room/${roomCode}`);
    }
  }, [roomCode, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim().length >= 2 && connectionStatus === 'connected') {
      createRoom(nickname.trim());
    }
  };

  const isValid = nickname.trim().length >= 2 && nickname.trim().length <= 20;
  const canSubmit = isValid && connectionStatus === 'connected' && !isLoading;

  return (
    <div className="screen">
      {/* Header */}
      <div className="screen-header">
        <Link href="/" className="text-game-text-dim hover:text-game-neon transition-colors">
          &larr; {tCommon('back')}
        </Link>
      </div>

      {/* Content */}
      <div className="screen-content items-center justify-center gap-8 px-4">
        <div className="animate-fade-in text-center">
          <h1 className="mb-2 text-3xl font-bold">{t('title')}</h1>
          <p className="text-game-text-dim">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="animate-slide-up w-full max-w-sm space-y-6">
          <div>
            <label htmlFor="nickname" className="mb-2 block text-sm font-medium">
              {t('nicknameLabel')}
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('nicknamePlaceholder')}
              className="game-input"
              maxLength={20}
              autoFocus
              autoComplete="off"
            />
            <p className="text-game-text-dim mt-2 text-xs">{t('nicknameHint')}</p>
          </div>

          {error && <div className="text-game-error text-center text-sm">{error}</div>}

          {connectionStatus !== 'connected' && (
            <div className="flex items-center justify-center gap-2 text-center text-sm text-yellow-400">
              <span className="connection-dot connection-dot-connecting" />
              {tCommon('connecting')}
            </div>
          )}

          <button type="submit" disabled={!canSubmit} className="game-btn game-btn-primary w-full">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" style={{ width: '1.25rem', height: '1.25rem' }} />
                {t('creating')}
              </span>
            ) : (
              t('createRoom')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
