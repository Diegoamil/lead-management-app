import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadDetailsPage } from './pages/LeadDetailsPage';
import { NewLeadPage } from './pages/NewLeadPage';
import { ProfilePage } from './pages/ProfilePage';
import { CompaniesPage } from './pages/CompaniesPage';
import { SellersPage } from './pages/SellersPage';
import { BottomNav } from './components/navigation/BottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import { CarProvider } from './context/CarContext';
import { CompanyProvider } from './context/CompanyContext';
import { SellerProvider } from './context/SellerContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Configurar flags futuras do React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function AppRoutes() {
  const { isAdmin } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/lead/:id" 
          element={
            <ProtectedRoute>
              <LeadDetailsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/new-lead" 
          element={
            <ProtectedRoute>
              <NewLeadPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/companies" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <CompaniesPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/sellers" 
          element={
            <ProtectedRoute requireManager={true}>
              <SellersPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Só mostrar o BottomNav se o usuário estiver autenticado */}
      <BottomNav showCompaniesTab={isAdmin} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={router.future}>
      <AuthProvider>
        <CompanyProvider>
          <SellerProvider>
            <CarProvider>
              <LeadProvider>
                <AppRoutes />
              </LeadProvider>
            </CarProvider>
          </SellerProvider>
        </CompanyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;