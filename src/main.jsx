// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink, // Renomeado Link para RouterLink para evitar conflitos
} from "react-router-dom";
import { initMercadoPago } from "@mercadopago/sdk-react"; // IMPORTADO

import "./index.css"; //
import App from "./App.jsx"; //
import Login from "./pages/Login.jsx"; //
import Admin from "./pages/Admin.jsx"; //
import ProductDetails from "./components/ProductDetails"; //
import { CartProvider } from "./context/CartContext"; //
import CartPage from "./pages/CartPage"; //
import PrivateRoute from "./components/PrivateRoute"; //

// ---- INICIALIZAÇÃO DO MERCADO PAGO ----
const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
if (publicKey) {
  initMercadoPago(publicKey, { locale: "pt-BR" }); // locale: 'pt-BR' para português
  // console.log("SDK Mercado Pago inicializada com Public Key:", publicKey); // Pode remover ou comentar esta linha
} else {
  console.error(
    "ERRO: Chave pública do Mercado Pago (VITE_MERCADO_PAGO_PUBLIC_KEY) não está configurada."
  );
}
// ---- FIM DA INICIALIZAÇÃO ----

// Paginas de Status de Pagamento (componentes simples para feedback)
const PagamentoSucesso = () => (
  <div className="container mx-auto text-center py-10">
    <h2 className="text-2xl font-bold text-green-600">Pagamento Aprovado!</h2>
    <p className="my-4">
      Obrigado pela sua compra. Em breve você receberá um email com os detalhes.
    </p>
    <RouterLink
      to="/"
      className="text-emerald-600 hover:text-emerald-800 font-semibold"
    >
      Voltar à loja
    </RouterLink>
  </div>
);
const PagamentoFalha = () => (
  <div className="container mx-auto text-center py-10">
    <h2 className="text-2xl font-bold text-red-600">Falha no Pagamento.</h2>
    <p className="my-4">
      Houve um problema ao processar seu pagamento. Por favor, verifique os
      dados ou tente novamente.
    </p>
    <RouterLink
      to="/carrinho"
      className="text-emerald-600 hover:text-emerald-800 font-semibold"
    >
      Tentar novamente com outro método
    </RouterLink>
  </div>
);
const PagamentoPendente = () => (
  <div className="container mx-auto text-center py-10">
    <h2 className="text-2xl font-bold text-yellow-600">Pagamento Pendente.</h2>
    <p className="my-4">
      Seu pagamento está pendente de processamento (ex: boleto aguardando
      compensação). Avisaremos por email assim que for aprovado.
    </p>
    <RouterLink
      to="/"
      className="text-emerald-600 hover:text-emerald-800 font-semibold"
    >
      Voltar à loja
    </RouterLink>
  </div>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<CartPage />} />
          {/* Rotas de Status de Pagamento ADICIONADAS */}
          <Route path="/pagamento/sucesso" element={<PagamentoSucesso />} />
          <Route path="/pagamento/falha" element={<PagamentoFalha />} />
          <Route path="/pagamento/pendente" element={<PagamentoPendente />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
