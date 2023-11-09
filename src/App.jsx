import { useState } from "react";
import PrivateRoutes from "./components/PrivateRoutes";
import Room from "./pages/Room";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
              <Route exact path="/register" element={<RegisterPage />}></Route>
            <Route element={<PrivateRoutes />}>
              <Route exact path="/" element={<Room />}></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
