import ExpenceRound from "./ExpenceRound";
import IncomeRound from "./IncomeRound";

const ExpenceList = () => {
  return (
    <div>
      <div className="p-5 w-full gap-2 flex flex-col   md:flex-row ">
        <div className="w-full gap-2 flex flex-col">
          <IncomeRound />
        </div>{" "}
        <div className="w-full gap-2 flex flex-col">
          <ExpenceRound />
        </div>
      </div>
    </div>
  );
};

export default ExpenceList;
