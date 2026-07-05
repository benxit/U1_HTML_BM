import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/register";
import Unauthorized from "../pages/Unauthorized";

import UserDashboard from "../pages/user/UserDashboard";
import UserClasses from "../pages/user/UserClasses";
import UserReservations from "../pages/user/UserReservations";
import UserProfile from "../pages/user/UserProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCoaches from "../pages/admin/AdminCoaches";
import AdminRooms from "../pages/admin/AdminRooms";
import AdminAssignments from "../pages/admin/AdminAssignments";
import AdminClasses from "../pages/admin/AdminClasses";
import AdminSports from "../pages/admin/AdminSports";

import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminLayout from "../layouts/AdminLayout";

import CoachDashboard from "../pages/coach/CoachDashboard";
import CoachClasses from "../pages/coach/CoachClasses";
import CoachSchedule from "../pages/coach/CoachSchedule";
import CoachStudents from "../pages/coach/CoachStudents";
import CoachProfile from "../pages/coach/CoachProfile";

import ProtectedRoute from "./ProtectRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Usuario */}
        <Route
          path="/user"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="classes" element={<UserClasses />} />
          <Route path="reservations" element={<UserReservations />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Coach */}
        <Route
          path="/coach"
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="classes" element={<CoachClasses />} />
          <Route path="schedule" element={<CoachSchedule />} />
          <Route path="students" element={<CoachStudents />} />
          <Route path="profile" element={<CoachProfile />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="sports" element={<AdminSports />} />
        </Route>
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <h1>Perfil del usuario autenticado</h1>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;


