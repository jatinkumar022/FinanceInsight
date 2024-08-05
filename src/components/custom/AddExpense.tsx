import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerDemo } from "./Datepicker";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/db/firebase";
import { toast } from "../ui/use-toast";
import { addDoc, collection } from "firebase/firestore";
import useTransactionStore from "@/store/transactionStore"; // Added import

interface FormValues {
  name: string;
  amount: string;
  date: Date | undefined;
  tag: string;
  customTag?: string; // Optional field for custom tag
}

export function AddExpense() {
  const [user] = useAuthState(auth);
  const { fetchTransactions } = useTransactionStore(); // Use fetchTransactions from Zustand store

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>();
  const date = watch("date");
  const tag = watch("tag");
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const newTransaction = {
      type: "expense",
      date: moment(data.date).format("YYYY-MM-DD"),
      amount: parseFloat(data.amount),
      tag: data.tag === "Custom" ? data.customTag || "" : data.tag,
      name: data.name,
    };
    await addTransaction(newTransaction);
    if (user?.uid) {
      fetchTransactions(user.uid); // Refresh data after adding
    }
    // Added to refresh data
    reset(); // Clear the form
    setDialogOpen(false); // Close the dialog
  };

  const addTransaction = async (transaction: {
    type: string;
    date: string;
    amount: number;
    tag: string;
    name: string;
  }) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user?.uid}/transactions`),
        transaction
      );
      console.log("Document written with Id: ", docRef.id);
      toast({
        variant: "success",
        title: `${transaction.name} - Expense Added Successfully!`,
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Couldn't add Transaction" });
    }
  };

  useEffect(() => {
    register("date", { required: "Date is required" });
    register("tag", { required: "Tag is required" });
    register("customTag"); // Register customTag as an optional field
  }, [register]);

  useEffect(() => {
    if (date) {
      setValue("date", date);
    }
  }, [date, setValue]);

  useEffect(() => {
    if (tag) {
      setValue("tag", tag);
    }
  }, [tag, setValue]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-cs_red hover:bg-red-600"
          onClick={() => setDialogOpen(true)}
        >
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Make changes to your expense here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="example: Movie"
                className="col-span-3"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="col-span-4 text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                placeholder="example: ₹5000"
                type="number"
                className="col-span-3 [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Invalid amount format",
                  },
                })}
              />
              {errors.amount && (
                <span className="col-span-4 text-red-500">
                  {errors.amount.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <DatePickerDemo
                selected={date}
                onChange={(date: Date) =>
                  setValue("date", date, { shouldValidate: true })
                }
              />
              {errors.date && (
                <span className="col-span-4 text-red-500">
                  {errors.date.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{tag || "Select Tag"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    onSelect={() =>
                      setValue("tag", "Food", { shouldValidate: true })
                    }
                  >
                    Food
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setValue("tag", "Education", { shouldValidate: true })
                    }
                  >
                    Education
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setValue("tag", "Travel", { shouldValidate: true })
                    }
                  >
                    Travel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setValue("tag", "Custom", { shouldValidate: true })
                    }
                  >
                    Custom
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {tag === "Custom" && (
                <div className="col-span-4 mt-2">
                  <Input
                    id="customTag"
                    {...register("customTag", {
                      required:
                        tag === "Custom" ? "Custom tag is required" : false,
                    })}
                    placeholder="Enter custom tag"
                  />
                  {errors.customTag && (
                    <span className="text-red-500">
                      {errors.customTag.message}
                    </span>
                  )}
                </div>
              )}
              {errors.tag && (
                <span className="col-span-4 text-red-500">
                  {errors.tag.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
