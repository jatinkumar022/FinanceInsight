"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";
import useTransactionStore from "@/store/transactionStore"; // Adjust the path if necessary

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const IncomeChart = () => {
  // Access income data from Zustand store
  const { income } = useTransactionStore((state) => ({
    income: state.income,
  }));

  // Extract and format the data
  const formattedData = income.map((trans) => ({
    date: new Date(trans.date),
    amount: trans.amount,
  }));

  // Generate X-axis labels based on unique months
  const months = Array.from(
    new Set(
      formattedData.map((data) =>
        data.date.toLocaleString("default", { year: "numeric", month: "short" })
      )
    )
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Aggregate data by month
  const chartData = months.map((month) => {
    const totalAmount = formattedData
      .filter(
        (data) =>
          data.date.toLocaleString("default", {
            year: "numeric",
            month: "short",
          }) === month
      )
      .reduce((sum, data) => sum + data.amount, 0);

    return {
      month,
      amount: totalAmount,
    };
  });

  return (
    <Card className="bg-black border-none md:w-[50%] ">
      <CardHeader className="flex items-center">
        <CardTitle>Income</CardTitle>
        <CardDescription>Income Data by Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Adjust to show full month names if needed
            />
            <YAxis tickLine={true} axisLine={true} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="amount"
              type="linear"
              stroke="#1db954"
              strokeWidth={2}
              dot={{
                fill: "#1db954",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeChart;
