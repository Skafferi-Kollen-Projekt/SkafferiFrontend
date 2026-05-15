// src/App.tsx
import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AuthGate } from "./components/AuthGate/AuthGate";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";

//!import {ContactPage} from "./pages/ContactPage";

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

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Header
          onLoginClick={() => setAuthOpen(true)}
          isAuthenticated={isAuthenticated}
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

            {/* <Route path="/contact" element={<ContactPage />} /> */}
          </Routes>
        </main>

        <Footer />
        <AuthGate
          open={authOpen}
          onClose={() => {
            setAuthOpen(false);
            fetchMe();
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
