export const sampleProjects = [
  {
    id: 'USL-2024-045',
    company: 'UNIQUE SOLAR',
    projectType: 'On-Grid',
    customerName: 'Rajesh Kumar',
    contact_no: '+92-321-1234567',
    address: 'Model Town, Lahore',
    date: '2024-07-15',
    status: 'IN PROGRESS',
    totalAmount: 82000,
    paid: 60000,
    pending: 22000
  },
  {
    id: 'ZRC-2024-032',
    company: 'ZARORRAT.COM',
    projectType: 'Services',
    customerName: 'Ayesha Ahmed',
    contact_no: '+92-333-9876543',
    address: 'DHA Phase 5, Karachi',
    date: '2024-07-10',
    status: 'COMPLETED',
    totalAmount: 15000,
    paid: 15000,
    pending: 0
  },
  {
    id: 'USL-2024-046',
    company: 'UNIQUE SOLAR',
    projectType: 'Hybrid',
    customerName: 'Muhammad Ali',
    contact_no: '+92-300-1122334',
    address: 'Gulberg, Lahore',
    date: '2024-07-12',
    status: 'DRAFT',
    totalAmount: 120000,
    paid: 30000,
    pending: 90000
  }
];

export const STATUS_CLASSES = {
  COMPLETED: 'bg-green-100 text-green-800',
  'IN PROGRESS': 'bg-orange-100 text-orange-800',
  DRAFT: 'bg-gray-100 text-gray-800'
};
