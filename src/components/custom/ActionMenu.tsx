import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/pages/TableTransaction"; // Adjust the import path as needed
import { useTransactionActions } from "@/hooks/useTransactionActions"; // Adjust the import path as needed

interface ActionMenuProps {
  transaction: Transaction;
  onUpdate: (id: string, updatedData: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  transaction,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(transaction.name);
  const [amount, setAmount] = useState(transaction.amount);

  const { updateTransaction, deleteTransaction, error, loading } =
    useTransactionActions();

  const handleSave = async () => {
    try {
      await updateTransaction(transaction.id, { name, amount });
      onUpdate(transaction.id, { name, amount });
      setIsEditing(false);
    } catch {
      // Handle error if needed
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      onDelete(transaction.id);
    } catch {
      // Handle error if needed
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full rounded-md border-blue-500 text-blue-500 text-sm hover:bg-blue-600 hover:text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="mb-2"
              />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount"
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full rounded-md bg-green-500 text-white text-sm hover:bg-green-600"
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-md border-red-500 text-red-500 text-sm hover:bg-red-600 hover:text-white"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            className="w-full rounded-md border-red-500 text-red-500 text-sm mt-2 hover:bg-red-600 hover:text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </PopoverContent>
    </Popover>
  );
};

export default ActionMenu;
