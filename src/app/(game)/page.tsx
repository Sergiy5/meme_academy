'use client';

import Link from 'next/link';

export default function GameHomePage() {
  return (
    <div className="screen">
      <div className="screen-content items-center justify-center gap-8 px-4">
        {/* Logo */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold neon-text mb-2">
            MEME
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            PARTY
          </h1>
          <p className="text-game-text-dim text-lg">
            The ultimate meme battle game
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col gap-4 w-full max-w-sm animate-slide-up">
          <Link href="/create" className="game-btn game-btn-primary w-full">
            Create Game
          </Link>
          <Link href="/join" className="game-btn game-btn-secondary w-full">
            Join Game
          </Link>
        </div>

        {/* How to Play */}
        <div className="game-card p-6 w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-4 neon-text-sm">How to Play</h2>
          <ol className="space-y-3 text-sm text-game-text-dim">
            <li className="flex gap-3">
              <span className="neon-text font-bold">1.</span>
              <span>Create a room and share the code</span>
            </li>
            <li className="flex gap-3">
              <span className="neon-text font-bold">2.</span>
              <span>One player becomes the Judge each round</span>
            </li>
            <li className="flex gap-3">
              <span className="neon-text font-bold">3.</span>
              <span>Judge shows a phrase, others pick memes</span>
            </li>
            <li className="flex gap-3">
              <span className="neon-text font-bold">4.</span>
              <span>Judge picks the funniest meme - winner judges next!</span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <p className="text-game-text-dim text-xs">
          3+ players needed
        </p>
      </div>
    </div>
  );
}
