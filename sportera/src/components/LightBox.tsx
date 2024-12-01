import React, { useCallback, useRef, TouchEvent, useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import './styles/Lightbox.css';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [dragDistance, setDragDistance] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, string>>({});  // Changed to object
  const loadingRef = useRef<Set<string>>(new Set());  // Track which images are being loaded

  useEffect(() => {
    const loadImage = async (index: number) => {
      if (index >= 0 && index < images.length) {
        const path = images[index];
        
        // Skip if already loaded or currently loading
        if (loadedImages[path] || loadingRef.current.has(path)) return;
        
        // Mark as loading
        loadingRef.current.add(path);

        try {
          const imageRef = ref(storage, path);
          const url = await getDownloadURL(imageRef);
          setLoadedImages(prev => ({
            ...prev,
            [path]: url
          }));
        } catch (error) {
          console.error('Error loading image:', error);
        } finally {
          loadingRef.current.delete(path);
        }
      }
    };

    // Load current image and neighbors
    loadImage(currentIndex);
    loadImage(currentIndex + 1);
    loadImage(currentIndex - 1);
  }, [currentIndex, images]); 

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = touchStartY.current - currentY;
    setDragDistance({ x: diffX, y: diffY });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffY) > 100 && Math.abs(diffY) > Math.abs(diffX)) {
      onClose();
    } else if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setDragDistance({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const goToNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goToPrevious = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [goToNext, goToPrevious, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const imageStyle = {
    transform: `translateX(${-dragDistance.x}px) translateY(${-dragDistance.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
  };

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-image-container">
        {loadedImages[images[currentIndex]] ? (
          <img 
            src={loadedImages[images[currentIndex]]}
            alt={`Image ${currentIndex + 1}`} 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={imageStyle}
          />
        ) : (
          <div className="loading-placeholder">Načítáme...</div>
        )}
      </div>
      {images.length > 1 && (
        <>
          <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); goToPrevious(); }} />
          <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); goToNext(); }} />
        </>
      )}
      <button className="lightbox-exit" onClick={(e) => { e.stopPropagation(); onClose(); }} />
    </div>
  );
};

export default Lightbox;