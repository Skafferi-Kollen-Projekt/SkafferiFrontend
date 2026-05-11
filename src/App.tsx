// src/App.tsx
import "./App.css";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main">{/* Här kommer pages / routes */}</main>

      <Footer />
    </div>
  );
}

export default App;
