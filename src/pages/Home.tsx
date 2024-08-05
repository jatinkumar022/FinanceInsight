import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import useTransactionStore from "@/store/transactionStore";
import { auth } from "@/db/firebase";
import IncomeChart from "@/components/custom/IncomeChart";
import ExpenceChart from "@/components/custom/ExpenceChart";
import ExpenceList from "@/components/custom/ExpenceList";
import Navbar from "@/components/custom/Navbar";

const Home = () => {
  const [user] = useAuthState(auth);
  const {
    totalIncome,
    totalExpenses,
    balance,
    fetchTransactions,
    income,
    expenses,
  } = useTransactionStore((state) => ({
    totalIncome: state.totalIncome,
    totalExpenses: state.totalExpenses,
    balance: state.balance,
    fetchTransactions: state.fetchTransactions,
    income: state.income,
    expenses: state.expenses,
  }));

  useEffect(() => {
    if (user) {
      fetchTransactions(user.uid);
    }
  }, [user, fetchTransactions]);

  // Check if there are any transactions
  const hasTransactions = income.length > 0 || expenses.length > 0;

  return (
    <div className="flex flex-col gap-5 place-items-center mb-36 ">
      <Navbar username={user?.displayName} />
      <div className="w-full flex items-center justify-between p-5 border-y md:px-56">
        <div>
          <h5 className="text-cs_gray">Balance</h5>
          <h2 className="text-2xl"> ₹{balance}</h2>
        </div>
        <div>
          <Link
            to="/transaction"
            className="p-3 px-5 text-sm outline outline-1 text-cs_yellow outline-cs_yellow"
          >
            ALL TRANSACTIONS
          </Link>
        </div>
      </div>

      <div className="flex p-10">
        <div className="flex flex-col md:flex-row gap-4 md:space-x-8">
          <div className="box spotify relative w-48 h-32 border-2 border-green-500 flex flex-col items-center justify-center text-white">
            <div className="text-lg oxygen-bold">Income</div>
            <div className="text-md text-white mt-1">₹{totalIncome}</div>
          </div>
          <div className="box netflix relative w-48 h-32 border-2 border-red-500 flex flex-col items-center justify-center text-white">
            <div className="text-lg oxygen-bold">Expenses</div>
            <div className="text-md text-white mt-1">₹{totalExpenses}</div>
          </div>
        </div>
      </div>

      {hasTransactions ? (
        <>
          <div className="-ml-6 p-5 w-full">
            <div className="md:flex">
              <IncomeChart />
              <ExpenceChart />
            </div>
          </div>

          <div className="w-full">
            <ExpenceList />
          </div>
        </>
      ) : (
        <div className="flex flex-col  items-center justify-center w-auto  h-[300px] shadow shadow-slate-800 rounded-lg p-8 ">
          <svg
            className="w-24 h-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6H4v7M3 6h18M3 6v8m18-8v8M4 15h16M4 15v3m16-3v3"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">
            No Transactions
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            It looks like you haven't added any transactions yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
