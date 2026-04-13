import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, ToastProvider } from './hooks/index.jsx'
import { getToken } from './lib/api.js'
import LoginPage from './pages/LoginPage.jsx'
import AppLayout from './components/AppLayout.jsx'
import DashboardPage, { AnalyticsPage, EmployeesPage, AccountingPage, BudgetPage, PayrollPage, LeavePage, ProcurementPage, RecruitmentPage, AuditPage, SettingsPage } from './pages/AllPages.jsx'

function Guard({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Guard><AppLayout /></Guard>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"   element={<DashboardPage />} />
              <Route path="analytics"   element={<AnalyticsPage />} />
              <Route path="accounting"  element={<AccountingPage />} />
              <Route path="budget"      element={<BudgetPage />} />
              <Route path="payroll"     element={<PayrollPage />} />
              <Route path="procurement" element={<ProcurementPage />} />
              <Route path="employees"   element={<EmployeesPage />} />
              <Route path="leave"       element={<LeavePage />} />
              <Route path="recruitment" element={<RecruitmentPage />} />
              <Route path="audit"       element={<AuditPage />} />
              <Route path="settings"    element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
