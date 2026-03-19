import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AssessmentHistory, SkillResult, UserAnswer } from "../types";

// Date → Firestore 用オブジェクトに変換
function toFirestoreData(history: AssessmentHistory): Record<string, any> {
  return {
    date: Timestamp.fromDate(
      history.date instanceof Date ? history.date : new Date(history.date)
    ),
    role: history.role,
    results: history.results,
    userAnswers: history.userAnswers,
    totalSkills: history.totalSkills,
    completionRate: history.completionRate,
  };
}

// Firestore ドキュメント → AssessmentHistory に変換
function fromFirestoreData(id: string, data: Record<string, any>): AssessmentHistory {
  return {
    id,
    date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
    role: data.role,
    results: data.results as SkillResult[],
    userAnswers: data.userAnswers as UserAnswer[],
    totalSkills: data.totalSkills,
    completionRate: data.completionRate,
  };
}

// 評価履歴の Firestore 管理
export const FirestoreAssessmentManager = {
  async save(uid: string, history: AssessmentHistory): Promise<void> {
    const docRef = doc(db, "users", uid, "assessments", history.id);
    await setDoc(docRef, toFirestoreData(history));
  },

  async getAll(uid: string): Promise<AssessmentHistory[]> {
    const colRef = collection(db, "users", uid, "assessments");
    const q = query(colRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => fromFirestoreData(doc.id, doc.data()));
  },

  async delete(uid: string, assessmentId: string): Promise<void> {
    const docRef = doc(db, "users", uid, "assessments", assessmentId);
    await deleteDoc(docRef);
  },

  async clearAll(uid: string): Promise<void> {
    const colRef = collection(db, "users", uid, "assessments");
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  },
};

// ユーザー情報の Firestore 管理
export const FirestoreUserManager = {
  async createOrUpdate(
    uid: string,
    data: { email: string; displayName?: string }
  ): Promise<void> {
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      {
        email: data.email,
        displayName: data.displayName || null,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
  },
};
