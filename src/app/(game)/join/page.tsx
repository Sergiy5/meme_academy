import { Suspense } from 'react';
import { JoinRoom } from '@/components/game/JoinRoom/JoinRoom';

export default function JoinRoomPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinRoom />;
    </Suspense>
  );
}
