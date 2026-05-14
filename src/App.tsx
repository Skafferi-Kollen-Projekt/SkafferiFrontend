// src/App.tsx
import "./App.css";

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AuthGate } from "./components/AuthGate/AuthGate";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";

//!import {ContactPage} from "./pages/ContactPage";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <div className="app">
      <BrowserRouter>
        <Header onLoginClick={() => setAuthOpen(true)} />

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* <Route path="/contact" element={<ContactPage />} /> */}
          </Routes>
        </main>

        <Footer />
        <AuthGate open={authOpen} onClose={() => setAuthOpen(false)} />
      </BrowserRouter>
    </div>
  );
}

export default App;
