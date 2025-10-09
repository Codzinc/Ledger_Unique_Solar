import React from "react";

const ProjectStats = ({ stats }) => {
  const statItems = [
    {
      label: "TOTAL PROJECTS",
      value: stats.totalProjects.toString(),
      color: "border-blue-500",
    },
    {
      label: "UNIQUE SOLAR PROJECTS",
      value: stats.uniqueSolarProjects.toString(),
      color: "border-red-500",
    },
    {
      label: "ZARORRAT.COM PROJECTS",
      value: stats.zarorratProjects.toString(),
      color: "border-teal-500",
    },
    {
      label: "TOTAL VALUE",
      value: `${stats.totalValue.toLocaleString()}`,
      color: "border-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${stat.color}`}
        >
          <div className="text-sm font-medium text-gray-600 mb-2">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;
