import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Carrega o carrinho do localStorage ao inicializar o estado
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      // Retorna o carrinho do localStorage se existir, senão um array vazio
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
      return []; // Garante que o estado seja um array vazio em caso de erro
    }
  });

  // 2. Salva o carrinho no localStorage sempre que 'cartItems' é atualizado
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Erro ao salvar carrinho no localStorage:", error);
    }
  }, [cartItems]); // O useEffect é executado sempre que 'cartItems' muda

  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Garante que o produto tenha uma quantidade inicial de 1 ao ser adicionado
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    // Aqui você pode adicionar a lógica para mostrar uma notificação se desejar
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: parseInt(quantity, 10) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  }, []);

  // Adicionado para limpar o carrinho, útil para um "Finalizar Compra" real
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      // Usa o preço promocional se ele existir e for menor que o preço normal
      const priceToConsider =
        item.preco_promocional && item.preco_promocional < item.preco
          ? item.preco_promocional
          : item.preco;
      // Garante que priceToConsider é um número antes da multiplicação
      const validPrice =
        typeof priceToConsider === "number" ? priceToConsider : 0;
      return total + validPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
