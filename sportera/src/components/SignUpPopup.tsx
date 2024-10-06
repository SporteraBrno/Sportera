import React, { useState } from 'react';
import './styles/SignUpPopup.css';

interface SignUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpPopup: React.FC<SignUpPopupProps> = ({ isOpen, onClose }) => {
  const [clickCount, setClickCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);

  if (!isOpen) return null;

  const handleButtonClick = () => {
    setClickCount(prevCount => prevCount + 1);
    if (!showCounter) setShowCounter(true); // Reveal counter after first click
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close the popup if the user clicks outside of the popup (in the overlay)
    if ((e.target as HTMLElement).classList.contains('signup-overlay')) {
      onClose();
    }
  };

  return (
    <div className="signup-overlay" onClick={handleOverlayClick}>
      <div className="signup-popup">
        <button className="close-signup" onClick={onClose}>&times;</button>
        <h2>Děkujeme že sportujete</h2>
        <p>Uživatelské účty budou k dispozici od Listopadu</p>
        <div className="profile-button-container">
          <img
            src="/images/ProfileButton.png"
            alt="Profile Button"
            className="profile-button"
            onClick={handleButtonClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {showCounter && <p className="click-counter">{clickCount}</p>}
      </div>
    </div>
  );
};

export default SignUpPopup;