"use client";

import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  id: string;
  type: string; // "PHOTO" | "VIDEO" | "story" | "audio" (we preview PHOTO and VIDEO)
  title: string;
  fileUrl?: string | null;
  content?: string | null;
}

interface MediaLightboxProps {
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function MediaLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: MediaLightboxProps) {
  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex, onClose, handlePrev, handleNext]);

  const activeItem = items[currentIndex];
  if (!activeItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-55"
        aria-label="Cerrar visor"
      >
        <X size={20} />
      </button>

      {/* Navigation Left */}
      {items.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-6 p-3 rounded-full bg-white/5 text-white hover:bg-white/15 transition-all z-55 hover:scale-105"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Media Content Area */}
      <div className="max-w-5xl max-h-[80vh] flex flex-col items-center justify-center space-y-4">
        {activeItem.type === "PHOTO" && activeItem.fileUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeItem.fileUrl}
            alt={activeItem.title}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl transition-transform"
          />
        ) : activeItem.type === "VIDEO" && activeItem.fileUrl ? (
          <video
            src={activeItem.fileUrl}
            controls
            autoPlay
            className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
          />
        ) : (
          <div className="p-8 bg-neutral-900 rounded-lg text-neutral-400">
            No se puede previsualizar este archivo.
          </div>
        )}

        <div className="text-center text-white/90 px-4 max-w-xl">
          <h4 className="font-serif text-sm font-semibold">{activeItem.title}</h4>
          {activeItem.content && (
            <p className="text-[10px] text-white/60 font-light mt-1.5 leading-normal">
              {activeItem.content}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Right */}
      {items.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-6 p-3 rounded-full bg-white/5 text-white hover:bg-white/15 transition-all z-55 hover:scale-105"
          aria-label="Siguiente"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Count Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/40 font-mono">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}
