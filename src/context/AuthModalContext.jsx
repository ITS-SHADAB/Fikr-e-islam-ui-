import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from '@/components/Modal/Modal';
import Login from '@/pages/Admin/pages/Login';
import Signup from '@/pages/Admin/pages/Signup';
import ForgotPassword from '@/pages/Admin/pages/ForgotPassword';
import ResetPassword from '@/pages/Admin/pages/ResetPassword';

const AuthModalContext = createContext({
  isOpen: false,
  mode: 'login',
  openLogin: () => {},
  openSignup: () => {},
  openForgotPassword: () => {},
  openResetPassword: () => {},
  closeAuthModal: () => {},
});

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot-password' | 'reset-password'
  const [resetToken, setResetToken] = useState('');
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

  const openForgotPassword = () => {
    setMode('forgot-password');
    setIsOpen(true);
  };

  const openResetPassword = (token = '') => {
    setResetToken(token);
    setMode('reset-password');
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  const modalTitle =
    mode === 'login'
      ? 'Sign In'
      : mode === 'signup'
      ? 'Create Account'
      : mode === 'reset-password'
      ? 'Reset Password'
      : 'Forgot Password';

  const modalMaxWidth =
    mode === 'login'
      ? 'max-w-md'
      : mode === 'signup'
      ? 'max-w-xl'
      : 'max-w-md';

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openLogin,
        openSignup,
        openForgotPassword,
        openResetPassword,
        closeAuthModal,
      }}
    >
      {children}

      {/* Global Auth Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeAuthModal}
        title={modalTitle}
        maxWidth={modalMaxWidth}
        height="max-h-[92vh]"
        dir="ltr"
      >
        {mode === 'login' ? (
          <Login
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        ) : mode === 'signup' ? (
          <Signup
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToLogin={() => setMode('login')}
          />
        ) : mode === 'reset-password' ? (
          <ResetPassword
            isModal={true}
            token={resetToken}
            onClose={closeAuthModal}
            onSwitchToLogin={() => setMode('login')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        ) : (
          <ForgotPassword
            isModal={true}
            onClose={closeAuthModal}
            onBackToLogin={() => setMode('login')}
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
