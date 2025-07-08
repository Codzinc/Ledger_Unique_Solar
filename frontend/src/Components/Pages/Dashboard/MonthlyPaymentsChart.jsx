import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const data = [
  { date: '1 Jul', payment: 500 },
  { date: '2 Jul', payment: 700 },
  { date: '3 Jul', payment: 800 },
  { date: '4 Jul', payment: 600 },
  { date: '5 Jul', payment: 1000 },
  { date: '6 Jul', payment: 950 },
  { date: '7 Jul', payment: 1200 },
  { date: '8 Jul', payment: 1100 },
  { date: '9 Jul', payment: 1050 },
  { date: '10 Jul', payment: 1150 },
];

const MonthlyPaymentsChart = () => (
  <div className="bg-white rounded-lg shadow p-4 w-full">
    <h2 className="text-lg font-semibold text-[#181829] mb-2">
      Monthly Payments (Daily Sales - July)
    </h2>
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="payment" fill="#d8f276" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default MonthlyPaymentsChart;
