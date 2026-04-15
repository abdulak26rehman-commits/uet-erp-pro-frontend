// ── Mock Data for UET Mardan ERP (Static Demo Mode) ───────────────────────────

export const MOCK_STATS = {
  totalEmployees: 450,
  totalDepartments: 12,
  monthlyRevenue: 15400000,
  monthlyExpenses: 12200000,
  budgetUtilization: 78,
  activeVouchers: 24,
  pendingLeaves: 15,
  recentAuditLogs: [
    { id: 1, action: 'User Login', user: 'Admin', timestamp: new Date().toISOString() },
    { id: 2, action: 'Updated Salary', user: 'Finance Dept', timestamp: new Date().toISOString() },
  ]
}

export const MOCK_EMPLOYEES = [
  { id: '1', name: 'Dr. Ahmad Khan', email: 'ahmad@uetmardan.edu.pk', department: 'CS & IT', designation: 'Professor', salary: 150000, status: 'active' },
  { id: '2', name: 'Sara Ali', email: 'sara@uetmardan.edu.pk', department: 'Finance', designation: 'Accountant', salary: 65000, status: 'active' },
  { id: '3', name: 'Engr. Jamil', email: 'jamil@uetmardan.edu.pk', department: 'Electrical', designation: 'Assistant Professor', salary: 110000, status: 'active' },
  { id: '4', name: 'M. Usman', email: 'usman@uetmardan.edu.pk', department: 'Mechanical', designation: 'Lecturer', salary: 85000, status: 'active' },
  { id: '5', name: 'Asma Bibi', email: 'asma@uetmardan.edu.pk', department: 'Registrar Office', designation: 'Admin Officer', salary: 55000, status: 'active' },
]

export const MOCK_VOUCHERS = [
  { id: 'V-1001', description: 'Equipment for Civil Lab', amount: 450000, status: 'approved', date: '2024-03-15' },
  { id: 'V-1002', description: 'Office Supplies - IT Dept', amount: 15000, status: 'pending', date: '2024-03-18' },
  { id: 'V-1003', description: 'Library Books Purchase', amount: 85000, status: 'approved', date: '2024-03-12' },
]

export const MOCK_BUDGET = [
  { id: 'B1', year: '2023-24', allocated: 50000000, spent: 38000000, department: 'CS & IT' },
  { id: 'B2', year: '2023-24', allocated: 30000000, spent: 22000000, department: 'Mechanical' },
  { id: 'B3', year: '2023-24', allocated: 20000000, spent: 18000000, department: 'Finance' },
]

export const MOCK_LEAVES = [
  { id: 'L1', employeeName: 'Dr. Ahmad Khan', type: 'Sick', days: 2, status: 'pending', date: '2024-03-20' },
  { id: 'L2', employeeName: 'Sara Ali', type: 'Annual', days: 5, status: 'approved', date: '2024-03-10' },
]

export const MOCK_PAYROLL = [
  { id: 'P1', month: 'February 2024', totalAmount: 8500000, employeesProcessed: 450, status: 'completed' },
  { id: 'P2', month: 'January 2024', totalAmount: 8300000, employeesProcessed: 445, status: 'completed' },
]

export const MOCK_AUDIT = [
  { id: 'A1', user: 'Admin', action: 'Login', details: 'System admin logged in', timestamp: '2024-03-20 09:00 AM' },
  { id: 'A2', user: 'Admin', action: 'Update', details: 'Updated budget for CS Dept', timestamp: '2024-03-20 10:30 AM' },
]
