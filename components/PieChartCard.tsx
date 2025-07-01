"use client";

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import React from "react";

type Props = {
  title: string;
  data: { name: string; value: number; color: string }[];
};

export default function PieChartCard({ title, data }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-300 flex flex-row items-center gap-6">
      {/* Custom Legend on the left */}
      <div className="flex flex-col items-start min-w-[120px]">
        <h2 className="text-md font-semibold mb-2">Legend</h2>
        {data.map((entry, i) => (
          <div key={i} className="flex items-center mb-1">
            <span
              className="inline-block w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-sm font-medium">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>

      {/* Chart on the right */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
        <PieChart width={350} height={260}>
          <Pie
            dataKey="value"
            isAnimationActive
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={false} // 🔧 Removed labels from slices
            labelLine={false}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
