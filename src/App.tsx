import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadDetailsPage } from './pages/LeadDetailsPage';
import { NewLeadPage } from './pages/NewLeadPage';
import { ProfilePage } from './pages/ProfilePage';
import { BottomNav } from './components/navigation/BottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import { CarProvider } from './context/CarContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
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
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      <BottomNav />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <LeadProvider>
          <AppRoutes />
        </LeadProvider>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;