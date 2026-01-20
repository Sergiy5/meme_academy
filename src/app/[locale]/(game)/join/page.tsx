'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { JoinRoom } from '@/components/game/JoinRoom/JoinRoom';

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="screen"><div className="screen-content items-center justify-center">Loading...</div></div>}>
      <JoinRoom />
    </Suspense>
  );
}
