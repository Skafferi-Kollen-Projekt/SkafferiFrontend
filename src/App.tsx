// src/App.tsx
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

import { HomePage } from "./pages/HomePage";
//!import {AboutPage} from "./pages/AboutPage";
//!import {ContactPage} from "./pages/ContactPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
