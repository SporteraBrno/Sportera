import React, { useCallback, useRef, TouchEvent, useState } from 'react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  const touchStartX = useRef<number | null>(null);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    setDragDistance(diff);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 100) { // Increased threshold for actual swipe
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
    setDragDistance(0);
    setIsDragging(false);
  };

  const goToNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goToPrevious = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const imageStyle = {
    transform: `translateX(${-dragDistance}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
  };

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-image-container">
        <img 
          src={images[currentIndex]} 
          alt={`Image ${currentIndex + 1}`} 
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={imageStyle}
        />
      </div>
      {images.length > 1 && (
        <>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
            &lt;
          </button>
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default Lightbox;