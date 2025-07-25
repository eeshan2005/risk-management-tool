"use client";

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import React from "react";

type Props = {
  title: string;
  data: { name: string; value: number; color: string }[];
};

export default function PieChartCard({ title, data }: Props) {
  return (
    <div className="card p-8 hover:shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">{title}</h2>
      
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart */}
        <div className="flex-1 flex justify-center">
          <PieChart width={320} height={280}>
            <Pie
              dataKey="value"
              isAnimationActive
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={40}
              label={false}
              labelLine={false}
              strokeWidth={2}
              stroke="rgba(255,255,255,0.8)"
            >
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
          </PieChart>
        </div>
        
      {/* Custom Legend on the left */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Distribution</h3>
          {data.map((entry, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-1 rounded-md">
                {entry.value}
              </span>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Items</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {data.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
