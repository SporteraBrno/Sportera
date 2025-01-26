import React from 'react';
import { useAuth } from '../context/AuthProvider';
import './styles/SignUpPopup.css';

interface SignUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpPopup: React.FC<SignUpPopupProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Přihlašování selhalo:', error);
    }
  };

  return (
    <div className="signup-overlay" onClick={(e) => {
      if ((e.target as HTMLElement).classList.contains('signup-overlay')) {
        onClose();
      }
    }}>
      <div className="signup-popup">
        <button className="close-signup" onClick={onClose}>&times;</button>
        <h2>Přihlášení do Sportery</h2>
        <button className="login-button" onClick={handleLogin}>
          <img src="/images/google-logo.png" alt="Google" />
          <span>Přihlásit se přes Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignUpPopup;