// src/components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { auth } from "../FirebaseConfig"; // Confere o caminho
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // 1. Log para verificar se 'auth' está sendo importado corretamente
    console.log("PrivateRoute: Objeto auth:", auth);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 2. Log para ver o que onAuthStateChanged está retornando
      console.log(
        "PrivateRoute: Estado de autenticação alterado. Usuário:",
        user
      );
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    console.log("PrivateRoute: Carregando estado de autenticação...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  // 3. Log para ver o valor final de isAuthenticated antes de renderizar/redirecionar
  console.log(
    "PrivateRoute: Redirecionando com isAuthenticated:",
    isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
