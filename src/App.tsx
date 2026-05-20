// src/App.tsx
import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AuthGate } from "./components/AuthGate/AuthGate";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminSupportPage } from "./pages/AdminSupportPage";
import { ProfilePage } from "./pages/ProfilePage";
import PantryPage from "./pages/PantryPage";
import PantryNewPage from "./pages/PantryNewPage";
type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
};

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "ADMIN";

  const fetchMe = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = (await res.json()) as User;
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Header
          user={user}
          onLoginClick={() => setAuthOpen(true)}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />

        <main className="main">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  onAuthRequired={() => setAuthOpen(true)}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/pantry"
              element={
                isAuthenticated ? <PantryPage /> : <Navigate to="/" replace />
              }
            />

            <Route
              path="/pantry/new"
              element={
                isAuthenticated ? (
                  <PantryNewPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/profile"
              element={
                user ? (
                  <ProfilePage
                    user={user}
                    onLogout={logout}
                    onProfileUpdated={fetchMe}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            ></Route>
            <Route
              path="/admin/support"
              element={
                isAdmin ? <AdminSupportPage /> : <Navigate to="/" replace />
              }
            />
          </Routes>
        </main>

        <Footer />
        <AuthGate
          open={authOpen}
          onClose={() => {
            setAuthOpen(false);
          }}
          onLoginSuccess={fetchMe}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
