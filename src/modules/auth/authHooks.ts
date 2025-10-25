import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { firebaseAuth } from '@/libs/firebase';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(firebaseAuth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  return { user, isAuthReady };
}
