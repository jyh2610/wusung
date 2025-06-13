'use client';

import { LoginModal } from '@/entities';
import { pageContainer } from '../signup/index.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/useAuthStore';

function Signin() {
  const router = useRouter();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className={pageContainer}>
      <LoginModal />
    </div>
  );
}

export default Signin;
