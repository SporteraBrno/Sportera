import React from 'react';
import './styles/SignUpPopup.css';

interface SignUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpPopup: React.FC<SignUpPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="close-signup" onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        {/* Add your sign-up form or content here */}
        <p>Sign-up form goes here...</p>
      </div>
    </div>
  );
};

export default SignUpPopup;