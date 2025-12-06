import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import LoginPage from "./components/Login";
import "./App.css";
import Registration from "./components/Registration";
import HallBooking from "./components/HallBookingNew";
import Booking from "./components/BookingEnhanced";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HallBooking/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Registration />} />
            <Route path='/HallBooking' element={<HallBooking />} />
            <Route path='/booking' element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path='/admin' element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
