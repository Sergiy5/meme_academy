'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { useGameSocket, useGameStore, selectIsJudge, selectJudge, selectCurrentRound, selectPhraseOptions } from '@/lib/game';
import { RoomHeader, PlayerAvatar } from '../common';

export default function PhraseSelectionScreen() {
  const { selectPhrase } = useGameSocket();
  const isJudge = useGameStore(selectIsJudge);
  const judge = useGameStore(selectJudge);
  const round = useGameStore(selectCurrentRound);
  const phraseOptions = useGameStore(selectPhraseOptions);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  if (!round) return null;

  const handleSelectPhrase = (phraseId: string) => {
    if (isJudge) {
      setSelectedPhraseId(selectedPhraseId === phraseId ? null : phraseId);
    }
  };

  const handleConfirmPhrase = () => {
    if (isJudge && selectedPhraseId) {
      selectPhrase(selectedPhraseId);
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.realIndex % phraseOptions.length;
    // Only clear selection if we actually moved to a different slide
    if (newIndex !== activeIndex) {
      setSelectedPhraseId(null);
    }
    setActiveIndex(newIndex);
  };

  const handleIndicatorClick = (index: number) => {
    swiperInstance?.slideToLoop(index);
  };

  // Duplicate slides to enable proper loop in both directions
  // Swiper needs at least slidesPerView * 2 slides for loop to work
  const duplicatedPhrases = [...phraseOptions, ...phraseOptions];

  return (
    <div className="screen">
      <RoomHeader compact />

      <div className="screen-content gap-6 px-4">
        {/* Round Info */}
        <div className="text-center">
          <span className="text-game-text-dim text-sm">Round {round.roundNumber}</span>
        </div>

        {/* Judge indicator */}
        <div className="flex items-center justify-center gap-2">
          {judge && (
            <>
              <PlayerAvatar player={judge} size="sm" />
              <span className="text-game-text-dim">
                {isJudge
                  ? 'Choose a phrase for this round!'
                  : `${judge.nickname} is choosing a phrase...`}
              </span>
            </>
          )}
        </div>

        {isJudge ? (
          // Judge View - Swiper Carousel
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <h3 className="text-game-text-dim text-center text-sm">
              Swipe or tap to browse phrases
            </h3>

            {/* Swiper Carousel */}
            <div className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-game-border bg-game-card/30 py-8 px-4">
              <Swiper
                modules={[EffectCoverflow]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView={1.2}
                spaceBetween={-15}
                loop
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 0,
                  modifier: 1,
                  scale: 0.85,
                  slideShadows: false,
                }}
                onSwiper={setSwiperInstance}
                onSlideChange={handleSlideChange}
                className="py-6"
                style={{ overflow: 'visible' }}
              >
                {duplicatedPhrases.map((phrase, index) => {
                  const isSelected = selectedPhraseId === phrase.id;
                  return (
                    <SwiperSlide key={`${phrase.id}-${index}`}>
                      <div
                        onClick={() => handleSelectPhrase(phrase.id)}
                        className={`game-card flex min-h-[100px] cursor-pointer flex-col items-center justify-center p-5 text-center transition-all ${
                          isSelected
                            ? 'border-game-neon neon-glow border-2'
                            : 'hover:border-game-neon/50 border-2 border-transparent'
                        }`}
                      >
                        <p className="text-base leading-relaxed font-semibold text-white">
                          {phrase.text}
                        </p>
                        {/* {isSelected && (
                          <div className="text-game-neon mt-2 flex items-center justify-center gap-2 text-sm">
                            <span>Selected</span>
                            <span className="text-lg">✓</span>
                          </div>
                        )} */}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Custom Indicators */}
              <div className="mt-4 flex justify-center gap-2">
                {phraseOptions.map((phrase, index) => (
                  <button
                    key={phrase.id}
                    onClick={() => handleIndicatorClick(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-game-neon scale-125'
                        : selectedPhraseId === phrase.id
                          ? 'bg-game-neon/50'
                          : 'bg-game-border'
                    }`}
                    aria-label={`Go to phrase ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Non-judge View - Waiting
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="game-card p-8 text-center">
              <div className="spinner mx-auto mb-4" />
              <h2 className="mb-2 text-xl font-semibold">Waiting for phrase...</h2>
              <p className="text-game-text-dim">
                {judge?.nickname} is choosing a phrase for this round
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Confirm Button (only for judge) */}
      {isJudge && (
        <div className="screen-footer">
          <button
            onClick={handleConfirmPhrase}
            disabled={!selectedPhraseId}
            className="game-btn game-btn-primary w-full"
          >
            {selectedPhraseId ? 'Use This Phrase' : 'Select a phrase'}
          </button>
        </div>
      )}
    </div>
  );
}
