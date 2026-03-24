import { useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { FirestoreAssessmentManager, FirestoreUserManager } from "../utils/firestoreManager";
import { AssessmentHistory } from "../types";
import { AssessmentHistoryManager } from "../utils/storageManager";

/**
 * ログイン時にローカルとFirestoreのデータを双方向同期するフック
 */
export function useFirestoreSync(
  user: User | null,
  onSyncComplete: () => void,
) {
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!user || hasSynced.current) return;

    const sync = async () => {
      try {
        // ユーザー情報を保存/更新
        await FirestoreUserManager.createOrUpdate(user.uid, {
          email: user.email || "",
        });

        // ローカルの全履歴を取得
        const localHistories = await AssessmentHistoryManager.getAll();
        // 新フォーマットのみ
        const localValid = localHistories.filter(h => !!h.role);

        // Firestore の全履歴を取得
        let firestoreHistories: AssessmentHistory[] = [];
        try {
          firestoreHistories = await FirestoreAssessmentManager.getAll(user.uid);
        } catch (error) {
          console.warn("Firestore からの履歴取得に失敗:", error);
        }

        const firestoreIds = new Set(firestoreHistories.map(h => h.id));
        const localIds = new Set(localValid.map(h => h.id));

        // ローカルにあって Firestore にないものをアップロード
        const toUpload = localValid.filter(h => !firestoreIds.has(h.id));
        for (const history of toUpload) {
          try {
            await FirestoreAssessmentManager.save(user.uid, history);
          } catch (error) {
            console.warn("Firestore へのアップロードに失敗:", history.id, error);
          }
        }

        // Firestore にあってローカルにないものをダウンロード
        const toDownload = firestoreHistories.filter(h => !localIds.has(h.id));
        for (const history of toDownload) {
          try {
            await AssessmentHistoryManager.save(history);
          } catch (error) {
            console.warn("ローカルへのダウンロードに失敗:", history.id, error);
          }
        }

        if (toUpload.length > 0 || toDownload.length > 0) {
          console.log(`同期完了: ↑${toUpload.length}件 ↓${toDownload.length}件`);
          onSyncComplete();
        }

        hasSynced.current = true;
      } catch (error) {
        console.warn("データ同期に失敗（ローカルデータは影響なし）:", error);
      }
    };

    sync();
  }, [user]);

  // ログアウト時にリセット
  useEffect(() => {
    if (!user) {
      hasSynced.current = false;
    }
  }, [user]);
}
