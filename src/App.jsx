// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import MobileOnlyWrapper from './components/common/MobileOnlyWrapper';
import { ToastContainer } from 'react-toastify';
import Loader from './components/common/Loader'; 

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));

const HomeView = lazy(() => import('./components/dashboard/HomeView'));
const StatisticsView = lazy(() => import('./components/dashboard/StatisticsView'));
const CurrencyView = lazy(() => import('./components/dashboard/CurrencyView'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegistrationPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeView />} />
            <Route path="statistics" element={<StatisticsView />} />
            <Route
              path="currency"
              element={
                <MobileOnlyWrapper>
                  <CurrencyView />
                </MobileOnlyWrapper>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="currency" element={<CurrencyView />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;