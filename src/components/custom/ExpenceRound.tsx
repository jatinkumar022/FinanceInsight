"use client";

import { Label, Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/Chart";
import useTransactionStore from "@/store/transactionStore"; // Adjust the path if necessary

const getUniqueColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; // Spread colors across the hue spectrum
    colors.push(`hsl(${hue}, 70%, 80%)`);
  }
  return colors;
};

const ExpenceRound = () => {
  // Access expense data from Zustand store
  const { expenses } = useTransactionStore((state) => ({
    expenses: state.expenses,
  }));

  // Aggregate data by tag
  const tagData = expenses.reduce((acc, exp) => {
    const tag = exp.tag || "Others";
    if (!acc[tag]) {
      acc[tag] = { tag, amount: 0 };
    }
    acc[tag].amount += exp.amount;
    return acc;
  }, {} as Record<string, { tag: string; amount: number }>);

  const chartData = Object.values(tagData);

  // Generate a color for each tag dynamically
  const colors = getUniqueColors(chartData.length);

  // Define the central label color
  const centralColor = "#ffffff"; // Adjust as needed

  return (
    <div>
      <Card className="flex flex-col bg-black">
        <CardHeader className="items-center pb-0">
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Expenses by Tag</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={{}} // Define your config if needed
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { name, value } = payload[0];
                    return (
                      <div className="p-2 bg-gray-800 text-white rounded">
                        <p className="font-bold">{name}</p>
                        <p>{value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="tag"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={2}
                stroke="#fff"
                labelLine={false}
                label={false} // Remove labels from the chart sections
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.tag} fill={colors[index]} />
                ))}
              </Pie>

              <Pie
                data={[
                  {
                    tag: "Expenses",
                    amount: chartData.reduce(
                      (sum, data) => sum + data.amount,
                      0
                    ),
                  },
                ]}
                dataKey="amount"
                nameKey="tag"
                innerRadius={0}
                outerRadius={0}
                fill={centralColor}
                strokeWidth={0}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={16}
                          fontWeight={600}
                          fill={centralColor}
                        >
                          Expenses
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: 20 }}
                content={({ payload }) => (
                  <div>
                    {payload ? (
                      payload.map((entry, index) => (
                        <div key={`item-${index}`} style={{ marginBottom: 5 }}>
                          <span
                            style={{
                              backgroundColor: entry.color,
                              width: 12,
                              height: 12,
                              display: "inline-block",
                              marginRight: 8,
                            }}
                          ></span>
                          {entry.value}
                        </div>
                      ))
                    ) : (
                      <h2></h2>
                    )}
                  </div>
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenceRound;
