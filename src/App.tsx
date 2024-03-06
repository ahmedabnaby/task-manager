import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Header from "./includes/Header";

const App: React.FC = () => {

  return (
    <Router>
      <AuthProvider>
        <Header/>
        <Routes>
          <Route
            path="/"
            element={<AuthForm isLogin={true}/>}
          />
          <Route
            path="/login"
            element={<AuthForm isLogin={true}/>}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/register"
            element={<AuthForm isLogin={false}/>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
