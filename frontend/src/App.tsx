import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import RegisterPage from "./pages/RegisterPage";
import InterpreterProfilePage from "./pages/InterpreterProfilePage";
import RoleHomeRedirect from "./components/RoleHomeRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* PUBLIC */}
          <Route path="/interpreters" element={<HomePage />} />

          {/* CUSTOMER */}
          <Route path="/customer/profile" element={<CustomerProfilePage />} />
          <Route path="/customer/bookings" element={<MyBookingsPage />} />

          {/* INTERPRETER */}
          <Route path="/interpreter/profile" element={<InterpreterProfilePage />} />
          {/* <Route path="/interpreter/bookings" element={<InterpreterBookingsPage />} /> */}

          {/* SMART DEFAULT */}
          <Route path="/profile" element={<RoleHomeRedirect />} />
          <Route path="/bookings" element={<RoleHomeRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
