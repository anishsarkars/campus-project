import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Query,
  CollectionReference
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, Card, Match, Task, Submission } from '@/types';

// User Profile Operations
export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Card Operations
export const createCard = async (card: Omit<Card, 'id' | 'timestamp'>) => {
  const docRef = await addDoc(collection(db, 'cards'), {
    ...card,
    timestamp: serverTimestamp()
  });
  return docRef.id;
};

export const getCards = async (filters?: { type?: string; status?: string }): Promise<Card[]> => {
  let q: Query | CollectionReference = collection(db, 'cards');
  
  if (filters?.type) {
    q = query(q, where('type', '==', filters.type));
  }
  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  q = query(q, orderBy('timestamp', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Card);
};

export const getCard = async (cardId: string): Promise<Card | null> => {
  const docRef = doc(db, 'cards', cardId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Card;
  }
  return null;
};

// Match Operations
export const createMatch = async (match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'matches'), {
    ...match,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getMatches = async (userId: string): Promise<Match[]> => {
  const q = query(
    collection(db, 'matches'),
    where('requesterId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Match);
};

export const updateMatch = async (matchId: string, updates: Partial<Match>) => {
  const docRef = doc(db, 'matches', matchId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Task Operations
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getTasks = async (filters?: { type?: string }): Promise<Task[]> => {
  let q: Query | CollectionReference = collection(db, 'tasks');
  
  if (filters?.type) {
    q = query(q, where('type', '==', filters.type));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
};

export const getTask = async (taskId: string): Promise<Task | null> => {
  const docRef = doc(db, 'tasks', taskId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Task;
  }
  return null;
};

// Submission Operations
export const createSubmission = async (submission: Omit<Submission, 'id' | 'submittedAt'>) => {
  const docRef = await addDoc(collection(db, 'submissions'), {
    ...submission,
    submittedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getSubmissions = async (taskId?: string, studentId?: string): Promise<Submission[]> => {
  let q: Query | CollectionReference = collection(db, 'submissions');
  
  if (taskId) {
    q = query(q, where('taskId', '==', taskId));
  }
  if (studentId) {
    q = query(q, where('studentId', '==', studentId));
  }
  
  q = query(q, orderBy('submittedAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Submission);
};

export const updateSubmission = async (submissionId: string, updates: Partial<Submission>) => {
  const docRef = doc(db, 'submissions', submissionId);
  await updateDoc(docRef, {
    ...updates,
    gradedAt: serverTimestamp()
  });
}; 