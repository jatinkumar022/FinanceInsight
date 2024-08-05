import { AddIncome } from "./AddIncome";
import { AddExpense } from "./AddExpense";

const AddInEx = () => {
  return (
    <div className="flex justify-around ">
      <AddIncome />

      <AddExpense />
    </div>
  );
};

export default AddInEx;
