import admin from '../config/firebase';
import { TarotCard } from './openai.service';

const isDev = process.env.NODE_ENV === 'development';

const db = () => admin.firestore();

const todayKey = () => new Date().toISOString().slice(0, 10); // "2026-04-27"

export const saveReading = async (
  uid: string,
  mbti: string,
  category: string,
  cards: TarotCard[],
  resultText: string
): Promise<string | null> => {
  if (isDev) {
    console.log('[DEV] Skipping Firestore write');
    return null;
  }

  const ref = await db()
    .collection('readings')
    .doc(uid)
    .collection('history')
    .add({
      uid,
      mbti,
      category,
      cards,
      resultText,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return ref.id;
};

export const getTodayCount = async (): Promise<number> => {
  if (isDev) return 0;

  const snap = await db().collection('stats').doc(todayKey()).get();
  return (snap.data()?.count as number) ?? 0;
};

export const incrementTodayCount = async (): Promise<number> => {
  if (isDev) return 0;

  const statsRef = db().collection('stats').doc(todayKey());
  await statsRef.set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true });

  const snap = await statsRef.get();
  return (snap.data()?.count as number) ?? 1;
};
