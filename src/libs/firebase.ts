import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

import { FIREBASE_CONFIG } from '@/config/firebase';

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDatabase = getDatabase(firebaseApp);
const firebaseAnalytics = getAnalytics(firebaseApp);

export { firebaseApp, firebaseAuth, firebaseDatabase, firebaseAnalytics };
