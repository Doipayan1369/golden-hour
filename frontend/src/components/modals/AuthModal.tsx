import React from 'react';
import { useApp } from '../../context/AppContext';
import { Auth5 } from '../blocks/Auth5';
import { UserType } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, closeAuthModal, authModalMode, 
    authModalRole, loginUser, signupUser, verifyEmail 
  } = useApp();

  if (!showAuthModal) return null;

  const handleAuthSuccess = (email: string, role: UserType) => {
    if (authModalMode === 'SIGNUP') {
      signupUser(email, role);
      verifyEmail('420193');
    } else {
      loginUser(email, role);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md my-auto relative z-[100000] animate-fadeIn">
        <Auth5
          initialRole={authModalRole}
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
          onClose={closeAuthModal}
          isModal={true}
        />
      </div>
    </div>
  );
};

