export const sampleProjects = [
  {
    id: "USL-2024-045",
    company: "UNIQUE SOLAR",
    projectType: "On-Grid",
    customerName: "Rajesh Kumar",
    contact_no: "+92-321-1234567",
    address: "Model Town, Lahore",
    date: "2024-07-15",
    status: "IN PROGRESS",
    totalAmount: 82000,
    paid: 60000,
    pending: 22000,
  },

  {
    id: "USL-2024-046",
    company: "UNIQUE SOLAR",
    projectType: "Hybrid",
    customerName: "Muhammad Ali",
    contact_no: "+92-300-1122334",
    address: "Gulberg, Lahore",
    date: "2024-07-12",
    status: "Completed",
    totalAmount: 120000,
    paid: 30000,
    pending: 90000,
  },
];

export const STATUS_CLASSES = {
  COMPLETED: "bg-green-100 text-green-800",
  "IN PROGRESS": "bg-orange-100 text-orange-800",
  U: "bg-gray-100 text-gray-800",
};
