// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import ProductDetails from "./components/ProductDetails";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import PrivateRoute from "./components/PrivateRoute"; // Importe o PrivateRoute

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />

          {/* Rota Protegida */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<CartPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
