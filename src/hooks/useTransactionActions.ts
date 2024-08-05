import { useState } from "react";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth } from "@/db/firebase";
import { UpdatableTransaction } from "@/types/types";
export function useTransactionActions() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();

  const updateTransaction = async (
    id: string,
    updatedData: Partial<UpdatableTransaction>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const transactionRef = doc(
        db,
        `users/${auth.currentUser?.uid}/transactions`,
        id
      );
      await updateDoc(transactionRef, updatedData);
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Error updating transaction.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const transactionRef = doc(
        db,
        `users/${auth.currentUser?.uid}/transactions`,
        id
      );
      await deleteDoc(transactionRef);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Error deleting transaction.");
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTransaction,
    deleteTransaction,
    error,
    loading,
  };
}
