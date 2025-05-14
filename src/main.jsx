// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx"; // vamos criar depois
import ProductDetails from "./components/ProductDetails"; // Importe o componente de detalhes

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/produto/:id" element={<ProductDetails />} />{" "}
        {/* Adicione a rota para ProductDetails aqui */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
