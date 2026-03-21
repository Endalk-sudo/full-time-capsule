import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Layout from "./layouts/Layout";
import AllCapsules from "./pages/AllCapsules";
import CapsuleDetailes from "./pages/CapsuleDetailes";
import { useAuthStore } from "./stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate replace to="/login" />;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate replace to="/capsules" /> : children;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/capsules"
            element={
              <ProtectedRoute>
                <AllCapsules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/capsules/:id"
            element={
              <ProtectedRoute>
                <CapsuleDetailes />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="sign_up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
