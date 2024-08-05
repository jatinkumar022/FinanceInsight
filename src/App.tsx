import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import { TableTransaction } from "./pages/TableTransaction";
import ProtectedRoute from "./pages/ProtectedRoute"; // Adjust the path accordingly

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signup"
        element={<ProtectedRoute element={<Signup />} requireAuth={false} />}
      />
      <Route
        path="/login"
        element={<ProtectedRoute element={<Login />} requireAuth={false} />}
      />

      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route path="/" index element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/transaction"
          element={<ProtectedRoute element={<TableTransaction />} />}
        />
      </Route>
    </Routes>
  );
};

export default App;
