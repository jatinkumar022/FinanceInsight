import create from "zustand";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/db/firebase";

interface Transaction {
  type: string;
  date: string;
  amount: number;
  tag: string;
  name: string;
}

interface TransactionState {
  income: Transaction[];
  expenses: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  fetchTransactions: (userId: string) => void;
}

const useTransactionStore = create<TransactionState>((set) => ({
  income: [],
  expenses: [],
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  fetchTransactions: async (userId: string) => {
    const q = query(collection(db, `users/${userId}/transactions`));
    const querySnapshot = await getDocs(q);
    let income: Transaction[] = [];
    let expenses: Transaction[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Transaction;
      if (data.type === "income") {
        income.push(data);
      } else if (data.type === "expense") {
        expenses.push(data);
      }
    });
    const totalIncome = income.reduce((sum, trans) => sum + trans.amount, 0);
    const totalExpenses = expenses.reduce(
      (sum, trans) => sum + trans.amount,
      0
    );
    const balance = totalIncome - totalExpenses;
    set({ income, expenses, totalIncome, totalExpenses, balance });
  },
}));

export default useTransactionStore;
