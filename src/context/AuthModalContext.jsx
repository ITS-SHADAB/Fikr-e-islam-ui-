import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from '@/components/Modal/Modal';
import Login from '@/pages/Admin/pages/Login';
import Signup from '@/pages/Admin/pages/Signup';

const AuthModalContext = createContext({
  isOpen: false,
  mode: 'login',
  openLogin: () => {},
  openSignup: () => {},
  closeAuthModal: () => {},
});

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Automatically close modal when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setIsOpen(false);
    }
  }, [isAuthenticated, isOpen]);

  const openLogin = () => {
    setMode('login');
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode('signup');
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openLogin,
        openSignup,
        closeAuthModal,
      }}
    >
      {children}

      {/* Global Auth Modal using existing Login and Signup components in English layout */}
      <Modal
        isOpen={isOpen}
        onClose={closeAuthModal}
        title={mode === 'login' ? 'Sign In' : 'Create Account'}
        maxWidth={mode === 'login' ? 'max-w-lg' : 'max-w-2xl'}
        height="max-h-[92vh]"
        dir="ltr"
      >
        {mode === 'login' ? (
          <Login
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <Signup
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </Modal>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}

export default AuthModalContext;
